import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await bootstrapSwagger(app);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(3000);
  console.log('================================');
  console.log('Project initialized');
  console.log('================================');
}

void bootstrap();

async function bootstrapSwagger(app: INestApplication): Promise<void> {
  const config = new DocumentBuilder()
    .setTitle('Inventory')
    .setDescription('Por Osmar André Bassi.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira seu token JWT',
        in: 'header',
      },
      'JWT'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Inventory',
    swaggerOptions: {
      docExpansion: 'none',
      tagsSorter: 'alpha',
    },
  };

  SwaggerModule.setup('api', app, document, customOptions);

  SwaggerModule.setup('api', app, document);
}
