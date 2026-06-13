import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @MaxLength(100)
  @IsString()
  name: string;

  @MaxLength(100)
  @IsString()
  @IsOptional()
  username?: string;

  @MinLength(8)
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  role?: string = 'admin';
}
