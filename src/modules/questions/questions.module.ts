import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnswersService } from './services/answer/answers.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule
  ],
  providers: [AnswersService],
  exports: [AnswersService]
})
export class QuestionsModule { }
