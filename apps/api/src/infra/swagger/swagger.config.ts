import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dtos from '@repo/domain/dtos/index';

export class SwaggerSetup {
  static execute(app: INestApplication) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Customer API')
      .setDescription('This is the OpenAPI specifications for the customer api')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const extraModels = Object.values(dtos);
    const document = SwaggerModule.createDocument(app, swaggerConfig, {
      extraModels,
    });

    SwaggerModule.setup('api/docs', app, document);
  }
}
