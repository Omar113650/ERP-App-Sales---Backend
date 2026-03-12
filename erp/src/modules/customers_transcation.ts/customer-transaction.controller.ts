// import {
//   Body,
//   Controller,
//   Get,
//   Post,
//   Patch,
//   Delete,
//   Param,
//   Query,
// } from '@nestjs/common';

// import { CreateCustomerTransactionDto } from './dto/customer_transaction.dto';
// import { UpdateCustomerDto } from './dto/update-customer-transaction.dto';
// import { CustomerTransactionService } from './customer-transaction.service';
// @Controller('customer-transaction')
// export class CustomerTransactionController {
//   constructor(
//     private readonly transactionService: CustomerTransactionService,
//   ) {}

//   @Post('create')
//   async create(@Body() body: CreateCustomerTransactionDto) {
//     return await this.transactionService.createTransaction(body);
//   }

//   @Get()
//   async getAll(@Query() query: any) {
//     return await this.transactionService.getTransactions(query);
//   }

//   @Get(':id')
//   async getById(@Param('id') id: string) {
//     return await this.transactionService.getTransactionById(id);
//   }

//   @Patch(':id')
//   async update(@Param('id') id: string, @Body() body: UpdateCustomerDto) {
//     return await this.transactionService.updateTransaction(id, body);
//   }

//   @Delete(':id')
//   async delete(@Param('id') id: string) {
//     return await this.transactionService.deleteTransaction(id);
//   }
// }
