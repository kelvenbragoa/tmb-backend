import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Session } from '../session/entities/session.entity';
import { User } from '../user/entities/user.entity';
import { TransportRoute } from '../transport-route/entities/transport-route.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { TicketType } from '../ticket-type/entities/ticket-type.entity';
import { TicketSale } from '../ticket-sale/entities/ticket-sale.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Session,
      User,
      TransportRoute,
      Vehicle,
      TicketType,
      TicketSale,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}