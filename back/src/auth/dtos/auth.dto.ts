import { User } from "src/users/models/users.model";

export class AuthUserDto {
  readonly id: number;
  readonly email: string;

  constructor({ id, email }: User) {
    this.id = id;
    this.email = email;
  }
}
