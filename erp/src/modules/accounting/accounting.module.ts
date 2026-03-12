// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AccountingService } from './accounting.service';
// import { AccountingController } from './accounting.controller';
// import { Account } from './entities/account.entity';
// import { JournalEntry } from './entities/journal-entry.entity';
// import { JournalLine } from './entities/journal-line.entity';
// import { Branch } from '../branches/entities/branch.entities';
// import { Tenant } from '../tenant/entities/tenant.entities';
// import { ReportsService } from './reports.service';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([
//       Account,
//       JournalEntry,
//       JournalLine,
//       Branch,
//       Tenant,
//     ]),
//   ],
//   providers: [AccountingService,ReportsService],
//   controllers: [AccountingController],
//   exports: [AccountingService],
// })
// export class AccountingModule {}
