// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ExpensesService } from './expenses.service';
// import { ExpensesController } from './expenses.controller';
// import { Expense } from './entities/expeness.entities';
// import { Tenant } from '../tenant/entities/tenant.entities';
// import { Branch } from '../branches/entities/branch.entities';
// import { Account } from '../accounting/entities/account.entity';
// import { AccountingModule } from '../accounting/accounting.module';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Expense, Tenant, Branch, Account]),
//     AccountingModule,
//   ],
//   controllers: [ExpensesController],
//   providers: [ExpensesService],
// })
// export class ExpensesModule {}