import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateLicenseDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}
