import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';
import { config } from 'dotenv';
import { NotificationService } from './notification/notification.service';
import { ParserService } from './parser/parser.service';
import { RedisServerService } from './redis/redis.service';

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
export class SharedModule {}
