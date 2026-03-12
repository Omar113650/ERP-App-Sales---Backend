import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Length,
  IsBoolean,
  IsUUID,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class CreateItemDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({ example: 'Coca Cola 500ml' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  name: string;

  @ApiProperty({ example: 'SKU123', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: '1234567890123', required: false })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({ example: 'coca-cola.png', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 10.0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number) 
  cost_price?: number;

  @ApiProperty({ example: 15.0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number) 
  selling_price: number;

  @ApiProperty({ example: 50, required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number) 
  current_stock?: number;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number) 
  min_stock_level?: number;

  @ApiProperty({ example: true, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}