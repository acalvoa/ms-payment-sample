import { Body, Controller, InternalServerErrorException, Post, ServiceUnavailableException} from '@nestjs/common';
import { GatewayProviderException } from 'src/exceptions/gateway-provider.exception';
import { ProcessOrderDto } from 'src/modules/payments/dto/create-payment.dto';
import { PaymentService } from 'src/modules/payments/services/payment/payment.service';
import { PaymentResponse } from '../../dto/payment-response.dto';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {
  }

  @Post()
  public async create(@Body() payment: ProcessOrderDto): Promise<PaymentResponse> {
    try {
      return this.paymentService.create(payment);
    } catch (error) {
      if (error.error instanceof GatewayProviderException) {
        throw new ServiceUnavailableException();
      }
      throw new InternalServerErrorException(error.error);
    }
  }
}
