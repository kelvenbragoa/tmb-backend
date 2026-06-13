import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TicketSale } from './entities/ticket-sale.entity';
import { TicketLog } from './entities/ticket-log.entity';
import { CreateTicketSaleDto } from './dto/create-ticket-sale.dto';
import { CreateTicketLogDto } from './dto/create-ticket-log.dto';
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
export class TicketSaleService {
  constructor(
    @InjectRepository(TicketSale)
    private readonly ticketSaleRepository: Repository<TicketSale>,
    @InjectRepository(TicketLog)
    private readonly ticketLogRepository: Repository<TicketLog>,
    private readonly sessionService: SessionService,
    private readonly routeTicketService: RouteTicketService,
    private readonly costumerService: CostumerService,
    private readonly dataSource: DataSource,
  ) {}

  async createSale(
    sessionId: number,
    createTicketSaleDtos: CreateTicketSaleDto[],
    user: User,
  ): Promise<{
    total_sales: number;
    total_tickets_sold: number;
    sales: TicketSale[];
  }> {
    // Validar sessão uma vez antes de processar as vendas
    await this.sessionService.validateSessionForSale(sessionId, user.id);

    return await this.dataSource.transaction(async (manager) => {
      const savedSales: TicketSale[] = [];
      let totalSalesAmount = 0;
      let totalTicketsCount = 0;

      // Processar cada venda no array
      for (const createTicketSaleDto of createTicketSaleDtos) {
        // Validar route ticket
        const routeTicket = await this.routeTicketService.findOne(
          createTicketSaleDto.route_ticket_id,
        );

        if (!routeTicket.is_active) {
          throw new BadRequestException(
            `Route ticket ${createTicketSaleDto.route_ticket_id} is not active`,
          );
        }

        // Validar customer se fornecido
        let customerData: any = null;
        if (createTicketSaleDto.customer_id || createTicketSaleDto.customer_number) {
          if (createTicketSaleDto.customer_id) {
            customerData = await this.costumerService.findOne(
              createTicketSaleDto.customer_id,
              user,
            );
          } else if (createTicketSaleDto.customer_number) {
            customerData = await this.costumerService.findByCustomerNumber(
              createTicketSaleDto.customer_number,
            );
            if (!customerData) {
              throw new NotFoundException(
                `Customer not found with number ${createTicketSaleDto.customer_number}`,
              );
            }
          }
        }

        const total = Number(routeTicket.price) * createTicketSaleDto.quantity;

        // Se houver reference, pular venda duplicada (mesma session, operator, route e reference)
        if (createTicketSaleDto.reference) {
          const existing = await manager.findOne(TicketSale, {
            where: {
              session_id: sessionId,
              operator_id: user.id,
              route_id: routeTicket.route_id,
              reference: createTicketSaleDto.reference
            },
          });

          if (existing) {
            // já existe venda com mesma referência — pular para o próximo item
            continue;
          }
        }

        const ticketSale = manager.create(TicketSale, {
          session_id: sessionId,
          operator_id: user.id,
          route_id: routeTicket.route_id,
          origin_route_stop_id: createTicketSaleDto?.origin_route_stop_id,
          destination_route_stop_id: createTicketSaleDto?.destination_route_stop_id,
          route_ticket_id: createTicketSaleDto.route_ticket_id,
          vehicle_id: createTicketSaleDto?.vehicle_id,
          driver_id: createTicketSaleDto?.driver_id,
          customer_id: customerData?.id,
          customer_number: customerData?.customer_number,
          price_at_sale: routeTicket.price,
          quantity: createTicketSaleDto.quantity,
          total: total,
          ...(createTicketSaleDto.ticket_sold_at && { ticket_sold_at: new Date(createTicketSaleDto.ticket_sold_at) }),
          ...(createTicketSaleDto.reference && { reference: createTicketSaleDto.reference }),
          notes: createTicketSaleDto.notes,
          createdBy: user,
          updatedBy: user,
        });

        const savedSale = await manager.save(TicketSale, ticketSale);
        savedSales.push(savedSale);

        totalSalesAmount += total;
        totalTicketsCount += createTicketSaleDto.quantity;
      }

      // Atualizar sessão com totais acumulados
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

  async createLog(
    sessionId: number,
    createTicketLogDtos: CreateTicketLogDto[],
    user: User,
  ): Promise<{
    total_logs: number;
    total_tickets_logged: number;
    logs: TicketLog[];
  }> {
    // Validar sessão uma vez antes de processar os logs
    await this.sessionService.validateSessionForSale(sessionId, user.id);

    return await this.dataSource.transaction(async (manager) => {
      const savedLogs: TicketLog[] = [];
      let totalLogsAmount = 0;
      let totalTicketsCount = 0;

      // Processar cada log no array
      for (const createTicketLogDto of createTicketLogDtos) {
        // Validar route ticket
        const routeTicket = await this.routeTicketService.findOne(
          createTicketLogDto.route_ticket_id,
        );

        if (!routeTicket.is_active) {
          throw new BadRequestException(
            `Route ticket ${createTicketLogDto.route_ticket_id} is not active`,
          );
        }

        // Validar customer se fornecido
        let customerData: any = null;
        if (createTicketLogDto.customer_id || createTicketLogDto.customer_number) {
          if (createTicketLogDto.customer_id) {
            customerData = await this.costumerService.findOne(
              createTicketLogDto.customer_id,
              user,
            );
          } else if (createTicketLogDto.customer_number) {
            customerData = await this.costumerService.findByCustomerNumber(
              createTicketLogDto.customer_number,
            );
            if (!customerData) {
              throw new NotFoundException(
                `Customer not found with number ${createTicketLogDto.customer_number}`,
              );
            }
          }
        }

        const total = Number(routeTicket.price) * createTicketLogDto.quantity;

        const ticketLog = manager.create(TicketLog, {
          session_id: sessionId,
          operator_id: user.id,
          route_id: routeTicket.route_id,
          origin_route_stop_id: createTicketLogDto?.origin_route_stop_id,
          destination_route_stop_id: createTicketLogDto?.destination_route_stop_id,
          route_ticket_id: createTicketLogDto.route_ticket_id,
          vehicle_id: createTicketLogDto?.vehicle_id,
          driver_id: createTicketLogDto?.driver_id,
          customer_id: customerData?.id,
          customer_number: customerData?.customer_number,
          price_at_sale: routeTicket.price,
          quantity: createTicketLogDto.quantity,
          total: total,
          ...(createTicketLogDto.ticket_sold_at && { ticket_sold_at: new Date(createTicketLogDto.ticket_sold_at) }),
          ...(createTicketLogDto.reference && { reference: createTicketLogDto.reference }),
          notes: createTicketLogDto.notes,
          createdBy: user,
          updatedBy: user,
        });

        const savedLog = await manager.save(TicketLog, ticketLog);
        savedLogs.push(savedLog);

        totalLogsAmount += total;
        totalTicketsCount += createTicketLogDto.quantity;
      }

      return {
        total_logs: totalLogsAmount,
        total_tickets_logged: totalTicketsCount,
        logs: savedLogs,
      };
    });
  }

  async findSessionSales(
    sessionId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<TicketSale>> {
    const queryBuilder = this.ticketSaleRepository
      .createQueryBuilder('ticketSale')
      .leftJoinAndSelect('ticketSale.routeTicket', 'routeTicket')
      .leftJoinAndSelect('routeTicket.ticketType', 'ticketType')
      .leftJoinAndSelect('ticketSale.operator', 'operator')
      .leftJoinAndSelect('ticketSale.route', 'route')
      .leftJoinAndSelect('ticketSale.driver', 'driver')
      .leftJoinAndSelect('ticketSale.createdBy', 'createdBy')
      .where('ticketSale.session_id = :sessionId', { sessionId })
      .andWhere('ticketSale.deletedAt IS NULL')
      .orderBy('ticketSale.sold_at', 'DESC');

    return await paginate<TicketSale>(queryBuilder, options);
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
  ): Promise<Pagination<TicketSale>> {
    const queryBuilder = this.ticketSaleRepository
      .createQueryBuilder('ticketSale')
      .leftJoinAndSelect('ticketSale.session', 'session')
      .leftJoinAndSelect('ticketSale.routeTicket', 'routeTicket')
      .leftJoinAndSelect('routeTicket.ticketType', 'ticketType')
      .leftJoinAndSelect('ticketSale.operator', 'operator')
      .leftJoinAndSelect('ticketSale.route', 'route')
      .leftJoinAndSelect('ticketSale.driver', 'driver')
      .leftJoinAndSelect('ticketSale.createdBy', 'createdBy')
      .where('ticketSale.deletedAt IS NULL');

    if (operatorId) {
      queryBuilder.andWhere('ticketSale.operator_id = :operatorId', {
        operatorId,
      });
    }

    // Filtro de rota
    if (filters?.route_id) {
      queryBuilder.andWhere('ticketSale.route_id = :routeId', {
        routeId: filters.route_id,
      });
    }

    // Filtro de veículo
    if (filters?.vehicle_id) {
      queryBuilder.andWhere('ticketSale.vehicle_id = :vehicleId', {
        vehicleId: filters.vehicle_id,
      });
    }

    // Filtro de motorista
    if (filters?.driver_id) {
      queryBuilder.andWhere('ticketSale.driver_id = :driverId', {
        driverId: filters.driver_id,
      });
    }

    // Filtro de origem
    if (filters?.origin_route_stop_id) {
      queryBuilder.andWhere('ticketSale.origin_route_stop_id = :originRouteStopId', {
        originRouteStopId: filters.origin_route_stop_id,
      });
    }

    // Filtro de destino
    if (filters?.destination_route_stop_id) {
      queryBuilder.andWhere('ticketSale.destination_route_stop_id = :destinationRouteStopId', {
        destinationRouteStopId: filters.destination_route_stop_id,
      });
    }

    queryBuilder.orderBy('ticketSale.sold_at', 'DESC');

    return await paginate<TicketSale>(queryBuilder, options);
  }

  async findOne(id: number): Promise<TicketSale> {
    const ticketSale = await this.ticketSaleRepository.findOne({
      where: { id },
      relations: [
        'session',
        'operator',
        'route',
        'routeTicket',
        'routeTicket.ticketType',
        'driver',
        'createdBy',
        'updatedBy',
      ],
    });

    if (!ticketSale) {
      throw new NotFoundException('Ticket sale not found');
    }

    return ticketSale;
  }

  async getSalesReport(sessionId: number) {
    const session = await this.sessionService.findOne(sessionId);

    const salesByTicketType = await this.ticketSaleRepository
      .createQueryBuilder('ts')
      .select('tt.name', 'ticketTypeName')
      .addSelect('tt.code', 'ticketTypeCode')
      .addSelect('SUM(ts.quantity)', 'totalQuantity')
      .addSelect('SUM(ts.total)', 'totalAmount')
      .addSelect('AVG(ts.price_at_sale)', 'averagePrice')
      .innerJoin('ts.routeTicket', 'rt')
      .innerJoin('rt.ticketType', 'tt')
      .where('ts.session_id = :sessionId', { sessionId })
      .andWhere('ts.deletedAt IS NULL')
      .groupBy('tt.id')
      .getRawMany();

    return {
      session,
      salesByTicketType,
      totalSales: session.total_sales,
      totalTicketsSold: session.total_tickets_sold,
    };
  }
}