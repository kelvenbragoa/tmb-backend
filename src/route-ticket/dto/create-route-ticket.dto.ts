import { IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRouteTicketDto {
  @IsNumber()
  @Type(() => Number)
  route_id: number;

  @IsNumber()
  @Type(() => Number)
  ticket_type_id: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  penalty_price?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
