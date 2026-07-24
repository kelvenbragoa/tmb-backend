import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PassReportsService } from './pass-reports.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { ReferenceMonth } from './enums/reference-month.enum';

@Controller({ path: 'pass-reports', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class PassReportsController {
  constructor(private readonly reportsService: PassReportsService) {}

  @Get('revenue-by-month')
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR, Role.SUPERVISOR)
  revenueByMonth(@Query('year') year?: number) {
    return this.reportsService.revenueByMonth(year ? +year : undefined);
  }

  @Get('revenue-by-category')
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR, Role.SUPERVISOR)
  revenueByCategory(
    @Query('year') year?: number,
    @Query('month') month?: ReferenceMonth,
  ) {
    return this.reportsService.revenueByCategory(
      year ? +year : undefined,
      month,
    );
  }

  @Get('revenue-by-destination')
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR, Role.SUPERVISOR)
  revenueByDestination(
    @Query('year') year?: number,
    @Query('month') month?: ReferenceMonth,
  ) {
    return this.reportsService.revenueByDestination(
      year ? +year : undefined,
      month,
    );
  }

  @Get('revenue-by-operator')
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR, Role.SUPERVISOR)
  revenueByOperator(
    @Query('year') year?: number,
    @Query('month') month?: ReferenceMonth,
  ) {
    return this.reportsService.revenueByOperator(
      year ? +year : undefined,
      month,
    );
  }

  @Get('status-counts')
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR, Role.SUPERVISOR)
  statusCounts() {
    return this.reportsService.passesByStatus();
  }

  @Get('summary')
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR, Role.SUPERVISOR)
  summary(
    @Query('year') year: number,
    @Query('month') month: ReferenceMonth,
  ) {
    const currentYear = year ? +year : new Date().getFullYear();
    const months = Object.values(ReferenceMonth);
    const currentMonth =
      month ?? months[new Date().getMonth()];
    return this.reportsService.summary(currentYear, currentMonth);
  }
}
