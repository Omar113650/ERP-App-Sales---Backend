// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
//   BaseEntity,
// } from 'typeorm';
// import { Tenant } from '../../tenant/entities/tenant.entities';
// import { Branch } from '../../branches/entities/branch.entities';
// import { BaseTenantEntity } from '../../../infrastructure/database/entities/tenant-base.entity';

// @Entity('customers')
// export class Customer extends BaseTenantEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   name: string;

//   @Column({ nullable: true })
//   email: string;

//   @Column({ nullable: true })
//   phone: string;

//   @Column({ type: 'text', nullable: true })
//   address: string;

//   @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
//   opening_balance: number;

//   @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
//   current_balance: number;

//   @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
//   credit_limit: number;

//   @Column({ default: true })
//   is_active: boolean;

//   @ManyToOne(() => Tenant)
//   @JoinColumn({ name: 'tenant_id' })
//   tenant: Tenant;

//   @ManyToOne(() => Branch, { nullable: true })
//   @JoinColumn({ name: 'branch_id' })
//   branch: Branch;
// }
