import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcryptjs";
import { User } from "src/users/models/users.model";
import { userDto } from "src/users/dto/create-user.dto";
import { TokenService } from "src/token/token.service";
import { AuthUserDto } from "./dtos/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService
  ) {}

  async register(
    userDto: userDto.Basic
  ): Promise<userDto.BE> {
    const candidate = await this.userService.getUserByEmail(
      userDto.email
    );
    if (candidate) {
      throw new HttpException(
        "User with this email already exists",
        HttpStatus.BAD_REQUEST
      );
    }
    const hashPassword = await bcrypt.hash(
      userDto.password,
      5
    );
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateAndSaveTokens(user);
  }

  async login(userDto: userDto.Basic): Promise<userDto.BE> {
    const user = await this.validateUser(userDto);

    return this.generateAndSaveTokens(user);
  }

  async logout(refreshToken: string): Promise<void> {
    return this.tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken: string): Promise<userDto.BE> {
    if (!refreshToken) {
      throw new UnauthorizedException(
        "User is not logged in"
      );
    }

    const tokenData = this.tokenService.validateRefreshToken(
      refreshToken
    );
    const tokenFromDb = await this.tokenService.findToken(
      refreshToken
    );
    if (!tokenData || !tokenFromDb) {
      throw new UnauthorizedException(
        "User is not logged in"
      );
    }

    const user = await this.userService.getUserByEmail(
      tokenData.email
    );
    return this.generateAndSaveTokens(user);
  }

  private async validateUser(
    userDto: userDto.Basic
  ): Promise<User> {
    const user = await this.userService.getUserByEmail(
      userDto.email
    );

    if (!user) {
      throw new UnauthorizedException(
        "User with email does not exist"
      );
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password
    );
    if (!passwordEquals) {
      throw new UnauthorizedException("Incorrect password");
    }

    return user;
  }

  //   private async generateToken(user: User): Promise<string> {
  //     const payload = { email: user.email, id: user.id };
  //     return this.jwtService.sign(payload);
  //   }

  private async generateAndSaveTokens(
    user: User
  ): Promise<userDto.BE> {
    const tokens = this.tokenService.generateTokens(user);
    const authUserDto = new AuthUserDto(user);

    await this.tokenService.saveToken(
      user.id,
      tokens.refreshToken
    );

    return { ...tokens, user: authUserDto };
  }
}
