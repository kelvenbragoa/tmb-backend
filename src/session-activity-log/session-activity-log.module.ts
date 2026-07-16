import { Module } from '@nestjs/common';
import { SessionActivityLogService } from './session-activity-log.service';
import { SessionActivityLogController } from './session-activity-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionActivityLog } from './entities/session-activity-log.entity';
import { Session } from 'src/session/entities/session.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SessionActivityLog,Session,User])],
  controllers: [SessionActivityLogController],
  providers: [SessionActivityLogService],
  exports: [SessionActivityLogService],
})
export class SessionActivityLogModule {}
