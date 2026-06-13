import { PartialType } from '@nestjs/mapped-types';
import { CreateRouteTicketDto } from './create-route-ticket.dto';

export class UpdateRouteTicketDto extends PartialType(CreateRouteTicketDto) {}
