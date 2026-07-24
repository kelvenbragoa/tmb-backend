import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EntityStatus } from '../enums/entity-status.enum';

export class CreateCategoryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  destinationId: number;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;
}
