import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv'; // import dotenv
import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config(); // load environment variables from .env file
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
