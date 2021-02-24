import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { TicketService } from './services/ticket.service';

@Module({
  imports: [UsersModule, HttpModule, ConfigModule],
  providers: [TicketService],
  exports: [TicketService]
})
export class TicketsModule {}
