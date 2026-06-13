import { PartialType } from '@nestjs/mapped-types';
import { CreateTransportRouteStopDto } from './create-transport-route-stop.dto';

export class UpdateTransportRouteStopDto extends PartialType(CreateTransportRouteStopDto) {}
