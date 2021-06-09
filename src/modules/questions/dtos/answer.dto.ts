export class Answer {
  public id: string;
  public answer: string;
  public consumerId: number;
  public ticketId: number;

  constructor(data: any) {
    this.id = data.id;
    this.answer = data.answer;
    this.consumerId = data.consumerId;
    this.ticketId = data.ticketId;
  }
}