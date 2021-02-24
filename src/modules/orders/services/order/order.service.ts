import { HttpService, Injectable, NotFoundException} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from 'src/enums/payment-status.enum';
import { Gateway } from 'src/models/gateway.model';
import { Order } from 'src/models/order.model';
import { Payment } from 'src/models/payment.model';
import { Provider } from 'src/models/provider.model';
import { ProcessOrderDto } from 'src/modules/payments/dto/create-payment.dto';
import { TicketService } from 'src/modules/tickets/services/ticket.service';
import { RedisServerService } from 'src/shared/redis/redis.service';
import { PaymentService } from 'src/modules/payments/services/payment/payment.service';
import { OrderStatus } from 'src/enums/order-status.enum';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { ParserService } from 'src/shared/parser/parser.service';

@Injectable()
export class OrderService {

  private platform: string;

  constructor(private rest: HttpService,
    private config: ConfigService,
    private parser: ParserService,
    private redis: RedisServerService,
    private paymentService: PaymentService,
    private ticketService: TicketService
    ) {
    this.platform = this.config.get('PLATFORM_DATA');
  }

  public async confirm(id: number, query: any, body: any): 
  Promise<[Payment, ProcessOrderDto]> {
    const payment = await this.paymentService.getPayment(id);
    try {
      const process = await this.getProcessFromMemory(payment.order);
      if (!process) {
        throw new NotFoundException('Process not found. Expire or deleted');
      }
      await this.confirmPayment(payment, query, body);
      payment.status = PaymentStatus.CREATED;
      payment.completedAt = new Date();
      await this.paymentService.updatePayment(payment);
      await this.ticketService.generateTickets(process);
      await this.updateOrder(process.order.id, { status: OrderStatus.PAID });
      return [payment, process];
    } catch (e) {
      payment.status = PaymentStatus.ERROR;
      await this.paymentService.updatePayment(payment);
      await this.updateOrderByTxp(payment.txp, { status: OrderStatus.PAID });
      console.error(e);
      return null;
    }
  }

  private async getProcessFromMemory(order: number): Promise<ProcessOrderDto> {
    try {
      const process = await this.redis.get(order);
      return process ? JSON.parse(process) : null;
    } catch(e) {
      console.error(e);
      return null;
    }
  }
  
  public async confirmPayment(payment: Payment, query: any, 
    body: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const provider = (payment.gateway as Gateway).provider as Provider;
      this.rest.post<any>(`${provider.app}/orders/confirm`, {
        query,
        body
      }).subscribe(response => {
          resolve(response.data);
        }, error => {
          console.log(error);
          reject(error);
        });
    });
  }

  public async updateOrderByTxp(txp: string, payload: Partial<Order>): Promise<Order> {
    return new Promise<Order>((resolve, reject) => {
      const query = RequestQueryBuilder.create();
      query.setFilter({ field: "txp", operator: "$eq", value: txp });
      this.rest.patch<Order>(`${this.platform}/orders?${this.parser.parse(query)}`, payload)
      .subscribe(response => {
          resolve(response.data);
        }, error => {
          console.log(error);
          reject(error);
        });
    });
  }

  private async updateOrder(order: number, payload: Partial<Order>): Promise<Order> {
    return new Promise<Order>((resolve, reject) => {
      this.rest.patch<Order>(`${this.platform}/orders/${order}`, payload)
      .subscribe(response => {
        const target = response.data;
        resolve(target);
      }, error => {
        console.error(error);
        reject(error);
      });
    });
  }
}
