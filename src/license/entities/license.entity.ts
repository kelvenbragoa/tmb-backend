import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { LicenseActivation } from './license-activation.entity';

export enum LicenseStatus {
  UNUSED = 'unused',
  USED = 'used',
}

@Entity('licenses')
export class License {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column({ type: 'enum', enum: LicenseStatus, default: LicenseStatus.UNUSED })
  status: LicenseStatus;

  /** Duração da licença em dias (365 = anual). */
  @Column({ type: 'int', default: 365 })
  duration_days: number;

  @Column({ type: 'timestamp', nullable: true })
  activated_at: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => LicenseActivation, (activation) => activation.license)
  activations: LicenseActivation[];
}
