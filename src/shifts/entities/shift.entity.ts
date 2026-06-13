import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';

@Entity('shifts')
export class Shift extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @Column({ default: true })
  is_active: boolean;
}
