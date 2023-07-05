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
      host:
        "ec2-63-35-80-199.eu-west-1.compute.amazonaws.com",
      port: 5432,
      username: "njhjwmkqibepyx",
      password:
        "5d65d3c915730a2f69777fef2bbd47b63ef2f327060a193d9a32d0e1c600a9d6",
      database: "d8b9kbo6uv2o5e",
      models: [User, Token],
      autoLoadModels: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }),
    UsersModule,
    AuthModule,
    TokenModule,
  ],
})
export class AppModule {}
