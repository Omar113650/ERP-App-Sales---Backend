// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
// import { JournalEntry } from './journal-entry.entity';
// import { BaseEntity } from '../../../infrastructure/database/entities/base.entity';

// @Entity('journal_entry_audits')
// export class JournalEntryAudit extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ManyToOne(() => JournalEntry)
//   @JoinColumn({ name: 'journal_entry_id' })
//   journalEntry: JournalEntry;

//   @Column()
//   action: string; // created, updated, deleted

//   @Column('json', { nullable: true })
//   oldValue: any;

//   @Column('json', { nullable: true })
//   newValue: any;

//   @Column()
//   performedBy: string; 
// }