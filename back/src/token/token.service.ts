import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import { AuthTokens } from "src/auth/auth.types";
import { Token } from "src/users/models/token.model";
import { User } from "src/users/models/users.model";
import { CreateTokenDto } from "./dtos/create-token.dto";

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token)
    private tokenRepository: typeof Token,
    private jwtService: JwtService
  ) {}

  async saveToken(
    userId: number,
    refreshToken: string
  ): Promise<Token> {
    const tokenData = await this.tokenRepository.findOne({
      where: { userId },
    });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await this.tokenRepository.create({
      userId,
      refreshToken,
    });
    return token;
  }

  generateTokens(user: User): AuthTokens {
    const payload = {
      email: user.email,
      id: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: "15d",
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    };
  }

  async removeToken(refreshToken: string): Promise<void> {
    await this.tokenRepository.destroy({
      where: { refreshToken },
    });
  }

  async findToken(refreshToken: string): Promise<Token> {
    return await this.tokenRepository.findOne({
      where: { refreshToken },
    });
  }

  validateRefreshToken(token: string): CreateTokenDto {
    try {
      const userData = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      return userData;
    } catch (error) {
      return null;
    }
  }
}
