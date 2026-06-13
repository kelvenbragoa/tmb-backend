import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CostumerService } from './costumer.service';
import { CreateCostumerDto } from './dto/create-costumer.dto';
import { UpdateCostumerDto } from './dto/update-costumer.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'costumers', version: '1' })
export class CostumerController {
  constructor(private readonly costumerService: CostumerService) {}

  @Post()
  create(@Body() createCostumerDto: CreateCostumerDto, @Req() req: Request) {
    const user = req.user as User;
    return this.costumerService.create(createCostumerDto, user);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 50,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.costumerService.findAll({ page, limit }, user);
  }

  @Get('by-number/:customerNumber')
  findByCustomerNumber(@Param('customerNumber') customerNumber: string) {
    return this.costumerService.findByCustomerNumber(customerNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.costumerService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCostumerDto: UpdateCostumerDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.costumerService.update(+id, updateCostumerDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.costumerService.remove(+id, user);
  }
}
