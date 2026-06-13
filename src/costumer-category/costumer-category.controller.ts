import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CostumerCategoryService } from './costumer-category.service';
import { CreateCostumerCategoryDto } from './dto/create-costumer-category.dto';
import { UpdateCostumerCategoryDto } from './dto/update-costumer-category.dto';
import { SkipAuth } from 'src/auth/jwt/skip-auth.decorator';

@SkipAuth()
@Controller({ path: 'costumer-category', version: '1' })
export class CostumerCategoryController {
  constructor(
    private readonly costumerCategoryService: CostumerCategoryService,
  ) {}

  @Post()
  create(@Body() createCostumerCategoryDto: CreateCostumerCategoryDto) {
    return this.costumerCategoryService.create(createCostumerCategoryDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 50,
  ) {
    return this.costumerCategoryService.findAll({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.costumerCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCostumerCategoryDto: UpdateCostumerCategoryDto,
  ) {
    return this.costumerCategoryService.update(+id, updateCostumerCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.costumerCategoryService.remove(+id);
  }
}
