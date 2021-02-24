import { Body, Controller, Post} from '@nestjs/common';
import { ProcessOrderDto } from 'src/modules/payments/dto/create-payment.dto';
import { PaymentService } from 'src/modules/payments/services/payment/payment.service';
import { PaymentResponse } from '../../dto/payment-response.dto';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {
  }

  @Post()
  public async create(@Body() payment: ProcessOrderDto): Promise<PaymentResponse> {
    return this.paymentService.create(payment);
  }
}
