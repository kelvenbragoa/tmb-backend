import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteTicket } from './entities/route-ticket.entity';
import { CreateRouteTicketDto } from './dto/create-route-ticket.dto';
import { UpdateRouteTicketDto } from './dto/update-route-ticket.dto';
import { User } from '../user/entities/user.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { TransportRouteService } from '../transport-route/transport-route.service';
import { TicketTypeService } from '../ticket-type/ticket-type.service';

@Injectable()
export class RouteTicketService {
  constructor(
    @InjectRepository(RouteTicket)
    private readonly routeTicketRepository: Repository<RouteTicket>,
    private readonly routeService: TransportRouteService,
    private readonly ticketTypeService: TicketTypeService,
  ) {}

  async create(
    createRouteTicketDto: CreateRouteTicketDto,
    user: User,
  ): Promise<RouteTicket> {
    await this.routeService.findOne(createRouteTicketDto.route_id);
    await this.ticketTypeService.findOne(createRouteTicketDto.ticket_type_id);

    // const existingRouteTicket = await this.routeTicketRepository.findOne({
    //   where: {
    //     route_id: createRouteTicketDto.route_id,
    //     ticket_type_id: createRouteTicketDto.ticket_type_id,
    //   },
    // });

    // if (existingRouteTicket) {
    //   throw new ConflictException('Route ticket association already exists');
    // }

    const routeTicket = this.routeTicketRepository.create({
      ...createRouteTicketDto,
      createdBy: user,
      updatedBy: user,
    });

    return await this.routeTicketRepository.save(routeTicket);
  }

  async findAll(
    options: IPaginationOptions,
    searchQuery?: string,
  ): Promise<Pagination<RouteTicket>> {
    const queryBuilder = this.routeTicketRepository
      .createQueryBuilder('routeTicket')
      .leftJoinAndSelect('routeTicket.route', 'route')
      .leftJoinAndSelect('routeTicket.ticketType', 'ticketType')
      .leftJoinAndSelect('routeTicket.createdBy', 'createdBy')
      .leftJoinAndSelect('routeTicket.updatedBy', 'updatedBy')
      .where('routeTicket.deletedAt IS NULL')
      .orderBy('routeTicket.createdAt', 'DESC');

    if (searchQuery) {
      queryBuilder.andWhere('route.name iLIKE :searchQuery', {
        searchQuery: `%${searchQuery}%`,
      });
    }

    return await paginate<RouteTicket>(queryBuilder, options);
  }

  async findOne(id: number): Promise<RouteTicket> {
    const routeTicket = await this.routeTicketRepository.findOne({
      where: { id },
      relations: ['route', 'ticketType', 'createdBy', 'updatedBy'],
    });

    if (!routeTicket) {
      throw new NotFoundException('Route ticket not found');
    }

    return routeTicket;
  }

  async update(
    id: number,
    updateRouteTicketDto: UpdateRouteTicketDto,
    user: User,
  ): Promise<RouteTicket> {
    const routeTicket = await this.findOne(id);

    if (updateRouteTicketDto.route_id) {
      await this.routeService.findOne(updateRouteTicketDto.route_id);
    }

    if (updateRouteTicketDto.ticket_type_id) {
      await this.ticketTypeService.findOne(
        updateRouteTicketDto.ticket_type_id,
      );
    }

    if (
      (updateRouteTicketDto.route_id &&
        updateRouteTicketDto.route_id !== routeTicket.route_id) ||
      (updateRouteTicketDto.ticket_type_id &&
        updateRouteTicketDto.ticket_type_id !== routeTicket.ticket_type_id)
    ) {
      const routeId = updateRouteTicketDto.route_id || routeTicket.route_id;
      const ticketTypeId =
        updateRouteTicketDto.ticket_type_id || routeTicket.ticket_type_id;

      const existingRouteTicket = await this.routeTicketRepository.findOne({
        where: {
          route_id: routeId,
          ticket_type_id: ticketTypeId,
        },
      });

      if (existingRouteTicket && existingRouteTicket.id !== id) {
        throw new ConflictException('Route ticket association already exists');
      }
    }

    Object.assign(routeTicket, updateRouteTicketDto);
    routeTicket.updatedBy = user;

    return await this.routeTicketRepository.save(routeTicket);
  }

  async remove(id: number, user: User): Promise<void> {
    const routeTicket = await this.findOne(id);

    routeTicket.updatedBy = user;
    await this.routeTicketRepository.softRemove(routeTicket);
  }

  async findByRouteAndTicketType(
    routeId: number,
    ticketTypeId: number,
  ): Promise<RouteTicket | null> {
    return await this.routeTicketRepository.findOne({
      where: {
        route_id: routeId,
        ticket_type_id: ticketTypeId,
        is_active: true,
      },
      relations: ['route', 'ticketType'],
    });
  }
}