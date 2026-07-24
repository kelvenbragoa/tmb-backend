import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PassStatus } from '../enums/pass-status.enum';
import { ReferenceMonth } from '../enums/reference-month.enum';

export class CreatePassDto {
  @IsString()
  @MaxLength(200)
  fullName: string;

  @IsString()
  @MaxLength(50)
  identityNumber: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  destinationId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  tariffId: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  bairro?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  rua?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  quarteirao?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  casaNumero?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  andar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  unidade?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  employerName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  schoolName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  schoolClass?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  schoolNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  schoolGrade?: string;

  @IsOptional()
  @IsBoolean()
  bairroConfirmation?: boolean;

  @IsOptional()
  @IsBoolean()
  employerConfirmation?: boolean;

  @IsOptional()
  @IsBoolean()
  schoolConfirmation?: boolean;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsEnum(PassStatus)
  status?: PassStatus;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  registerPayment?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsEnum(ReferenceMonth)
  referenceMonth?: ReferenceMonth;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  referenceYear?: number;
}
