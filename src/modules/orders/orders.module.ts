import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'src/shared/shared.module';
import { PaymentsModule } from '../payments/payments.module';
import { TicketsModule } from '../tickets/tickets.module';
import { UsersModule } from '../users/users.module';
import { OrderController } from './controllers/order/order.controller';
import { OrderService } from './services/order/order.service';

@Module({
  imports: [HttpModule, ConfigModule, SharedModule, TicketsModule, 
    PaymentsModule, UsersModule],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrdersModule {}
