export class Coupon {
  public code: string;
  public stock: number;
  public eventId: number;
  public used: number;

  constructor(data?: any) {
    this.code = data.code;
    this.stock = data.stock;
    this.eventId = data.eventId;
    this.used = data.used;
  }
}