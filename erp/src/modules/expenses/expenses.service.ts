// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, DataSource } from 'typeorm';
// import { Expense } from './entities/expeness.entities';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { Tenant } from '../tenant/entities/tenant.entities';
// import { Branch } from '../branches/entities/branch.entities';
// import { Account } from '../accounting/entities/account.entity';
// import { AccountingService } from '../accounting/accounting.service';

// @Injectable()
// export class ExpensesService {
//   constructor(
//     @InjectRepository(Expense)
//     private readonly expenseRepo: Repository<Expense>,
//     private readonly dataSource: DataSource,
//     private readonly accountingService: AccountingService,
//   ) {}

//   async createExpense(dto: CreateExpenseDto) {
//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       // Fetch related entities
//       const tenant = await queryRunner.manager.findOne(Tenant, {
//         where: { id: dto.tenant_id },
//       });
//       if (!tenant) throw new NotFoundException('Tenant not found');

//       const branch = await queryRunner.manager.findOne(Branch, {
//         where: { id: dto.branch_id },
//       });
//       if (!branch) throw new NotFoundException('Branch not found');

//       const expenseAccount = await queryRunner.manager.findOne(Account, {
//         where: { id: dto.expense_account_id },
//       });
//       if (!expenseAccount)
//         throw new NotFoundException('Expense Account not found');

//       const paymentAccount = await queryRunner.manager.findOne(Account, {
//         where: { id: dto.payment_account_id },
//       });
//       if (!paymentAccount)
//         throw new NotFoundException('Payment Account not found');

//       // Create Expense
//       const expense: Expense = queryRunner.manager.create(Expense, {
//         tenant,
//         branch,
//         expenseAccount,
//         paymentAccount,
//         amount: dto.amount,
//         description: dto.description,
//       });

//       await queryRunner.manager.save(expense);

//       // Create Journal Entry
//       await this.accountingService.createJournalEntry(queryRunner.manager, {
//         tenant,
//         branch,
//         referenceType: 'expense',
//         referenceId: expense.id,
//         lines: [
//           { account: expenseAccount, debit: dto.amount, credit: 0 },
//           { account: paymentAccount, debit: 0, credit: dto.amount },
//         ],
//       });

//       await queryRunner.commitTransaction();
//       return expense;
//     } catch (err) {
//       await queryRunner.rollbackTransaction();
//       throw err;
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   async getAllExpenses(tenantId: string, branchId?: string) {
//     const query = this.expenseRepo
//       .createQueryBuilder('expense')
//       .where('expense.tenant_id = :tenantId', { tenantId });

//     if (branchId) {
//       query.andWhere('expense.branch_id = :branchId', { branchId });
//     }

//     return await query.getMany();
//   }

//   async getExpenseById(id: string) {
//     const expense = await this.expenseRepo.findOne({ where: { id } });
//     if (!expense) throw new NotFoundException('Expense not found');
//     return expense;
//   }
// }
