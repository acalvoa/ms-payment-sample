import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { GatewaysModule } from './modules/gateways/gateways.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    GatewaysModule,
    PaymentsModule,
    SharedModule,
    OrdersModule,
    QuestionsModule,
    RavenModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor(),
    },
  ],
  controllers: [],
})
export class AppModule {}
