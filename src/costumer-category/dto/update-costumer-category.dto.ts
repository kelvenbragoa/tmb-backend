import { PartialType } from '@nestjs/mapped-types';
import { CreateCostumerCategoryDto } from './create-costumer-category.dto';

export class UpdateCostumerCategoryDto extends PartialType(CreateCostumerCategoryDto) {}
