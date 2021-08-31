import { Injectable } from '@nestjs/common';
import { TransactionalEmail } from 'src/enums/transactional-email.enum';
import { Order } from 'src/models/order.model';
import { Ticket } from 'src/models/ticket.model';
import { Event } from 'src/models/event.model';
import { EventTicket } from 'src/models/event-ticket.model';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc)
dayjs.extend(timezone)
import 'dayjs/locale/es'
import { Payment } from 'src/models/payment.model';
import { User } from 'src/models/user.model';
import { ReadStreamingDto } from 'src/modules/orders/dto/read-streaming.dto';
import { Consumer } from 'src/models/consumer.model';
import { SqsService } from '@ssut/nestjs-sqs';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import { GeneralException } from 'src/exceptions/general-exception';

config();

@Injectable()
export class NotificationService {

  constructor(private readonly sqsService: SqsService) {
  }

  private getEventDate(event: Event | ReadStreamingDto, user: User): string {
    const sdate = dayjs(event.startDate).tz(user.timezone);
    const edate = dayjs(event.endDate).tz(user.timezone);

    const isSameDay = () => {
      return sdate.date() === edate.date() &&
        sdate.month() === edate.month() &&
        sdate.year() === edate.year();
    }

    const isSameYear = () => {
      return sdate.year() === edate.year();
    }

    const isActualYear = () => {
      return dayjs().year() === edate.year();
    }

    const date = isSameDay()
      ? sdate.format(`DD [de] MMMM [del] YYYY`) 
      : `${sdate.format(isSameYear() ? `DD [de] MMMM` : `DD [de] MMMM [del] YYYY`)} al 
        ${edate.format(isSameYear() ? `DD [de] MMMM` : `DD [de] MMMM [del] YYYY`)}` +
        (isSameYear() && !isActualYear() ? edate.format(' [del] YYYY') : '') ;

    return date;
  }
  
  private getDateFormated(date: string, timezone: string, format: string): string {
    const target = dayjs.tz(date, timezone);
    return target.format(format);
  }

  private getHour(event: Event | ReadStreamingDto, user: User): string {
    const sdate = dayjs(event.startDate).tz(user.timezone);
    const edate = dayjs(event.endDate).tz(user.timezone);
    return `De ${sdate.format(`HH:mm`)} a ${edate.format(`HH:mm`)} horas`;
  }

  public getTicket(ticket: Ticket, user: User): Ticket {
    return {
      ...ticket,
      total: ticket.paid + ticket.commission,
      eventTicket: ticket.eventTicket 
        ? this.getEventTicket(ticket.eventTicket as EventTicket, user)
        : null,
      streamings: ticket.streamings ? ticket.streamings.map(streaming => {
        return {
          ...streaming,
          dateString: this.getEventDate(streaming, user),
          hourString: this.getHour(streaming, user)
        };
      }) : null,
      createdAt: this.getDateFormated(ticket.createdAt.toString(), 
        user.timezone, 'DD-MM-YYYY HH:mm:ss'),
      updatedAt: ticket.updatedAt ? this.getDateFormated(ticket.updatedAt.toString(), 
      user.timezone, 'DD-MM-YYYY HH:mm:ss') : null
    };
  }

  public getOrder(order: Order, user: User): Order {
    return {
      ...order,
      createdAt: this.getDateFormated(order.createdAt.toString(), 
        user.timezone, 'DD-MM-YYYY HH:mm:ss'),
      updatedAt: order.updatedAt ? this.getDateFormated(order.updatedAt.toString(), 
      user.timezone, 'DD-MM-YYYY HH:mm:ss') : null
    };
  }

  public getEventTicket(ticket: EventTicket, user: User): EventTicket {
    return {
      ...ticket,
      startDate: this.getDateFormated(ticket.startDate.toString(), 
        user.timezone, 'DD-MM-YYYY HH:mm:ss'),
      endDate: this.getDateFormated(ticket.endDate.toString(), 
      user.timezone, 'DD-MM-YYYY HH:mm:ss')
    };
  }

