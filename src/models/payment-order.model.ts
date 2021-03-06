export class PaymentOrder {
  public tx: string;
  public amount: number;
  public url: string;
  public method: 'POST' | 'GET' | 'PUT';
  public data?: any;
  public callback: string;
  public cancel: string;
}