import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketType } from './entities/ticket-type.entity';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';
import { User } from '../user/entities/user.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class TicketTypeService {
  constructor(
    @InjectRepository(TicketType)
    private readonly ticketTypeRepository: Repository<TicketType>,
  ) {}

  async create(
    createTicketTypeDto: CreateTicketTypeDto,
    user: User,
  ): Promise<TicketType> {
    const existingTicketType = await this.ticketTypeRepository.findOne({
      where: { code: createTicketTypeDto.code },
    });

    if (existingTicketType) {
      throw new ConflictException('Ticket type code already exists');
    }

    const ticketType = this.ticketTypeRepository.create({
      ...createTicketTypeDto,
      createdBy: user,
      updatedBy: user,
    });

    return await this.ticketTypeRepository.save(ticketType);
  }

  async findAll(options: IPaginationOptions, searchQuery?: string): Promise<Pagination<TicketType>> {
    const queryBuilder = this.ticketTypeRepository
      .createQueryBuilder('ticketType')
      .leftJoinAndSelect('ticketType.createdBy', 'createdBy')
      .leftJoinAndSelect('ticketType.updatedBy', 'updatedBy')
      .where('ticketType.deletedAt IS NULL')
      .andWhere('ticketType.name iLIKE :searchQuery', { searchQuery: `%${searchQuery}%` })
      .orderBy('ticketType.createdAt', 'DESC');

    return await paginate<TicketType>(queryBuilder, options);
  }

  async findOne(id: number): Promise<TicketType> {
    const ticketType = await this.ticketTypeRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy', 'routeTickets'],
    });

    if (!ticketType) {
      throw new NotFoundException('Ticket type not found');
    }

    return ticketType;
  }

  async update(
    id: number,
    updateTicketTypeDto: UpdateTicketTypeDto,
    user: User,
  ): Promise<TicketType> {
    const ticketType = await this.findOne(id);

    if (
      updateTicketTypeDto.code &&
      updateTicketTypeDto.code !== ticketType.code
    ) {
      const existingTicketType = await this.ticketTypeRepository.findOne({
        where: { code: updateTicketTypeDto.code },
      });

      if (existingTicketType) {
        throw new ConflictException('Ticket type code already exists');
      }
    }

    Object.assign(ticketType, updateTicketTypeDto);
    ticketType.updatedBy = user;

    return await this.ticketTypeRepository.save(ticketType);
  }

  async remove(id: number, user: User): Promise<void> {
    const ticketType = await this.findOne(id);

    ticketType.updatedBy = user;
    await this.ticketTypeRepository.softRemove(ticketType);
  }

  async findByCode(code: string): Promise<TicketType | null> {
    return await this.ticketTypeRepository.findOne({
      where: { code },
      relations: ['createdBy', 'updatedBy'],
    });
  }
}