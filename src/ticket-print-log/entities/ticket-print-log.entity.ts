import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';
import { TicketSale } from '../../ticket-sale/entities/ticket-sale.entity';
import { PenaltyTicketSale } from '../../penalty-ticket-sale/entities/penalty-ticket-sale.entity';
import { User } from '../../user/entities/user.entity';
import { Session } from '../../session/entities/session.entity';
import { TransportRoute } from '../../transport-route/entities/transport-route.entity';
import { RouteTicket } from '../../route-ticket/entities/route-ticket.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Driver } from '../../drivers/entities/driver.entity';
import { TransportRouteStop } from '../../transport-route-stop/entities/transport-route-stop.entity';

@Entity('ticket_print_logs')
export class TicketPrintLog extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  // Referência à venda original
  @Column({ nullable: true })
  ticket_sale_id: number;

  @Column({ nullable: true })
  penalty_ticket_sale_id: number;

  @Column({ type: 'enum', enum: ['regular', 'penalty'] })
  sale_type: 'regular' | 'penalty';

  // Dados da sessão e operador
  @Column()
  session_id: number;

  @Column()
  operator_id: number;

  // Dados da rota e route ticket
  @Column()
  route_id: number;

  @Column({ nullable: true })
  origin_route_stop_id: number;

  @Column({ nullable: true })
  destination_route_stop_id: number;

  @Column()
  route_ticket_id: number;

  // Dados do veículo e motorista
  @Column({ nullable: true })
  vehicle_id: number;

  @Column({ nullable: true })
  driver_id: number;

  // Dados da venda
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_at_sale: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total: number;

  // Informações da impressão
  @Column({ type: 'timestamp' })
  printed_at: Date;

  @Column({ default: false })
  is_reprint: boolean;

  @Column({ type: 'int', default: 1 })
  print_number: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reprint_reason: string;

  // Referência única do mobile
  @Column({ type: 'varchar', length: 255, nullable: true })
  mobile_reference: string;

  // Referência da venda original no mobile
  @Column({ type: 'varchar', length: 255, nullable: true })
  sale_reference: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relacionamentos (opcional, para queries)
  @ManyToOne(() => TicketSale, { nullable: true })
  @JoinColumn({ name: 'ticket_sale_id' })
  ticketSale: TicketSale;

  @ManyToOne(() => PenaltyTicketSale, { nullable: true })
  @JoinColumn({ name: 'penalty_ticket_sale_id' })
  penaltyTicketSale: PenaltyTicketSale;

  @ManyToOne(() => Session)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'operator_id' })
  operator: User;

  @ManyToOne(() => TransportRoute)
  @JoinColumn({ name: 'route_id' })
  route: TransportRoute;

  @ManyToOne(() => RouteTicket)
  @JoinColumn({ name: 'route_ticket_id' })
  routeTicket: RouteTicket;

  @ManyToOne(() => TransportRouteStop, { nullable: true })
  @JoinColumn({ name: 'origin_route_stop_id' })
  originRouteStop: TransportRouteStop;

  @ManyToOne(() => TransportRouteStop, { nullable: true })
  @JoinColumn({ name: 'destination_route_stop_id' })
  destinationRouteStop: TransportRouteStop;

  @ManyToOne(() => Vehicle, { nullable: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => Driver, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;
}
