// import { Injectable } from '@nestjs/common';
// import { DataSource } from 'typeorm';
// import { Account } from './entities/account.entity';
// import { JournalLine } from './entities/journal-line.entity';
// import { JournalEntry } from './entities/journal-entry.entity';

// @Injectable()
// export class ReportsService {
//   constructor(private dataSource: DataSource) {}


//   async getTrialBalance(tenantId: string, branchId?: string) {
//     const manager = this.dataSource.manager;
//     const accounts = await manager.find(Account, {
//       where: { tenant: { id: tenantId } },
//     });

//     const result: {
//       account: string;
//       type: string;
//       debit: number;
//       credit: number;
//     }[] = [];
//     for (const acc of accounts) {
//       const lines = await manager.find(JournalLine, {
//         where: { account: { id: acc.id } },
//       });
//       const debit = lines.reduce((sum, l) => sum + Number(l.debit), 0);
//       const credit = lines.reduce((sum, l) => sum + Number(l.credit), 0);
//       result.push({ account: acc.name, type: acc.type, debit, credit });
//     }
//     return result;
//   }


//   async getBalanceSheet(tenantId: string, branchId?: string) {
//     const trial = await this.getTrialBalance(tenantId, branchId);
//     const assets = trial
//       .filter((a) => ['asset'].includes(a.type))
//       .reduce((s, a) => s + (a.debit - a.credit), 0);
//     const liabilities = trial
//       .filter((a) => ['liability'].includes(a.type))
//       .reduce((s, a) => s + (a.credit - a.debit), 0);
//     const equity = trial
//       .filter((a) => ['equity'].includes(a.type))
//       .reduce((s, a) => s + (a.credit - a.debit), 0);

//     return { assets, liabilities, equity };
//   }

//   async getProfitAndLoss(tenantId: string, branchId?: string) {
//     const trial = await this.getTrialBalance(tenantId, branchId);
//     const income = trial
//       .filter((a) => ['income'].includes(a.type))
//       .reduce((s, a) => s + (a.credit - a.debit), 0);
//     const expenses = trial
//       .filter((a) => ['expense'].includes(a.type))
//       .reduce((s, a) => s + (a.debit - a.credit), 0);

//     const netProfit = income - expenses;
//     return { income, expenses, netProfit };
//   }

//   async getAccountLedger(accountId: string) {
//     const manager = this.dataSource.manager;
//     const account = await manager.findOne(Account, {
//       where: { id: accountId },
//     });
//     if (!account) {
//       throw new Error(`Account with id ${accountId} not found`);
//     }
//     const lines = await manager.find(JournalLine, {
//       where: { account: { id: accountId } },
//       relations: ['journalEntry'],
//     });

//     const ledger = lines.map((l) => ({
//       date: l.createdAt,
//       reference:
//         l.journalEntry.reference_type + ' / ' + l.journalEntry.reference_id,
//       debit: l.debit,
//       credit: l.credit,
//       balance: l.debit - l.credit,
//     }));

//     return { account: account.name, ledger };
//   }
// }
