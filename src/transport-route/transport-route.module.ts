import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportRouteService } from './transport-route.service';
import { TransportRouteController } from './transport-route.controller';
import { TransportRoute } from './entities/transport-route.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransportRoute])],
  controllers: [TransportRouteController],
  providers: [TransportRouteService],
  exports: [TransportRouteService],
})
export class TransportRouteModule {}
