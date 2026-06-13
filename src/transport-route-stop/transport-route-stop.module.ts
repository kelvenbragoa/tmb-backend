import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportRouteStopService } from './transport-route-stop.service';
import { TransportRouteStopController } from './transport-route-stop.controller';
import { TransportRouteStop } from './entities/transport-route-stop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransportRouteStop])],
  controllers: [TransportRouteStopController],
  providers: [TransportRouteStopService],
  exports: [TransportRouteStopService],
})
export class TransportRouteStopModule {}
