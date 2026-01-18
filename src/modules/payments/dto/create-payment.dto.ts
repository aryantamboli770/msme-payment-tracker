import { IsUUID, IsDateString, IsNumber, IsPositive, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '../../../common/enums';
export class CreatePaymentDto {
  @IsUUID() purchaseOrderId: string;
  @IsDateString() paymentDate: string;
  @IsNumber() @IsPositive() amountPaid: number;
  @IsEnum(PaymentMethod) paymentMethod: PaymentMethod;
  @IsOptional() @IsString() notes?: string;
}
