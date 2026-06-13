import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TicketPrintLogService } from './ticket-print-log.service';
import { CreateTicketPrintLogDto } from './dto/create-ticket-print-log.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller({ path: 'ticket-print-logs', version: '1' })

@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketPrintLogController {
  constructor(private readonly ticketPrintLogService: TicketPrintLogService) {}

  @Post()
  @Roles(Role.ADMIN, Role.OPERATOR, Role.CAIXA, Role.COBRADOR)
  async create(
    @Body() createPrintLogDtos: CreateTicketPrintLogDto[],
    @GetUser() user: User,
  ) {
    return await this.ticketPrintLogService.createPrintLogs(
      createPrintLogDtos,
      user,
    );
  }

  @Get()
  @Roles(Role.ADMIN, Role.GESTOR, Role.SUPERVISOR)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('session_id') sessionId?: string,
    @Query('operator_id') operatorId?: string,
    @Query('sale_type') saleType?: 'regular' | 'penalty',
    @Query('is_reprint') isReprint?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.ticketPrintLogService.findAll(
      { page, limit },
      {
        session_id: sessionId ? parseInt(sessionId) : undefined,
        operator_id: operatorId ? parseInt(operatorId) : undefined,
        sale_type: saleType,
        is_reprint: isReprint === 'true',
        startDate,
        endDate,
      },
    );
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.GESTOR, Role.SUPERVISOR)
  async getStats(@Query('session_id') sessionId?: string) {
    return await this.ticketPrintLogService.getReprintStats(
      sessionId ? parseInt(sessionId) : undefined,
    );
  }
}
