import { IsDefined, IsEnum, IsNumber, IsOptional } from "class-validator";
import { PaymentType } from "src/enums/payment-type.enum";

export class UpdateGatewayDto {
  @IsOptional()
  @IsNumber()
  public id: number;

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