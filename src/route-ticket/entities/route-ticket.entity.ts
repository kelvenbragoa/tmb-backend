import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';
import { TransportRoute } from '../../transport-route/entities/transport-route.entity';
import { TicketType } from '../../ticket-type/entities/ticket-type.entity';
import { TicketSale } from '../../ticket-sale/entities/ticket-sale.entity';

@Entity('route_tickets')
export class RouteTicket extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  route_id: number;

  @Column()
  ticket_type_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  penalty_price: number;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => TransportRoute, route => route.routeTickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_id' })
  route: TransportRoute;

  @ManyToOne(() => TicketType, ticketType => ticketType.routeTickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticket_type_id' })
  ticketType: TicketType;

  @OneToMany(() => TicketSale, ticketSale => ticketSale.routeTicket)
  ticketSales: TicketSale[];
}