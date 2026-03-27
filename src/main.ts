import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const swaggerPath = 'api-docs';
  const config = new DocumentBuilder()
    .setTitle('Yampi Webhook Service')
    .setDescription('API para processar webhooks da plataforma Yampi e gerenciar estoque, clientes e vendas')
    .setVersion('1.0')
    .addTag('Webhook', 'Endpoints para receber webhooks da Yampi')
    .build();

  // Prevent CDN/browser caching of Swagger docs
  app.use(`/${swaggerPath}`, (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document, {
    customSiteTitle: 'Yampi Webhook API',
    customfavIcon: 'https://cdn-icons-png.flaticon.com/512/3687/3687412.png',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 30px 0; }
      .swagger-ui .info .title { font-size: 32px; color: #1a1a1a; font-weight: 600; }
      .swagger-ui .info .description { font-size: 14px; color: #555; line-height: 1.6; }
      .swagger-ui .scheme-container { background: #fafafa; padding: 20px; border-radius: 4px; margin: 20px 0; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; }
    `,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/${swaggerPath}`);
}

bootstrap();
