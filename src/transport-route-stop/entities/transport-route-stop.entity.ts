import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';
import { TransportRoute } from '../../transport-route/entities/transport-route.entity';

@Entity('transport_route_stops')
export class TransportRouteStop extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  order: number;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  routeId: number;

  @ManyToOne(() => TransportRoute, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routeId' })
  route: TransportRoute;
}
