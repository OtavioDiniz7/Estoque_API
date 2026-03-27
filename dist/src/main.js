"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const swaggerPath = 'api-docs';
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Yampi Webhook Service')
        .setDescription('API para processar webhooks da plataforma Yampi e gerenciar estoque, clientes e vendas')
        .setVersion('1.0')
        .addTag('Webhook', 'Endpoints para receber webhooks da Yampi')
        .build();
    app.use(`/${swaggerPath}`, (req, res, next) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
        next();
    });
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(swaggerPath, app, document, {
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
//# sourceMappingURL=main.js.map