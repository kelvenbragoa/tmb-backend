import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { Session } from './entities/session.entity';
import { TicketSale } from '../ticket-sale/entities/ticket-sale.entity';
import { PenaltyTicketSale } from 'src/penalty-ticket-sale/entities/penalty-ticket-sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, TicketSale, PenaltyTicketSale])],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
