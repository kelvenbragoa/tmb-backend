import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PenaltyTicketSale } from './entities/penalty-ticket-sale.entity';
import { CreatePenaltyTicketSaleDto } from './dto/create-penalty-ticket-sale.dto';
import { User } from '../user/entities/user.entity';
import { SessionService } from '../session/session.service';
import { RouteTicketService } from '../route-ticket/route-ticket.service';
import { CostumerService } from '../costumer/costumer.service';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class PenaltyTicketSaleService {
  constructor(
    @InjectRepository(PenaltyTicketSale)
    private readonly penaltyTicketSaleRepository: Repository<PenaltyTicketSale>,
    private readonly sessionService: SessionService,
    private readonly routeTicketService: RouteTicketService,
    private readonly costumerService: CostumerService,
    private readonly dataSource: DataSource,
  ) {}

  async createPenaltySale(
    sessionId: number,
    createPenaltyTicketSaleDtos: CreatePenaltyTicketSaleDto[],
    user: User,
  ): Promise<{
    total_sales: number;
    total_tickets_sold: number;
    sales: PenaltyTicketSale[];
  }> {
    await this.sessionService.validateSessionForSale(sessionId, user.id);

    return await this.dataSource.transaction(async (manager) => {
      const savedSales: PenaltyTicketSale[] = [];
      let totalSalesAmount = 0;
      let totalTicketsCount = 0;

      for (const createPenaltyTicketSaleDto of createPenaltyTicketSaleDtos) {
        const routeTicket = await this.routeTicketService.findOne(
          createPenaltyTicketSaleDto.route_ticket_id,
        );

        if (!routeTicket.is_active) {
          throw new BadRequestException(
            `Route ticket ${createPenaltyTicketSaleDto.route_ticket_id} is not active`,
          );
        }

        if (!routeTicket.penalty_price || routeTicket.penalty_price <= 0) {
          throw new BadRequestException(
            `Route ticket ${createPenaltyTicketSaleDto.route_ticket_id} has no penalty price configured`,
          );
        }

        let customerData: any = null;
        if (createPenaltyTicketSaleDto.customer_id || createPenaltyTicketSaleDto.customer_number) {
          if (createPenaltyTicketSaleDto.customer_id) {
            customerData = await this.costumerService.findOne(
              createPenaltyTicketSaleDto.customer_id,
              user,
            );
          } else if (createPenaltyTicketSaleDto.customer_number) {
            customerData = await this.costumerService.findByCustomerNumber(
              createPenaltyTicketSaleDto.customer_number,
            );
            if (!customerData) {
              throw new NotFoundException(
                `Customer not found with number ${createPenaltyTicketSaleDto.customer_number}`,
              );
            }
          }
        }

        const total = Number(routeTicket.penalty_price) * createPenaltyTicketSaleDto.quantity;

        const penaltyTicketSale = manager.create(PenaltyTicketSale, {
          session_id: sessionId,
          operator_id: user.id,
          route_id: routeTicket.route_id,
          origin_route_stop_id: createPenaltyTicketSaleDto?.origin_route_stop_id,
          destination_route_stop_id: createPenaltyTicketSaleDto?.destination_route_stop_id,
          route_ticket_id: createPenaltyTicketSaleDto.route_ticket_id,
          vehicle_id: createPenaltyTicketSaleDto?.vehicle_id,
          driver_id: createPenaltyTicketSaleDto?.driver_id,
          ticket_sale_id: createPenaltyTicketSaleDto?.ticket_sale_id,
          customer_id: customerData?.id,
          customer_number: customerData?.customer_number,
          penalty_price_at_sale: routeTicket.penalty_price,
          quantity: createPenaltyTicketSaleDto.quantity,
          total: total,
          ...(createPenaltyTicketSaleDto.ticket_sold_at && { ticket_sold_at: new Date(createPenaltyTicketSaleDto.ticket_sold_at) }),
          ...(createPenaltyTicketSaleDto.reference && { reference: createPenaltyTicketSaleDto.reference }),
          notes: createPenaltyTicketSaleDto.notes,
          createdBy: user,
          updatedBy: user,
        });

        const savedSale = await manager.save(PenaltyTicketSale, penaltyTicketSale);
        savedSales.push(savedSale);

        totalSalesAmount += total;
        totalTicketsCount += createPenaltyTicketSaleDto.quantity;
      }

      await manager
        .createQueryBuilder()
        .update('sessions')
        .set({
          total_sales: () => `total_sales + ${totalSalesAmount}`,
          total_tickets_sold: () => `total_tickets_sold + ${totalTicketsCount}`,
          updatedAt: new Date(),
        })
        .where('id = :sessionId', { sessionId })
        .execute();

      return {
        total_sales: totalSalesAmount,
        total_tickets_sold: totalTicketsCount,
        sales: savedSales,
      };
    });
  }

  async findSessionPenaltySales(
    sessionId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<PenaltyTicketSale>> {
    const queryBuilder = this.penaltyTicketSaleRepository
      .createQueryBuilder('penaltyTicketSale')
      .leftJoinAndSelect('penaltyTicketSale.routeTicket', 'routeTicket')
      .leftJoinAndSelect('routeTicket.ticketType', 'ticketType')
      .leftJoinAndSelect('penaltyTicketSale.operator', 'operator')
      .leftJoinAndSelect('penaltyTicketSale.route', 'route')
      .leftJoinAndSelect('penaltyTicketSale.driver', 'driver')
      .leftJoinAndSelect('penaltyTicketSale.ticketSale', 'ticketSale')
      .leftJoinAndSelect('penaltyTicketSale.createdBy', 'createdBy')
      .where('penaltyTicketSale.session_id = :sessionId', { sessionId })
      .andWhere('penaltyTicketSale.deletedAt IS NULL')
      .orderBy('penaltyTicketSale.sold_at', 'DESC');

    return await paginate<PenaltyTicketSale>(queryBuilder, options);
  }

  async findAll(
    options: IPaginationOptions,
    operatorId?: number,
    filters?: {
      route_id?: number;
      vehicle_id?: number;
      driver_id?: number;
      origin_route_stop_id?: number;
      destination_route_stop_id?: number;
    }
  ): Promise<Pagination<PenaltyTicketSale>> {
    const queryBuilder = this.penaltyTicketSaleRepository
      .createQueryBuilder('penaltyTicketSale')
      .leftJoinAndSelect('penaltyTicketSale.session', 'session')
      .leftJoinAndSelect('penaltyTicketSale.routeTicket', 'routeTicket')
      .leftJoinAndSelect('routeTicket.ticketType', 'ticketType')
      .leftJoinAndSelect('penaltyTicketSale.operator', 'operator')
      .leftJoinAndSelect('penaltyTicketSale.route', 'route')
      .leftJoinAndSelect('penaltyTicketSale.driver', 'driver')
      .leftJoinAndSelect('penaltyTicketSale.ticketSale', 'ticketSale')
      .leftJoinAndSelect('penaltyTicketSale.createdBy', 'createdBy')
      .where('penaltyTicketSale.deletedAt IS NULL');

    if (operatorId) {
      queryBuilder.andWhere('penaltyTicketSale.operator_id = :operatorId', {
        operatorId,
      });
    }

    // Filtro de rota
    if (filters?.route_id) {
      queryBuilder.andWhere('penaltyTicketSale.route_id = :routeId', {
        routeId: filters.route_id,
      });
    }

    // Filtro de veículo
    if (filters?.vehicle_id) {
      queryBuilder.andWhere('penaltyTicketSale.vehicle_id = :vehicleId', {
        vehicleId: filters.vehicle_id,
      });
    }

    // Filtro de motorista
    if (filters?.driver_id) {
      queryBuilder.andWhere('penaltyTicketSale.driver_id = :driverId', {
        driverId: filters.driver_id,
      });
    }

    // Filtro de origem
    if (filters?.origin_route_stop_id) {
      queryBuilder.andWhere('penaltyTicketSale.origin_route_stop_id = :originRouteStopId', {
        originRouteStopId: filters.origin_route_stop_id,
      });
    }

    // Filtro de destino
    if (filters?.destination_route_stop_id) {
      queryBuilder.andWhere('penaltyTicketSale.destination_route_stop_id = :destinationRouteStopId', {
        destinationRouteStopId: filters.destination_route_stop_id,
      });
    }

    queryBuilder.orderBy('penaltyTicketSale.sold_at', 'DESC');

    return await paginate<PenaltyTicketSale>(queryBuilder, options);
  }

  async findOne(id: number): Promise<PenaltyTicketSale> {
    const penaltyTicketSale = await this.penaltyTicketSaleRepository.findOne({
      where: { id },
      relations: [
        'session',
        'operator',
        'route',
        'routeTicket',
        'routeTicket.ticketType',
        'driver',
        'ticketSale',
        'createdBy',
        'updatedBy',
      ],
    });

    if (!penaltyTicketSale) {
      throw new NotFoundException('Penalty ticket sale not found');
    }

    return penaltyTicketSale;
  }

  async getPenaltySalesReport(sessionId: number) {
    const session = await this.sessionService.findOne(sessionId);

    const salesByTicketType = await this.penaltyTicketSaleRepository
      .createQueryBuilder('pts')
      .select('tt.name', 'ticketTypeName')
      .addSelect('tt.code', 'ticketTypeCode')
      .addSelect('SUM(pts.quantity)', 'totalQuantity')
      .addSelect('SUM(pts.total)', 'totalAmount')
      .addSelect('AVG(pts.penalty_price_at_sale)', 'averagePenaltyPrice')
      .innerJoin('pts.routeTicket', 'rt')
      .innerJoin('rt.ticketType', 'tt')
      .where('pts.session_id = :sessionId', { sessionId })
      .andWhere('pts.deletedAt IS NULL')
      .groupBy('tt.id')
      .getRawMany();

    const totals = await this.penaltyTicketSaleRepository
      .createQueryBuilder('pts')
      .select('SUM(pts.total)', 'total_sales')
      .addSelect('SUM(pts.quantity)', 'total_tickets_sold')
      .where('pts.session_id = :sessionId', { sessionId })
      .andWhere('pts.deletedAt IS NULL')
      .getRawOne();

    return {
      session,
      salesByTicketType,
      totalPenaltySales: Number(totals?.total_sales) || 0,
      totalPenaltyTicketsSold: Number(totals?.total_tickets_sold) || 0,
    };
  }
}
