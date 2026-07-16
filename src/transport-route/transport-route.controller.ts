import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransportRouteService } from './transport-route.service';
import { CreateTransportRouteDto } from './dto/create-transport-route.dto';
import { UpdateTransportRouteDto } from './dto/update-transport-route.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller({ path: 'routes', version: '1' })

@UseGuards(JwtAuthGuard, RolesGuard)
export class TransportRouteController {
  constructor(private readonly routeService: TransportRouteService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Body() createRouteDto: CreateTransportRouteDto,
    @GetUser() user: User,
  ) {
    return this.routeService.create(createRouteDto, user);
  }

  @Get()
  // @Roles(Role.ADMIN, Role.OPERATOR)
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 200,
    @Query('search') searchQuery?: string,
  ) {
    const options: IPaginationOptions = {
      page,
      limit: limit,
    };
    return this.routeService.findAll(options, searchQuery);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.OPERATOR)
  findOne(@Param('id') id: string) {
    return this.routeService.findOne(+id);
  }

  @Get(':id/tickets')
  @Roles(Role.ADMIN, Role.OPERATOR)
  findRouteTickets(@Param('id') id: string) {
    return this.routeService.findRouteTickets(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateRouteDto: UpdateTransportRouteDto,
    @GetUser() user: User,
  ) {
    return this.routeService.update(+id, updateRouteDto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.routeService.remove(+id, user);
  }

  @Get(':id/vehicles')
  @Roles(Role.ADMIN, Role.OPERATOR)
  getRouteVehicles(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    const options: IPaginationOptions = {
      page,
      limit: limit,
    };
    return this.routeService.getRouteVehicles(+id, options);
  }
}
