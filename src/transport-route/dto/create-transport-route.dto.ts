import { IsString, IsOptional, IsBoolean, MaxLength, IsObject, IsNumber } from 'class-validator';

export class CreateTransportRouteDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(100)
  origin: string;

  @IsString()
  @MaxLength(100)
  destination: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
