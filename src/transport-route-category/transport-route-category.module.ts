import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportRouteCategoryService } from './transport-route-category.service';
import { TransportRouteCategoryController } from './transport-route-category.controller';
import { TransportRouteCategory } from './entities/transport-route-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransportRouteCategory])],
  controllers: [TransportRouteCategoryController],
  providers: [TransportRouteCategoryService],
  exports: [TransportRouteCategoryService],
})
export class TransportRouteCategoryModule {}
