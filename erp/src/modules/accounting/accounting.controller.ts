// import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
// import { AccountingService } from './accounting.service';
// import { ReportsService } from './reports.service';
// import { CreateJournalEntryDto } from './dtos/create-journal-entry.dto';
// import { CreateAccountDto } from './dtos/create-account.dto';
// import { CreateRecurringEntryDto } from './dtos/create-recurring-entry.dto';
// import { DataSource } from 'typeorm';
// import { Account } from './entities/account.entity';

// @Controller('accounting')
// export class AccountingController {
//   constructor(
//     private readonly accountingService: AccountingService,
//     private readonly reportsService: ReportsService,
//     private readonly dataSource: DataSource,
//   ) {}


//   @Post('account')
//   async createAccount(@Body() body: CreateAccountDto) {
//     return this.accountingService.createAccount(body);
//   }

//   @Post('journal-entry/manual')
//   async createManualJournalEntry(@Body() dto: CreateJournalEntryDto) {
//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       const lines: { account: Account; debit: number; credit: number }[] = [];
//       for (const line of dto.lines) {
//         const account = await queryRunner.manager.findOne(Account, {
//           where: { id: line.account_id },
//         });
//         if (!account) throw new Error('Account not found');
//         lines.push({ account, debit: line.debit, credit: line.credit });
//       }

//       const journal = await this.accountingService.createJournalEntry(
//         queryRunner.manager,
//         {
//           tenant: { id: dto.tenant_id },
//           branch: { id: dto.branch_id },
//           referenceType: 'manual',
//           referenceId: dto.reference_id,
//           performedBy: dto.performedBy?.id,
//           lines,
//         },
//       );

//       await queryRunner.commitTransaction();
//       return journal;
//     } catch (err) {
//       await queryRunner.rollbackTransaction();
//       throw err;
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   @Post('recurring-entry')
//   async createRecurringEntry(@Body() dto: CreateRecurringEntryDto) {
//     return this.accountingService.createRecurringEntry(dto);
//   }

//   @Post('recurring-entry/generate')
//   async generateRecurringEntries() {
//     return this.accountingService.generateRecurringEntries();
//   }
//   @Get('reports/trial-balance/:tenantId')
//   async getTrialBalance(
//     @Param('tenantId') tenantId: string,
//     @Query('branchId') branchId?: string,
//   ) {
//     return this.reportsService.getTrialBalance(tenantId, branchId);
//   }

//   @Get('reports/balance-sheet/:tenantId')
//   async getBalanceSheet(
//     @Param('tenantId') tenantId: string,
//     @Query('branchId') branchId?: string,
//   ) {
//     return this.reportsService.getBalanceSheet(tenantId, branchId);
//   }

//   @Get('reports/pl/:tenantId')
//   async getProfitAndLoss(
//     @Param('tenantId') tenantId: string,
//     @Query('branchId') branchId?: string,
//   ) {
//     return this.reportsService.getProfitAndLoss(tenantId, branchId);
//   }

//   @Get('reports/ledger/:accountId')
//   async getAccountLedger(@Param('accountId') accountId: string) {
//     return this.reportsService.getAccountLedger(accountId);
//   }
// }
