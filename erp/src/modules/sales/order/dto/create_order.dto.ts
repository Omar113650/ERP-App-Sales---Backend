import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  IsString,
  ValidateNested,
  ArrayMinSize,
  IsUUID,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { OrderType } from '../../../../core/enums/order_type.enum';

class OrderItemDto {
  @ApiProperty({ example: 'uuid-of-item' })
  @IsNotEmpty()
  @IsUUID()
  itemId: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'Extra napkins', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @ApiProperty({ enum: OrderType, example: OrderType.DINE_IN })
  @IsNotEmpty()
  @IsEnum(OrderType)
  order_type: OrderType;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  paid_amount?: number;

  @ApiProperty({
    type: [OrderItemDto],
    example: [{ itemId: 'uuid1', quantity: 2, notes: 'Extra napkins' }],
  })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'Customer requested extra napkins', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}