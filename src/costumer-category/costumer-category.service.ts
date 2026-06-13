import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCostumerCategoryDto } from './dto/create-costumer-category.dto';
import { UpdateCostumerCategoryDto } from './dto/update-costumer-category.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { CostumerCategory } from './entities/costumer-category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CostumerCategoryService {
  constructor(
    @InjectRepository(CostumerCategory)
    private costumerCategoryRepository: Repository<CostumerCategory>,
  ) {}
  async create(createCostumerCategoryDto: CreateCostumerCategoryDto) {
    const costumerCategory = this.costumerCategoryRepository.create(
      createCostumerCategoryDto,
    );
    await this.costumerCategoryRepository.insert(costumerCategory);
    return costumerCategory;
  }

  async findAll(options: IPaginationOptions) {
    return paginate(this.costumerCategoryRepository, options, {
      // select: ['id', 'name', 'email'],
    });
  }

  async findOne(id: number) {
    const result = await this.costumerCategoryRepository.findOne({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(`CostumerCategory with id ${id} not found`);
    }
    return result;
  }

  update(id: number, updateCostumerCategoryDto: UpdateCostumerCategoryDto) {
    return `This action updates a #${id} costumerCategory`;
  }

  async remove(id: number) {
    const result = await this.costumerCategoryRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Costumer with id ${id} not found`);
    }
    return { message: 'Costumer deleted successfully' };
  }
}
