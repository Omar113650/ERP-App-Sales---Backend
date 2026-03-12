import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Or,
} from 'typeorm';
import { BaseEntity } from '../../../infrastructure/database/entities/base.entity';
import { Tenant } from '../../tenant/entities/tenant.entities';
// import { RecurringEntry } from '../../accounting/entities/recurring-entry.entity';
import { Order } from '../../sales/order/entities/order.entities';

@Entity('branches')
export class Branch extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;


  @ManyToOne(() => Tenant, (tenant) => tenant.branches, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @OneToMany(() => Order, (order) => order.branch)
  orders: Order[];

//   @OneToMany(() => RecurringEntry, (entry) => entry.branch)
// recurringEntries: RecurringEntry[];
}
