import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { Gateway } from 'src/models/gateway.model';
import { ParserService } from 'src/shared/parser/parser.service';

@Injectable()
export class GatewayService {

  private path: string;

  constructor(private rest: HttpService,
    private config: ConfigService, private parser: ParserService) {
    this.path = this.config.get('PAYMENTS_DATA');
  }

  public getGateways(country: string): Promise<Gateway[]> {
    return new Promise(async (resolve, reject) => {
      const query = RequestQueryBuilder.create();
      query.setJoin({ field: 'provider' })
      .setFilter({ field: "country", operator: "$eq", value: country })
      this.rest.get<Gateway[]>(`${this.path}/gateways?${this.parser.parse(query)}`)
      .subscribe(response => {
        resolve(response.data);
      }, error => {
        reject(error);
      });
    });
  }
}
