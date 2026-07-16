import { Injectable } from '@nestjs/common';
import { CreateSessionActivityLogDto } from './dto/create-session-activity-log.dto';
import { UpdateSessionActivityLogDto } from './dto/update-session-activity-log.dto';

@Injectable()
export class SessionActivityLogService {
  create(createSessionActivityLogDto: CreateSessionActivityLogDto) {
    return 'This action adds a new sessionActivityLog';
  }

  findAll() {
    return `This action returns all sessionActivityLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sessionActivityLog`;
  }

  update(id: number, updateSessionActivityLogDto: UpdateSessionActivityLogDto) {
    return `This action updates a #${id} sessionActivityLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} sessionActivityLog`;
  }
}
