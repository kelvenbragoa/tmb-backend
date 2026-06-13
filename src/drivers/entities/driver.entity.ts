import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';

@Entity('drivers')
export class Driver extends BaseEntityWithAudit {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      name: string;

      @Column({ nullable: true })
      mobile: string;

      @Column({ nullable: true })
      document: string;

      @Column({ type: 'date', nullable: true })
      document_expiry_date: Date;

      @Column({ default: true })
      is_active: boolean;
}
