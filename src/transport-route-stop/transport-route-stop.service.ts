import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransportRouteStop } from './entities/transport-route-stop.entity';
import { CreateTransportRouteStopDto } from './dto/create-transport-route-stop.dto';
import { UpdateTransportRouteStopDto } from './dto/update-transport-route-stop.dto';
import { User } from '../user/entities/user.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class TransportRouteStopService {
  constructor(
    @InjectRepository(TransportRouteStop)
    private readonly stopRepository: Repository<TransportRouteStop>,
  ) {}

  async create(
    createStopDto: CreateTransportRouteStopDto,
    user: User,
  ): Promise<TransportRouteStop> {
    const stop = this.stopRepository.create({
      ...createStopDto,
      createdBy: user,
      updatedBy: user,
    });

    return await this.stopRepository.save(stop);
  }

  async findAll(
    options: IPaginationOptions,
    searchQuery?: string,
  ): Promise<Pagination<TransportRouteStop>> {
    const queryBuilder = this.stopRepository
      .createQueryBuilder('stop')
      .leftJoinAndSelect('stop.route', 'route')
      .leftJoinAndSelect('stop.createdBy', 'createdBy')
      .leftJoinAndSelect('stop.updatedBy', 'updatedBy')
      .where('stop.deletedAt IS NULL')
      .andWhere('stop.name iLIKE :searchQuery', { searchQuery: `%${searchQuery}%` })
      .orderBy('stop.routeId', 'ASC')
      .addOrderBy('stop.order', 'ASC');

    return await paginate<TransportRouteStop>(queryBuilder, options);
  }

  async findByRoute(
    routeId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<TransportRouteStop>> {
    const queryBuilder = this.stopRepository
      .createQueryBuilder('stop')
      .leftJoinAndSelect('stop.route', 'route')
      .leftJoinAndSelect('stop.createdBy', 'createdBy')
      .leftJoinAndSelect('stop.updatedBy', 'updatedBy')
      .where('stop.deletedAt IS NULL')
      .andWhere('stop.routeId = :routeId', { routeId })
      .orderBy('stop.order', 'ASC');

    return await paginate<TransportRouteStop>(queryBuilder, options);
  }

  async findOne(id: number): Promise<TransportRouteStop> {
    const stop = await this.stopRepository.findOne({
      where: { id },
      relations: ['route', 'createdBy', 'updatedBy'],
    });

    if (!stop) {
      throw new NotFoundException(`Paragem com ID ${id} não encontrada`);
    }

    return stop;
  }

  async update(
    id: number,
    updateStopDto: UpdateTransportRouteStopDto,
    user: User,
  ): Promise<TransportRouteStop> {
    await this.findOne(id); // Validate stop exists

    // Use update query to bypass cached relations
    await this.stopRepository.update(id, {
      ...updateStopDto,
      updatedBy: user,
    });

    // Fetch and return updated stop
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const stop = await this.findOne(id);
    await this.stopRepository.softDelete(id);
  }

  async restore(id: number): Promise<TransportRouteStop> {
    await this.stopRepository.restore(id);
    return this.findOne(id);
  }
}
