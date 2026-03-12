// // يمثل تفاصيل القيد (مدين / دائن)

// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { BaseEntity } from '../../../infrastructure/database/entities/base.entity';
// import { JournalEntry } from './journal-entry.entity';
// import { Account } from './account.entity';

// @Entity('journal_lines')
// export class JournalLine extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ManyToOne(() => JournalEntry, (entry) => entry.lines)
//   @JoinColumn({ name: 'journal_entry_id' })
//   journalEntry: JournalEntry;

//   @ManyToOne(() => Account)
//   @JoinColumn({ name: 'account_id' })
//   account: Account;

//   @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
//   debit: number;

//   @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
//   credit: number;
// }