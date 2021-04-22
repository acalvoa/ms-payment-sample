import { CouponType } from "src/enums/coupon-type.enum";
import { DiscountType } from "src/enums/discount-type.enum";
import { ExpirationType } from "src/enums/expiration-type.enum";
import { Coupon } from "./coupon.model";

export class Discount {
  public id: string;
  public name: string;
  public discountType: DiscountType;
  public couponType: CouponType;
  public expirationType: ExpirationType;
  public eventId: number;
  public eventTickets: number[];
  public amount: number;
  public min: number;
  public max: number;
  public startDate: string;
  public endDate: string;
  public coupon?: Coupon[];
  public soldout: boolean;

  constructor(data?: any) {
    this.id = data.id;
    this.name = data.name;
    this.discountType = data.discountType;
    this.couponType = data.couponType;
    this.expirationType = data.expirationType;
    this.eventId = data.eventId;
    this.eventTickets = data.eventTickets;
    this.amount = data.amount;
    this.min = data.min;
    this.max = data.max;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.soldout = data.soldout;
    this.coupon = data.coupon?.map(coupon => new Coupon(coupon));
  }
}