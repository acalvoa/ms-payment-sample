import { HttpModule, HttpService } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { ConsumerDataException } from 'src/exceptions/consumer-data.exception';
import { ConsumerFixture } from 'test/fixtures/consumer.fixture';
import { ConsumerService } from './consumer.service';

describe('ConsumerService', () => {
  let service: ConsumerService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsumerService],
      imports: [
        ConfigModule,
        HttpModule
      ]
    }).compile();

    service = module.get<ConsumerService>(ConsumerService);
    http = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create successfull a consumer for ticket', async () => {
    http.post = jest.fn(() => new Observable(observer => observer.next({ data: ConsumerFixture } as any)));
    
    const consumer = await service.createConsumer(ConsumerFixture);
    expect(consumer).toEqual(ConsumerFixture);
  });

  it('Throws a error creating a consumer', async () => {
    http.post = jest.fn(() => new Observable(observer => observer.error(new Error())));
    
    const consumer = service.createConsumer(ConsumerFixture);
    await expect(consumer).rejects.toBeInstanceOf(ConsumerDataException);
  });
});
