import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('pass_card_sequences')
@Unique('UQ_pass_card_sequence_year', ['year'])
export class PassCardSequence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ name: 'last_number', type: 'int', default: 0 })
  lastNumber: number;
}
