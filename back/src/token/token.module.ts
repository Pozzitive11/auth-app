import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { Token } from "src/users/models/token.model";

@Module({
  providers: [TokenService],
  imports: [
    SequelizeModule.forFeature([Token]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || "SECRET",
      signOptions: {
        expiresIn: "30m",
      },
    }),
  ],
  exports: [TokenService, JwtModule],
})
export class TokenModule {}
