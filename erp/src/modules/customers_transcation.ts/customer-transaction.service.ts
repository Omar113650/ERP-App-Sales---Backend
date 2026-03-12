// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CustomerTransaction } from './entities/customer_transcation.entities';
// import { CreateCustomerTransactionDto } from './dto/customer_transaction.dto';
// import { UpdateCustomerDto } from './dto/update-customer-transaction.dto';
// import { Tenant } from '../../modules/tenant/entities/tenant.entities';
// import { Customer } from '../../modules/customers/entities/customer.entities';

// @Injectable()
// export class CustomerTransactionService {
//   constructor(
//     @InjectRepository(CustomerTransaction)
//     private readonly transactionRepo: Repository<CustomerTransaction>,
//   ) {}

//   async createTransaction(
//     dto: CreateCustomerTransactionDto,
//   ): Promise<CustomerTransaction> {
//     const transaction = this.transactionRepo.create({
//       ...dto,
//       tenant: { id: dto.tenantId } as unknown as Tenant,
//       customer: { id: dto.customerId } as unknown as Customer,
//     });
//     return await this.transactionRepo.save(transaction);
//   }

//   async getTransactions(queryParams: any): Promise<CustomerTransaction[]> {
//     const query = this.transactionRepo.createQueryBuilder('transaction');
//     // لو عندك ApiFeatures للفلترة والPagination تقدر تستخدمه هنا
//     return await query.getMany();
//   }

//   async getTransactionById(id: string): Promise<CustomerTransaction> {
//     const transaction = await this.transactionRepo.findOne({ where: { id } });
//     if (!transaction) throw new NotFoundException('Transaction not found');
//     return transaction;
//   }

//   async updateTransaction(
//     id: string,
//     dto: UpdateCustomerDto,
//   ): Promise<CustomerTransaction> {
//     const transaction = await this.transactionRepo.preload({ id, ...dto });
//     if (!transaction) throw new NotFoundException('Transaction not found');
//     return await this.transactionRepo.save(transaction);
//   }

//   async deleteTransaction(id: string): Promise<{ message: string }> {
//     const transaction = await this.getTransactionById(id);
//     await this.transactionRepo.remove(transaction);
//     return { message: 'Transaction deleted successfully' };
//   }
// }
