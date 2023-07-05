import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";

async function start() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule
  );
  app.enableCors({
    credentials: true,
    origin: process.env.CLIENT_URLS,
  });
  app.use(cookieParser());
  app.setGlobalPrefix("api");

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT, () =>
    console.log(`Server started on port = ${PORT}`)
  );
}

start();
