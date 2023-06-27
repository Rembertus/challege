if (!process.env.IS_TS_NODE){
  require('module-alias/register');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import helmet from "helmet";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Bankathon')
    .setDescription('Backend - Bankathon Panama 2023')
    .setVersion('0.1')
    .addTag('Backend, Bankathon, TowerBank, Panama, 2023')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);  

  await app.listen(process.env.APP_PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
