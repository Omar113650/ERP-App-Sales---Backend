// import {
//   IsNotEmpty,
//   IsString,
//   IsUUID,
//   IsArray,
//   ValidateNested,
// } from 'class-validator';
// import { Type } from 'class-transformer';

// export class JournalLineDto {
//   @IsUUID()
//   account_id: string;

//   @IsNotEmpty()
//   debit: number;

//   @IsNotEmpty()
//   credit: number;
// }

// export class CreateJournalEntryDto {
//   @IsUUID()
//   tenant_id: string;

//   @IsUUID()
//   branch_id: string;

//   @IsString()
//   @IsNotEmpty()
//   reference_type: string;

//   @IsUUID()
//   @IsNotEmpty()
//   reference_id: string;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => JournalLineDto)
//   lines: JournalLineDto[];

//   performedBy?: {
//     id: string;
//   };
// }
