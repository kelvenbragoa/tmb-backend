import {
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum DatePeriod {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_90_DAYS = 'last_90_days',
  LAST_180_DAYS = 'last_180_days',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  THIS_YEAR = 'this_year',
  CUSTOM = 'custom',
}

export class DashboardFiltersDto {
  @IsOptional()
  @IsEnum(DatePeriod)
  period?: DatePeriod;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value.map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    const str = String(value).trim();
    if (str === '') return undefined;
    return str.split(',').map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v));
  })
  route_ids?: number[];

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value.map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    const str = String(value).trim();
    if (str === '') return undefined;
    return str.split(',').map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v));
  })
  vehicle_ids?: number[];

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value.map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    const str = String(value).trim();
    if (str === '') return undefined;
    return str.split(',').map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v));
  })
  operator_ids?: number[];

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value.map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    const str = String(value).trim();
    if (str === '') return undefined;
    return str.split(',').map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v));
  })
  ticket_type_ids?: number[];
}