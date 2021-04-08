import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QuestionsModule } from '../questions/questions.module';
import { UsersModule } from '../users/users.module';
import { TicketService } from './services/ticket.service';

@Module({
  imports: [UsersModule, HttpModule, ConfigModule, QuestionsModule],
  providers: [TicketService],
  exports: [TicketService]
})
export class TicketsModule {}
