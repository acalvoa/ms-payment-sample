import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsString()
  readonly answer: string;

  @IsNotEmpty()
  @IsNumber()
  readonly consumerId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly ticketId: number;
}