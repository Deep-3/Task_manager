import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { requireEnv } from './utils/env';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('Task Manager API built with NestJS and TypeORM')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(requireEnv('PORT') ?? 3000);
}
bootstrap().catch((e) => console.log(e));
