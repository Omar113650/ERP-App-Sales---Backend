import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  IsNumber,
  Min,
  MinLength,
  Matches,
  IsPhoneNumber,
} from '@nestjs/class-validator';
import { IsDecimal } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ example: 'My Company' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  name: string;

  @ApiProperty({ example: 'info@company.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Omar@669696' })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/, {
    message: 'Password must contain uppercase, lowercase, number and symbol',
  })
  password: string;

  @ApiProperty({ example: '01012345678' })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('EG')
  @Length(5, 50)
  phone: string;

  @ApiProperty({ example: 'Cairo, Egypt', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'logo.png', required: false })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ example: 'EGP', default: 'EGP' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  // @ApiProperty({ example: 14.0, default: 0 })
  // @IsOptional()
  @IsDecimal()
  // @Min(0)
  taxRate?: number;
}
