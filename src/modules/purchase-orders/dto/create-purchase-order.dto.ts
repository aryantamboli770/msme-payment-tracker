import { IsUUID, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseOrderItemDto } from './purchase-order-item.dto';
export class CreatePurchaseOrderDto {
  @IsUUID() vendorId: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => PurchaseOrderItemDto) items: PurchaseOrderItemDto[];
}
