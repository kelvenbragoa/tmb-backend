import { Module } from '@nestjs/common';
import { CostumerService } from './costumer.service';
import { CostumerController } from './costumer.controller';
import { Costumer } from './entities/costumer.entity';
import { TicketType } from '../ticket-type/entities/ticket-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Costumer, TicketType])],
  exports: [CostumerService],
  controllers: [CostumerController],
  providers: [CostumerService],
})
export class CostumerModule {}
