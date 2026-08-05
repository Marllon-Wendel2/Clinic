import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const dbHost = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace(/\/\/.*@/, '//***@')
    : 'nao configurado';
  logger.log(`Banco de dados configurado: ${dbHost}`);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Servidor rodando na porta ${port}`);
}
bootstrap();
