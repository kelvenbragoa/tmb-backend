import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class CloseSessionDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  actual_amount_delivered?: number;
}
