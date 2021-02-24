import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.model';
import { ClusterRestService } from 'src/modules/common/services/cluster-rest/cluster-rest.service';

@Injectable()
export class AuthService {
  private path: string;

  constructor(private configService: ConfigService,
    private rest: ClusterRestService) {
      this.path = this.configService.get('AUTHORIZATION_APP');
  }

  public getUserOrCreate(email: string, dni: string, timezone: string = null): Promise<User>{
    return new Promise<User>((resolve, reject) => {
      this.rest.put<User>(`${this.path}/users`, {
        email,
        dni,
        timezone
      }).subscribe(response => {
        resolve(response.data);
      }, error => {
        console.error(error);
        reject(error);
      });
    });
  }
}
