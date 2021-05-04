import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'src/shared/shared.module';
import { QuestionsModule } from '../questions/questions.module';
import { UsersModule } from '../users/users.module';
import { TicketService } from './services/ticket.service';

@Module({
  imports: [UsersModule, HttpModule, ConfigModule, SharedModule, 
    QuestionsModule],
  providers: [TicketService],
  exports: [TicketService]
})
export class TicketsModule {}
