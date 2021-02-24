import { Body, Controller, Get, Param, Query, Redirect, 
  UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from 'src/enums/payment-status.enum';
import { OrderService } from '../../services/order/order.service';

@Controller('orders')
export class OrderController {

  private eventsMF: string;

  constructor(private config: ConfigService,
    private orderService: OrderService) {
    this.eventsMF = this.config.get('EVENTS_MF');
  }

  @Get(':id/confirm')
  @Redirect()
  public async confirm(@Param('id') id: number, @Query() query: any,
    @Body() body: any): Promise<{ url: string }> {
    const [confirm, process] = await this.orderService.confirm(id, query, body);
    return { url: `${this.eventsMF}/events/${process.event.id}/orders/${process.order.id}` };
  }
}
