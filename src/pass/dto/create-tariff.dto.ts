import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EntityStatus } from '../enums/entity-status.enum';
import { TariffType } from '../enums/tariff-type.enum';

export class CreateTariffDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId: number;

  @IsString()
  @MaxLength(150)
  name: string;

  @IsEnum(TariffType)
  tariffType: TariffType;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  monthlyAmount: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  registrationFee: number;

  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;

  @IsDateString()
  effectiveFrom: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string;
}
