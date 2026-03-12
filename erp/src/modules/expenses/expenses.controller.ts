// import { Controller, Post, Body, Get, Param, Query, UseGuards } from '@nestjs/common';
// import { ExpensesService } from './expenses.service';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { Roles } from '../../core/decorators/roles.decorator';
// import { RolesGuard } from '../../core/guards/roles.guard';

// @Controller('expenses')
// export class ExpensesController {
//   constructor(private readonly expensesService: ExpensesService) {}

//   @Post()
//   @Roles('tenant_owner', 'super_admin')
//   @UseGuards(RolesGuard)
//   async create(@Body() dto: CreateExpenseDto) {
//     return await this.expensesService.createExpense(dto);
//   }

//   @Get()
//   @Roles('tenant_owner', 'super_admin')
//   @UseGuards(RolesGuard)
//   async getAll(@Query('tenantId') tenantId: string, @Query('branchId') branchId?: string) {
//     return await this.expensesService.getAllExpenses(tenantId, branchId);
//   }

//   @Get(':id')
//   @Roles('tenant_owner', 'super_admin')
//   @UseGuards(RolesGuard)
//   async getById(@Param('id') id: string) {
//     return await this.expensesService.getExpenseById(id);
//   }
// }