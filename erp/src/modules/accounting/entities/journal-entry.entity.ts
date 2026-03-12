// // يمثل أي حركة مالية (القيد)

// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
// import { BaseEntity } from '../../../infrastructure/database/entities/base.entity';
// import { Tenant } from '../../tenant/entities/tenant.entities';
// import { Branch } from '../../branches/entities/branch.entities';
// import { JournalLine } from './journal-line.entity';

// @Entity('journal_entries')
// export class JournalEntry extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ManyToOne(() => Tenant)
//   @JoinColumn({ name: 'tenant_id' })
//   tenant: Tenant;

//   @ManyToOne(() => Branch)
//   @JoinColumn({ name: 'branch_id' })
//   branch: Branch;

//   @Column()
//   reference_type: string; 

//   @Column()
//   reference_id: string;

//   @Column({ default: 'posted' })
//   status: string;

//   @OneToMany(() => JournalLine, (line) => line.journalEntry, { cascade: true })
//   lines: JournalLine[];
// }