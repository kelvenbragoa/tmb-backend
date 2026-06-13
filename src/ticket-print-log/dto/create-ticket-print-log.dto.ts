import { IsNumber, IsOptional, IsString, IsBoolean, IsEnum, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketPrintLogDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ticket_sale_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  penalty_ticket_sale_id?: number;

  @IsEnum(['regular', 'penalty'])
  sale_type: 'regular' | 'penalty';

  @IsNumber()
  @Type(() => Number)
  session_id: number;

  @IsNumber()
  @Type(() => Number)
  operator_id: number;

  @IsNumber()
  @Type(() => Number)
  route_id: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  origin_route_stop_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  destination_route_stop_id?: number;

  @IsNumber()
  @Type(() => Number)
  route_ticket_id: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  vehicle_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  driver_id?: number;

  @IsNumber()
  @Type(() => Number)
  price_at_sale: number;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  quantity: number;

  @IsNumber()
  @Type(() => Number)
  total: number;

  @IsDateString()
  printed_at: string;

  @IsBoolean()
  is_reprint: boolean;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  print_number: number;

  @IsOptional()
  @IsString()
  reprint_reason?: string;

  @IsOptional()
  @IsString()
  mobile_reference?: string;

  @IsOptional()
  @IsString()
  sale_reference?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
