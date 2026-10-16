import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const logger = new Logger();

    const configuredFrontendOrigins = [
      process.env.FRONTEND_URL,
      process.env.NEXT_PUBLIC_FRONTEND_URL,
    ]
      .filter(Boolean)
      .flatMap((origin) => origin!.split(','))
      .map((origin) => origin.trim())
      .filter(Boolean);
    const frontendOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      ...configuredFrontendOrigins,
    ];

    app.enableCors({
      origin: frontendOrigins,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    // Increase payload size limit
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });

    const port = process.env.PORT || 4000;

    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}
bootstrap();