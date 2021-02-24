import { Controller, Get, Headers } from '@nestjs/common';
import { Gateway } from 'src/models/gateway.model';
import { GatewayService } from '../../services/gateway/gateway.service';

@Controller('gateways')
export class GatewayController {
  constructor(private gatewayService: GatewayService) {
  }

  @Get()
  public async get(@Headers('Country') country: string): Promise<Gateway[]> {
    return await this.gatewayService.getGateways(country);
  }
}
