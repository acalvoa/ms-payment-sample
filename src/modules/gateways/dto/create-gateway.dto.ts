import { IsDefined, IsEnum, IsNumber } from "class-validator";
import { PaymentType } from "src/enums/payment-type.enum";

export class CreateGatewayDto {
  @IsDefined()
  @IsNumber()
  public provider: number;

  @IsDefined()
  @IsEnum(PaymentType)
  public type: PaymentType;

  @IsDefined()
  @IsNumber()
  public country: number;

  @IsDefined()
  @IsNumber()
  public commission: number;

  @IsDefined()
  @IsNumber()
  public tax: number;
}