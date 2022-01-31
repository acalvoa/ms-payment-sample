import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsumerDataException } from 'src/exceptions/consumer-data.exception';
import { Consumer } from 'src/models/consumer.model';

@Injectable()
export class ConsumerService {
  private path: string;

  constructor(
    private configService: ConfigService,
    private rest: HttpService
  ) {
    this.path = this.configService.get('PLATFORM_DATA');
  }

  public async createConsumer(consumer: Consumer): Promise<Consumer> {
    return new Promise<Consumer>((resolve, reject) => {
      this.rest.post<Consumer>(`${this.path}/consumers`, consumer)
      .subscribe(response => {
        const target = response.data;
        resolve(target);
      }, error => {
        reject(new ConsumerDataException(error));
      });
    });
  }
}
