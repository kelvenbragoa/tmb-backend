import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntityWithAudit } from '../../common/base-entity.entity';
import { TransportRoute } from '../../transport-route/entities/transport-route.entity';
import { TicketSale } from '../../ticket-sale/entities/ticket-sale.entity';

@Entity('vehicles')
export class Vehicle extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  plate: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToMany(() => TransportRoute, route => route.vehicles)
  @JoinTable({
    name: 'route_vehicles',
    joinColumn: { name: 'vehicle_id' },
    inverseJoinColumn: { name: 'route_id' },
  })
  routes: TransportRoute[];

  @OneToMany(() => TicketSale, ticketSale => ticketSale.vehicle)
  ticketSales: TicketSale[];
}