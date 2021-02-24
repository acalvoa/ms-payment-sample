import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.model';
import { ClusterRestService } from 'src/modules/common/services/cluster-rest/cluster-rest.service';

@Injectable()
export class UserService {
  private path: string;

  constructor(private configService: ConfigService,
    private rest: ClusterRestService) {
      this.path = this.configService.get('AUTHORIZATION_APP');
  }

  public getUserOrCreate(email: string, dni: string, timezone: string = null): Observable<User>{
    return new Observable<User>(observe => {
      this.rest.put<User>(`${this.path}/users`, {
        email,
        dni,
        timezone
      }).subscribe(response => {
        observe.next(response.data);
        observe.complete();
      }, error => {
        observe.error(error);
        observe.complete();
      });
    });
  }
}
