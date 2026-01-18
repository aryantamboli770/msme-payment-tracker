import { IsString, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { VendorStatus, PaymentTerms } from '../../../common/enums';

export class CreateVendorDto {
  @IsString() @IsNotEmpty() vendorName: string;
  @IsString() @IsNotEmpty() contactPerson: string;
  @IsEmail() @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() phoneNumber: string;
  @IsEnum(PaymentTerms) paymentTerms: PaymentTerms;
  @IsEnum(VendorStatus) status: VendorStatus;
}
