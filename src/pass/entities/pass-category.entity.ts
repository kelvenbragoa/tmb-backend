import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';
import { EntityStatus } from '../enums/entity-status.enum';
import { Destination } from './destination.entity';
import { PassTariff } from './pass-tariff.entity';
import { Pass } from './pass.entity';

@Entity('pass_categories')
export class PassCategory extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'destination_id' })
  destinationId: number;

  @ManyToOne(() => Destination, (destination) => destination.categories, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'destination_id' })
  destination: Destination;

  @Column({ length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: EntityStatus,
    default: EntityStatus.ACTIVE,
  })
  status: EntityStatus;

  @OneToMany(() => PassTariff, (tariff) => tariff.category)
  tariffs: PassTariff[];

  @OneToMany(() => Pass, (pass) => pass.category)
  passes: Pass[];
}
