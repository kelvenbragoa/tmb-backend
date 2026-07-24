import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Destination } from './entities/destination.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { User } from '../user/entities/user.entity';
import { EntityStatus } from './enums/entity-status.enum';

@Injectable()
export class DestinationService {
  private readonly logger = new Logger(DestinationService.name);

  constructor(
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
  ) {}

  async create(
    dto: CreateDestinationDto,
    user: User,
  ): Promise<Destination> {
    const existing = await this.destinationRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException('Destination name already exists');
    }

    const destination = this.destinationRepository.create({
      ...dto,
      status: dto.status ?? EntityStatus.ACTIVE,
      createdBy: user,
      updatedBy: user,
    });

    const saved = await this.destinationRepository.save(destination);
    this.logger.log(`Destination created id=${saved.id}`);
    return saved;
  }

  async findAll(
    options: IPaginationOptions,
    search?: string,
    status?: EntityStatus,
  ): Promise<Pagination<Destination>> {
    const qb = this.destinationRepository
      .createQueryBuilder('destination')
      .leftJoinAndSelect('destination.createdBy', 'createdBy')
      .where('destination.deletedAt IS NULL')
      .orderBy('destination.name', 'ASC');

    if (search) {
      qb.andWhere(
        '(destination.name ILIKE :search OR destination.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (status) {
      qb.andWhere('destination.status = :status', { status });
    }

    return paginate(qb, options);
  }

  async findOne(id: number): Promise<Destination> {
    const destination = await this.destinationRepository.findOne({
      where: { id },
      relations: ['categories', 'createdBy', 'updatedBy'],
    });
    if (!destination) {
      throw new NotFoundException(`Destination with id ${id} not found`);
    }
    return destination;
  }

  async update(
    id: number,
    dto: UpdateDestinationDto,
    user: User,
  ): Promise<Destination> {
    const destination = await this.findOne(id);

    if (dto.name && dto.name !== destination.name) {
      const existing = await this.destinationRepository.findOne({
        where: { name: dto.name },
      });
      if (existing) {
        throw new ConflictException('Destination name already exists');
      }
    }

    Object.assign(destination, dto);
    destination.updatedBy = user;
    return this.destinationRepository.save(destination);
  }

  async remove(id: number, user: User): Promise<{ message: string }> {
    const destination = await this.findOne(id);
    destination.updatedBy = user;
    await this.destinationRepository.save(destination);
    await this.destinationRepository.softRemove(destination);
    this.logger.log(`Destination soft-deleted id=${id}`);
    return { message: 'Destination deleted successfully' };
  }
}
