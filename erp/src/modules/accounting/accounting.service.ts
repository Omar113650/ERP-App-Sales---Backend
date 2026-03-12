// import { Injectable } from '@nestjs/common';
// import { DataSource, EntityManager } from 'typeorm';
// import { Account } from './entities/account.entity';
// import { JournalEntry } from './entities/journal-entry.entity';
// import { JournalLine } from './entities/journal-line.entity';
// import { CreateAccountDto } from './dtos/create-account.dto';
// @Injectable()
// export class AccountingService {
  
//   constructor(private dataSource: DataSource) {}
//   async createAccount(dto: CreateAccountDto) {
//     return await this.dataSource.transaction(async (manager) => {
//       const repo = manager.getRepository(Account);

//       const existing = await repo.findOne({
//         where: { name: dto.name, tenant: { id: dto.tenant_id } },
//       });

//       if (existing) {
//         throw new Error('Account already exists');
//       }
//       if (dto.parent_id) {
//         const parent = await repo.findOne({
//           where: { id: dto.parent_id },
//         });

//         if (!parent) throw new Error('Parent not found');

//         if (parent.type !== dto.type) {
//           throw new Error('Parent type mismatch');
//         }
//       }

//       const account = repo.create(dto);
//       return await repo.save(account);
//     });
//   }
//   async createJournalEntry(
//     manager: EntityManager,
//     data: {
//       tenant: any;
//       branch: any;
//       referenceType: string;
//       referenceId: string;
//       performedBy?: string;
//       lines: { account: Account; debit: number; credit: number }[];
//     },
//   ) {
//     if (!data.lines.length) {
//       throw new Error('Journal entry must contain at least one line');
//     }

//     let totalDebit = 0;
//     let totalCredit = 0;

//     for (const line of data.lines) {
//       const debit = Number(line.debit) || 0;
//       const credit = Number(line.credit) || 0;

//       if (debit < 0 || credit < 0) {
//         throw new Error('Debit or credit cannot be negative');
//       }
//       if (debit > 0 && credit > 0) {
//         throw new Error('Line cannot have both debit and credit');
//       }
//       if (debit === 0 && credit === 0) {
//         throw new Error('Line must have either debit or credit');
//       }
//       if (!line.account.isActive) {
//         throw new Error(`Account ${line.account.name} is inactive`);
//       }
//       if (line.account.tenant.id !== data.tenant.id) {
//         throw new Error(
//           `Account ${line.account.name} does not belong to this tenant`,
//         );
//       }
//       totalDebit += debit;
//       totalCredit += credit;
//     }

//     if (Math.abs(totalDebit - totalCredit) > 0.0001) {
//       throw new Error('Journal entry is not balanced');
//     }

//     const journal = manager.create(JournalEntry, {
//       tenant: data.tenant,
//       branch: data.branch,
//       reference_type: data.referenceType,
//       reference_id: data.referenceId,
//       status: 'draft',
//       performed_by: data.performedBy ?? null,
//     });

//     await manager.save(journal);

//     const journalLines = data.lines.map((line) =>
//       manager.create(JournalLine, {
//         journalEntry: journal,
//         account: line.account,
//         debit: Number(line.debit) || 0,
//         credit: Number(line.credit) || 0,
//       }),
//     );

//     await manager.save(journalLines);

//     return journal;
//   }

//   async createRecurringEntry(dto: any) {
//     const repo = this.dataSource.getRepository('recurring_entries');
//     const entry = repo.create(dto);
//     return await repo.save(entry);
//   }

//   async generateRecurringEntries() {
//     const repo = this.dataSource.getRepository('recurring_entries');
//     const entries = await repo.find({ where: { isActive: true } });
//     const manager = this.dataSource.manager;

//     for (const entry of entries) {
//       const lines: { account: Account; debit: number; credit: number }[] = [];
//       for (const line of entry.lines) {
//         const account = await manager.findOne(Account, {
//           where: { id: line.account_id },
//         });
//         if (!account) continue;
//         lines.push({ account, debit: line.debit, credit: line.credit });
//       }

//       if (lines.length > 0) {
//         await this.createJournalEntry(manager, {
//           tenant: entry.tenant,
//           branch: entry.branch,
//           referenceType: 'recurring',
//           referenceId: entry.id,
//           lines: lines,
//         });
//       }
//     }
//   }
// }
