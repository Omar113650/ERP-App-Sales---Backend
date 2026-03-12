// import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsNotEmpty,
//   IsNumber,
//   Min,
//   IsOptional,
//   IsString,
// } from '@nestjs/class-validator';
// import { IsUUID } from 'class-validator';

// export class CreateOrderItemDto {
//   @ApiProperty({ example: 'qfqj5648w' })
//   @IsNotEmpty()
//   @IsUUID()
//   item_id: string;

//      @ApiProperty({ example: 1 })
//   @IsNotEmpty()
//   @IsUUID()
//   order_id: string;

//   @ApiProperty({ example: 2.5 })
//   @IsNotEmpty()
//   @IsNumber()
//   @Min(0)
//   quantity: number;

//   @ApiProperty({ example: 50.0 })
//   @IsNotEmpty()
//   @IsNumber()
//   @Min(0)
//   unit_price: number;

//   @ApiProperty({ example: 125.0 })
//   @IsNotEmpty()
//   @IsNumber()
//   @Min(0)
//   total_price: number;

//   @ApiProperty({ example: 'Extra sauce', required: false })
//   @IsOptional()
//   @IsString()
//   notes?: string;
// }





import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { IsUUID } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'uuid-of-item' })
  @IsNotEmpty()
  @IsUUID()
  item_id: string;

  @ApiProperty({ example: 'uuid-of-order' })
  @IsNotEmpty()
  @IsUUID()
  order_id: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'Extra sauce', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderItemDto {
  @ApiProperty({ example: 3 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}