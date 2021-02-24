import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'src/shared/shared.module';
import { CommonModule } from '../common/common.module';
import { UserService } from './services/user.service';

@Module({
  imports: [CommonModule, ConfigModule, SharedModule],
  providers: [UserService],
  exports: [UserService]
})
export class UsersModule {}
