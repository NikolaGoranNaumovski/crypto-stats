import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*', // Allow only your frontend URL (e.g., React or Vue.js)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'traceparent'], // Allow headers like Content-Type and Authorization
    credentials: true, // Allow credentials like cookies and authorization headers
  });

  await app.listen(3000);
}
void bootstrap();
