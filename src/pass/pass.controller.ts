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
import { PassService } from './pass.service';
import { CreatePassDto } from './dto/create-pass.dto';
import { UpdatePassDto } from './dto/update-pass.dto';
import { RenewPassDto } from './dto/renew-pass.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FilterPassDto } from './dto/filter-pass.dto';
import { FilterPaymentDto } from './dto/filter-payment.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { PassStatus } from './enums/pass-status.enum';

@Controller({ path: 'passes', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class PassController {
  constructor(private readonly passService: PassService) {}

  @Post()
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR, Role.CAIXA)
  create(@Body() dto: CreatePassDto, @GetUser() user: User) {
    return this.passService.create(dto, user);
  }

  @Get()
  @Roles(
    Role.ADMIN,
    Role.GESTOR,
    Role.COORDENADOR,
    Role.CAIXA,
    Role.OPERATOR,
    Role.SUPERVISOR,
  )
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query() filters: FilterPassDto,
  ) {
    const options: IPaginationOptions = { page, limit };
    return this.passService.findAll(options, filters);
  }

  @Get('payments')
  @Roles(
    Role.ADMIN,
    Role.GESTOR,
    Role.COORDENADOR,
    Role.CAIXA,
    Role.OPERATOR,
    Role.SUPERVISOR,
  )
  findPayments(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query() filters: FilterPaymentDto,
  ) {
    const options: IPaginationOptions = { page, limit };
    return this.passService.findPayments(options, filters);
  }

  @Get('payments/:id')
  @Roles(
    Role.ADMIN,
    Role.GESTOR,
    Role.COORDENADOR,
    Role.CAIXA,
    Role.OPERATOR,
    Role.SUPERVISOR,
  )
  findPaymentOne(@Param('id') id: string) {
    return this.passService.findPaymentOne(+id);
  }

  @Post('payments')
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR, Role.CAIXA)
  createPayment(@Body() dto: CreatePaymentDto, @GetUser() user: User) {
    return this.passService.createPayment(dto, user);
  }

  @Post('renew')
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR, Role.CAIXA)
  renew(@Body() dto: RenewPassDto, @GetUser() user: User) {
    return this.passService.renew(dto, user);
  }

  @Get(':id')
  @Roles(
    Role.ADMIN,
    Role.GESTOR,
    Role.COORDENADOR,
    Role.CAIXA,
    Role.OPERATOR,
    Role.SUPERVISOR,
  )
  findOne(@Param('id') id: string) {
    return this.passService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR, Role.CAIXA)
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePassDto,
    @GetUser() user: User,
  ) {
    return this.passService.update(+id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.passService.remove(+id, user);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: PassStatus,
    @GetUser() user: User,
  ) {
    return this.passService.update(+id, { status }, user);
  }
}
