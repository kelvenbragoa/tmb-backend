import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Session } from '../session/entities/session.entity';
import { User } from '../user/entities/user.entity';
import { TransportRoute } from '../transport-route/entities/transport-route.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { TicketType } from '../ticket-type/entities/ticket-type.entity';
import { TicketSale } from '../ticket-sale/entities/ticket-sale.entity';
import { DashboardFiltersDto, DatePeriod } from './dto/dashboard-filters.dto';
import {
  DashboardData,
  DashboardOverview,
  SalesChart,
  RoutePerformance,
  OperatorPerformance,
  VehiclePerformance,
  TicketTypeAnalysis,
  SessionAnalysis,
  RevenueAnalysis,
} from './interfaces/dashboard.interface';
import { Role } from '../user/entities/role.enum';
import { SessionStatus } from '../session/entities/session-status.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TransportRoute)
    private readonly routeRepository: Repository<TransportRoute>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(TicketType)
    private readonly ticketTypeRepository: Repository<TicketType>,
    @InjectRepository(TicketSale)
    private readonly ticketSaleRepository: Repository<TicketSale>,
    private readonly dataSource: DataSource,
  ) {}

  async getDashboardData(filters: DashboardFiltersDto): Promise<DashboardData> {
    const dateRange = this.getDateRange(filters);
    
    const [
      overview,
      salesChart,
      routePerformance,
      operatorPerformance,
      vehiclePerformance,
      ticketTypeAnalysis,
      sessionAnalysis,
      revenueAnalysis,
    ] = await Promise.all([
      this.getOverview(dateRange, filters),
      this.getSalesChart(dateRange, filters),
      this.getRoutePerformance(dateRange, filters),
      this.getOperatorPerformance(dateRange, filters),
      this.getVehiclePerformance(dateRange, filters),
      this.getTicketTypeAnalysis(dateRange, filters),
      this.getSessionAnalysis(dateRange, filters),
      this.getRevenueAnalysis(dateRange, filters),
    ]);

    return {
      overview,
      salesChart,
      routePerformance,
      operatorPerformance,
      vehiclePerformance,
      ticketTypeAnalysis,
      sessionAnalysis,
      revenueAnalysis,
      filters: {
        applied_period: filters.period || DatePeriod.LAST_30_DAYS,
        start_date: dateRange.startDate.toISOString().split('T')[0],
        end_date: dateRange.endDate.toISOString().split('T')[0],
        route_ids: filters.route_ids || [],
        vehicle_ids: filters.vehicle_ids || [],
        operator_ids: filters.operator_ids || [],
        ticket_type_ids: filters.ticket_type_ids || [],
      },
    };
  }

  private getDateRange(filters: DashboardFiltersDto): { startDate: Date; endDate: Date } {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    if (filters.period === DatePeriod.CUSTOM && filters.start_date && filters.end_date) {
      startDate = new Date(filters.start_date);
      endDate = new Date(filters.end_date);
    } else {
      switch (filters.period) {
        case DatePeriod.TODAY:
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
          break;
        case DatePeriod.YESTERDAY:
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
          break;
        case DatePeriod.LAST_7_DAYS:
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0);
          break;
        case DatePeriod.LAST_30_DAYS:
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0);
          break;
        case DatePeriod.LAST_90_DAYS:
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 89, 0, 0, 0);
          break;
        case DatePeriod.LAST_180_DAYS:
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 179, 0, 0, 0);
          break;
        case DatePeriod.THIS_MONTH:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
          break;
        case DatePeriod.LAST_MONTH:
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0);
          endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
          break;
        case DatePeriod.THIS_YEAR:
          startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0);
      }
    }

    return { startDate, endDate };
  }

  private async getOverview(
    dateRange: { startDate: Date; endDate: Date },
    filters: DashboardFiltersDto,
  ): Promise<DashboardOverview> {
    const baseSessionQuery = this.sessionRepository
      .createQueryBuilder('session')
      .where('session.createdAt >= :startDate', { startDate: dateRange.startDate })
      .andWhere('session.createdAt <= :endDate', { endDate: dateRange.endDate });

    const baseSaleQuery = this.ticketSaleRepository
      .createQueryBuilder('sale')
      .innerJoin('sale.session', 'session')
      .where('sale.createdAt >= :startDate', { startDate: dateRange.startDate })
      .andWhere('sale.createdAt <= :endDate', { endDate: dateRange.endDate });

    // Apply filters
    this.applyFilters(baseSessionQuery, filters, 'session');
    this.applyFilters(baseSaleQuery, filters, 'session');

    const [
      totalUsers,
      totalOperators,
      totalAdmins,
      activeUsers,
      totalRoutes,
      activeRoutes,
      totalVehicles,
      activeVehicles,
      totalTicketTypes,
      activeTicketTypes,
      totalSessions,
      activeSessions,
      closedSessions,
      salesData,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { role: Role.OPERATOR } }),
      this.userRepository.count({ where: { role: Role.ADMIN } }),
      this.userRepository.count({ where: { is_active: 1 } }),
      this.routeRepository.count(),
      this.routeRepository.count({ where: { is_active: true } }),
      this.vehicleRepository.count(),
      this.vehicleRepository.count({ where: { is_active: true } }),
      this.ticketTypeRepository.count(),
      this.ticketTypeRepository.count({ where: { is_active: true } }),
      baseSessionQuery.getCount(),
      baseSessionQuery.clone().andWhere('session.status = :status', { status: SessionStatus.OPEN }).getCount(),
      baseSessionQuery.clone().andWhere('session.status = :status', { status: SessionStatus.CLOSED }).getCount(),
      baseSaleQuery
        .select([
          'COUNT(sale.id) as total_sales',
          'SUM(sale.total) as total_revenue',
          'SUM(sale.quantity) as total_tickets',
          'AVG(sale.price_at_sale) as average_price',
        ])
        .getRawOne(),
    ]);

    return {
      totalUsers,
      totalOperators,
      totalAdmins,
      activeUsers,
      totalRoutes,
      activeRoutes,
      totalVehicles,
      activeVehicles,
      totalTicketTypes,
      activeTicketTypes,
      totalSessions,
      activeSessions,
      closedSessions,
      totalSales: Number(salesData?.total_sales) || 0,
      totalTicketsSold: Number(salesData?.total_tickets) || 0,
      averageTicketPrice: Number(salesData?.average_price) || 0,
      totalRevenue: Number(salesData?.total_revenue) || 0,
    };
  }

  private async getSalesChart(
    dateRange: { startDate: Date; endDate: Date },
    filters: DashboardFiltersDto,
  ): Promise<SalesChart[]> {
    const query = this.ticketSaleRepository
      .createQueryBuilder('sale')
      .innerJoin('sale.session', 'session')
      .select([
        'DATE(sale.createdAt) as date',
        'COUNT(sale.id) as sales_count',
        'SUM(sale.total) as revenue',
        'SUM(sale.quantity) as tickets_sold',
      ])
      .where('sale.createdAt >= :startDate', { startDate: dateRange.startDate })
      .andWhere('sale.createdAt <= :endDate', { endDate: dateRange.endDate })
      .groupBy('DATE(sale.createdAt)')
      .orderBy('DATE(sale.createdAt)', 'ASC');

    this.applyFilters(query, filters, 'session');

    const results = await query.getRawMany();
    
    return results.map((row) => ({
      date: row.date,
      sales_count: Number(row.sales_count),
      revenue: Number(row.revenue),
      tickets_sold: Number(row.tickets_sold),
    }));
  }

  private async getRoutePerformance(
    dateRange: { startDate: Date; endDate: Date },
    filters: DashboardFiltersDto,
  ): Promise<RoutePerformance[]> {
    const query = this.ticketSaleRepository
      .createQueryBuilder('sale')
      .innerJoin('sale.session', 'session')
      .innerJoin('sale.route', 'route')
      .select([
        'route.id as route_id',
        'route.name as route_name',
        'COUNT(sale.id) as total_sales',
        'SUM(sale.total) as total_revenue',
        'SUM(sale.quantity) as total_tickets',
        'COUNT(DISTINCT session.id) as sessions_count',
        'AVG(session.total_sales) as average_revenue_per_session',
      ])
      .where('sale.createdAt >= :startDate', { startDate: dateRange.startDate })
      .andWhere('sale.createdAt <= :endDate', { endDate: dateRange.endDate })
      .groupBy('route.id, route.name')
      .orderBy('total_revenue', 'DESC');

    this.applyFilters(query, filters, 'session');

    const results = await query.getRawMany();
    
    return results.map((row) => ({
      route_id: Number(row.route_id),
      route_name: row.route_name,
      total_sales: Number(row.total_sales),
      total_revenue: Number(row.total_revenue),
      total_tickets: Number(row.total_tickets),
      sessions_count: Number(row.sessions_count),
      average_revenue_per_session: Number(row.average_revenue_per_session) || 0,
    }));
  }

  private async getOperatorPerformance(
    dateRange: { startDate: Date; endDate: Date },
    filters: DashboardFiltersDto,
  ): Promise<OperatorPerformance[]> {
    const query = this.ticketSaleRepository
      .createQueryBuilder('sale')
      .innerJoin('sale.session', 'session')
      .innerJoin('session.operator', 'operator')
      .select([
        'operator.id as operator_id',
        'operator.name as operator_name',
        'COUNT(sale.id) as total_sales',
        'SUM(sale.total) as total_revenue',
        'SUM(sale.quantity) as total_tickets',
        'COUNT(DISTINCT session.id) as sessions_count',
        'AVG(session.total_sales) as average_revenue_per_session',
        'SUM(EXTRACT(EPOCH FROM (COALESCE(session.closed_at, NOW()) - session.opened_at)) / 3600) as hours_worked',
      ])
      .where('sale.createdAt >= :startDate', { startDate: dateRange.startDate })
      .andWhere('sale.createdAt <= :endDate', { endDate: dateRange.endDate })
      .groupBy('operator.id, operator.name')
      .orderBy('total_revenue', 'DESC');

    this.applyFilters(query, filters, 'session');

    const results = await query.getRawMany();
    
    return results.map((row) => ({
      operator_id: Number(row.operator_id),
      operator_name: row.operator_name,
      total_sales: Number(row.total_sales),
      total_revenue: Number(row.total_revenue),
      total_tickets: Number(row.total_tickets),
      sessions_count: Number(row.sessions_count),
      average_revenue_per_session: Number(row.average_revenue_per_session) || 0,
      hours_worked: Number(row.hours_worked) || 0,
    }));
  }

  private async getVehiclePerformance(
    dateRange: { startDate: Date; endDate: Date },
    filters: DashboardFiltersDto,
  ): Promise<VehiclePerformance[]> {
    const query = this.ticketSaleRepository
      .createQueryBuilder('sale')
      .innerJoin('sale.session', 'session')
      .innerJoin('sale.vehicle', 'vehicle')
      .select([
        'vehicle.id as vehicle_id',
        'vehicle.name as vehicle_name',
        'vehicle.plate as license_plate',
        'COUNT(sale.id) as total_sales',
        'SUM(sale.total) as total_revenue',
        'SUM(sale.quantity) as total_tickets',
        'COUNT(DISTINCT session.id) as sessions_count',
        '(COUNT(DISTINCT session.id)::float / (EXTRACT(DAY FROM (:endDate::timestamp - :startDate::timestamp)) + 1)) * 100 as utilization_rate',
      ])
      .where('sale.createdAt >= :startDate', { startDate: dateRange.startDate })
      .andWhere('sale.createdAt <= :endDate', { endDate: dateRange.endDate })
      .andWhere('sale.vehicle_id IS NOT NULL')
      .setParameters({ startDate: dateRange.startDate, endDate: dateRange.endDate })
      .groupBy('vehicle.id, vehicle.name, vehicle.plate')
      .orderBy('total_revenue', 'DESC');

    this.applyFilters(query, filters, 'session');

    const results = await query.getRawMany();
    
    return results.map((row) => ({
      vehicle_id: Number(row.vehicle_id),
      vehicle_name: row.vehicle_name,
      license_plate: row.license_plate,
      total_sales: Number(row.total_sales),
      total_revenue: Number(row.total_revenue),
      total_tickets: Number(row.total_tickets),
      sessions_count: Number(row.sessions_count),
      utilization_rate: Number(row.utilization_rate) || 0,
    }));
  }

  private async getTicketTypeAnalysis(
    dateRange: { startDate: Date; endDate: Date },
    filters: DashboardFiltersDto,
  ): Promise<TicketTypeAnalysis[]> {
    // Get total sales for percentage calculation
    const totalQuery = this.ticketSaleRepository
      .createQueryBuilder('sale')
      .innerJoin('sale.session', 'session')
      .select('SUM(sale.quantity) as total')
      .where('sale.createdAt >= :startDate', { startDate: dateRange.startDate })
      .andWhere('sale.createdAt <= :endDate', { endDate: dateRange.endDate });

    this.applyFilters(totalQuery, filters, 'session');
    const totalResult = await totalQuery.getRawOne();
    const totalSold = Number(totalResult?.total) || 1;

    const query = this.ticketSaleRepository
      .createQueryBuilder('sale')
      .innerJoin('sale.session', 'session')
      .innerJoin('sale.routeTicket', 'routeTicket')
      .innerJoin('routeTicket.ticketType', 'ticketType')
      .select([
        'ticketType.id as ticket_type_id',
        'ticketType.name as ticket_type_name',
        'SUM(sale.quantity) as total_sold',
        'SUM(sale.total) as total_revenue',
        'AVG(sale.price_at_sale) as average_price',
        `(SUM(sale.quantity) / ${totalSold}) * 100 as percentage_of_total`,
      ])
      .where('sale.createdAt >= :startDate', { startDate: dateRange.startDate })
      .andWhere('sale.createdAt <= :endDate', { endDate: dateRange.endDate })
      .groupBy('ticketType.id, ticketType.name')
      .orderBy('total_sold', 'DESC');

    this.applyFilters(query, filters, 'session');

    const results = await query.getRawMany();
    
    return results.map((row) => ({
      ticket_type_id: Number(row.ticket_type_id),
      ticket_type_name: row.ticket_type_name,
      total_sold: Number(row.total_sold),
      total_revenue: Number(row.total_revenue),
      percentage_of_total: Number(row.percentage_of_total) || 0,
      average_price: Number(row.average_price) || 0,
    }));
  }

  private async getSessionAnalysis(
    dateRange: { startDate: Date; endDate: Date },
    filters: DashboardFiltersDto,
  ): Promise<SessionAnalysis> {
    const sessionQuery = this.sessionRepository
      .createQueryBuilder('session')
      .where('session.createdAt >= :startDate', { startDate: dateRange.startDate })
      .andWhere('session.createdAt <= :endDate', { endDate: dateRange.endDate });

    this.applyFilters(sessionQuery, filters, 'session');

    const [avgDurationResult, avgSalesResult, peakHours, busiestRoutes] = await Promise.all([
      sessionQuery
        .clone()
        .select('AVG(EXTRACT(EPOCH FROM (COALESCE(session.closed_at, NOW()) - session.opened_at)) / 60) as avg_duration')
        .getRawOne(),
      
      sessionQuery
        .clone()
        .select('AVG(session.total_sales) as avg_sales')
        .getRawOne(),
      
      this.ticketSaleRepository
        .createQueryBuilder('sale')
        .innerJoin('sale.session', 'session')
        .select([
          'EXTRACT(HOUR FROM sale.createdAt) as hour',
          'COUNT(sale.id) as sales_count',
        ])
        .where('sale.createdAt >= :startDate', { startDate: dateRange.startDate })
        .andWhere('sale.createdAt <= :endDate', { endDate: dateRange.endDate })
        .groupBy('EXTRACT(HOUR FROM sale.createdAt)')
        .orderBy('sales_count', 'DESC')
        .limit(24)
        .getRawMany(),
      
      this.ticketSaleRepository
        .createQueryBuilder('sale')
        .innerJoin('sale.session', 'session')
        .innerJoin('sale.route', 'route')
        .select([
          'route.id as route_id',
          'route.name as route_name',
          'COUNT(DISTINCT session.id) as sessions_count',
        ])
        .where('session.createdAt >= :startDate', { startDate: dateRange.startDate })
        .andWhere('session.createdAt <= :endDate', { endDate: dateRange.endDate })
        .groupBy('route.id, route.name')
        .orderBy('sessions_count', 'DESC')
        .limit(10)
        .getRawMany(),
    ]);

    return {
      average_session_duration: Number(avgDurationResult?.avg_duration) || 0,
      average_sales_per_session: Number(avgSalesResult?.avg_sales) || 0,
      peak_hours: peakHours.map((row) => ({
        hour: Number(row.hour),
        sales_count: Number(row.sales_count),
      })),
      busiest_routes: busiestRoutes.map((row) => ({
        route_id: Number(row.route_id),
        route_name: row.route_name,
        sessions_count: Number(row.sessions_count),
      })),
    };
  }

  private async getRevenueAnalysis(
    dateRange: { startDate: Date; endDate: Date },
    filters: DashboardFiltersDto,
  ): Promise<RevenueAnalysis> {
    const baseQuery = this.ticketSaleRepository
      .createQueryBuilder('sale')
      .innerJoin('sale.session', 'session')
      .where('sale.createdAt >= :startDate', { startDate: dateRange.startDate })
      .andWhere('sale.createdAt <= :endDate', { endDate: dateRange.endDate });

    this.applyFilters(baseQuery, filters, 'session');

    const [totalRevenueResult, revenueByRoute] = await Promise.all([
      baseQuery
        .clone()
        .select('SUM(sale.total) as total_revenue')
        .getRawOne(),
      
      baseQuery
        .clone()
        .innerJoin('sale.route', 'route')
        .select([
          'route.id as route_id',
          'route.name as route_name',
          'SUM(sale.total) as revenue',
        ])
        .groupBy('route.id, route.name')
        .orderBy('revenue', 'DESC')
        .getRawMany(),
    ]);

    const totalRevenue = Number(totalRevenueResult?.total_revenue) || 0;

    // Calculate growth (compare with previous period)
    const previousPeriodStart = new Date(dateRange.startDate);
    const previousPeriodEnd = new Date(dateRange.endDate);
    const periodDiff = dateRange.endDate.getTime() - dateRange.startDate.getTime();
    
    previousPeriodStart.setTime(dateRange.startDate.getTime() - periodDiff);
    previousPeriodEnd.setTime(dateRange.endDate.getTime() - periodDiff);

    const previousRevenueQuery = this.ticketSaleRepository
      .createQueryBuilder('sale')
      .innerJoin('sale.session', 'session')
      .select('SUM(sale.total) as total_revenue')
      .where('sale.createdAt >= :startDate', { startDate: previousPeriodStart })
      .andWhere('sale.createdAt <= :endDate', { endDate: previousPeriodEnd });

    this.applyFilters(previousRevenueQuery, filters, 'session');
    
    const previousRevenueResult = await previousRevenueQuery.getRawOne();
    const previousRevenue = Number(previousRevenueResult?.total_revenue) || 0;
    
    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    return {
      total_revenue: totalRevenue,
      revenue_growth: revenueGrowth,
      revenue_by_payment_method: [
        { method: 'cash', amount: totalRevenue, percentage: 100 },
      ], // TODO: Implement when payment methods are added
      revenue_by_route: revenueByRoute.map((row) => ({
        route_id: Number(row.route_id),
        route_name: row.route_name,
        revenue: Number(row.revenue),
        percentage: totalRevenue > 0 ? (Number(row.revenue) / totalRevenue) * 100 : 0,
      })),
    };
  }

  private applyFilters(query: any, filters: DashboardFiltersDto, sessionAlias: string): void {
    if (filters.route_ids && Array.isArray(filters.route_ids) && filters.route_ids.length > 0) {
      query.andWhere(`${sessionAlias}.route_id IN (:...routeIds)`, { routeIds: filters.route_ids });
    }

    if (filters.vehicle_ids && Array.isArray(filters.vehicle_ids) && filters.vehicle_ids.length > 0) {
      query.andWhere(`${sessionAlias}.vehicle_id IN (:...vehicleIds)`, { vehicleIds: filters.vehicle_ids });
    }

    if (filters.operator_ids && Array.isArray(filters.operator_ids) && filters.operator_ids.length > 0) {
      query.andWhere(`${sessionAlias}.operator_id IN (:...operatorIds)`, { operatorIds: filters.operator_ids });
    }

    if (filters.ticket_type_ids && Array.isArray(filters.ticket_type_ids) && filters.ticket_type_ids.length > 0) {
      query.andWhere('routeTicket.ticket_type_id IN (:...ticketTypeIds)', { ticketTypeIds: filters.ticket_type_ids });
    }
  }
}