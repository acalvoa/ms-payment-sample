import { Discount } from "./discount.model";

export class AppliedDiscount {
  public code: string;
  public discounts: { id: number, price: number, discount: number }[];
  public discount: number;
  public coupon: Discount;
  public status: number;
}