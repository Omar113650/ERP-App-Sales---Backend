import {
  Controller,
  Post,
  Body,
  Param,
  Headers,
  Req,
  Query,
  Get,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { Request } from 'express';
import type { Response } from 'express';
interface StripeRawBodyRequest extends Request {
  rawBody: Buffer;
}
@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create/:orderId')
  createPayment(
    @Param('orderId') orderId: string,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentService.createPayment(orderId, dto);
  }

  @Get('success')
  async success(@Query('session_id') sessionId: string) {
    const session = await this.paymentService.verifySession(sessionId);

    if (session.payment_status === 'paid') {
      return `
      <html>
        <body style="text-align:center">
          <h1 style="color:green;"> Payment Successful</h1>
        </body>
      </html>
    `;
    }

    return `
    <html>
      <body style="text-align:center">
        <h1 style="color:red;"> Payment Not Completed</h1>
      </body>
    </html>
  `;
  }

  @Get('cancel')
  cancel(@Res() res: Response) {
    return res.send(`
      <html>
        <body style="text-align:center;font-family:sans-serif">
          <h1 style="color:red;"> Payment Cancelled</h1>
        </body>
      </html>
    `);
  }

  // @Post('webhook')
  // handleWebhook(
  //   @Headers('stripe-signature') sig: string,
  //   @Req() request: StripeRawBodyRequest,
  // ) {
  //   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  //   return this.paymentService.handleStripeWebhook(request.rawBody, sig, endpointSecret);
  // }


}
