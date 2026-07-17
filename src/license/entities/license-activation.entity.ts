import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { License } from './license.entity';

@Entity('license_activations')
export class LicenseActivation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  license_id: number;

  @ManyToOne(() => License, (license) => license.activations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'license_id' })
  license: License;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp' })
  end_date: Date;

  @Column({ default: true })
  is_active: boolean;

  /** Id do utilizador (admin) que ativou a licença. */
  @Column({ nullable: true })
  activated_by: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
