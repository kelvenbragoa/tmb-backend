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
import { DestinationService } from './destination.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { EntityStatus } from './enums/entity-status.enum';

@Controller({ path: 'pass-destinations', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class DestinationController {
  constructor(private readonly destinationService: DestinationService) {}

  @Post()
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR)
  create(
    @Body() dto: CreateDestinationDto,
    @GetUser() user: User,
  ) {
    return this.destinationService.create(dto, user);
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
    @Query('search') search?: string,
    @Query('status') status?: EntityStatus,
  ) {
    const options: IPaginationOptions = { page, limit };
    return this.destinationService.findAll(options, search, status);
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
    return this.destinationService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDestinationDto,
    @GetUser() user: User,
  ) {
    return this.destinationService.update(+id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.destinationService.remove(+id, user);
  }
}
