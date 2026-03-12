// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
//   BaseEntity,
// } from 'typeorm';
// import { Tenant } from '../../tenant/entities/tenant.entities';
// import { Customer } from '../../customers/entities/customer.entities';
// import { TransactionType } from '../../../core/enums/transaction-type';
// import { ReferenceType } from '../../../core/enums/reference-type';


// @Entity('customer_transactions')
// export class CustomerTransaction extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'enum', enum: ReferenceType, nullable: true })
//   reference_type: ReferenceType;

//   @Column({ nullable: true })
//   reference_id: number;

//   @Column({ type: 'enum', enum: TransactionType })
//   type: TransactionType;

//   @Column({ type: 'text', nullable: true })
//   description: string;

//   @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
//   debit: number;

//   @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
//   credit: number;

//   @Column({ type: 'decimal', precision: 10, scale: 2 })
//   balance: number;

//   @ManyToOne(() => Tenant)
//   @JoinColumn({ name: 'tenant_id' })
//   tenant: Tenant;

//   @ManyToOne(() => Customer)
//   @JoinColumn({ name: 'customer_id' })
//   customer: Customer;
// }
