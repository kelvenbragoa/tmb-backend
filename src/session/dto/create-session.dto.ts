import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSessionDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  user_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  shift_id?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
