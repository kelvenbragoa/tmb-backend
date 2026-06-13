import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';
import { TransportRoute } from '../../transport-route/entities/transport-route.entity';

@Entity('transport_route_categories')
export class TransportRouteCategory extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => TransportRoute, route => route.category)
  routes: TransportRoute[];
}
