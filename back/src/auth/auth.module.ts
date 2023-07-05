import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { TokenModule } from "src/token/token.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [forwardRef(() => UsersModule), TokenModule],
  exports: [AuthService, TokenModule],
})
export class AuthModule {}
