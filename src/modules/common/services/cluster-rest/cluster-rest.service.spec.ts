import { HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ClusterRestService } from './cluster-rest.service';

describe('ClusterRestService', () => {
  let service: ClusterRestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClusterRestService],
      imports: [
        HttpModule,
        ConfigModule
      ]
    }).compile();

    service = module.get<ClusterRestService>(ClusterRestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
