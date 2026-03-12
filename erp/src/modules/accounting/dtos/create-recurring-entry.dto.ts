// import {
//   IsNotEmpty,
//   IsUUID,
//   IsArray,
//   ValidateNested,
//   IsString,
//   IsIn,
// } from 'class-validator';
// import { Type } from 'class-transformer';

// class RecurringLineDto {
//   @IsUUID()
//   account_id: string;

//   @IsNotEmpty()
//   debit: number;

//   @IsNotEmpty()
//   credit: number;
// }

// export class CreateRecurringEntryDto {
//   @IsUUID()
//   tenant_id: string;

//   @IsUUID()
//   branch_id: string;

//   @IsString()
//   @IsNotEmpty()
//   reference_name: string;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => RecurringLineDto)
//   lines: RecurringLineDto[];

//   @IsString()
//   @IsIn(['daily', 'weekly', 'monthly'])
//   frequency: string; // daily, weekly, monthly
// }
