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
import { TransportRouteStopService } from './transport-route-stop.service';
import { CreateTransportRouteStopDto } from './dto/create-transport-route-stop.dto';
import { UpdateTransportRouteStopDto } from './dto/update-transport-route-stop.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller({ path: 'route-stops', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransportRouteStopController {
  constructor(private readonly stopService: TransportRouteStopService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Body() createStopDto: CreateTransportRouteStopDto,
    @GetUser() user: User,
  ) {
    return this.stopService.create(createStopDto, user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.OPERATOR)
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('search') searchQuery?: string,
  ) {
    const options: IPaginationOptions = {
      page,
      limit: limit,
    };
    return this.stopService.findAll(options, searchQuery);
  }

  @Get('route/:routeId')
  @Roles(Role.ADMIN, Role.OPERATOR)
  findByRoute(
    @Param('routeId') routeId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    const options: IPaginationOptions = {
      page,
      limit: Math.min(limit, 100),
    };
    return this.stopService.findByRoute(+routeId, options);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.OPERATOR)
  findOne(@Param('id') id: string) {
    return this.stopService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateStopDto: UpdateTransportRouteStopDto,
    @GetUser() user: User,
  ) {
    return this.stopService.update(+id, updateStopDto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.stopService.remove(+id);
  }

  @Patch(':id/restore')
  @Roles(Role.ADMIN)
  restore(@Param('id') id: string) {
    return this.stopService.restore(+id);
  }
}
