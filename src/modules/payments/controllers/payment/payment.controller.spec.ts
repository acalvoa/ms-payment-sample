import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { ProcessOrderDto } from '../../../../modules/payments/dto/create-payment.dto';
import { PaymentService } from '../../services/payment/payment.service';
import { HttpModule, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'src/shared/shared.module';
import * as request from 'supertest';
import { ProcessOrderFixture } from 'test/fixtures/process-order.fixture';
import { InternalServerException } from 'src/exceptions/internal.exception';
import { GatewayProviderException } from 'src/exceptions/gateway-provider.exception';

describe('PaymentController', () => {
  let app: INestApplication;
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        PaymentController
      ],
      providers: [
        PaymentService
      ],
      imports: [
        SharedModule.forTest(),
        HttpModule,
        ConfigModule
      ]
    }).compile();
  
    service = module.get<PaymentService>(PaymentService);
  
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('The endpoint works fine, with 200 HTTP code', () => {
    service.create = jest.fn();

    return request(app.getHttpServer())
      .post('/payments')
      .send(ProcessOrderFixture)
      .expect(201);
  });

  it('The endpoint return 400 HTTP code, when payload not validate', () => {
    return request(app.getHttpServer())
      .post('/payments')
      .send(new ProcessOrderDto())
      .expect(400);
  });

  it('The endpoint return 500 HTTP code, when process throws an error', () => {
    service.create = jest.fn(() => {
      throw new InternalServerException();
    });

    return request(app.getHttpServer())
      .post('/payments')
      .send(ProcessOrderFixture)
      .expect(500);
  });

  it('The endpoint return 503 HTTP code, when is payment is not available', () => {
    service.create = jest.fn(() => {
      throw new InternalServerException(new GatewayProviderException());
    });

    return request(app.getHttpServer())
      .post('/payments')
      .send(ProcessOrderFixture)
      .expect(503);
  });
});
