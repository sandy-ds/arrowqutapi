import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {

  const app =
    await NestFactory.create(
      AppModule,
    );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(
    process.env.PORT ?? 3001,
  );

  console.log(
    '=================================',
  );

  console.log(
    '🚀 NestJS Server Started',
  );

  console.log(
    '🌐 http://localhost:3001',
  );

  console.log(
    '=================================',
  );
}

bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3001);
// }
// bootstrap();
