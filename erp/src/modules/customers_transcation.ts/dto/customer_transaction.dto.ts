// import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsNotEmpty,
//   IsOptional,
//   IsEnum,
//   IsNumber,
//   Min,
//   IsString,
// } from '@nestjs/class-validator';
// import { ReferenceType } from '../../../core/enums/reference-type';

// import { TransactionType } from '../../../core/enums/transaction-type';

// export class CreateCustomerTransactionDto {
//   @ApiProperty({ example: 1 })
//   @IsNotEmpty()
//   @IsNumber()
//   tenantId: number;

//   @ApiProperty({ example: 1 })
//   @IsNotEmpty()
//   @IsNumber()
//   customerId: number;

//   @ApiProperty({
//     enum: ReferenceType,
//     example: ReferenceType.ORDER,
//     required: false,
//   })
//   @IsOptional()
//   @IsEnum(ReferenceType)
//   reference_type?: ReferenceType;

//   @ApiProperty({ example: 123, required: false })
//   @IsOptional()
//   @IsNumber()
//   reference_id?: number;

//   @ApiProperty({ enum: TransactionType, example: TransactionType.INVOICE })
//   @IsNotEmpty()
//   @IsEnum(TransactionType)
//   type: TransactionType;

//   @ApiProperty({ example: 'Payment for invoice #123', required: false })
//   @IsOptional()
//   @IsString()
//   description?: string;

//   @ApiProperty({ example: 100.0, default: 0 })
//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   debit?: number;

//   @ApiProperty({ example: 0.0, default: 0 })
//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   credit?: number;

//   @ApiProperty({ example: 500.0 })
//   @IsNotEmpty()
//   @IsNumber()
//   balance: number;
// }
