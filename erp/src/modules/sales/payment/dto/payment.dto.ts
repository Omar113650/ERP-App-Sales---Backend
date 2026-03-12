// dto/create-payment.dto.ts
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { IsBoolean, IsDate } from 'class-validator';
export class CreatePaymentDto {
  @IsString()
  userId: string;

  // @IsNumber()
  // amount: number;

  @IsEnum(['card', 'cash'])
  paymentMethodType: 'card' | 'cash';

  @IsOptional()
  success_url?: string;

  @IsOptional()
  cancel_url?: string;

  @IsOptional()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsDate()
  paidAt?: string;
}

// dto/update-payment.dto.ts

export class UpdatePaymentDto {
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsDate()
  paidAt?: Date;

  @IsOptional()
  @IsEnum(['pending', 'paid', 'failed'])
  status?: 'pending' | 'paid' | 'failed';
}
