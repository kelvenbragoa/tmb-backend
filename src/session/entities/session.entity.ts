import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';
import { User } from '../../user/entities/user.entity';
import { SessionStatus } from './session-status.enum';
import { TicketSale } from '../../ticket-sale/entities/ticket-sale.entity';
import { TicketLog } from '../../ticket-sale/entities/ticket-log.entity';
import { PenaltyTicketSale } from '../../penalty-ticket-sale/entities/penalty-ticket-sale.entity';
import { Shift } from '../../shifts/entities/shift.entity';

@Entity('sessions')
export class Session extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  operator_id: number;

  @Column({ nullable: true })
  shift_id: number;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.OPEN })
  status: SessionStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  opened_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  closed_at: Date;

  @Column({ nullable: true })
  closed_by_id: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_sales: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_penalty_sales: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_amount: number;

  @Column({ type: 'int', default: 0 })
  total_tickets_sold: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  actual_amount_delivered: number | null;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'operator_id' })
  operator: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'closed_by_id' })
  closedBy: User;

  @ManyToOne(() => Shift, { nullable: true })
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  @OneToMany(() => TicketSale, ticketSale => ticketSale.session)
  ticketSales: TicketSale[];

  @OneToMany(() => TicketLog, ticketLog => ticketLog.session)
  ticketLogs: TicketLog[];

  @OneToMany(() => PenaltyTicketSale, penaltyTicketSale => penaltyTicketSale.session)
  penaltyTicketSales: PenaltyTicketSale[];
}
