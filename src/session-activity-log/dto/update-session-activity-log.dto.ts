import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionActivityLogDto } from './create-session-activity-log.dto';

export class UpdateSessionActivityLogDto extends PartialType(CreateSessionActivityLogDto) {}
