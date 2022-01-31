import { BadRequestException, Controller, Get, Headers, InternalServerErrorException } from '@nestjs/common';
import { Gateway } from 'src/models/gateway.model';
import { GatewayService } from '../../services/gateway/gateway.service';

@Controller('gateways')
export class GatewayController {
  constructor(private gatewayService: GatewayService) {
  }

  @Get()
  public async get(@Headers('Country') country: string): Promise<Gateway[]> {
    try {
      if (!country) {
        throw new BadRequestException('Country is required');
      }
      return await this.gatewayService.getGateways(country);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new BadRequestException(e);
      }
      throw new InternalServerErrorException(e);
    }
  }
}
