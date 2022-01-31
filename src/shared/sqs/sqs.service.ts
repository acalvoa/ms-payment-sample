import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Producer } from 'sqs-producer';

@Injectable()
export class SQSService {
  
  private producer: Producer;

  constructor(private configService: ConfigService) {
    this.producer = Producer.create({
      queueUrl: this.configService.get('AWS_SQS_QUEUE_URL_NOTIFICATION'),
      region: this.configService.get('AWS_REGION')
    });
  }

  public async sendFIFOMessage(message: any): Promise<void> {
    this.producer.send(message);
  }

}