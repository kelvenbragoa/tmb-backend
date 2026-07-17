import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Session } from '../session/entities/session.entity';
import { TicketSale } from '../ticket-sale/entities/ticket-sale.entity';
import { PenaltyTicketSale } from '../penalty-ticket-sale/entities/penalty-ticket-sale.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, TicketSale, PenaltyTicketSale]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
