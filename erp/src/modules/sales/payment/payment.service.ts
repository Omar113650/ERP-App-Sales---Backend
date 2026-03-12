// استخدام القيم الصحيحة من enum
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.schema';
import { Order } from '../order/entities/order.entities';
import { CreatePaymentDto } from './dto/payment.dto';
import * as dotenv from 'dotenv';
import { PaymentStatus } from '../../../core/enums/payment_status.enum'; // PENDING, PAID, FAILED
import { PaymentMethod } from '../../../core/enums/payment_method.enum'; // CASH, CARD
import { OrderStatus } from '../../../core/enums/order_status.enum'; // PENDING, COMPLETED, CANCELLED

dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  async createPayment(orderId: string, dto: CreatePaymentDto) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'branch', 'tenant'],
    });
    if (!order) throw new NotFoundException('Order not found');

    if (dto.paymentMethodType === 'cash') {
      const payment = this.paymentRepo.create({
        order: { id: order.id } as Order,
        amount: order.total_amount,
        payment_method: PaymentMethod.CASH,
        status:
          order.total_amount >= order.total_amount
            ? PaymentStatus.PAID
            : PaymentStatus.PENDING,
        paid_at: order.total_amount >= order.total_amount ? new Date() : null,
      });
      await this.paymentRepo.save(payment);

      if (payment.status === PaymentStatus.PAID) {
        order.paid_amount += payment.amount;
        order.status =
          order.paid_amount >= order.total_amount
            ? OrderStatus.COMPLETED
            : order.status;
        await this.orderRepo.save(order);
      }

      return payment;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'egp',
            unit_amount: Math.round(order.total_amount * 100),
            product_data: { name: `Order ${order.id} payment` },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url:
        dto.success_url ||
        `https://example.com/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: dto.cancel_url || 'https://example.com/cancel',
      client_reference_id: order.id,
      metadata: dto.metadata || {},
    });

    const payment = this.paymentRepo.create({
      order: { id: order.id } as Order,
      amount: order.total_amount,
      payment_method: PaymentMethod.CARD,
      status: PaymentStatus.PAID,
      session_id: session.id,
      metadata: dto.metadata || {},
      paid_at: new Date(new Date().toISOString().split('T')[0]),
    });

    await this.paymentRepo.save(payment);
    return {
      payment,
      url: session.url,
      sessionId: session.id,
    };
  }

  async verifySession(sessionId: string) {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return session;
  }

  // async handleStripeWebhook(payload: any, sig: string, endpointSecret: string) {
  //   let event;
  //   try {
  //     event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  //   } catch (err) {
  //     console.log(`Webhook Error: ${err.message}`);
  //     return;
  //   }

  //   if (event.type === 'checkout.session.completed') {
  //     const sessionId = event.data.object.id;
  //     const payment = await this.paymentRepo.findOne({
  //       where: { session_id: sessionId },
  //       relations: ['order'],
  //     });
  //     if (!payment) return;

  //     payment.status = PaymentStatus.PAID; // <-- هنا
  //     payment.paid_at = new Date();
  //     await this.paymentRepo.save(payment);

  //     const order = payment.order;
  //     order.paid_amount += payment.amount;
  //     order.status =
  //       order.paid_amount >= order.total_amount ? OrderStatus.COMPLETED : order.status; // <-- هنا
  //     await this.orderRepo.save(order);
  //   }
  // }
}
