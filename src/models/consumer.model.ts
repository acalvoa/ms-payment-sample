import { Ticket } from "./ticket.model";

export class Consumer {
  public id?: number;
  public name: string;
  public lastname: string;
  public email: string;
  public dni: string;
  public phone: string;
  public ticket?: Ticket | number;
 
  constructor(data: Partial<Consumer> = null) {
    if (data ){
      this.id = data.id;
      this.name = data.name;
      this.lastname = data.lastname;
      this.email = data.email;
      this.dni = data.dni;
      this.phone = data.phone;
      this.ticket = data.ticket;
    }
  }
}