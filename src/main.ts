import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle("Airbnb")
    .setDescription("Dự án capstone cuối khóa Backend Nodejs")
    .addBearerAuth()
    .setVersion("1.0")
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("/swagger", app, document)

  await app.listen(8080);
}
bootstrap();
