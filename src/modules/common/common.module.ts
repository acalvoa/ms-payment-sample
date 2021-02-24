import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClusterRestService } from './services/cluster-rest/cluster-rest.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [ClusterRestService],
  exports: [ClusterRestService]
})
export class CommonModule {}
