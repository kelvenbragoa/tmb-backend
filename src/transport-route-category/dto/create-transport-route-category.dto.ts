import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateTransportRouteCategoryDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
