import { HttpModule, HttpService } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { PaymentStatus } from 'src/enums/payment-status.enum';
import { PaymentType } from 'src/enums/payment-type.enum';
import { GatewayDataException } from 'src/exceptions/gateway-data.exception';
import { GatewayProviderException } from 'src/exceptions/gateway-provider.exception';
import { InternalServerException } from 'src/exceptions/internal.exception';
import { PaymentDataException } from 'src/exceptions/payment-data.exception';
import { Payment } from 'src/models/payment.model';
import { Provider } from 'src/models/provider.model';
import { NotificationService } from 'src/shared/notification/notification.service';
import { RedisMockService } from 'src/shared/redis/redis.service.mock';
import { SharedModule } from 'src/shared/shared.module';
import { GatewayFixture } from 'test/fixtures/gateway.fixture';
import { PaymentOrderFixture } from 'test/fixtures/payment-order.fixture';
import { PaymentFixture } from 'test/fixtures/payment.fixture';
import { ProcessOrderFixture } from 'test/fixtures/process-order.fixture';
import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let http: HttpService;
  let redis: RedisMockService = new RedisMockService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        NotificationService
      ],
      imports: [
        SharedModule.forTest(redis),
        HttpModule,
        ConfigModule
      ]
    }).compile();
    service = module.get<PaymentService>(PaymentService);
    http = module.get<HttpService>(HttpService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Metadata is attached', () => {
    const payment = new Payment();
    service.attachMetadata(payment, ProcessOrderFixture);
    expect(payment.metadata).toBeDefined();
    expect(payment.metadata.event).toBe(ProcessOrderFixture.event);
    expect(payment.metadata.userData).toBe(ProcessOrderFixture.userData);
    expect(payment.metadata.tickets).toBe(ProcessOrderFixture.tickets);
  });

  it('Try to get Gateway', async () => {
    
    http.get = jest.fn(() => {
      return new Observable<any>(observer => {
        observer.next({
          data: [GatewayFixture]
        });
      })
    });

    const response = await service.getGateway(1);
    expect(response).toBe(GatewayFixture);
  });

  it('Gateway be null if not get any object from DB', async () => {
    http.get = jest.fn(() => {
      return new Observable<any>(observer => {
        observer.next({
          data: []
        });
      })
    });

    const response = await service.getGateway(1);
    expect(response).toBeNull();
  });

  it('Get gateway get an Error', async () => {
    http.get = jest.fn(() => {
      return new Observable<any>(observer => {
        observer.error({});
      })
    });

    const provider = service.getGateway(1);
    await expect(provider).rejects.toBeInstanceOf(GatewayDataException);
  });

  it('Try create a payment gateway transaction', async () => {
    
    http.post = jest.fn(() => {
      return new Observable<any>(observer => {
        observer.next({
          data: PaymentOrderFixture
        });
      })
    });

    const response = await service.txPayment(GatewayFixture, PaymentFixture);
    expect(response).toBe(PaymentOrderFixture);
  });

  it('Get an error from gateway provider', async () => {
    http.post = jest.fn(() => {
      return new Observable<any>(observer => {
        observer.error({});
      })
    });
    const provider = service.txPayment(GatewayFixture, PaymentFixture);
    await expect(provider).rejects.toBeInstanceOf(GatewayProviderException);
  });

  it('Try get a payment', async () => {  
    http.get = jest.fn(() => {
      return new Observable<any>(observer => {
        observer.next({
          data: [PaymentFixture]
        });
      })
    });

    const response = await service.getPayment(99999);
    expect(response).toBe(PaymentFixture);
  });

  it('Get an error when get payment', async () => {
    http.get = jest.fn(() => {
      return new Observable<any>(observer => {
        observer.error({});
      })
    });
    const payment = service.getPayment(99999);
    await expect(payment).rejects.toBeInstanceOf(PaymentDataException);
  });

  it('Try update a payment', async () => {  
    http.patch = jest.fn(() => {
      return new Observable<any>(observer => {
        observer.next({
          data: PaymentFixture
        });
      })
    });

    const response = await service.updatePayment(PaymentFixture);
    expect(response).toBe(PaymentFixture);
  });

  it('Get an error when update payment', async () => {
    http.patch = jest.fn(() => {
      return new Observable<any>(observer => {
        observer.error({});
      })
    });
    const payment = service.updatePayment(PaymentFixture);
    await expect(payment).rejects.toBeInstanceOf(PaymentDataException);
  });

  it('Try create a payment', async () => {  
    http.post = jest.fn((url: string, data: any) => {
      return new Observable<any>(observer => {
        observer.next({
          data: {
            id: 4444,
            ...data
          }
        });
      })
    });

    const response = await service.createPayment(ProcessOrderFixture, GatewayFixture);
    expect(response.id).toBe(4444);
    expect(response.amount).toBe(ProcessOrderFixture.total);
    expect(response.country).toBe(ProcessOrderFixture.country);
    expect(response.order).toBe(ProcessOrderFixture.order.id);
    expect(response.gateway).toBe(GatewayFixture.id);
    expect(response.net).toBe(ProcessOrderFixture.total / (1 + GatewayFixture.tax));
    expect(response.tax).toBe(ProcessOrderFixture.total - (ProcessOrderFixture.total / (1 + GatewayFixture.tax)));
    expect(response.commission).toBe(ProcessOrderFixture.total * GatewayFixture.commission);
    expect(response.currency).toBe(ProcessOrderFixture.currency);
    expect(response.tx).toBe(ProcessOrderFixture.order.tx);
    expect(response.provider).toBe((GatewayFixture.provider as Provider).id);
    expect(response.type).toBe(PaymentType.CREDIT);
    expect(response.status).toBe(PaymentStatus.CREATED);
  });

  it('Get an error when create payment', async () => {
    http.post = jest.fn(() => {
      return new Observable<any>(observer => {
        observer.error({});
      })
    });
    const payment = service.createPayment(ProcessOrderFixture, GatewayFixture);
    await expect(payment).rejects.toBeInstanceOf(PaymentDataException);
  });

  it('Create successfull a payment transaction', async () => {
    service.getGateway = jest.fn(() => Promise.resolve(GatewayFixture));
    service.createPayment = jest.fn(() => Promise.resolve(PaymentFixture));
    service.txPayment = jest.fn(() => Promise.resolve(PaymentOrderFixture));
    service.updatePayment = jest.fn((data: Payment) => Promise.resolve(data));
    const response = await service.create(ProcessOrderFixture);
    
    const payment = PaymentFixture;
    payment.txp = PaymentOrderFixture.tx;
    expect(response.payment.txp).toBe(PaymentOrderFixture.tx);
    expect(response.payment).toBe(payment);
    expect(response.gatewayInfo).toBe(PaymentOrderFixture);
  });

  it('Get GatewayDataException when getGateway fails', async () => {
    service.getGateway = jest.fn(() => Promise.reject(new GatewayDataException));
    service.createPayment = jest.fn(() => Promise.resolve(PaymentFixture));
    service.txPayment = jest.fn(() => Promise.resolve(PaymentOrderFixture));
    service.updatePayment = jest.fn((data: Payment) => Promise.resolve(data));

    try {
      const payment = await service.create(ProcessOrderFixture);
    } catch (e) {
      expect(e).toBeInstanceOf(InternalServerException);
      expect(e.error).toBeInstanceOf(GatewayDataException);
    }
  });

  it('Get PaymentDataException when getGateway fails', async () => {
    service.getGateway = jest.fn(() => Promise.resolve(GatewayFixture));
    service.createPayment = jest.fn(() => Promise.reject(new PaymentDataException()));
    service.txPayment = jest.fn(() => Promise.resolve(PaymentOrderFixture));
    service.updatePayment = jest.fn((data: Payment) => Promise.resolve(data));

    try {
      const payment = await service.create(ProcessOrderFixture);
    } catch (e) {
      expect(e).toBeInstanceOf(InternalServerException);
      expect(e.error).toBeInstanceOf(PaymentDataException);
    }
  });

  it('Get GatewayProviderException when getGateway fails', async () => {
    service.getGateway = jest.fn(() => Promise.resolve(GatewayFixture));
    service.createPayment = jest.fn(() => Promise.resolve(PaymentFixture));
    service.txPayment = jest.fn(() => Promise.reject(new GatewayProviderException()));
    service.updatePayment = jest.fn((data: Payment) => Promise.resolve(data));

    try {
      const payment = await service.create(ProcessOrderFixture);
    } catch (e) {
      expect(e).toBeInstanceOf(InternalServerException);
      expect(e.error).toBeInstanceOf(GatewayProviderException);
    }
  });

  it('Get PaymentDataException when getGateway fails', async () => {
    service.getGateway = jest.fn(() => Promise.resolve(GatewayFixture));
    service.createPayment = jest.fn(() => Promise.resolve(PaymentFixture));
    service.txPayment = jest.fn(() => Promise.resolve(PaymentOrderFixture));
    service.updatePayment = jest.fn((data: Payment) => Promise.reject(new PaymentDataException()));

    try {
      const payment = await service.create(ProcessOrderFixture);
    } catch (e) {
      expect(e).toBeInstanceOf(InternalServerException);
      expect(e.error).toBeInstanceOf(PaymentDataException);
    }
  });
});