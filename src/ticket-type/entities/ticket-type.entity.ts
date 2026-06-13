import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';
import { RouteTicket } from '../../route-ticket/entities/route-ticket.entity';

@Entity('ticket_types')
export class TicketType extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => RouteTicket, routeTicket => routeTicket.ticketType)
  routeTickets: RouteTicket[];
}
