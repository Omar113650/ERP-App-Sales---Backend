import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Order } from '../order/entities/order.entities';
import { OrderItem } from '../order_item/entities/order_item.entities';
import { Item } from '../../inventory/item/entities/item.entities';
import { CreateOrderItemDto } from './dto/order_Item.dto';
import { OrderStatus } from '../../../core/enums/order_status.enum';

@Injectable()
export class OrderItemService {
  constructor(
    private readonly dataSource: DataSource,
   @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}


async addItem(dto: CreateOrderItemDto) {
  const { order_id, item_id, quantity, notes } = dto;

  return await this.dataSource.transaction(async (manager) => {
    const order = await manager.findOne(Order, {
      where: { id: order_id },
      relations: ['tenant', 'branch', 'items', 'items.item'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.PENDING)
      throw new BadRequestException(
        'Cannot modify completed or cancelled order',
      );

    const item = await manager.findOne(Item, { where: { id: item_id } });
    if (!item) throw new NotFoundException('Item not found');
    if (Number(item.current_stock) < quantity)
      throw new BadRequestException('Not enough stock');

    const unitPrice = Number(item.selling_price);
    const totalPrice = unitPrice * quantity;

    const orderItem = manager.create(OrderItem, {
      order,
      item,
      quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      notes,
    });
    await manager.save(orderItem);

    item.current_stock = Number(item.current_stock) - quantity;
    await manager.save(item);

    await this.recalculateOrder(order.id, manager);

    const updatedOrder = await manager.findOne(Order, {
      where: { id: order.id },
      relations: ['tenant', 'branch', 'items', 'items.item'],
    });
    if (!updatedOrder) throw new NotFoundException('Order not found');

    return {
      id: updatedOrder.id,
      order_type: updatedOrder.order_type,
      status: updatedOrder.status,
      subtotal: updatedOrder.subtotal,
      tax_amount: updatedOrder.tax_amount,
      discount_amount: updatedOrder.discount_amount,
      total_amount: updatedOrder.total_amount,
      paid_amount: updatedOrder.paid_amount,
      remaining_amount: updatedOrder.total_amount - updatedOrder.paid_amount,
      notes: updatedOrder.notes,
      tenant: {
        id: updatedOrder.tenant.id,
        name: updatedOrder.tenant.name,
      },
      branch: {
        id: updatedOrder.branch.id,
        name: updatedOrder.branch.name,
      },
      items: updatedOrder.items.map((oi) => ({
        id: oi.id,
        quantity: Number(oi.quantity),
        total_price: oi.total_price,
        notes: oi.notes,
        item: {
          name: oi.item.name,
          selling_price: oi.item.selling_price,
        },
      })),
    };
  });
}
async updateItem(id: string, quantity: number) {
  return await this.dataSource.transaction(async (manager) => {
    const orderItem = await manager.findOne(OrderItem, {
      where: { id },
      relations: ['order', 'item', 'order.tenant', 'order.branch', 'order.items', 'order.items.item'],
    });
    if (!orderItem) throw new NotFoundException('Order item not found');
    if (orderItem.order.status !== OrderStatus.PENDING)
      throw new BadRequestException('Cannot modify completed or cancelled order');

    const oldQty = Number(orderItem.quantity);
    const diff = quantity - oldQty;

    if (diff > 0 && Number(orderItem.item.current_stock) < diff)
      throw new BadRequestException('Not enough stock');

    orderItem.quantity = quantity;
    orderItem.total_price = Number(orderItem.unit_price) * quantity;
    orderItem.item.current_stock -= diff;

    await manager.save(orderItem.item);
    await manager.save(orderItem);

    await this.recalculateOrder(orderItem.order.id, manager);

    const updatedOrder = await manager.findOne(Order, {
      where: { id: orderItem.order.id },
      relations: ['tenant', 'branch', 'items', 'items.item'],
    });
    if (!updatedOrder) throw new NotFoundException('Order not found');

    return {
      id: updatedOrder.id,
      order_type: updatedOrder.order_type,
      status: updatedOrder.status,
      subtotal: updatedOrder.subtotal,
      tax_amount: updatedOrder.tax_amount,
      discount_amount: updatedOrder.discount_amount,
      total_amount: updatedOrder.total_amount,
      remaining_amount:(updatedOrder.total_amount - updatedOrder.paid_amount).toString(),
      notes: updatedOrder.notes,
      tenant: {
        id: updatedOrder.tenant.id,
        name: updatedOrder.tenant.name,
      },
      branch: {
        id: updatedOrder.branch.id,
        name: updatedOrder.branch.name,
      },
      items: updatedOrder.items.map((oi) => ({
        id: oi.id,
        quantity: Number(oi.quantity),
        total_price: oi.total_price,
        notes: oi.notes,
        item: {
          name: oi.item.name,
          selling_price: oi.item.selling_price,
        },
      })),
    };
  });
}

async removeItem(id: string) {
  return await this.dataSource.transaction(async (manager) => {
    const orderItem = await manager.findOne(OrderItem, {
      where: { id },
      relations: ['order', 'item', 'order.tenant', 'order.branch', 'order.items', 'order.items.item'],
    });
    if (!orderItem) throw new NotFoundException('Order item not found');
    if (orderItem.order.status !== OrderStatus.PENDING)
      throw new BadRequestException('Cannot modify completed or cancelled order');

    orderItem.item.current_stock += Number(orderItem.quantity);
    await manager.save(orderItem.item);

    await manager.remove(orderItem);
    await this.recalculateOrder(orderItem.order.id, manager);

    const updatedOrder = await manager.findOne(Order, {
      where: { id: orderItem.order.id },
      relations: ['tenant', 'branch', 'items', 'items.item'],
    });
    if (!updatedOrder) throw new NotFoundException('Order not found');

    return {
      id: updatedOrder.id,
      order_type: updatedOrder.order_type,
      status: updatedOrder.status,
      subtotal: updatedOrder.subtotal,
      tax_amount: updatedOrder.tax_amount,
      discount_amount: updatedOrder.discount_amount,
      total_amount: updatedOrder.total_amount,
      paid_amount: updatedOrder.paid_amount,
      remaining_amount:(updatedOrder.total_amount - updatedOrder.paid_amount).toString(),
      notes: updatedOrder.notes,
      tenant: {
        id: updatedOrder.tenant.id,
        name: updatedOrder.tenant.name,
      },
      branch: {
        id: updatedOrder.branch.id,
        name: updatedOrder.branch.name,
      },
      items: updatedOrder.items.map((oi) => ({
        id: oi.id,
        quantity: Number(oi.quantity),
        total_price: oi.total_price,
        notes: oi.notes,
        item: {
          name: oi.item.name,
          selling_price: oi.item.selling_price,
        },
      })),
    };
  });
}

  private async recalculateOrder(order_id: string, manager: any) {
    const order = await manager.findOne(Order, {
      where: { id: order_id },
      relations: ['items', 'tenant'],
    });
    if (!order) throw new NotFoundException('Order not found');

    const subtotal = order.items.reduce(
      (sum, i) => sum + Number(i.total_price),
      0,
    );
    const taxRate = Number(order.tenant?.taxRate || 0);
    const taxAmount = subtotal * (taxRate / 100);

    order.subtotal = subtotal;
    order.tax_amount = taxAmount;
    order.total_amount = subtotal + taxAmount;

    await manager.save(order);
  }
}
