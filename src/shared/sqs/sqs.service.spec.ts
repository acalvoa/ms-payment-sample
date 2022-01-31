import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SQSService } from '../sqs/sqs.service';

describe('SQSService', () => {
  let service: SQSService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SQSService,
        { provide: SQSService, useValue: {}}
      ],
      imports: [
        ConfigModule
      ]
    }).compile();

    service = module.get<SQSService>(SQSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
