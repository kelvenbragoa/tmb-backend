import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentType } from '../enums/payment-type.enum';
import { ReferenceMonth } from '../enums/reference-month.enum';

export class CreatePaymentDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  passId: number;

  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsEnum(ReferenceMonth)
  referenceMonth: ReferenceMonth;

  @Type(() => Number)
  @IsInt()
  @Min(2000)
  referenceYear: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
