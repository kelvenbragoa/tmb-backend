import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateLicenseDto {
  /** Quantas chaves gerar. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  quantity?: number = 1;

  /** Duração de cada licença em dias (365 = anual). */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  duration_days?: number = 365;
}
