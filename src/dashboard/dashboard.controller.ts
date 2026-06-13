import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardFiltersDto } from './dto/dashboard-filters.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { DashboardData } from './interfaces/dashboard.interface';

@Controller({ path: 'dashboard', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(Role.ADMIN, Role.OPERATOR)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(
    @Query() filters: DashboardFiltersDto,
  ): Promise<DashboardData> {
    return this.dashboardService.getDashboardData(filters);
  }

  @Get('overview')
  async getOverview(@Query() filters: DashboardFiltersDto) {
    const data = await this.dashboardService.getDashboardData(filters);
    return data.overview;
  }

  @Get('sales-chart')
  async getSalesChart(@Query() filters: DashboardFiltersDto) {
    const data = await this.dashboardService.getDashboardData(filters);
    return data.salesChart;
  }

  @Get('route-performance')
  async getRoutePerformance(@Query() filters: DashboardFiltersDto) {
    const data = await this.dashboardService.getDashboardData(filters);
    return data.routePerformance;
  }

  @Get('operator-performance')
  // @Roles(Role.ADMIN)
  async getOperatorPerformance(@Query() filters: DashboardFiltersDto) {
    const data = await this.dashboardService.getDashboardData(filters);
    return data.operatorPerformance;
  }

  @Get('vehicle-performance')
  async getVehiclePerformance(@Query() filters: DashboardFiltersDto) {
    const data = await this.dashboardService.getDashboardData(filters);
    return data.vehiclePerformance;
  }

  @Get('ticket-analysis')
  async getTicketAnalysis(@Query() filters: DashboardFiltersDto) {
    const data = await this.dashboardService.getDashboardData(filters);
    return data.ticketTypeAnalysis;
  }

  @Get('session-analysis')
  async getSessionAnalysis(@Query() filters: DashboardFiltersDto) {
    const data = await this.dashboardService.getDashboardData(filters);
    return data.sessionAnalysis;
  }

  @Get('revenue-analysis')
  // @Roles(Role.ADMIN)
  async getRevenueAnalysis(@Query() filters: DashboardFiltersDto) {
    const data = await this.dashboardService.getDashboardData(filters);
    return data.revenueAnalysis;
  }
}
