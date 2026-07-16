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
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { CloseSessionDto } from './dto/close-session.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller({ path: 'sessions', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

//   @Post()
  // @Roles(Role.OPERATOR, Role.ADMIN)
//   create(@Body() createSessionDto: CreateSessionDto, @GetUser() user: User) {
//     return this.sessionService.create(createSessionDto, user);
//   }

  @Post()
  // @Roles(Role.OPERATOR, Role.ADMIN)
  create(@Body() createSessionDto: CreateSessionDto, @GetUser() user: User) {
    return this.sessionService.create(createSessionDto, user);
  }

  @Get()
  // @Roles(Role.ADMIN)
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('operator_id') operatorId?: number,
    @Query('status') status?: 'OPEN' | 'CLOSED' | 'open' | 'closed',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const options: IPaginationOptions = {
      page,
      limit: limit,
    };
    
    const filters = {
      status: status ? status.toUpperCase() as 'OPEN' | 'CLOSED' : undefined,
      operator_id: operatorId,
      startDate,
      endDate,
    };
    
    return this.sessionService.findAll(options, operatorId, filters);
  }

  @Get('reports')
  findReports(
    @Query('date') date: string,
    @Query('operatorId') operatorId: number,
  ) {
    return this.sessionService.findReports(date, operatorId);
  }

  @Get('current')
  // @Roles(Role.OPERATOR, Role.ADMIN)
  findCurrentSession(@GetUser() user: User) {
    return this.sessionService.findCurrentSession(user.id);
  }

  @Get(':id')
  // @Roles(Role.OPERATOR, Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sessionService.findOne(id);
  }

  @Post(':id/close')
  // @Roles(Role.OPERATOR, Role.ADMIN)
  closeSession(
    @Param('id', ParseIntPipe) id: number,
    @Body() closeSessionDto: CloseSessionDto,
    @GetUser() user: User,
  ) {
    return this.sessionService.closeSession(id, closeSessionDto, user);
  }

  @Post(':id/reopen')
  reopenSession(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.sessionService.reopenSession(id, user);
  }


}
