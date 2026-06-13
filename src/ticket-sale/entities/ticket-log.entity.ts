import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';
import { Session } from '../../session/entities/session.entity';
import { RouteTicket } from '../../route-ticket/entities/route-ticket.entity';
import { User } from '../../user/entities/user.entity';
import { TransportRoute } from '../../transport-route/entities/transport-route.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Costumer } from '../../costumer/entities/costumer.entity';
import { TransportRouteStop } from 'src/transport-route-stop/entities/transport-route-stop.entity';
import { Driver } from '../../drivers/entities/driver.entity';

@Entity('ticket_logs')
export class TicketLog extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  session_id: number;

  @Column()
  operator_id: number;

  @Column()
  route_id: number;

  @Column({ nullable: true })
  origin_route_stop_id: number;

  @Column({ nullable: true })
  destination_route_stop_id: number;

  @Column()
  route_ticket_id: number;

  @Column({ nullable: true })
  vehicle_id: number;

  @Column({ nullable: true })
  driver_id: number;

  @Column({ nullable: true })
  customer_id: number;

  @Column({ nullable: true })
  customer_number: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_at_sale: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sold_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  ticket_sold_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference: string;

  @Column({ type: 'int', default: 1 })
  print_count: number;

  @Column({ type: 'timestamp', nullable: true })
  last_printed_at: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Session, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'operator_id' })
  operator: User;

  @ManyToOne(() => TransportRoute, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'route_id' })
  route: TransportRoute;

  @ManyToOne(() => TransportRouteStop, {
    nullable: true,
  })
  @JoinColumn({ name: 'origin_route_stop_id' })
  originRouteStop: TransportRouteStop;

  @ManyToOne(() => TransportRouteStop, {
    nullable: true,
  })
  @JoinColumn({ name: 'destination_route_stop_id' })
  destinationRouteStop: TransportRouteStop;

  @ManyToOne(() => RouteTicket, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'route_ticket_id' })
  routeTicket: RouteTicket;

  @ManyToOne(() => Vehicle, {
    nullable: true,
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => Driver, {
    nullable: true,
  })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @ManyToOne(() => Costumer, {
    nullable: true,
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Costumer;
}
