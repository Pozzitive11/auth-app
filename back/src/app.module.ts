import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { TokenModule } from "./token/token.module";
import { Token } from "./users/models/token.model";
import { User } from "./users/models/users.model";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  providers: [],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "front"),
    }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Token],
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
    TokenModule,
  ],
})
export class AppModule {}
