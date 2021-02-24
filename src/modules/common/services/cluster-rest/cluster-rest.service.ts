/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class ClusterRestService {

  private token: string;

  constructor(private rest: HttpService,
    private configService: ConfigService) {
      this.token = this.configService.get('CLUSTER_SECRET');
  }

  public get<T>(uri: string, options: any = {}): Observable<AxiosResponse<T>> {
    return this.rest.get<T>(uri, this.generateOptions(options))
  }

  public post<T>(uri: string, data: any, options: any = {}): Observable<AxiosResponse<T>> {
    return this.rest.post(uri, data, this.generateOptions(options));
  }

  public patch<T>(uri: string, data: any, options: any = {}): Observable<AxiosResponse<T>> {
    return this.rest.patch(uri, data, this.generateOptions(options));
  }

  public put<T>(uri: string, data: any, options: any = {}): Observable<AxiosResponse<T>> {
    return this.rest.put(uri, data, this.generateOptions(options));
  }

  public delete<T>(uri: string, options: any = {}): Observable<AxiosResponse<T>> {
    return this.rest.patch(uri, this.generateOptions(options));
  }

  public createHeaders(): any {
    return {
      'Authorization': `Bearer ${this.token}`
    };
  }

  private generateOptions(options: any = {}): any {
    return {
      ...options,
      headers: {
        ...this.createHeaders(),
        ...options.headers
      }
    }
  }
}
