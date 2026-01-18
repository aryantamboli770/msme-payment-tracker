import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';
export class PurchaseOrderItemDto {
  @IsString() @IsNotEmpty() description: string;
  @IsNumber() @IsPositive() quantity: number;
  @IsNumber() @IsPositive() unitPrice: number;
}
