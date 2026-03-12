// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { Tenant } from '../../tenant/entities/tenant.entities';
// import { Branch } from '../../branches/entities/branch.entities';
// import { BaseTenantEntity } from '../../../infrastructure/database/entities/tenant-base.entity';

// @Entity('expenses')
// export class Expense extends BaseTenantEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'text', nullable: true })
//   description: string;

//   @Column({ type: 'decimal', precision: 10, scale: 2 })
//   amount: number;

//   @Column({ type: 'date', nullable: true })
//   expense_date: string;

//   @Column({ nullable: true })
//   created_by_user_id: number;

//   @ManyToOne(() => Tenant)
//   @JoinColumn({ name: 'tenant_id' })
//   tenant: Tenant;

//   @ManyToOne(() => Branch, { nullable: true })
//   @JoinColumn({ name: 'branch_id' })
//   branch: Branch;
// }


















// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { BaseEntity } from '../../../infrastructure/database/entities/base.entity';
// import { Tenant } from '../../tenant/entities/tenant.entities';
// import { Branch } from '../../branches/entities/branch.entities';
// import { Account } from '../../accounting/entities/account.entity';

// @Entity('expenses')
// export class Expense extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ManyToOne(() => Tenant)
//   @JoinColumn({ name: 'tenant_id' })
//   tenant: Tenant;

//   @ManyToOne(() => Branch)
//   @JoinColumn({ name: 'branch_id' })
//   branch: Branch;

//   @ManyToOne(() => Account)
//   @JoinColumn({ name: 'expense_account_id' })
//   expenseAccount: Account;

//   @ManyToOne(() => Account)
//   @JoinColumn({ name: 'payment_account_id' })
//   paymentAccount: Account;

//   @Column({ type: 'decimal', precision: 10, scale: 2 })
//   amount: number;

//   @Column({ type: 'text' })
//   description: string;
// }