  public getPayment(payment: Payment, user: User): Payment {
    return {
      ...payment,
      createdAt: this.getDateFormated(payment.createdAt.toString(), 
        user.timezone, 'DD-MM-YYYY HH:mm:ss'),
      completedAt: payment.completedAt 
        ? this.getDateFormated(payment.completedAt.toString(), 
      user.timezone, 'DD-MM-YYYY HH:mm:ss') : null
    };
  }

  public getEvent(event: Event, user: User): Event {
    return {
      ...event,
      dateString: this.getEventDate(event, user),
      hourString: this.getHour(event, user),
      startDate: this.getDateFormated(event.startDate.toString(), 
        user.timezone, 'DD-MM-YYYY HH:mm:ss'),
      endDate: event.endDate ? this.getDateFormated(event.endDate.toString(), 
      user.timezone, 'DD-MM-YYYY HH:mm:ss') : null
    };
  }
 
  public async sendSinglePaidTicket(email: string, country: string, ticket: Ticket, 
    order: Order, user: User, event: Event, payment: Payment, consumer: Consumer): Promise<boolean> {
    return await this.sendNotification({
      template: TransactionalEmail.SINGLE_PAID_ADQUIRED,
      target: email,
      country: country,
      data: {
        email,
        country,
        user,
        ticket: this.getTicket(ticket, user),
        order: this.getOrder(order, user),
        event: this.getEvent(event, user),
        payment: this.getPayment(payment, user),
        consumer
      },
    });
  }

  public async sendSinglePaidTicketWithStreaming(email: string, country: string, ticket: Ticket, 
    order: Order, user: User, event: Event, payment: Payment, consumer: Consumer): Promise<boolean> {
    return await this.sendNotification({
      template: TransactionalEmail.SINGLE_PAID_ADQUIRED_WITH_TRANSMISION,
      target: email,
      country: country,
      data: {
        email,
        country,
        user,
        ticket: this.getTicket(ticket, user),
        order: this.getOrder(order, user),
        event: this.getEvent(event, user),
        payment: this.getPayment(payment, user),
        consumer
      },
    });
  }

  public async sendMultiplePaidTicket(email: string, country: string, tickets: Ticket[], 
    order: Order, user: User, event: Event, payment: Payment, consumer: Consumer): Promise<boolean> {
    return await this.sendNotification({
      template: TransactionalEmail.MULTIPLE_PAID_ADQUIRED,
      target: email,
      country: country,
      data: {
        email,
        country,
        user,
        tickets: tickets.map(ticket => this.getTicket(ticket, user)),
        order: this.getOrder(order, user),
        event: this.getEvent(event, user),
        payment: this.getPayment(payment, user),
        consumer
      },
    });
  }

  public async sendEmailNotification(email: string, country: string, tickets: Ticket[], 
    order: Order, user: User, event: Event, payment: Payment, consumer: Consumer): Promise<boolean> {
      try {
        if (tickets.length > 1) {
          return await this.sendMultiplePaidTicket(email, country, tickets, order, 
            user, event, payment, consumer);
        } else {
          if (tickets[0].streamings && tickets[0].streamings.length > 0) {
            return await this.sendSinglePaidTicketWithStreaming(email, country, 
              tickets[0], order, user, event, payment, consumer);
          } else {
            return await this.sendSinglePaidTicket(email, country, tickets[0], 
              order, user, event, payment, consumer);
          }
        }
      } catch(e) {
        new GeneralException(e);
        console.error(`Cannot send email notification. MS Notification - Error: ${e}`);
      }
  }

  private async sendNotification(message: any): Promise<boolean> {
    try {
      await this.sqsService.send(process.env.AWS_SQS_QUEUE_NAME_NOTIFICATION, {
        id: uuidv4(),
        body: message,
        groupId: `email-notification-${uuidv4()}`,
        deduplicationId: uuidv4(),
        delaySeconds: 0,
      });
      return true;
    } catch (e) {
      new GeneralException(e);
      return false;
    }
  }
}
