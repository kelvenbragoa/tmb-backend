import { IsString, IsOptional, IsBoolean, MaxLength, IsNumber } from 'class-validator';

export class CreateTransportRouteStopDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  order: number;

  @IsNumber()
  routeId: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
