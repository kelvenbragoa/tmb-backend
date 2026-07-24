import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';
import { EntityStatus } from '../enums/entity-status.enum';
import { PassCategory } from './pass-category.entity';
import { Pass } from './pass.entity';

@Entity('pass_destinations')
export class Destination extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: EntityStatus,
    default: EntityStatus.ACTIVE,
  })
  status: EntityStatus;

  @OneToMany(() => PassCategory, (category) => category.destination)
  categories: PassCategory[];

  @OneToMany(() => Pass, (pass) => pass.destination)
  passes: Pass[];
}
