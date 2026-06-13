import { PartialType } from '@nestjs/mapped-types';
import { CreatePenaltyTicketSaleDto } from './create-penalty-ticket-sale.dto';

export class UpdatePenaltyTicketSaleDto extends PartialType(CreatePenaltyTicketSaleDto) {}
