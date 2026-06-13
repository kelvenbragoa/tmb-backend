import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteTicketService } from './route-ticket.service';
import { RouteTicketController } from './route-ticket.controller';
import { RouteTicket } from './entities/route-ticket.entity';
import { TransportRouteModule } from '../transport-route/transport-route.module';
import { TicketTypeModule } from '../ticket-type/ticket-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RouteTicket]),
    forwardRef(() => TransportRouteModule),
    forwardRef(() => TicketTypeModule),
  ],
  controllers: [RouteTicketController],
  providers: [RouteTicketService],
  exports: [RouteTicketService],
})
export class RouteTicketModule {}
