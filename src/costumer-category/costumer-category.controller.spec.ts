import { Test, TestingModule } from '@nestjs/testing';
import { CostumerCategoryController } from './costumer-category.controller';
import { CostumerCategoryService } from './costumer-category.service';

describe('CostumerCategoryController', () => {
  let controller: CostumerCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CostumerCategoryController],
      providers: [CostumerCategoryService],
    }).compile();

    controller = module.get<CostumerCategoryController>(CostumerCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
