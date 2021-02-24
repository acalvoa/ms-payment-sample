import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'src/shared/shared.module';
import { CommonModule } from '../common/common.module';
import { AuthService } from './services/user.service';

@Module({
  imports: [HttpModule, CommonModule, ConfigModule, SharedModule],
  providers: [AuthService],
  exports: [AuthService]
})
export class UsersModule {}
