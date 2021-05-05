import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { Gateway } from 'src/models/gateway.model';
import { Payment } from 'src/models/payment.model';
import { ParserService } from 'src/shared/parser/parser.service';
import { ProcessOrderDto } from 'src/modules/payments/dto/create-payment.dto';
import { PaymentResponse } from 'src/modules/payments/dto/payment-response.dto';
import { Provider } from 'src/models/provider.model';
import { PaymentType } from 'src/enums/payment-type.enum';
import { PaymentStatus } from 'src/enums/payment-status.enum';
import { PaymentOrder } from 'src/models/payment-order.model';


@Injectable()
export class PaymentService {
  private path: string;

  constructor(private rest: HttpService,
    private config: ConfigService, 
    private parser: ParserService) {
    this.path = this.config.get('PAYMENTS_DATA');
  }

  public async create(process: ProcessOrderDto): Promise<PaymentResponse> {
    const gateway = await this.getGateway(process.payment);
    let payment = await this.createPayment(process, gateway);
    const payOrder = await this.txPayment(gateway, payment);
    payment.txp = payOrder.tx;
    payment = await this.updatePayment(payment);
    return {
      payment,
      gatewayInfo: payOrder
    }
  }

  public async createPayment(process: ProcessOrderDto, gateway: Gateway): Promise<Payment> {
    return new Promise<Payment>((resolve, reject) => {
      const payment = new Payment();
      payment.amount = process.total;
      payment.country = process.country;
      payment.order = process.order.id;
      payment.gateway = gateway.id;
      payment.net = process.total / (1 + gateway.tax);
      payment.tax = process.total - payment.net;
      payment.commission = process.total * gateway.commission;
      payment.currency = process.currency;
      payment.tx = process.order.tx;
      payment.provider = (gateway.provider as Provider).id;
      payment.type = PaymentType.CREDIT;
      payment.status = PaymentStatus.CREATED;

      this.rest.post<Payment>(`${this.path}/payments`, payment)
      .subscribe(response => {
        resolve(response.data);
      }, error => {
        console.error(error);
        reject(error);
      });
    });
  }

  public async updatePayment(payment: Payment): Promise<Payment> {
    return new Promise<Payment>((resolve, reject) => {
      this.rest.patch<Payment>(`${this.path}/payments/${payment.id}`, payment)
      .subscribe(response => {
        resolve(response.data);
      }, error => {
        console.error(error);
        reject(error);
      });
    });
  }

  public async getGateway(gateway: number): Promise<Gateway> {
    return new Promise<Gateway>((resolve, reject) => {
      const query = RequestQueryBuilder.create();
      query.setJoin({ field: 'provider' })
      .setFilter({ field: "id", operator: "$eq", value: gateway })
      this.rest.get<Gateway[]>(`${this.path}/gateways?${this.parser.parse(query)}`)
        .subscribe(response => {
          resolve((response.data && response.data.length > 0) ? response.data[0] : null);
        }, error => {
          console.error(error);
          reject(error);
        });
    });
  }

  public async txPayment(gateway: Gateway, payment: Payment): Promise<PaymentOrder> {
    return new Promise<PaymentOrder>((resolve, reject) => {
      const url = `${(gateway.provider as Provider).app}/orders`;
      this.rest.post<PaymentOrder>(url, {
        payment
      })
      .subscribe(response => {
        resolve(response.data);
      }, error => {
        console.error(error);
        reject(error);
      });
    });
  }

  public async getPayment(id: number): Promise<Payment> {
    return new Promise<Payment>((resolve, reject) => {
      const query = RequestQueryBuilder.create();
      query.setJoin({ field: 'gateway' })
      .setJoin({ field: 'gateway.provider' })
      .setFilter({ field: "id", operator: "$eq", value: id })
      this.rest.get<Payment[]>(`${this.path}/payments?${this.parser.parse(query)}`)
        .subscribe(response => {
          resolve((response.data && response.data.length > 0) ? response.data[0] : null);
        }, error => {
          console.error(error);
          reject(error);
        });
    });
  }
}
