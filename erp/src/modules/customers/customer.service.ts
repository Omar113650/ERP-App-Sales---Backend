// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Customer } from './entities/customer.entities';
// import { CreateCustomerDto } from './dto/create-customer.dto';
// import { UpdateCustomerDto } from './dto/update-customer.dto';
// import { ApiFeatures } from '../../shared/utils/api-features'; 

// @Injectable()
// export class CustomerService {
//   constructor(
//     @InjectRepository(Customer)
//     private readonly customerRepository: Repository<Customer>,
//   ) {}

//   async createCustomer(dto: CreateCustomerDto) {
//     const customer = this.customerRepository.create({
//       ...dto,
//       tenantId: String(dto.tenantId),
//     });
//     return await this.customerRepository.save(customer);
//   }

//   async getCustomers(queryParams: any) {
//     const query = this.customerRepository.createQueryBuilder('customer');
//     const features = new ApiFeatures(query, queryParams)
//       .filter()
//       .sort()
//       .paginate();

//     return await features.execute();
//   }

//   async getCustomerById(id: string) {
//     const customer = await this.customerRepository.findOne({ where: { id } });
//     if (!customer)
//       throw new NotFoundException(`Customer with id ${id} not found`);
//     return customer;
//   }

//   async updateCustomer(id: string, dto: UpdateCustomerDto) {
//     const customer = await this.customerRepository.preload({
//       id,
//       ...dto,
//       tenantId: dto.tenantId ? String(dto.tenantId) : undefined,
//     });
//     if (!customer) throw new NotFoundException('Customer not found');
//     return await this.customerRepository.save(customer);
//   }

//   async deleteCustomer(id: string): Promise<{ message: string }> {
//     const customer = await this.getCustomerById(id);
//     await this.customerRepository.remove(customer);
//     return { message: 'Customer deleted successfully' };
//   }
// }
