import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PenaltyTicketSaleService } from './penalty-ticket-sale.service';
import { PenaltyTicketSaleController } from './penalty-ticket-sale.controller';
import { PenaltyTicketSale } from './entities/penalty-ticket-sale.entity';
import { SessionModule } from '../session/session.module';
import { RouteTicketModule } from '../route-ticket/route-ticket.module';
import { CostumerModule } from '../costumer/costumer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PenaltyTicketSale]),
    SessionModule,
    RouteTicketModule,
    CostumerModule,
  ],
  controllers: [PenaltyTicketSaleController],
  providers: [PenaltyTicketSaleService],
  exports: [PenaltyTicketSaleService],
})
export class PenaltyTicketSaleModule {}
