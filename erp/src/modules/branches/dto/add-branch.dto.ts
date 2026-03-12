import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  Length,
  IsBoolean,
  IsUUID,
} from '@nestjs/class-validator';

export class CreateBranchDto {
  @ApiProperty({ example: 'Main Branch' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  name: string;

  @ApiProperty({ example: 'Cairo', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '01012345678', required: false })
  @IsOptional()
  @IsString()
  @Length(5, 50)
  phone?: string;

  @ApiProperty({ example: 'branch@mail.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: '1fmefpefkpqwdwqdqwd' })
  @IsNotEmpty()
  @IsUUID()
  tenant_id: string;
}
