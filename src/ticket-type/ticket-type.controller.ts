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
import { TicketTypeService } from './ticket-type.service';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller({ path: 'ticket-types', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketTypeController {
  constructor(private readonly ticketTypeService: TicketTypeService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Body() createTicketTypeDto: CreateTicketTypeDto,
    @GetUser() user: User,
  ) {
    return this.ticketTypeService.create(createTicketTypeDto, user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.OPERATOR)
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    const options: IPaginationOptions = {
      page,
      limit: limit,
    };
    return this.ticketTypeService.findAll(options);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.OPERATOR)
  findOne(@Param('id') id: string) {
    return this.ticketTypeService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateTicketTypeDto: UpdateTicketTypeDto,
    @GetUser() user: User,
  ) {
    return this.ticketTypeService.update(+id, updateTicketTypeDto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.ticketTypeService.remove(+id, user);
  }
}
