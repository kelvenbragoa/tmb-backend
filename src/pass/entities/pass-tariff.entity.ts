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
import { TariffType } from '../enums/tariff-type.enum';
import { PassCategory } from './pass-category.entity';
import { Pass } from './pass.entity';

@Entity('pass_tariffs')
export class PassTariff extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => PassCategory, (category) => category.tariffs, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: PassCategory;

  @Column({ length: 150 })
  name: string;

  @Column({
    type: 'enum',
    enum: TariffType,
    default: TariffType.NORMAL,
  })
  tariffType: TariffType;

  @Column({
    name: 'monthly_amount',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  monthlyAmount: number;

  @Column({
    name: 'registration_fee',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  registrationFee: number;

  @Column({
    type: 'enum',
    enum: EntityStatus,
    default: EntityStatus.ACTIVE,
  })
  status: EntityStatus;

  @Column({ name: 'effective_from', type: 'date' })
  effectiveFrom: string;

  @Column({ name: 'effective_to', type: 'date', nullable: true })
  effectiveTo: string | null;

  @OneToMany(() => Pass, (pass) => pass.tariff)
  passes: Pass[];
}
