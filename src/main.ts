import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = config.getOrThrow<number>('PORT');
  await app.listen(port, () => {
    console.log(`✓ Recommendations Service listening on port ${port}`);
  });
}

bootstrap();
