import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from './notification/notification.service';
import { ParserService } from './parser/parser.service';
import { RedisServerService } from './redis/redis.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [ParserService, RedisServerService, NotificationService],
  exports: [ParserService, RedisServerService, NotificationService]
})
export class SharedModule {}
