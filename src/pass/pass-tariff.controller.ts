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
import { PassTariffService } from './pass-tariff.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { EntityStatus } from './enums/entity-status.enum';
import { TariffType } from './enums/tariff-type.enum';

@Controller({ path: 'pass-tariffs', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class PassTariffController {
  constructor(private readonly tariffService: PassTariffService) {}

  @Post()
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR)
  create(@Body() dto: CreateTariffDto, @GetUser() user: User) {
    return this.tariffService.create(dto, user);
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
    @Query('categoryId') categoryId?: number,
    @Query('tariffType') tariffType?: TariffType,
    @Query('status') status?: EntityStatus,
    @Query('search') search?: string,
  ) {
    const options: IPaginationOptions = { page, limit };
    return this.tariffService.findAll(
      options,
      categoryId ? +categoryId : undefined,
      tariffType,
      status,
      search,
    );
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
    return this.tariffService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTariffDto,
    @GetUser() user: User,
  ) {
    return this.tariffService.update(+id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.tariffService.remove(+id, user);
  }
}
