import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePassDto } from './create-pass.dto';

export class UpdatePassDto extends PartialType(
  OmitType(CreatePassDto, [
    'registerPayment',
    'discount',
    'referenceMonth',
    'referenceYear',
  ] as const),
) {}
