import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  Length,
} from '@nestjs/class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Beverages' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: true, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
