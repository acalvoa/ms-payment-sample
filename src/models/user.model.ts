import { UserStatus } from "src/enums/user-status.enum";
import { UserType } from "src/enums/user-type.enum";

export class User {
  public id?: number;
  public name: string;
  public lastname: string;
  public email: string;
  public password?: string;
  public type: UserType;
  public dni: string;
  public timezone: string;
  public status: UserStatus;
  public phone: string;
}