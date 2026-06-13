import { IsString, MaxLength } from 'class-validator';

export class CreateCostumerCategoryDto {
  @MaxLength(100)
  @IsString()
  name: string;
}
