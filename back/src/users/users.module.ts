import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "../auth/auth.module";
import { User } from "./models/users.model";
import { Token } from "./models/token.model";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Token]),
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService, AuthModule],
})
export class UsersModule {}
