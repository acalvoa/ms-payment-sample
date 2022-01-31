import { HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ClusterRestService } from 'src/modules/common/services/cluster-rest/cluster-rest.service';
import { PaymentService } from 'src/modules/payments/services/payment/payment.service';
import { AnswersService } from 'src/modules/questions/services/answer/answers.service';
import { ConsumerService } from 'src/modules/tickets/services/consumer/consumer.service';
import { TicketService } from 'src/modules/tickets/services/ticket/ticket.service';
import { AuthService } from 'src/modules/users/services/user.service';
import { SharedModule } from 'src/shared/shared.module';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        PaymentService,
        TicketService,
        AuthService,
        AnswersService,
        ConsumerService,
        ClusterRestService
      ],
      imports: [
        SharedModule.forTest(),
        HttpModule,
        ConfigModule
      ]
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
