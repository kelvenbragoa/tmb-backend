import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { PassTariff } from './entities/pass-tariff.entity';
import { PassCategory } from './entities/pass-category.entity';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { User } from '../user/entities/user.entity';
import { EntityStatus } from './enums/entity-status.enum';
import { TariffType } from './enums/tariff-type.enum';

@Injectable()
export class PassTariffService {
  private readonly logger = new Logger(PassTariffService.name);

  constructor(
    @InjectRepository(PassTariff)
    private readonly tariffRepository: Repository<PassTariff>,
    @InjectRepository(PassCategory)
    private readonly categoryRepository: Repository<PassCategory>,
  ) {}

  async create(dto: CreateTariffDto, user: User): Promise<PassTariff> {
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId, status: EntityStatus.ACTIVE },
    });
    if (!category) {
      throw new BadRequestException('Category not found or inactive');
    }

    if (dto.effectiveTo && dto.effectiveTo < dto.effectiveFrom) {
      throw new BadRequestException(
        'effectiveTo must be greater than or equal to effectiveFrom',
      );
    }

    const tariff = this.tariffRepository.create({
      ...dto,
      status: dto.status ?? EntityStatus.ACTIVE,
      createdBy: user,
      updatedBy: user,
    });

    const saved = await this.tariffRepository.save(tariff);
    this.logger.log(`Pass tariff created id=${saved.id}`);
    return this.findOne(saved.id);
  }

  async findAll(
    options: IPaginationOptions,
    categoryId?: number,
    tariffType?: TariffType,
    status?: EntityStatus,
    search?: string,
  ): Promise<Pagination<PassTariff>> {
    const qb = this.tariffRepository
      .createQueryBuilder('tariff')
      .leftJoinAndSelect('tariff.category', 'category')
      .leftJoinAndSelect('category.destination', 'destination')
      .leftJoinAndSelect('tariff.createdBy', 'createdBy')
      .where('tariff.deletedAt IS NULL')
      .orderBy('tariff.effectiveFrom', 'DESC');

    if (categoryId) {
      qb.andWhere('tariff.categoryId = :categoryId', { categoryId });
    }
    if (tariffType) {
      qb.andWhere('tariff.tariffType = :tariffType', { tariffType });
    }
    if (status) {
      qb.andWhere('tariff.status = :status', { status });
    }
    if (search) {
      qb.andWhere('tariff.name ILIKE :search', { search: `%${search}%` });
    }

    return paginate(qb, options);
  }

  async findOne(id: number): Promise<PassTariff> {
    const tariff = await this.tariffRepository.findOne({
      where: { id },
      relations: [
        'category',
        'category.destination',
        'createdBy',
        'updatedBy',
      ],
    });
    if (!tariff) {
      throw new NotFoundException(`Tariff with id ${id} not found`);
    }
    return tariff;
  }

  async update(
    id: number,
    dto: UpdateTariffDto,
    user: User,
  ): Promise<PassTariff> {
    const tariff = await this.findOne(id);

    const effectiveFrom = dto.effectiveFrom ?? tariff.effectiveFrom;
    const effectiveTo =
      dto.effectiveTo !== undefined ? dto.effectiveTo : tariff.effectiveTo;
    if (effectiveTo && effectiveTo < effectiveFrom) {
      throw new BadRequestException(
        'effectiveTo must be greater than or equal to effectiveFrom',
      );
    }

    Object.assign(tariff, dto);
    tariff.updatedBy = user;
    await this.tariffRepository.save(tariff);
    return this.findOne(id);
  }

  async remove(id: number, user: User): Promise<{ message: string }> {
    const tariff = await this.findOne(id);
    tariff.updatedBy = user;
    await this.tariffRepository.save(tariff);
    await this.tariffRepository.softRemove(tariff);
    this.logger.log(`Pass tariff soft-deleted id=${id}`);
    return { message: 'Tariff deleted successfully' };
  }
}
