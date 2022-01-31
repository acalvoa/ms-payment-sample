import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';
import { config } from 'dotenv';
import { NotificationService } from './notification/notification.service';
import { ParserService } from './parser/parser.service';
import { RedisServerService } from './redis/redis.service';
import { RedisMockService } from './redis/redis.service.mock';

config();

@Module({
  imports: [HttpModule, ConfigModule,
    SqsModule.register({
      consumers: [],
      producers: [
        {
          name: process.env.AWS_SQS_QUEUE_NAME_NOTIFICATION,
          queueUrl: process.env.AWS_SQS_QUEUE_URL_NOTIFICATION
        }
      ]
    })
  ],
  providers: [ParserService, RedisServerService, NotificationService],
  exports: [ParserService, RedisServerService, NotificationService]
})
export class SharedModule {
  static forTest(redis: RedisMockService = new RedisMockService()): DynamicModule {
    return {
      module: SharedModule,
      imports: [HttpModule, ConfigModule],
      providers: [
        ParserService, 
        { provide: RedisServerService, useValue: redis}, 
        NotificationService
      ],
      exports: [ParserService, RedisServerService, NotificationService]
    }
  }
}
