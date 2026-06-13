import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketSaleService } from './ticket-sale.service';
import { TicketSaleController } from './ticket-sale.controller';
import { TicketSale } from './entities/ticket-sale.entity';
import { TicketLog } from './entities/ticket-log.entity';
import { SessionModule } from '../session/session.module';
import { RouteTicketModule } from '../route-ticket/route-ticket.module';
import { CostumerModule } from '../costumer/costumer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketSale, TicketLog]),
    forwardRef(() => SessionModule),
    forwardRef(() => RouteTicketModule),
    CostumerModule,
  ],
  controllers: [TicketSaleController],
  providers: [TicketSaleService],
  exports: [TicketSaleService],
})
export class TicketSaleModule {}
