import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Tenant } from '../../../tenant/entities/tenant.entities';
import { Branch } from '../../../branches/entities/branch.entities';
// import { Customer } from '../../../customers/entities/customer.entities';
import { OrderItem } from '../../order_item/entities/order_item.entities';
import { OrderStatus } from '../../../../core/enums/order_status.enum';
import { OrderType } from '../../../../core/enums/order_type.enum';
import { BaseEntity } from '../../../../infrastructure/database/entities/base.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: OrderType, default: 'dine_in' })
  order_type: OrderType;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tax_amount?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount_amount?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paid_amount: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}