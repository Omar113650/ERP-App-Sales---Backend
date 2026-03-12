// import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsNotEmpty,
//   IsOptional,
//   IsString,
//   IsNumber,
//   Min,
//   IsDateString,
// } from '@nestjs/class-validator';

// export class CreateExpenseDto {
//   @ApiProperty({ example: 1 })
//   @IsNotEmpty()
//   @IsNumber()
//   tenant_id: string;

//   @ApiProperty({ example: 1, required: false })
//   @IsOptional()
//   branch_id?: string;

//   @ApiProperty({ example: 1, required: false })
//   @IsOptional()
//   expense_account_id?: string;

//   @ApiProperty({ example: 1, required: false })
//   @IsOptional()
//   account_id?: string;

//   @ApiProperty({ example: 1, required: false })
//   @IsOptional()
//   payment_account_id?: string;

//   @ApiProperty({ example: 'Office rent for February', required: false })
//   @IsOptional()
//   @IsString()
//   description?: string;

//   @ApiProperty({ example: 5000.0 })
//   @IsNotEmpty()
//   @IsNumber()
//   @Min(0)
//   amount: number;

//   @ApiProperty({ example: '2026-02-07', required: false })
//   @IsOptional()
//   @IsDateString()
//   expense_date?: string;

//   @ApiProperty({ example: 1, required: false })
//   @IsOptional()
//   @IsNumber()
//   created_by_user_id?: number;
// }
