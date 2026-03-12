import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create_order.dto';
import { Roles } from '../../../core/decorators/roles.decorator';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { OrderStatus } from '../../../core/enums/order_status.enum';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create-order')
  @Roles('tenant_owner', 'super_admin', 'cashier', 'branch_manager')
  @UseGuards(RolesGuard)
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    return this.orderService.createOrder(createOrderDto, req.user);
  }

  @Patch('update-status/:id')
  @Roles('tenant_owner', 'super_admin', 'cashier', 'branch_manager')
  @UseGuards(RolesGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.updateOrderStatus(id, status);
  }
}
