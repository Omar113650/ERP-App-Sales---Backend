import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entities';
import { OrderItem } from '../order_item/entities/order_item.entities';
import { Item } from '../../inventory/item/entities/item.entities';
import { Tenant } from '../../tenant/entities/tenant.entities';
import { Branch } from '../../branches/entities/branch.entities';
import { CreateOrderDto } from './dto/create_order.dto';
import { OrderStatus } from '../../../core/enums/order_status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, user: any) {
    const { order_type, items, notes, paid_amount = 0 } = createOrderDto;

    const tenant = await this.tenantRepository.findOne({
      where: { id: user.tenantId },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const branch = await this.branchRepository.findOne({
      where: { id: user.branchId },
    });
    if (!branch) throw new NotFoundException('Branch not found');

    const order = this.orderRepository.create({
      tenant,
      branch,
      order_type,
      status: OrderStatus.CONFIRMED,
      subtotal: 0,
      tax_amount: 0,
      discount_amount: 10,
      total_amount: 0,
      paid_amount,
      notes,
    });
    await this.orderRepository.save(order);

    let subtotal = 0;
    const orderItems: OrderItem[] = [];

    for (const itemDto of items) {
      const item = await this.itemRepository.findOne({
        where: { id: itemDto.itemId },
      });
      if (!item)
        throw new NotFoundException(`Item not found: ${itemDto.itemId}`);

      if (Number(item.current_stock) < Number(itemDto.quantity)) {
        throw new Error(`Insufficient stock for item ${item.name}`);
      }
      const total_price = Number(item.selling_price) * Number(itemDto.quantity);

      subtotal += total_price;

      item.current_stock =
        Number(item.current_stock) - Number(itemDto.quantity);
      await this.itemRepository.save(item);

      const orderItem = this.orderItemRepository.create({
        order,
        item,
        quantity: itemDto.quantity,
        unit_price: item.selling_price,
        total_price,
        notes: itemDto.notes,
      });
      await this.orderItemRepository.save(orderItem);

      orderItems.push(orderItem);
    }
    const taxRate = Number(tenant.taxRate || 0);
    const tax_amount = subtotal * (taxRate / 100);
    const discountRate = 10; 
    const discount_amount = subtotal * (discountRate / 100);
    const total_amount = subtotal + tax_amount - (discount_amount || 0);
    const remaining_amount = total_amount - paid_amount;

    order.subtotal = subtotal;
    order.tax_amount = tax_amount;
    order.total_amount = total_amount;
    await this.orderRepository.save(order);

    return {
      id: order.id,
      order_type: order.order_type,
      status: order.status,
      subtotal: Number(order.subtotal).toFixed(2),
      tax_amount: Number(order.tax_amount ?? 0).toFixed(2),
      discount_amount: Number(order.discount_amount ?? 0).toFixed(2),
      total_amount: Number(order.total_amount).toFixed(2),
      paid_amount: Number(order.paid_amount).toFixed(2),
      remaining_amount: Number(remaining_amount).toFixed(2),
      notes: order.notes,
      tenant: { id: tenant.id, name: tenant.name },
      branch: { id: branch.id, name: branch.name },
      items: orderItems.map((oi: OrderItem) => ({
        id: oi.id,
        quantity: Number(oi.quantity),
        total_price: Number(oi.total_price).toFixed(2),
        notes: oi.notes,
        item: {
          name: oi.item.name,
          selling_price: oi.item.selling_price,
        },
      })),
    };
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    order.status = newStatus;
    await this.orderRepository.save(order);
    return order;
  }
}
