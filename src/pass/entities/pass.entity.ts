import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';
import { PassStatus } from '../enums/pass-status.enum';
import { Destination } from './destination.entity';
import { PassCategory } from './pass-category.entity';
import { PassTariff } from './pass-tariff.entity';
import { PassPayment } from './pass-payment.entity';

@Entity('passes')
@Unique('UQ_pass_card_number_year', ['cardNumber', 'cardYear'])
@Index('IDX_pass_full_name', ['fullName'])
@Index('IDX_pass_identity_number', ['identityNumber'])
export class Pass extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'card_number', length: 20 })
  cardNumber: string;

  @Column({ name: 'card_year', type: 'int' })
  cardYear: number;

  @Column({ name: 'full_name', length: 200 })
  fullName: string;

  @Column({ name: 'identity_number', length: 50 })
  identityNumber: string;

  @Column({ name: 'destination_id' })
  destinationId: number;

  @ManyToOne(() => Destination, (destination) => destination.passes, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'destination_id' })
  destination: Destination;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => PassCategory, (category) => category.passes, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: PassCategory;

  @Column({ name: 'tariff_id' })
  tariffId: number;

  @ManyToOne(() => PassTariff, (tariff) => tariff.passes, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'tariff_id' })
  tariff: PassTariff;

  @Column({ type: 'varchar', length: 120, nullable: true })
  bairro: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  rua: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  quarteirao: string | null;

  @Column({ name: 'casa_numero', type: 'varchar', length: 50, nullable: true })
  casaNumero: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  andar: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unidade: string | null;

  @Column({ name: 'employer_name', type: 'varchar', length: 200, nullable: true })
  employerName: string | null;

  @Column({ name: 'school_name', type: 'varchar', length: 200, nullable: true })
  schoolName: string | null;

  @Column({ name: 'school_class', type: 'varchar', length: 100, nullable: true })
  schoolClass: string | null;

  @Column({ name: 'school_number', type: 'varchar', length: 50, nullable: true })
  schoolNumber: string | null;

  @Column({ name: 'school_grade', type: 'varchar', length: 50, nullable: true })
  schoolGrade: string | null;

  @Column({ name: 'bairro_confirmation', type: 'boolean', default: false })
  bairroConfirmation: boolean;

  @Column({ name: 'employer_confirmation', type: 'boolean', default: false })
  employerConfirmation: boolean;

  @Column({ name: 'school_confirmation', type: 'boolean', default: false })
  schoolConfirmation: boolean;

  @Column({ type: 'text', nullable: true })
  photo: string | null;

  @Column({
    type: 'enum',
    enum: PassStatus,
    default: PassStatus.ACTIVE,
  })
  status: PassStatus;

  @Column({ name: 'issue_date', type: 'date' })
  issueDate: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @OneToMany(() => PassPayment, (payment) => payment.pass)
  payments: PassPayment[];
}
