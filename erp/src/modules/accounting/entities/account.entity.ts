// // يمثل الحساب في الـ Chart of Accounts
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { BaseEntity } from '../../../infrastructure/database/entities/base.entity';
// import { Tenant } from '../../tenant/entities/tenant.entities';
// import{AccountType} from  '../../../core/enums/account-type'


// @Entity('accounts')
// export class Account extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'varchar', length: 255 })
//   name: string;

//   @Column({ type: 'enum', enum: AccountType })
//   type: AccountType;

//   @ManyToOne(() => Tenant)
//   @JoinColumn({ name: 'tenant_id' })
//   tenant: Tenant;

//   @Column({ nullable: true })
//   parent_id?: string;

//   @Column({ default: true })
//   isActive: boolean;
// }