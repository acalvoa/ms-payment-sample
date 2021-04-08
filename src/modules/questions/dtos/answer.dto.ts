export class Answer {
  public id: string;
  public answer: string;
  public userId: number;
  public ticketId: number;

  constructor(data: any) {
    this.id = data.id;
    this.answer = data.answer;
    this.userId = data.userId;
    this.ticketId = data.ticketId;
  }
}