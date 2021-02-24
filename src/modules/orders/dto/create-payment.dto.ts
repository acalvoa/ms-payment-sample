import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { Order } from "src/models/order.model";
import { UserData } from "src/models/user-data.model";
import { Event } from 'src/models/event.model';

export class ProcessOrderDto {
  @IsNotEmpty()
  @IsObject()
  public event: Event;

  @IsOptional()
  @IsNumber()
  public total: number;

  @IsNotEmpty()
  @IsArray()
  public tickets: any[];

  @IsOptional()
  @IsObject()
  public discount: any;

  @IsNotEmpty()
  @IsObject()
  public userData: UserData;

  @IsOptional()
  @IsNumber()
  public payment: any;

  @IsNotEmpty()
  @IsObject()
  public order: Order;

  @IsNotEmpty()
  @IsString()
  public country: string;

  @IsNotEmpty()
  @IsString()
  public currency: string;
}