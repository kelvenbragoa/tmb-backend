import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PenaltyTicketSaleService } from './penalty-ticket-sale.service';
import { CreatePenaltyTicketSaleDto } from './dto/create-penalty-ticket-sale.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller({ path: 'penalty-ticket-sales', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class PenaltyTicketSaleController {
  constructor(
    private readonly penaltyTicketSaleService: PenaltyTicketSaleService,
  ) {}

  @Post('sessions/:sessionId/sales')
  // @Roles(Role.OPERATOR, Role.ADMIN)
  createPenaltySale(
    @Param('sessionId') sessionId: string,
    @Body() createPenaltyTicketSaleDtos: CreatePenaltyTicketSaleDto[],
    @GetUser() user: User,
  ) {
    return this.penaltyTicketSaleService.createPenaltySale(
      +sessionId,
      createPenaltyTicketSaleDtos,
      user,
    );
  }

  @Get('session/:sessionId')
  // @Roles(Role.OPERATOR, Role.ADMIN)
  findSessionPenaltySales(
    @Param('sessionId') sessionId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    const options: IPaginationOptions = {
      page,
      limit: Math.min(limit, 100),
    };
    return this.penaltyTicketSaleService.findSessionPenaltySales(
      +sessionId,
      options,
    );
  }

  @Get('session/:sessionId/report')
  // @Roles(Role.OPERATOR, Role.ADMIN)
  getPenaltySalesReport(@Param('sessionId') sessionId: string) {
    return this.penaltyTicketSaleService.getPenaltySalesReport(+sessionId);
  }

  @Get()
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
      limit: Math.min(limit, 100),
    };
    
    const filters = {
      route_id: routeId,
      vehicle_id: vehicleId,
      driver_id: driverId,
      origin_route_stop_id: originRouteStopId,
      destination_route_stop_id: destinationRouteStopId,
    };
    
    return this.penaltyTicketSaleService.findAll(options, operatorId, filters);
  }

  @Get(':id')
  // @Roles(Role.OPERATOR, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.penaltyTicketSaleService.findOne(+id);
  }
}
