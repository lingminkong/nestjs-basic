import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('listening on port 3333');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3333);
}
bootstrap();
