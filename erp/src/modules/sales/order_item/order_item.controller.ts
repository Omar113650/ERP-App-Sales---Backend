import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { OrderItemService } from './order_item.service';
import { CreateOrderItemDto } from './dto/order_Item.dto';
import { UpdateOrderItemDto } from './dto/update-order_Item.dto';
import { Roles } from '../../../core/decorators/roles.decorator';
import { RolesGuard } from '../../../core/guards/roles.guard';
@ApiTags('Order-Items')
@ApiBearerAuth()
@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post('Add-items-in-order')
  @Roles('tenant_owner', 'super_admin', 'cashier', 'branch_manager')
  @UseGuards(RolesGuard)
  async addItem(@Body() dto: CreateOrderItemDto) {
    return this.orderItemService.addItem(dto);
  }

  @Patch(':id')
  @Roles('tenant_owner', 'super_admin', 'cashier', 'branch_manager')
  @UseGuards(RolesGuard)
  async updateItem(@Param('id') id: string, @Body() dto: UpdateOrderItemDto) {
    return this.orderItemService.updateItem(id, dto.quantity!);
  }

  @Delete(':id')
  @Roles('tenant_owner', 'super_admin', 'cashier', 'branch_manager')
  @UseGuards(RolesGuard)
  async removeItem(@Param('id') id: string) {
    return this.orderItemService.removeItem(id);
  }
}
