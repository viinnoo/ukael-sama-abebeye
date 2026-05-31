import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe()); 
  
  const config = new DocumentBuilder()
    .setTitle('UKL Sama Abebeye API')
    .setDescription('API documentation for UKL Sama Abebeye project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    customSiteTitle: 'UKL Sama Abebeye API Docs',
  });

  const port = process.env.port || 3000;

  await app.listen(port, '0.0.0.0');
}
bootstrap();