// import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty, IsOptional, IsString, IsEmail, IsNumber, Min, Length, IsBoolean } from '@nestjs/class-validator';

// export class CreateCustomerDto {
//   @ApiProperty({ example: 1 })
//   @IsNotEmpty()
//   @IsNumber()
//   tenantId: number;

//   @ApiProperty({ example: 1, required: false })
//   @IsOptional()
//   @IsNumber()
//   branchId?: number;

//   @ApiProperty({ example: 'Ahmed Ali' })
//   @IsNotEmpty()
//   @IsString()
//   @Length(2, 255)
//   name: string;

//   @ApiProperty({ example: 'ahmed@example.com', required: false })
//   @IsOptional()
//   @IsEmail()
//   email?: string;

//   @ApiProperty({ example: '01012345678', required: false })
//   @IsOptional()
//   @IsString()
//   @Length(5, 50)
//   phone?: string;

//   @ApiProperty({ example: 'Cairo, Egypt', required: false })
//   @IsOptional()
//   @IsString()
//   address?: string;

//   @ApiProperty({ example: 100.00, required: false, default: 0 })
//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   opening_balance?: number;

//   @ApiProperty({ example: 100.00, required: false, default: 0 })
//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   current_balance?: number;

//   @ApiProperty({ example: 500.00, required: false })
//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   credit_limit?: number;

//   @ApiProperty({ example: true, required: false, default: true })
//   @IsOptional()
//   @IsBoolean()
//   is_active?: boolean;
// }
