// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { BaseEntity } from '../../../infrastructure/database/entities/base.entity';
// import { Tenant } from '../../tenant/entities/tenant.entities';
// import { Branch } from '../../branches/entities/branch.entities';
// import { Account } from './account.entity';

// @Entity('recurring_entries')
// export class RecurringEntry extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ManyToOne(() => Tenant)
//   @JoinColumn({ name: 'tenant_id' })
//   tenant: Tenant;

//   @ManyToOne(() => Branch)
//   @JoinColumn({ name: 'branch_id' })
//   branch: Branch;

// @Column({ type: 'varchar', nullable: true })
// reference_name?: string;

//   @Column('simple-json')
//   lines: { account_id: string; debit: number; credit: number }[];

//   @Column({ type: 'varchar', default: 'monthly' }) // daily, weekly, monthly
//   frequency: string;

//   @Column({ type: 'boolean', default: true })
//   isActive: boolean;
// }