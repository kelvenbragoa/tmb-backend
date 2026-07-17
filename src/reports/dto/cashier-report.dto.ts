import { IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CashierReportDto {
  @IsDateString()
  date: string;

  @Type(() => Number)
  @IsNumber()
  operatorId: number;
}
