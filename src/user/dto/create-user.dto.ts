import { IsString, MaxLength, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
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


}
