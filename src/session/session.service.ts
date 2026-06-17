import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Raw, In } from 'typeorm';
import { Session } from './entities/session.entity';
import { TicketSale } from '../ticket-sale/entities/ticket-sale.entity';
import { PenaltyTicketSale } from '../penalty-ticket-sale/entities/penalty-ticket-sale.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { CloseSessionDto } from './dto/close-session.dto';
import { SessionDetailDto } from './dto/session-detail.dto';
import { SessionStatus } from './entities/session-status.enum';
import { User } from '../user/entities/user.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Role } from '../user/entities/role.enum';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(TicketSale)
    private readonly ticketSaleRepository: Repository<TicketSale>,
    @InjectRepository(PenaltyTicketSale)
    private readonly penaltyTicketSaleRepository: Repository<PenaltyTicketSale>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createSessionDto: CreateSessionDto,
    user: User,
  ): Promise<Session> {
    // Determinar o operador da sessão
    const operatorId: number = createSessionDto.user_id ?? 0;
    // Se user_id foi fornecido e o usuário atual é ADMIN, usar o user_id fornecido
    // if (createSessionDto.user_id && user.role === Role.ADMIN) {
    //   operatorId = createSessionDto.user_id;
    // } else if (createSessionDto.user_id && user.role !== Role.ADMIN) {
    //   throw new ForbiddenException(
    //     'Only administrators can create sessions for other users',
    //   );
    // }

    // Verificar se já existe uma sessão aberta para o operador
    const openSession = await this.sessionRepository.findOne({
      where: {
        operator_id: operatorId,
        status: SessionStatus.OPEN,
      },
    });

    if (openSession) {
      throw new BadRequestException('Operator already has an open session');
    }

    const session = this.sessionRepository.create({
      ...createSessionDto,
      operator_id: operatorId,
      status: SessionStatus.OPEN,
      createdBy: user,
      updatedBy: user,
    });

    return await this.sessionRepository.save(session);
  }

  async findAll(
    options: IPaginationOptions,
    operatorId?: number,
    filters?: {
      status?: SessionStatus | 'OPEN' | 'CLOSED';
      operator_id?: number;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<Pagination<Session>> {
    const queryBuilder = this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.operator', 'operator')
      .leftJoinAndSelect('session.shift', 'shift')
      .leftJoinAndSelect('session.createdBy', 'createdBy')
      .leftJoinAndSelect('session.updatedBy', 'updatedBy')
      .where('session.deletedAt IS NULL');

    // Filtro de status (OPEN/CLOSED)
    if (filters?.status) {
      const statusValue = typeof filters.status === 'string'
        ? filters.status.toLowerCase()
        : filters.status;
      queryBuilder.andWhere('session.status = :status', { status: statusValue });
    }

    // Filtro de operador (prioritário sobre o parâmetro legado)
    const finalOperatorId = filters?.operator_id ?? operatorId;
    if (finalOperatorId) {
      queryBuilder.andWhere('session.operator_id = :operatorId', {
        operatorId: finalOperatorId,
      });
    }

    // Filtro de data de criação (início)
    if (filters?.startDate) {
      queryBuilder.andWhere('session.createdAt >= :startDate', {
        startDate: new Date(filters.startDate),
      });
    }

    // Filtro de data de criação (fim)
    if (filters?.endDate) {
      queryBuilder.andWhere('session.createdAt <= :endDate', {
        endDate: new Date(filters.endDate),
      });
    }

    queryBuilder.orderBy('session.createdAt', 'DESC');

    return await paginate<Session>(queryBuilder, options);
  }

  async findOne(id: number): Promise<SessionDetailDto> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: [
        'operator',
        'shift',
        'createdBy',
        'updatedBy',
        'closedBy',
        'ticketSales',
        'ticketSales.route',
        'ticketSales.routeTicket',
        'ticketSales.routeTicket.ticketType',
        'ticketSales.vehicle',
        'ticketSales.driver',
        'ticketLogs',
        'ticketLogs.route',
        'ticketLogs.routeTicket',
        'ticketLogs.routeTicket.ticketType',
        'ticketLogs.vehicle',
        'ticketLogs.driver',
        'penaltyTicketSales',
        'penaltyTicketSales.route',
        'penaltyTicketSales.routeTicket',
        'penaltyTicketSales.routeTicket.ticketType',
        'penaltyTicketSales.vehicle',
        'penaltyTicketSales.driver',
      ],
      order: {
        ticketSales: {
          sold_at: 'DESC',
        },
        ticketLogs: {
          sold_at: 'DESC',
        },
        penaltyTicketSales: {
          sold_at: 'DESC',
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Calcular indicadores
    const totalRegularTickets = session.ticketSales?.reduce((sum, sale) => sum + sale.quantity, 0) || 0;
    const totalPenaltyTickets = session.penaltyTicketSales?.reduce((sum, sale) => sum + sale.quantity, 0) || 0;
    const totalRegularSales = session.ticketSales?.reduce((sum, sale) => sum + Number(sale.total), 0) || 0;
    const totalPenaltySales = session.penaltyTicketSales?.reduce((sum, sale) => sum + Number(sale.total), 0) || 0;
    const totalTickets = totalRegularTickets + totalPenaltyTickets;
    const totalSales = totalRegularSales + totalPenaltySales;
    const totalTransactions = (session.ticketSales?.length || 0) + (session.penaltyTicketSales?.length || 0);
    const averageTicketPrice = totalTickets > 0 ? totalSales / totalTickets : 0;

    // Vendas por tipo de bilhete
    const salesByTicketTypeMap = new Map<number, {
      ticket_type_id: number;
      ticket_type_name: string;
      quantity: number;
      total_amount: number;
    }>();

    session.ticketSales?.forEach(sale => {
      const key = sale.routeTicket.ticket_type_id;
      if (!salesByTicketTypeMap.has(key)) {
        salesByTicketTypeMap.set(key, {
          ticket_type_id: key,
          ticket_type_name: sale.routeTicket.ticketType.name,
          quantity: 0,
          total_amount: 0,
        });
      }
      const data = salesByTicketTypeMap.get(key)!;
      data.quantity += sale.quantity;
      data.total_amount += Number(sale.total);
    });

    session.penaltyTicketSales?.forEach(sale => {
      const key = sale.routeTicket.ticket_type_id;
      if (!salesByTicketTypeMap.has(key)) {
        salesByTicketTypeMap.set(key, {
          ticket_type_id: key,
          ticket_type_name: sale.routeTicket.ticketType.name,
          quantity: 0,
          total_amount: 0,
        });
      }
      const data = salesByTicketTypeMap.get(key)!;
      data.quantity += sale.quantity;
      data.total_amount += Number(sale.total);
    });

    const salesByTicketType = Array.from(salesByTicketTypeMap.values())
      .map(item => ({
        ...item,
        percentage: totalSales > 0 ? (item.total_amount / totalSales) * 100 : 0,
      }))
      .sort((a, b) => b.total_amount - a.total_amount);

    // Vendas por rota
    const salesByRouteMap = new Map<number, {
      route_id: number;
      route_name: string;
      regular_tickets: number;
      penalty_tickets: number;
      total_amount: number;
    }>();

    session.ticketSales?.forEach(sale => {
      const key = sale.route_id;
      if (!salesByRouteMap.has(key)) {
        salesByRouteMap.set(key, {
          route_id: key,
          route_name: sale.route.name,
          regular_tickets: 0,
          penalty_tickets: 0,
          total_amount: 0,
        });
      }
      const data = salesByRouteMap.get(key)!;
      data.regular_tickets += sale.quantity;
      data.total_amount += Number(sale.total);
    });

    session.penaltyTicketSales?.forEach(sale => {
      const key = sale.route_id;
      if (!salesByRouteMap.has(key)) {
        salesByRouteMap.set(key, {
          route_id: key,
          route_name: sale.route.name,
          regular_tickets: 0,
          penalty_tickets: 0,
          total_amount: 0,
        });
      }
      const data = salesByRouteMap.get(key)!;
      data.penalty_tickets += sale.quantity;
      data.total_amount += Number(sale.total);
    });

    const salesByRoute = Array.from(salesByRouteMap.values())
      .map(item => ({
        ...item,
        total_tickets: item.regular_tickets + item.penalty_tickets,
        percentage: totalSales > 0 ? (item.total_amount / totalSales) * 100 : 0,
      }))
      .sort((a, b) => b.total_amount - a.total_amount);

    // Vendas por route_ticket (combinação rota + tipo de bilhete)
    const salesByRouteTicketMap = new Map<number, {
      route_ticket_id: number;
      route_name: string;
      ticket_type_name: string;
      price: number;
      penalty_price: number;
      regular_tickets: number;
      penalty_tickets: number;
      total_amount: number;
    }>();

    session.ticketSales?.forEach(sale => {
      const key = sale.route_ticket_id;
      if (!salesByRouteTicketMap.has(key)) {
        salesByRouteTicketMap.set(key, {
          route_ticket_id: key,
          route_name: sale.route.name,
          ticket_type_name: sale.routeTicket.ticketType.name,
          price: Number(sale.price_at_sale),
          penalty_price: Number(sale.routeTicket.penalty_price),
          regular_tickets: 0,
          penalty_tickets: 0,
          total_amount: 0,
        });
      }
      const data = salesByRouteTicketMap.get(key)!;
      data.regular_tickets += sale.quantity;
      data.total_amount += Number(sale.total);
    });

    session.penaltyTicketSales?.forEach(sale => {
      const key = sale.route_ticket_id;
      if (!salesByRouteTicketMap.has(key)) {
        salesByRouteTicketMap.set(key, {
          route_ticket_id: key,
          route_name: sale.route.name,
          ticket_type_name: sale.routeTicket.ticketType.name,
          price: Number(sale.routeTicket.price),
          penalty_price: Number(sale.penalty_price_at_sale),
          regular_tickets: 0,
          penalty_tickets: 0,
          total_amount: 0,
        });
      }
      const data = salesByRouteTicketMap.get(key)!;
      data.penalty_tickets += sale.quantity;
      data.total_amount += Number(sale.total);
    });

    const salesByRouteTicket = Array.from(salesByRouteTicketMap.values())
      .map(item => ({
        ...item,
        total_tickets: item.regular_tickets + item.penalty_tickets,
        percentage: totalSales > 0 ? (item.total_amount / totalSales) * 100 : 0,
      }))
      .sort((a, b) => b.total_amount - a.total_amount);

    // Vendas por veículo
    const salesByVehicleMap = new Map<number, {
      vehicle_id: number;
      vehicle_name: string;
      vehicle_plate: string;
      regular_tickets: number;
      penalty_tickets: number;
      total_amount: number;
    }>();

    session.ticketSales?.forEach(sale => {
      if (sale.vehicle_id) {
        const key = sale.vehicle_id;
        if (!salesByVehicleMap.has(key)) {
          salesByVehicleMap.set(key, {
            vehicle_id: key,
            vehicle_name: sale.vehicle.name,
            vehicle_plate: sale.vehicle.plate,
            regular_tickets: 0,
            penalty_tickets: 0,
            total_amount: 0,
          });
        }
        const data = salesByVehicleMap.get(key)!;
        data.regular_tickets += sale.quantity;
        data.total_amount += Number(sale.total);
      }
    });

    session.penaltyTicketSales?.forEach(sale => {
      if (sale.vehicle_id) {
        const key = sale.vehicle_id;
        if (!salesByVehicleMap.has(key)) {
          salesByVehicleMap.set(key, {
            vehicle_id: key,
            vehicle_name: sale.vehicle.name,
            vehicle_plate: sale.vehicle.plate,
            regular_tickets: 0,
            penalty_tickets: 0,
            total_amount: 0,
          });
        }
        const data = salesByVehicleMap.get(key)!;
        data.penalty_tickets += sale.quantity;
        data.total_amount += Number(sale.total);
      }
    });

    const salesByVehicle = Array.from(salesByVehicleMap.values())
      .map(item => ({
        ...item,
        total_tickets: item.regular_tickets + item.penalty_tickets,
        percentage: totalSales > 0 ? (item.total_amount / totalSales) * 100 : 0,
      }))
      .sort((a, b) => b.total_amount - a.total_amount);

    // Vendas por hora
    const salesByHourMap = new Map<number, {
      regular_tickets: number;
      penalty_tickets: number;
      total_amount: number;
    }>();

    session.ticketSales?.forEach(sale => {
      const hour = new Date(sale.ticket_sold_at).getHours();
      // const hour = (new Date(sale.sold_at).getHours() + 2) % 24;

      if (!salesByHourMap.has(hour)) {
        salesByHourMap.set(hour, {
          regular_tickets: 0,
          penalty_tickets: 0,
          total_amount: 0,
        });
      }
      const data = salesByHourMap.get(hour)!;
      data.regular_tickets += sale.quantity;
      data.total_amount += Number(sale.total);
    });

    session.penaltyTicketSales?.forEach(sale => {
      const hour = new Date(sale.ticket_sold_at).getHours();
      // const hour = (new Date(sale.sold_at).getHours() + 2) % 24;
      if (!salesByHourMap.has(hour)) {
        salesByHourMap.set(hour, {
          regular_tickets: 0,
          penalty_tickets: 0,
          total_amount: 0,
        });
      }
      const data = salesByHourMap.get(hour)!;
      data.penalty_tickets += sale.quantity;
      data.total_amount += Number(sale.total);
    });

    const salesByHour = Array.from(salesByHourMap.entries())
      .map(([hour, data]) => ({
        hour,
        ...data,
        total_tickets: data.regular_tickets + data.penalty_tickets,
      }))
      .sort((a, b) => a.hour - b.hour);

    // Histórico de vendas recentes (últimas 20 vendas)
    const allSales = [
      ...(session.ticketSales?.map(sale => ({
        id: sale.id,
        reference: sale.reference,
        type: 'regular' as const,
        route_name: sale.route.name,
        ticket_type_name: sale.routeTicket.ticketType.name,
        quantity: sale.quantity,
        price: Number(sale.price_at_sale),
        total: Number(sale.total),
        ticket_sold_at: sale.ticket_sold_at,
        sold_at: sale.sold_at,
        customer_number: sale.customer_number,
        vehicle_plate: sale.vehicle?.plate || null,
        driver_name: sale.driver?.name || null,
      })) || []),
      ...(session.penaltyTicketSales?.map(sale => ({
        id: sale.id,
        reference: sale.reference,
        type: 'penalty' as const,
        route_name: sale.route.name,
        ticket_type_name: sale.routeTicket.ticketType.name,
        quantity: sale.quantity,
        price: Number(sale.penalty_price_at_sale),
        total: Number(sale.total),
        ticket_sold_at: sale.ticket_sold_at,
        sold_at: sale.sold_at,
        customer_number: sale.customer_number,
        vehicle_plate: sale.vehicle?.plate || null,
        driver_name: sale.driver?.name || null,
      })) || []),
    ];

    const recentSales = allSales
      .sort((a, b) => new Date(b.ticket_sold_at).getTime() - new Date(a.ticket_sold_at).getTime());
      // .slice(0, 20);

    // Processar ticket logs (últimos 20 logs)
    const recentLogs = (session.ticketLogs || [])
      .map(log => ({
        id: log.id,
        route_name: log.route.name,
        ticket_type_name: log.routeTicket.ticketType.name,
        quantity: log.quantity,
        price: Number(log.price_at_sale),
        total: Number(log.total),
        sold_at: log.sold_at,
        ticket_sold_at: log.ticket_sold_at,
        customer_number: log.customer_number,
        vehicle_plate: log.vehicle?.plate || null,
        driver_name: log.driver?.name || null,
        reference: log.reference,
        notes: log.notes,
      }))
      .sort((a, b) => new Date(b.ticket_sold_at).getTime() - new Date(a.ticket_sold_at).getTime())
      .slice(0, 20);

    // Montar o DTO de resposta
    return {
      id: session.id,
      status: session.status,
      opened_at: session.opened_at,
      closed_at: session.closed_at,
      total_sales: Number(session.total_sales),
      total_penalty_sales: Number(session.total_penalty_sales),
      total_amount: Number(session.total_amount),
      total_tickets_sold: session.total_tickets_sold,
      actual_amount_delivered: session.actual_amount_delivered ? Number(session.actual_amount_delivered) : null,
      notes: session.notes,
      operator: {
        id: session.operator.id,
        name: session.operator.name,
        email: session.operator.username,
      },
      shift: session.shift ? {
        id: session.shift.id,
        name: session.shift.name,
        start_time: session.shift.start_time,
        end_time: session.shift.end_time,
      } : null,
      indicators: {
        total_regular_tickets: totalRegularTickets,
        total_penalty_tickets: totalPenaltyTickets,
        total_regular_sales: totalRegularSales,
        total_penalty_sales: totalPenaltySales,
        average_ticket_price: averageTicketPrice,
        total_transactions: totalTransactions,
      },
      salesByTicketType,
      salesByRoute,
      salesByRouteTicket,
      salesByVehicle,
      salesByHour,
      recentSales,
      recentLogs,
      createdBy: {
        id: session.createdBy.id,
        name: session.createdBy.name,
      },
      updatedBy: session.updatedBy ? {
        id: session.updatedBy.id,
        name: session.updatedBy.name,
      } : null,
      closedBy: session.closedBy ? {
        id: session.closedBy.id,
        name: session.closedBy.name,
      } : null,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  private async findSessionById(id: number): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['operator', 'shift', 'createdBy', 'updatedBy', 'closedBy'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async findCurrentSession(operatorId: number): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: {
        operator_id: operatorId,
        status: SessionStatus.OPEN,
      },
      relations: ['operator', 'shift'],
    });

    if (!session) {
      throw new NotFoundException('No open session found for this operator');
    }

    return session;
  }

  async closeSession(
    id: number,
    closeSessionDto: CloseSessionDto,
    user: User,
  ): Promise<Session> {
    const session = await this.findSessionById(id);

    if (session.status === SessionStatus.CLOSED) {
      throw new BadRequestException('Session is already closed');
    }

    // if (session.operator_id !== user.id && user.role !== Role.ADMIN) {
    //   throw new ForbiddenException(
    //     'Only the operator or admin can close this session',
    //   );
    // }

    return await this.dataSource.transaction(async (manager) => {
      // Calcular totais de vendas normais
      const regularTotals = await manager
        .createQueryBuilder()
        .select('SUM(ts.total)', 'total_sales')
        .addSelect('SUM(ts.quantity)', 'total_tickets_sold')
        .from('ticket_sales', 'ts')
        .where('ts.session_id = :sessionId', { sessionId: id })
        .getRawOne();

      // Calcular totais de vendas de multas
      const penaltyTotals = await manager
        .createQueryBuilder()
        .select('SUM(pts.total)', 'total_penalty_sales')
        .addSelect('SUM(pts.quantity)', 'total_penalty_tickets_sold')
        .from('penalty_ticket_sales', 'pts')
        .where('pts.session_id = :sessionId', { sessionId: id })
        .getRawOne();

      const totalSales = Number(regularTotals?.total_sales) || 0;
      const totalPenaltySales = Number(penaltyTotals?.total_penalty_sales) || 0;
      const totalTicketsSold = Number(regularTotals?.total_tickets_sold) || 0;
      const totalPenaltyTicketsSold = Number(penaltyTotals?.total_penalty_tickets_sold) || 0;

      session.status = SessionStatus.CLOSED;
      session.closed_at = new Date();
      session.closed_by_id = user.id;
      session.total_sales = totalSales;
      session.total_penalty_sales = totalPenaltySales;
      session.total_amount = totalSales + totalPenaltySales;
      session.total_tickets_sold = totalTicketsSold + totalPenaltyTicketsSold;
      session.actual_amount_delivered = closeSessionDto.actual_amount_delivered !== undefined 
        ? closeSessionDto.actual_amount_delivered 
        : null;
      session.notes = closeSessionDto.notes || session.notes;
      session.updatedBy = user;

      return await manager.save(Session, session);
    });
  }

  async validateSessionForSale(
    sessionId: number,
    operatorId: number,
  ): Promise<Session> {
    const session = await this.findSessionById(sessionId);

    if (session.status !== SessionStatus.OPEN) {
      throw new BadRequestException('Session is not open : session id ' + sessionId);
    }

    if (session.operator_id !== operatorId) {
      throw new ForbiddenException('Session does not belong to operator');
    }

    return session;
  }

  async findReports(date: string, operatorId: number) {
    // console.log(date, operatorId);
    const sessions = await this.sessionRepository.find({
      where: [
        {
          createdBy: { id: operatorId },
          createdAt: Raw((alias) => `DATE(${alias}) = :date`, { date }),
        },
        {
          closed_by_id: operatorId,
          createdAt: Raw((alias) => `DATE(${alias}) = :date`, { date }),
        },
      ],
      relations: [
        'operator',
        'shift',
        'createdBy',
        'updatedBy',
        'closedBy',
      ],
    });

    if (!sessions.length) {
      throw new NotFoundException('Este usuario caixa nao criou nehuma sessão nesta data. Por favor verifique os dados. O relatório é gerado com base na data de criação da sessão e no usuário que a fechou a sessão. Se o usuário criou sessões em outras datas ou se as sessões foram fechadas por outro usuário, elas não aparecerão neste relatório.');
    }

    const totalAmount = sessions.reduce(
      (sum, session) => sum + Number(session.total_amount),
      0,
    );

    const totalAmountByShift = [
      ...sessions.reduce((map, session) => {
        const existing = map.get(session.shift_id);
        if (existing) {
          existing.totalAmount += Number(session.total_amount);
        } else {
          map.set(session.shift_id, {
            shift_id: session.shift_id,
            shift_name: session.shift?.name ?? null,
            totalAmount: Number(session.total_amount),
          });
        }
        return map;
      }, new Map<number | null, { shift_id: number | null; shift_name: string | null; totalAmount: number }>()),
    ].map((entry) => entry[1]);

    const sessionIds = sessions.map((session) => session.id);

    const sessionShiftMap = new Map(
      sessions.map((session) => [
        session.id,
        { shift_id: session.shift_id, shift_name: session.shift?.name ?? null },
      ]),
    );

    const ticketSales = await this.ticketSaleRepository.find({
      where: {
        session_id: In(sessionIds),
      },
      relations: ['routeTicket', 'routeTicket.ticketType', 'route'],
    });

    const penaltyTicketSales = await this.penaltyTicketSaleRepository.find({
      where: {
        session_id: In(sessionIds),
      },
      relations: ['routeTicket', 'routeTicket.ticketType', 'route'],
    });

    const salesByTicketType = [
      ...ticketSales.reduce((map, sale) => {
        const key = sale.routeTicket.ticket_type_id;
        const existing = map.get(key);
        if (existing) {
          existing.quantity += sale.quantity;
          existing.total_amount += Number(sale.total);
        } else {
          map.set(key, {
            ticket_type_id: key,
            ticket_type_name: sale.routeTicket.ticketType.name,
            ticket_price: Number(sale.routeTicket.price),
            quantity: sale.quantity,
            total_amount: Number(sale.total),
          });
        }
        return map;
      }, new Map<number, { ticket_type_id: number; ticket_type_name: string; ticket_price: number; quantity: number; total_amount: number }>()),
    ].map((entry) => entry[1]);

    const totalAmountByShiftAndRoute = [
      ...ticketSales.reduce((shiftMap, sale) => {
        const { shift_id, shift_name } = sessionShiftMap.get(sale.session_id)!;
        let shiftEntry = shiftMap.get(shift_id);
        if (!shiftEntry) {
          shiftEntry = {
            shift_id,
            shift_name,
            routes: new Map<number, { route_id: number; route_name: string; total_amount: number }>(),
          };
          shiftMap.set(shift_id, shiftEntry);
        }
        const existingRoute = shiftEntry.routes.get(sale.route_id);
        if (existingRoute) {
          existingRoute.total_amount += Number(sale.total);
        } else {
          shiftEntry.routes.set(sale.route_id, {
            route_id: sale.route_id,
            route_name: sale.route.name,
            total_amount: Number(sale.total),
          });
        }
        return shiftMap;
      }, new Map<number | null, {
        shift_id: number | null;
        shift_name: string | null;
        routes: Map<number, { route_id: number; route_name: string; total_amount: number }>;
      }>()),
    ].map((entry) => ({
      shift_id: entry[1].shift_id,
      shift_name: entry[1].shift_name,
      routes: [...entry[1].routes.values()],
    }));

    const salesByRouteTicketMap = new Map<number, {
      route_ticket_id: number;
      route_name: string;
      ticket_type_name: string;
      price: number;
      penalty_price: number;
      regular_tickets: number;
      penalty_tickets: number;
      total_amount: number;
    }>();

    ticketSales.forEach(sale => {
      const key = sale.route_ticket_id;
      if (!salesByRouteTicketMap.has(key)) {
        salesByRouteTicketMap.set(key, {
          route_ticket_id: key,
          route_name: sale.route.name,
          ticket_type_name: sale.routeTicket.ticketType.name,
          price: Number(sale.price_at_sale),
          penalty_price: Number(sale.routeTicket.penalty_price),
          regular_tickets: 0,
          penalty_tickets: 0,
          total_amount: 0,
        });
      }
      const data = salesByRouteTicketMap.get(key)!;
      data.regular_tickets += sale.quantity;
      data.total_amount += Number(sale.total);
    });

    penaltyTicketSales.forEach(sale => {
      const key = sale.route_ticket_id;
      if (!salesByRouteTicketMap.has(key)) {
        salesByRouteTicketMap.set(key, {
          route_ticket_id: key,
          route_name: sale.route.name,
          ticket_type_name: sale.routeTicket.ticketType.name,
          price: Number(sale.routeTicket.price),
          penalty_price: Number(sale.penalty_price_at_sale),
          regular_tickets: 0,
          penalty_tickets: 0,
          total_amount: 0,
        });
      }
      const data = salesByRouteTicketMap.get(key)!;
      data.penalty_tickets += sale.quantity;
      data.total_amount += Number(sale.total);
    });

    const salesByRouteTicket = Array.from(salesByRouteTicketMap.values())
      .map(item => ({
        ...item,
        total_tickets: item.regular_tickets + item.penalty_tickets,
      }))
      .sort((a, b) => b.total_amount - a.total_amount);

    return {
      sessions,
      totalAmount,
      totalAmountByShift,
      salesByTicketType,
      totalAmountByShiftAndRoute,
      salesByRouteTicket,
    };
  }
}