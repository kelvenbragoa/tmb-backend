import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { TransportRoute } from './entities/transport-route.entity';
import { CreateTransportRouteDto } from './dto/create-transport-route.dto';
import { UpdateTransportRouteDto } from './dto/update-transport-route.dto';
import { User } from '../user/entities/user.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class TransportRouteService {
  constructor(
    @InjectRepository(TransportRoute)
    private readonly routeRepository: Repository<TransportRoute>,
  ) {}

  async create(
    createRouteDto: CreateTransportRouteDto,
    user: User,
  ): Promise<TransportRoute> {
    const route = this.routeRepository.create({
      ...createRouteDto,
      createdBy: user,
      updatedBy: user,
    });

    return await this.routeRepository.save(route);
  }

  // async findAll(
  //   options: IPaginationOptions,
  // ): Promise<Pagination<TransportRoute>> {
  //   const queryBuilder = this.routeRepository
  //     .createQueryBuilder('route')
  //     .leftJoinAndSelect('route.createdBy', 'createdBy')
  //     .leftJoinAndSelect('route.updatedBy', 'updatedBy')
  //     .leftJoinAndSelect('route.category', 'category')
  //     .leftJoinAndSelect('route.routeStops', 'routeStops')
  //     .leftJoinAndSelect('route.routeTickets', 'routeTickets')
  //     .leftJoinAndSelect('routeTickets.ticketType', 'ticketType')
  //     .where('route.deletedAt IS NULL')
  //     .orderBy('route.createdAt', 'DESC');

  //   return await paginate<TransportRoute>(queryBuilder, options);
  // }

  async findAll(
    options: IPaginationOptions,
    searchQuery?: string,
  ): Promise<Pagination<TransportRoute>> {
    const whereCondition = {};
    if (searchQuery) {
      whereCondition['name'] = ILike(`%${searchQuery}%`);
    }
    return await paginate<TransportRoute>(this.routeRepository, options, {
      relations: [
        'createdBy',
        'updatedBy',
        'category',
        'routeStops',
        'routeTickets',
        'routeTickets.ticketType',
      ],
      where: whereCondition,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TransportRoute> {
    const route = await this.routeRepository.findOne({
      where: { id },
      relations: [
        'createdBy',
        'updatedBy',
        'routeTickets',
        'category',
        'routeStops',
        'routeTickets.ticketType',
      ],
    });

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    return route;
  }

  async update(
    id: number,
    updateRouteDto: UpdateTransportRouteDto,
    user: User,
  ): Promise<TransportRoute> {
    await this.findOne(id); // Validate route exists

    console.log('Updating route:', { id, updateRouteDto });

    // Use update query to bypass cached relations
    await this.routeRepository.update(id, {
      ...updateRouteDto,
      updatedBy: user,
    });

    // Fetch and return updated route
    return await this.findOne(id);
  }

  async remove(id: number, user: User): Promise<void> {
    const route = await this.findOne(id);

    route.updatedBy = user;
    await this.routeRepository.softRemove(route);
  }

  async findRouteTickets(routeId: number) {
    const route = await this.routeRepository.findOne({
      where: { id: routeId },
      relations: [
        'routeTickets',
        'routeTickets.ticketType',
        'routeTickets.createdBy',
        'routeTickets.updatedBy',
      ],
    });

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    return route.routeTickets.filter((rt) => rt.is_active);
  }

  async getRouteVehicles(routeId: number, options: IPaginationOptions) {
    const route = await this.routeRepository.findOne({
      where: { id: routeId },
      relations: ['vehicles'],
    });

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    const activeVehicles = route.vehicles 
      ? route.vehicles.filter((vehicle: any) => vehicle.is_active) 
      : [];

    return {
      items: activeVehicles,
      meta: {
        totalItems: activeVehicles.length,
        itemCount: activeVehicles.length,
        itemsPerPage: options.limit,
        totalPages: 1,
        currentPage: options.page,
      },
    };
  }
}