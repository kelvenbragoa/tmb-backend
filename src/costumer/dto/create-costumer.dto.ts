import { IsEmail, IsString, MaxLength, MinLength, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCostumerDto {
  @MaxLength(100)
  @IsString()
  name: string;

  @MaxLength(100)
  @IsEmail()
  email: string;

  @MinLength(8)
  @IsString()
  mobile: string;

  @IsOptional()
  @MaxLength(100)
  @IsString()
  nuit?: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  ticket_type_id: number;
}
