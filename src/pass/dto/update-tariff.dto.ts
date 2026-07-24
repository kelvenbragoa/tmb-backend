import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateTariffDto } from './create-tariff.dto';

export class UpdateTariffDto extends PartialType(
  OmitType(CreateTariffDto, ['categoryId'] as const),
) {}
