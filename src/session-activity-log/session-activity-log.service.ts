import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSessionActivityLogDto } from './dto/create-session-activity-log.dto';
import { UpdateSessionActivityLogDto } from './dto/update-session-activity-log.dto';
import { SessionActivityLog } from './entities/session-activity-log.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class SessionActivityLogService {
  constructor(
    @InjectRepository(SessionActivityLog)
    private readonly activityLogRepository: Repository<SessionActivityLog>,
  ) {}

  async create(
    createSessionActivityLogDto: CreateSessionActivityLogDto,
    user?: User,
  ): Promise<SessionActivityLog> {
    const log = this.activityLogRepository.create({
      ...createSessionActivityLogDto,
      createdBy: user,
      updatedBy: user,
    });

    return this.activityLogRepository.save(log);
  }

  async findAll(): Promise<SessionActivityLog[]> {
    return this.activityLogRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findBySession(sessionId: number): Promise<SessionActivityLog[]> {
    return this.activityLogRepository.find({
      where: { session_id: sessionId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SessionActivityLog> {
    const log = await this.activityLogRepository.findOne({ where: { id } });
    if (!log) {
      throw new NotFoundException(`Session activity log #${id} not found`);
    }
    return log;
  }

  async update(
    id: number,
    updateSessionActivityLogDto: UpdateSessionActivityLogDto,
  ): Promise<SessionActivityLog> {
    const log = await this.findOne(id);
    Object.assign(log, updateSessionActivityLogDto);
    return this.activityLogRepository.save(log);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.activityLogRepository.softDelete(id);
  }
}
