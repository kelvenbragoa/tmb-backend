import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';

@Entity('session_activity_logs')
export class SessionActivityLog extends BaseEntityWithAudit {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      session_id: number;

      @Column({ nullable: true })
      user_id: number;

      @Column({ nullable: true })
      activity: string;
}
