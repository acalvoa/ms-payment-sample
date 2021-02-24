import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ParserService } from './parser/parser.service';
import { RedisServerService } from './redis/redis.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [ParserService, RedisServerService],
  exports: [ParserService, RedisServerService]
})
export class SharedModule {}
