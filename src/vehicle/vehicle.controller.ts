import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller({ path: 'vehicles', version: '1' })
@UseGuards(JwtAuthGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(
    @Body() createVehicleDto: CreateVehicleDto,
    @GetUser() user: User,
  ) {
    return this.vehicleService.create(createVehicleDto, user.id);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return this.vehicleService.findAll({
      page,
      limit,
    });
  }

  @Get('active')
  findActive(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return this.vehicleService.findActive({
      page,
      limit,
    });
  }

  @Get('route/:routeId')
  findByRoute(
    @Param('routeId', ParseIntPipe) routeId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return this.vehicleService.findByRoute(routeId, {
      page,
      limit,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @GetUser() user: User,
  ) {
    return this.vehicleService.update(id, updateVehicleDto, user.id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.remove(id);
  }

  @Post(':id/routes/:routeId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  addRoute(
    @Param('id', ParseIntPipe) id: number,
    @Param('routeId', ParseIntPipe) routeId: number,
  ) {
    return this.vehicleService.addRoute(id, routeId);
  }

  @Delete(':id/routes/:routeId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  removeRoute(
    @Param('id', ParseIntPipe) id: number,
    @Param('routeId', ParseIntPipe) routeId: number,
  ) {
    return this.vehicleService.removeRoute(id, routeId);
  }
}