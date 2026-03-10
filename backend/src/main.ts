import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Enable CORS so the React frontend can call these APIs
  app.enableCors();

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Master CRM API')
    .setDescription('Unified API for Lead Intelligence, Subscription Management, and Master Administration')
    .setVersion('1.0')
    .addTag('Companies', 'Manage client companies')
    .addTag('Subscriptions', 'Plan management and history')
    .addTag('Master Users', 'Administrative users')
    .addTag('Master Roles', 'Granular permissions')
    .addTag('Google Maps Scraper', 'Lead extraction services')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 App running at:  http://localhost:${port}`);
  console.log(`📄 Swagger docs at: http://localhost:${port}/api`);
  console.log(
    `📊 Excel endpoint:  POST http://localhost:${port}/scraper/excel`,
  );
}
bootstrap();
