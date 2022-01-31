import { HttpModule, HttpService } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { UserDataException } from 'src/exceptions/user-data.exception';
import { ClusterRestService } from 'src/modules/common/services/cluster-rest/cluster-rest.service';
import { NotificationService } from 'src/shared/notification/notification.service';
import { RedisMockService } from 'src/shared/redis/redis.service.mock';
import { SharedModule } from 'src/shared/shared.module';
import { UserFixture } from 'test/fixtures/user.fixture';
import { AuthService } from './user.service';

describe('UserService', () => {
  let service: AuthService;
  let http: HttpService;
  let redis: RedisMockService = new RedisMockService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ClusterRestService,
        NotificationService
      ],
      imports: [
        SharedModule.forTest(redis),
        HttpModule,
        ConfigModule
      ]
    }).compile();
    service = module.get<AuthService>(AuthService);
    http = module.get<HttpService>(HttpService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Get or create user', async () => {
    http.put = jest.fn(() => new Observable(observer => observer.next({ data: UserFixture } as any)));
    
    const user = await service.getUserOrCreate(UserFixture.email, UserFixture.dni, 
      UserFixture.phone, UserFixture.name, UserFixture.lastname, UserFixture.timezone);
    expect(user).toEqual(UserFixture);
  });

  it('Throws a error getting a user', async () => {
    http.put = jest.fn(() => new Observable(observer => observer.error(new Error())));
    
    const user = service.getUserOrCreate(UserFixture.email, UserFixture.dni, 
      UserFixture.phone, UserFixture.name, UserFixture.lastname, UserFixture.timezone);

    await expect(user).rejects.toBeInstanceOf(UserDataException);
  });
});