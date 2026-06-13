import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TicketSaleService } from './ticket-sale.service';
import { CreateTicketSaleDto } from './dto/create-ticket-sale.dto';
import { CreateTicketLogDto } from './dto/create-ticket-log.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller({ path: 'ticket-sales', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketSaleController {
  constructor(private readonly ticketSaleService: TicketSaleService) {}

  @Post('sessions/:sessionId/sales')
  // @Roles(Role.OPERATOR, Role.ADMIN)
  createSale(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() createTicketSaleDtos: CreateTicketSaleDto[],
    @GetUser() user: User,
  ) {
    return this.ticketSaleService.createSale(
      sessionId,
      createTicketSaleDtos,
      user,
    );
  }

  @Post('sessions/:sessionId/log')
  // @Roles(Role.OPERATOR, Role.ADMIN)
  createLog(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() createTicketLogDtos: CreateTicketLogDto[],
    @GetUser() user: User,
  ) {
    return this.ticketSaleService.createLog(
      sessionId,
      createTicketLogDtos,
      user,
    );
  }

  @Get('sessions/:sessionId/sales')
  // @Roles(Role.OPERATOR, Role.ADMIN)
  findSessionSales(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    const options: IPaginationOptions = {
      page,
      limit: limit,
    };
    return this.ticketSaleService.findSessionSales(sessionId, options);
  }

  @Get('sessions/:sessionId/report')
  // @Roles(Role.OPERATOR, Role.ADMIN)
  getSalesReport(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.ticketSaleService.getSalesReport(sessionId);
  }

  @Get('/')
  // @Roles(Role.ADMIN)
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('operatorId') operatorId?: number,
    @Query('route_id') routeId?: number,
    @Query('vehicle_id') vehicleId?: number,
    @Query('driver_id') driverId?: number,
    @Query('origin_route_stop_id') originRouteStopId?: number,
    @Query('destination_route_stop_id') destinationRouteStopId?: number,
  ) {
    const options: IPaginationOptions = {
      page,
      limit: limit,
    };
    
    const filters = {
      route_id: routeId,
      vehicle_id: vehicleId,
      driver_id: driverId,
      origin_route_stop_id: originRouteStopId,
      destination_route_stop_id: destinationRouteStopId,
    };

    return this.ticketSaleService.findAll(options, operatorId, filters);
  }

  @Get(':id')
  // @Roles(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketSaleService.findOne(id);
  }
}