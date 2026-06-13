import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';
import { RouteTicket } from '../../route-ticket/entities/route-ticket.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { TransportRouteCategory } from '../../transport-route-category/entities/transport-route-category.entity';
import { TransportRouteStop } from 'src/transport-route-stop/entities/transport-route-stop.entity';

@Entity('transport_routes')
export class TransportRoute extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => TransportRouteCategory, category => category.routes)
  @JoinColumn({ name: 'categoryId' })
  category: TransportRouteCategory;

  @OneToMany(() => RouteTicket, routeTicket => routeTicket.route)
  routeTickets: RouteTicket[];

  @ManyToMany(() => Vehicle, vehicle => vehicle.routes)
  vehicles: Vehicle[];

  @OneToMany(() => TransportRouteStop, routeStop => routeStop.route)
  routeStops: TransportRouteStop[];
}