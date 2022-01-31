import { HttpModule, HttpService } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SharedModule } from 'src/shared/shared.module';
import { AnswersService } from './answers.service';
import { AnswerFixture } from 'test/fixtures/answer.fixture';
import { CreateAnswerFixture } from 'test/fixtures/create-answer.fixture';
import { Observable } from 'rxjs';
import { AnswerDataException } from 'src/exceptions/answer-data.exception';

describe('AnswersService', () => {
  let service: AnswersService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnswersService],
      imports: [
        HttpModule,
        ConfigModule,
        SharedModule.forTest()
      ]
    }).compile();

    service = module.get<AnswersService>(AnswersService);
    http = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create successfull a question for ticket', async () => {
    http.post = jest.fn(() => new Observable(observer => observer.next({ data: AnswerFixture } as any)));
    
    const answer = await service.createAnswer('g5f4d2s1g4h5', CreateAnswerFixture);
    expect(answer).toEqual(AnswerFixture);
  });

  it('Throws a error creating a answer', async () => {
    http.post = jest.fn(() => new Observable(observer => observer.error(new Error())));
    
    const answer = service.createAnswer('g5f4d2s1g4h5', CreateAnswerFixture);
    await expect(answer).rejects.toBeInstanceOf(AnswerDataException);
  });
});
