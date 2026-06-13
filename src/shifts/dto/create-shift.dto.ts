import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateShiftDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  start_time: string; // format HH:MM or HH:MM:SS

  @IsString()
  @IsNotEmpty()
  end_time: string; // format HH:MM or HH:MM:SS

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
