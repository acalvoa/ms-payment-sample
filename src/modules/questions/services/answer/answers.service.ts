import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Answer } from '../../dtos/answer.dto';
import { CreateAnswerDto } from '../../dtos/create-answer.dto';

@Injectable()
export class AnswersService {
  private path: string;

  constructor(
    private rest: HttpService,
    private configService: ConfigService,
    ) {
    this.path = this.configService.get('QUESTIONS_APP');
  }

  public async createAnswer(questionId: string, answerDto: CreateAnswerDto): Promise<Answer> {
    return new Promise((resolve, reject) => {
      this.rest.post(`${this.path}/questions/${questionId}/answer`, answerDto)
        .subscribe(response => {
          resolve(new Answer(response.data));
        }, error => {
          reject(error);
        });
    });
  }
}
