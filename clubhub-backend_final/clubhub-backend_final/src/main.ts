/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core'; //Creates the application instance
import { AppModule } from './app.module'; //The root module that organizes your application
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // The function that initializes and starts the application.
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve the uploads folder as a static directory
  app.useStaticAssets(join(__dirname, '..', 'uploads/profile-images'), {
    prefix: '/uploads/profile-images', // Static path for accessing files, e.g., '/uploads'
  });

  // Enable CORS to allow cross-origin requests from the frontend
  app.enableCors({
    origin: 'http://localhost:3000',  // Allow requests from this origin
    methods: 'GET,POST,PUT,DELETE,OPTIONS',  // Allowed methods
    credentials: true,  // Allow cookies or other credentials
  });
  
  // Add validation pipes for request validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // Disable whitelist for now to see if fields are being stripped
      transform: true,  // Automatically transform payloads to DTO types
      forbidNonWhitelisted: false,  // Ensure no extra fields cause the request to fail
    }),
  );
  
  
  // Start the server on port 4000
  await app.listen(4000);
}
bootstrap();
