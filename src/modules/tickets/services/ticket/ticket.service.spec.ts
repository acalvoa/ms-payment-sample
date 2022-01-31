import { HttpModule, HttpService } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AnswersService } from 'src/modules/questions/services/answer/answers.service';
import { ParserService } from 'src/shared/parser/parser.service';
import { ConsumerService } from '../consumer/consumer.service';
import { TicketService } from './Ticket.service';

describe('TicketService', () => {
  let service: TicketService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        AnswersService,
        ParserService,
        ConsumerService
      ],
      imports: [
        ConfigModule,
        HttpModule
      ]
    }).compile();

    service = module.get<TicketService>(TicketService);
    http = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
