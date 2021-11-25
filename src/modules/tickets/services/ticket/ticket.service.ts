import { HttpService, Injectable } from "@nestjs/common";
import { TicketOrigin } from "src/enums/ticket-origin.enum";
import { TicketStatus } from "src/enums/ticket-status.enum";
import { EventTicket } from "src/models/event-ticket.model";
import { Order } from "src/models/order.model";
import { Ticket } from "src/models/ticket.model";
import { Event } from 'src/models/event.model';
import { ConfigService } from "@nestjs/config";
import { CreateTicketDto } from "src/modules/users/dto/create-ticket.dto";
import { ProcessOrderDto } from "src/modules/payments/dto/create-payment.dto";
import * as jwt from 'jsonwebtoken';
import { User } from "src/models/user.model";
import { AnswersService } from "src/modules/questions/services/answer/answers.service";
import { TicketDiscounted } from "src/models/ticket-discounted.model";
import { ReadStreamingDto } from "src/modules/orders/dto/read-streaming.dto";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { plainToClass } from "class-transformer";
import { ParserService } from "src/shared/parser/parser.service";
import { CountryDomain } from "src/enums/country-domain.enum";
import { ConsumerService } from "../consumer/consumer.service";
import { Consumer } from "src/models/consumer.model";
import { CommissionPayer } from "src/enums/commission-payer.enum";

@Injectable()
export class TicketService {

  private platform: string;
  private streaming: string;
  
  constructor(private rest: HttpService,
    private answerService: AnswersService,
    private config: ConfigService,
    private parser: ParserService,
    private consumerService: ConsumerService) {
    this.platform = this.config.get('PLATFORM_DATA');
    this.streaming = this.config.get('STREAMING_MF');
  }

  private isUniqueOrder(tickets: any[]): boolean {
    return tickets.length === 1 && tickets[0].amount === 1;
  }

  public async generateTickets(process: ProcessOrderDto, user: User): Promise<Ticket[]> {
    const tickets = [];
    for (const item of process.tickets) {
      const ticket = process.event.tickets.find(ticket => item.id === ticket.id);
      for (let i = 0; i < item.amount; i++) {
        const result = await this.createByOrder(ticket, process.event,
          user, process.order, TicketOrigin.BOUGHT, 
          this.isUniqueOrder(process.tickets) ? TicketStatus.VALIDATED : TicketStatus.REGISTERED,
          this.isUniqueOrder(process.tickets),
          item.discounted, process);
        result.eventTicket = ticket;

        // Create the consumer
        const consumer = new Consumer({ ...process.userData, ticket: result.id });
        result.consumers = [await this.consumerService.createConsumer(consumer)];

        try {
          result.streamings = await this.getByEventTicketId(ticket.id);
        } catch (e) {
          result.streamings = null;
        }
        
        if (this.isUniqueOrder(process.tickets)) {
          result.token = jwt.sign({ 
            event: process.event.id,
            eventTicket: ticket.id,
            ticket: result.id
          }, process.order.tx);
          result.link = `${CountryDomain[process.country]}/streamings/${result.token}`;
        } else {
          result.token = jwt.sign({ 
            event: process.event.id,
            eventTicket: ticket.id,
            ticket: result.id,
            holder: result.holder
          }, process.order.tx);
          result.link = `${CountryDomain[process.country]}/events/${process.event.id}/register/${result.token}`;
        }
        tickets.push(result);
      }
    }
    if (tickets.length === 1 && process.answers?.length > 0) {
      for (const answer of process.answers) {
        await this.answerService.createAnswer(answer.questionId, {
          answer: answer.answer,
          consumerId: user.id,
          ticketId: tickets[0].id
        });
      }
    } 
    return tickets;
  }

  public getByEventTicketId(eventTicketId: number): Promise<ReadStreamingDto[]> {
    return new Promise((resolve, reject) => {
      const query = RequestQueryBuilder.create()
        .setJoin({ field: 'eventTicket' })
        .setJoin({ field: 'streaming' })
        .setFilter({ field: "eventTicket.id", operator: "$eq", value: eventTicketId });

      this.rest.get(`${this.platform}/streamings/tickets?${this.parser.parse(query)}`)
        .subscribe(response => {
          resolve(response.data.map(streamingTicket => plainToClass(ReadStreamingDto, streamingTicket.streaming)));
        }, error => {
          reject(error);
        });
    });
  }

  public createByOrder(ticket: EventTicket, event: Event, user: User, order: Order, 
    origin: TicketOrigin, status: TicketStatus, owner: boolean, 
    discounted: TicketDiscounted, process: ProcessOrderDto): Promise<Ticket>  {
    return new Promise<Ticket>((resolve, reject) => {
      const commision = ticket.price * ticket.commission;
      const target = new CreateTicketDto();
      target.eventTicket = ticket.id;
      target.event = event.id;
      target.status = status;
      target.order = order.id;
      target.coupon = discounted && process.discount ? process.discount.code : null;
      target.user = owner ? user.id : null;
      target.holder = user.id;
      target.discount = discounted ? discounted.discount : 0
      target.paid = discounted 
        ? discounted.price - commision 
        : ticket.commissionPayer === CommissionPayer.BUYER 
          ? ticket.price 
          : ticket.price - commision;
      target.commission = discounted && discounted.price === 0 ? 0 : commision;
      target.origin = origin;
      this.rest.post<Ticket>(`${this.platform}/tickets`, target)
      .subscribe(response => {
        resolve(response.data);
      }, error => {
        console.error(error);
        reject(error);
      });
    });
  }
}