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
import { RouteTicketService } from './route-ticket.service';
import { CreateRouteTicketDto } from './dto/create-route-ticket.dto';
import { UpdateRouteTicketDto } from './dto/update-route-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller({ path: 'route-tickets', version: '1' })

@UseGuards(JwtAuthGuard, RolesGuard)
export class RouteTicketController {
  constructor(private readonly routeTicketService: RouteTicketService) {}

  @Post()
  // @Roles(Role.ADMIN)
  create(
    @Body() createRouteTicketDto: CreateRouteTicketDto,
    @GetUser() user: User,
  ) {
    return this.routeTicketService.create(createRouteTicketDto, user);
  }

  @Get()
  // @Roles(Role.ADMIN, Role.OPERATOR)
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('search') searchQuery?: string,
  ) {
    const options: IPaginationOptions = {
      page,
      limit: limit,
    };
    return this.routeTicketService.findAll(options, searchQuery);
  }

  @Get(':id')
  // @Roles(Role.ADMIN, Role.OPERATOR)
  findOne(@Param('id') id: string) {
    return this.routeTicketService.findOne(+id);
  }

  @Patch(':id')
  // @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateRouteTicketDto: UpdateRouteTicketDto,
    @GetUser() user: User,
  ) {
    return this.routeTicketService.update(+id, updateRouteTicketDto, user);
  }

  @Delete(':id')
  // @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.routeTicketService.remove(+id, user);
  }
}
