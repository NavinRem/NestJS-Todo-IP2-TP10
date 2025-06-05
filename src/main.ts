import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string | string[];

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else {
      const resp = exceptionResponse as Record<string, any>;
      if (Array.isArray(resp.message)) {
        message = resp.message;
      } else if (typeof resp.message === 'string') {
        message = resp.message;
      } else {
        message = 'Unknown error';
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3100);
}
bootstrap();
