import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
import { NotificationService } from './notification/notification.service';
import { ParserService } from './parser/parser.service';
import { RedisServerService } from './redis/redis.service';
import { RedisMockService } from './redis/redis.service.mock';
import { SQSService } from './sqs/sqs.service';

config();

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [ParserService, RedisServerService, NotificationService, SQSService],
  exports: [ParserService, RedisServerService, NotificationService, SQSService]
})
export class SharedModule {
  static forTest(redis: RedisMockService = new RedisMockService()): DynamicModule {
    return {
      module: SharedModule,
      imports: [HttpModule, ConfigModule],
      providers: [
        ParserService, 
        { provide: RedisServerService, useValue: redis}, 
        NotificationService,
        { provide: SQSService, useValue: {}}
      ],
      exports: [ParserService, RedisServerService, NotificationService, SQSService]
    }
  }
}
