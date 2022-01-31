import { BadRequestException, HttpModule, HttpService } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { GatewayDataException } from 'src/exceptions/gateway-data.exception';
import { SharedModule } from 'src/shared/shared.module';
import { GatewayFixture } from 'test/fixtures/gateway.fixture';
import { GatewayService } from './gateway.service';

describe('GatewayService', () => {
  let service: GatewayService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GatewayService],
      imports: [
        HttpModule, 
        ConfigModule,
        SharedModule.forTest()
      ]
    }).compile();

    service = module.get<GatewayService>(GatewayService);
    http = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Get gateways successfully', async () => {
    http.get = jest.fn(() => {
      return new Observable<any>(observer => {
        observer.next({ 
          data: [GatewayFixture, GatewayFixture, GatewayFixture]
        });
      })
    });

    const provider = await service.getGateways('CL');
    expect(provider).toHaveLength(3);
    expect(provider[0]).toBe(GatewayFixture);
  });

  it('Try get gateways without country, gets BadRequestException', async () => {
    const provider = service.getGateways(null);
    await expect(provider).rejects.toBeInstanceOf(BadRequestException);
  });


  it('Get GatewayDataException when cant obtain gateway from database', async () => {
    http.get = jest.fn(() => {
      return new Observable<any>(observer => {
        observer.error({});
      })
    });

    const provider = service.getGateways('CL');
    await expect(provider).rejects.toBeInstanceOf(GatewayDataException);
  });
});
