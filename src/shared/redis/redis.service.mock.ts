import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import * as redis from 'redis-mock';

@Injectable()
export class RedisMockService {
  private redisClient: any;
  public keys: (key: string | number) => any;
  public set: (key: string | number, value: any, command?: string, time?: number) => void;
  public get: (key: string | number) => any;

  constructor() {
    this.redisClient = redis.createClient({
      host: process.env.APP_REDIS_HOST,
      port: process.env.APP_REDIS_PORT,
      db: process.env.APP_REDIS_DB
    });

    this.keys = promisify(this.redisClient.keys).bind(this.redisClient);
    this.set = promisify(this.redisClient.set).bind(this.redisClient);
    this.get = promisify(this.redisClient.get).bind(this.redisClient);

    this.redisClient.on('error', function (err) {
    });
    
    this.redisClient.on('connect', function (err) {
    });
  }

  public getRedis(): any {
    return this.redisClient;
  }
}