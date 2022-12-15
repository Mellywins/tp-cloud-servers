import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // get the port from the environment variable PORT
  // if it is not set, then use port 3000
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
