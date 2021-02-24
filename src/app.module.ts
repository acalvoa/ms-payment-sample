import { Module } from '@nestjs/common';
import { GatewaysModule } from './modules/gateways/gateways.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    GatewaysModule,
    PaymentsModule,
    SharedModule,
    OrdersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
