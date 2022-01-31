import { UserStatus } from "src/enums/user-status.enum";
import { UserType } from "src/enums/user-type.enum";
import { User } from "src/models/user.model";

export const UserFixture: User = {
  id: 65432,
  name: 'John',
  lastname: 'Doe',
  email: 'admin@microsoft.com',
  type: UserType.CONSUMER,
  dni: '22.222.222-2',
  timezone: 'America/Santiago',
  status: UserStatus.ACTIVE,
  phone: '954081153'
}