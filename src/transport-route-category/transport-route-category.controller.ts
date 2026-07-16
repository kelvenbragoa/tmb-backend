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
import { TransportRouteCategoryService } from './transport-route-category.service';
import { CreateTransportRouteCategoryDto } from './dto/create-transport-route-category.dto';
import { UpdateTransportRouteCategoryDto } from './dto/update-transport-route-category.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller({ path: 'route-categories', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransportRouteCategoryController {
  constructor(private readonly categoryService: TransportRouteCategoryService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Body() createCategoryDto: CreateTransportRouteCategoryDto,
    @GetUser() user: User,
  ) {
    return this.categoryService.create(createCategoryDto, user);
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
    return this.categoryService.findAll(options, searchQuery);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.OPERATOR)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateTransportRouteCategoryDto,
    @GetUser() user: User,
  ) {
    return this.categoryService.update(+id, updateCategoryDto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }

  @Patch(':id/restore')
  @Roles(Role.ADMIN)
  restore(@Param('id') id: string) {
    return this.categoryService.restore(+id);
  }
}
