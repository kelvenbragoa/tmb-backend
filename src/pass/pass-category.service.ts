import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { PassCategory } from './entities/pass-category.entity';
import { Destination } from './entities/destination.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from '../user/entities/user.entity';
import { EntityStatus } from './enums/entity-status.enum';

@Injectable()
export class PassCategoryService {
  private readonly logger = new Logger(PassCategoryService.name);

  constructor(
    @InjectRepository(PassCategory)
    private readonly categoryRepository: Repository<PassCategory>,
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
  ) {}

  async create(dto: CreateCategoryDto, user: User): Promise<PassCategory> {
    const destination = await this.destinationRepository.findOne({
      where: { id: dto.destinationId, status: EntityStatus.ACTIVE },
    });
    if (!destination) {
      throw new BadRequestException('Destination not found or inactive');
    }

    const existing = await this.categoryRepository.findOne({
      where: { destinationId: dto.destinationId, name: dto.name },
    });
    if (existing) {
      throw new ConflictException(
        'Category name already exists for this destination',
      );
    }

    const category = this.categoryRepository.create({
      ...dto,
      status: dto.status ?? EntityStatus.ACTIVE,
      createdBy: user,
      updatedBy: user,
    });

    const saved = await this.categoryRepository.save(category);
    this.logger.log(`Pass category created id=${saved.id}`);
    return this.findOne(saved.id);
  }

  async findAll(
    options: IPaginationOptions,
    destinationId?: number,
    search?: string,
    status?: EntityStatus,
  ): Promise<Pagination<PassCategory>> {
    const qb = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.destination', 'destination')
      .leftJoinAndSelect('category.createdBy', 'createdBy')
      .where('category.deletedAt IS NULL')
      .orderBy('category.name', 'ASC');

    if (destinationId) {
      qb.andWhere('category.destinationId = :destinationId', {
        destinationId,
      });
    }
    if (search) {
      qb.andWhere('category.name ILIKE :search', { search: `%${search}%` });
    }
    if (status) {
      qb.andWhere('category.status = :status', { status });
    }

    return paginate(qb, options);
  }

  async findOne(id: number): Promise<PassCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['destination', 'tariffs', 'createdBy', 'updatedBy'],
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(
    id: number,
    dto: UpdateCategoryDto,
    user: User,
  ): Promise<PassCategory> {
    const category = await this.findOne(id);

    if (dto.name && dto.name !== category.name) {
      const existing = await this.categoryRepository.findOne({
        where: {
          destinationId: category.destinationId,
          name: dto.name,
        },
      });
      if (existing) {
        throw new ConflictException(
          'Category name already exists for this destination',
        );
      }
    }

    Object.assign(category, dto);
    category.updatedBy = user;
    await this.categoryRepository.save(category);
    return this.findOne(id);
  }

  async remove(id: number, user: User): Promise<{ message: string }> {
    const category = await this.findOne(id);
    category.updatedBy = user;
    await this.categoryRepository.save(category);
    await this.categoryRepository.softRemove(category);
    this.logger.log(`Pass category soft-deleted id=${id}`);
    return { message: 'Category deleted successfully' };
  }
}
