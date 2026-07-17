import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSessionActivityLogDto {
  @IsNumber()
  @IsNotEmpty()
  session_id: number;

  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsOptional()
  @IsString()
  activity?: string;
}
