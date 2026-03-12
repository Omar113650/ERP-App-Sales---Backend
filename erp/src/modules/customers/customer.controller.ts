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
// import { CustomerService } from './customer.service';
// import { CreateCustomerDto } from './dto/create-customer.dto';
// import { UpdateCustomerDto } from './dto/update-customer.dto';

// @Controller('customer')
// export class CustomerController {
//   constructor(private readonly customerService: CustomerService) {}

//   @Post('create')
//   async create(@Body() body: CreateCustomerDto) {
//     return await this.customerService.createCustomer(body);
//   }

//   @Get()
//   async getAll(@Query() query: any) {
//     return await this.customerService.getCustomers(query);
//   }

//   @Get(':id')
//   async getById(@Param('id') id: string) {
//     return await this.customerService.getCustomerById(id);
//   }

//   @Patch(':id')
//   async update(
//     @Param('id') id: string,
//     @Body() body: UpdateCustomerDto,
//   ) {
//     return await this.customerService.updateCustomer(id, body);
//   }

//   @Delete(':id')
//   async delete(@Param('id') id: string) {
//     return await this.customerService.deleteCustomer(id);
//   }
// }
