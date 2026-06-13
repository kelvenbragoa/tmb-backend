import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketPrintLogController } from './ticket-print-log.controller';
import { TicketPrintLogService } from './ticket-print-log.service';
import { TicketPrintLog } from './entities/ticket-print-log.entity';
import { TicketSale } from '../ticket-sale/entities/ticket-sale.entity';
import { PenaltyTicketSale } from '../penalty-ticket-sale/entities/penalty-ticket-sale.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketPrintLog, TicketSale, PenaltyTicketSale]),
  ],
  controllers: [TicketPrintLogController],
  providers: [TicketPrintLogService],
  exports: [TicketPrintLogService],
})
export class TicketPrintLogModule {}
