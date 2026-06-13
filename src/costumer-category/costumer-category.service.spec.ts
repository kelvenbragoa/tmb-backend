import { Test, TestingModule } from '@nestjs/testing';
import { CostumerCategoryService } from './costumer-category.service';

describe('CostumerCategoryService', () => {
  let service: CostumerCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CostumerCategoryService],
    }).compile();

    service = module.get<CostumerCategoryService>(CostumerCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
