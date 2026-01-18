import { IsEnum } from 'class-validator';
import { PurchaseOrderStatus } from '../../../common/enums';
export class UpdatePoStatusDto {
  @IsEnum(PurchaseOrderStatus) status: PurchaseOrderStatus;
}
