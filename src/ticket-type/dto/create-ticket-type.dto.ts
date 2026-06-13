import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateTicketTypeDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @MaxLength(20)
  code: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
