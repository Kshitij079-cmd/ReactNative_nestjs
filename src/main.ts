import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB database');
  });
  await app.listen(3000);
}
bootstrap();
