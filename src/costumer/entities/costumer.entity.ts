import { BaseEntityWithAudit } from 'src/common/base-entity.entity';
import { TicketType } from 'src/ticket-type/entities/ticket-type.entity';
import { TicketSale } from 'src/ticket-sale/entities/ticket-sale.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('costumers')
export class Costumer extends BaseEntityWithAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  mobile: string;

  @Column({ nullable: true })
  nuit: string;

  @Column({ unique: true })
  customer_number: string;

  @Column()
  ticket_type_id: number;

  @ManyToOne(() => TicketType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticket_type_id' })
  ticketType: TicketType;

  @OneToMany(() => TicketSale, (ticketSale) => ticketSale.customer)
  ticketSales: TicketSale[];
}
