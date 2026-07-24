import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';
import { PaymentType } from '../enums/payment-type.enum';
import { ReferenceMonth } from '../enums/reference-month.enum';
import { Pass } from './pass.entity';
import { User } from '../../user/entities/user.entity';

@Entity('pass_payments')
@Unique('UQ_pass_payment_month_year_type', [
  'passId',
  'referenceMonth',
  'referenceYear',
  'paymentType',
])
@Index('IDX_pass_payment_date', ['paymentDate'])
export class PassPayment extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pass_id' })
  passId: number;

  @ManyToOne(() => Pass, (pass) => pass.payments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'pass_id' })
  pass: Pass;

  @Column({
    name: 'payment_type',
    type: 'enum',
    enum: PaymentType,
  })
  paymentType: PaymentType;

  @Column({
    name: 'reference_month',
    type: 'enum',
    enum: ReferenceMonth,
  })
  referenceMonth: ReferenceMonth;

  @Column({ name: 'reference_year', type: 'int' })
  referenceYear: number;

  @Column({
    name: 'monthly_amount',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  monthlyAmount: number;

  @Column({
    name: 'registration_fee',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  registrationFee: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  discount: number;

  @Column({
    name: 'total_paid',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  totalPaid: number;

  @Column({ name: 'receipt_number', length: 50, unique: true })
  receiptNumber: string;

  @Column({ name: 'payment_date', type: 'timestamptz' })
  paymentDate: Date;

  @Column({ name: 'cashier_id' })
  cashierId: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cashier_id' })
  cashier: User;

  @Column({ type: 'text', nullable: true })
  notes: string | null;
}
