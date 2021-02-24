import { Injectable } from '@nestjs/common';
import * as redis from 'redis';
import { promisify } from 'util';

@Injectable()
export class RedisServerService {
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
      console.log('Could not establish a connection with redis. ' + err);
    });
    
    this.redisClient.on('connect', function (err) {
      console.log('Connected to redis successfully');
    });
  }

  public getRedis(): any {
    return this.redisClient;
  }
}