import { AuthTokens } from "src/auth/auth.types";
import { AuthUserDto } from "src/auth/dtos/auth.dto";

export namespace userDto {
  export interface Basic {
    readonly email: string;
    readonly password: string;
  }

  export interface Extended extends Basic {
    readonly nickname: string;
  }

  export type BE = AuthTokens & { user: AuthUserDto };
}
