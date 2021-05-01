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

@Injectable()
export class TicketService {

  private platform: string;
  
  constructor(private rest: HttpService,
    private answerService: AnswersService,
    private config: ConfigService) {
    this.platform = this.config.get('PLATFORM_DATA');
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
          item.discounted);
        result.eventTicket = ticket;
        result.token = jwt.sign({ 
          event: process.event.id,
          eventTicket: ticket.id,
          ticket: result.id
        }, process.order.tx);
        tickets.push(result);
      }
    }
    if (tickets.length === 1 && process.answers?.length > 0) {
      for (const answer of process.answers) {
        await this.answerService.createAnswer(answer.questionId, {
          answer: answer.answer,
          userId: user.id,
          ticketId: tickets[0].id
        });
      }
    } 
    return tickets;
  }

  public createByOrder(ticket: EventTicket, event: Event, user: User, order: Order, 
    origin: TicketOrigin, status: TicketStatus, owner: boolean, 
    discounted: TicketDiscounted): Promise<Ticket>  {
    return new Promise<Ticket>((resolve, reject) => {
      const target = new CreateTicketDto();
      target.eventTicket = ticket.id;
      target.event = event.id;
      target.status = status;
      target.order = order.id;
      target.user = owner ? user.id : null;
      target.holder = user.id;
      target.discount = discounted ? discounted.discount : 0
      target.paid = discounted ? discounted.price : ticket.price;
      target.commission = target.paid * ticket.commission;
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