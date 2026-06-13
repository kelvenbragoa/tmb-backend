import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  plate: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  model: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  brand: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    return parseInt(value);
  })
  capacity?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => 
    Array.isArray(value) ? value.map(id => parseInt(id)) : []
  )
  route_ids?: number[];
}