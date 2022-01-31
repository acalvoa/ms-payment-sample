import { HttpModule, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SharedModule } from 'src/shared/shared.module';
import { GatewayService } from '../../services/gateway/gateway.service';
import { GatewayController } from './gateway.controller';
import * as request from 'supertest';
import { ProcessOrderFixture } from 'test/fixtures/process-order.fixture';
import { GatewayDataException } from 'src/exceptions/gateway-data.exception';

describe('GatewayController', () => {
  let app: INestApplication;
  let controller: GatewayController;
  let service: GatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [GatewayService],
      imports: [
        HttpModule,
        ConfigModule,
        SharedModule.forTest()
      ]
    }).compile();

    controller = module.get<GatewayController>(GatewayController);
    service = module.get<GatewayService>(GatewayService);

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('The endpoint works fine, with 200 HTTP code', () => {
    service.getGateways = jest.fn();

    return request(app.getHttpServer())
      .get('/gateways')
      .set('Country', 'CL')
      .send(ProcessOrderFixture)
      .expect(200);
  });

  it('The endpoint works fine, with 500 HTTP code', () => {
    service.getGateways = jest.fn(() => {
      throw new GatewayDataException();
    });

    return request(app.getHttpServer())
      .get('/gateways')
      .set('Country', 'CL')
      .send(ProcessOrderFixture)
      .expect(500);
  });

  it('The endpoint works fine, with 400 HTTP code', () => {
    return request(app.getHttpServer())
      .get('/gateways')
      .send(ProcessOrderFixture)
      .expect(400);
  });
});
