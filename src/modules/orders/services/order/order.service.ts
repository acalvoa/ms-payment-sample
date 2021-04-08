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
import { ParserService } from 'src/shared/parser/parser.service';
import { NotificationService } from 'src/shared/notification/notification.service';
import { AuthService } from 'src/modules/users/services/user.service';

@Injectable()
export class OrderService {

  private platform: string;

  constructor(private rest: HttpService,
    private config: ConfigService,
    private parser: ParserService,
    private redis: RedisServerService,
    private paymentService: PaymentService,
    private ticketService: TicketService,
    private notification: NotificationService,
    private authService: AuthService) {
    this.platform = this.config.get('PLATFORM_DATA');
  }

  public async confirm(id: number, query: any, body: any): 
  Promise<[Payment, ProcessOrderDto]> {
    const payment = await this.paymentService.getPayment(id);
    try {
      const process = await this.getProcessFromMemory(payment.order);
      const { email, dni, timezone } = process.userData;
      const user = await this.authService.getUserOrCreate(email, dni, timezone);
      
      if (!process) {
        throw new NotFoundException('Process not found. Expire or deleted');
      }
      const response = await this.confirmPayment(payment, query, body);
      // If have metadata
      if (response) {
        payment.metadata = response;
      }
      payment.status = PaymentStatus.PAID;
      payment.completedAt = new Date();
      await this.paymentService.updatePayment(payment);
      const tickets = await this.ticketService.generateTickets(process, user);
      const order = await this.updateOrder(process.order.id, { status: OrderStatus.PAID });
      await this.notification.sendEmailNotification(process.userData.email, 
        payment.country, tickets, order, user, process.event, payment);
      return [payment, process];
    } catch (e) {
      console.error(e);
      if (e.data) {
        payment.metadata = e.data;
      }
      payment.status = PaymentStatus.ERROR;
      await this.paymentService.updatePayment(payment);
      await this.updateOrder(payment.order, { status: OrderStatus.FAILED });
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
    body: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const provider = (payment.gateway as Gateway).provider as Provider;
      this.rest.post<any>(`${provider.app}/orders/confirm`, {
        query,
        body
      }).subscribe(response => {
          resolve(response.data);
        }, error => {
          console.error(error);
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
