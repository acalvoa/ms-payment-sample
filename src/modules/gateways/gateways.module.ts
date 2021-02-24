import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'src/shared/shared.module';
import { GatewayController } from './controllers/gateway/gateway.controller';
import { GatewayService } from './services/gateway/gateway.service';

@Module({
  imports: [HttpModule, SharedModule, ConfigModule],
  controllers: [GatewayController],
  providers: [GatewayService]
})
export class GatewaysModule {}
