import { IsNumber, IsOptional, IsString, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketLogDto {
  @IsNumber()
  @Type(() => Number)
  route_ticket_id: number;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customer_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  vehicle_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  driver_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  origin_route_stop_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  destination_route_stop_id?: number;

  @IsOptional()
  @IsString()
  customer_number?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  ticket_sold_at?: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
