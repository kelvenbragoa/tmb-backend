import { PartialType } from '@nestjs/mapped-types';
import { CreateTransportRouteCategoryDto } from './create-transport-route-category.dto';

export class UpdateTransportRouteCategoryDto extends PartialType(CreateTransportRouteCategoryDto) {}
