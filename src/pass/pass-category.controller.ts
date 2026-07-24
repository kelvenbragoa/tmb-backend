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
import { PassCategoryService } from './pass-category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { EntityStatus } from './enums/entity-status.enum';

@Controller({ path: 'pass-categories', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class PassCategoryController {
  constructor(private readonly categoryService: PassCategoryService) {}

  @Post()
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR)
  create(@Body() dto: CreateCategoryDto, @GetUser() user: User) {
    return this.categoryService.create(dto, user);
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
    @Query('destinationId') destinationId?: number,
    @Query('search') search?: string,
    @Query('status') status?: EntityStatus,
  ) {
    const options: IPaginationOptions = { page, limit };
    return this.categoryService.findAll(
      options,
      destinationId ? +destinationId : undefined,
      search,
      status,
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
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.GESTOR, Role.COORDENADOR)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @GetUser() user: User,
  ) {
    return this.categoryService.update(+id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.categoryService.remove(+id, user);
  }
}
