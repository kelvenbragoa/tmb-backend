import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('pass_receipt_sequences')
@Unique('UQ_pass_receipt_sequence_prefix', ['prefix'])
export class PassReceiptSequence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  prefix: string;

  @Column({ name: 'last_number', type: 'int', default: 0 })
  lastNumber: number;
}
