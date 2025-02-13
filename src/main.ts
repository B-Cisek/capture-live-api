import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3000);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix(configService.get<string>('API_PREFIX', 'api'));
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL', ''),
  });

  await app.listen(port, () => {
    console.log(`Application is running on: http://localhost:${port}`);
  });
}
bootstrap();
