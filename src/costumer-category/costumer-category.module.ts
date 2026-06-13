import { Module } from '@nestjs/common';
import { CostumerCategoryService } from './costumer-category.service';
import { CostumerCategoryController } from './costumer-category.controller';
import { CostumerCategory } from './entities/costumer-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CostumerCategory])],
  exports: [CostumerCategoryService],
  controllers: [CostumerCategoryController],
  providers: [CostumerCategoryService],
})
export class CostumerCategoryModule {}
