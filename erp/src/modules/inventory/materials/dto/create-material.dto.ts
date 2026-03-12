import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Length,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class CreateMaterialDto {
  @ApiProperty({ example: 'uuid-of-item' })
  @IsNotEmpty()
  @IsUUID()
  itemId: string;

  @ApiProperty({ example: 'Sugar' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  name: string;

  @ApiProperty({ example: 'Organic sugar', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'kg' })
  @IsNotEmpty()
  @IsString()
  unit: string;

  @ApiProperty({ example: 100, required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  current_quantity?: number;

  @ApiProperty({ example: 10, required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_quantity?: number;

  @ApiProperty({ example: 20.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost_per_unit?: number;

  @ApiProperty({ example: '2026-12-31', required: false })
  @IsOptional()
  @IsDateString()
  expiry_date?: string;
}