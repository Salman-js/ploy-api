import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.useLogger(new Logger());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  // log all requests
  app.use((req: Request, res: Response, next: express.NextFunction) => {
    Logger.log(`${req.method} ${req.url}`);
    next();
  });

  // swagger docs
  const config = new DocumentBuilder()
    .setTitle('Ploy api')
    .setDescription('API for PLOY')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('explorer', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      plugins: [
        () => {
          return {
            wrapComponents: {
              curl: () => () => null,
            },
          };
        },
      ],
    },
  });

  // this will enable CORS for all routes by default (you can disable it per route)
  app.enableCors(
    // TODO: change this to the actual frontend URL
    {
      origin: '*',
      allowedHeaders: '*',
      methods: '*',
    },
  );

  app.useGlobalPipes(
    // this will enable validation for all routes by default (you can disable it per route)
    new ValidationPipe({
      // this will remove all properties that are not in the DTO
      whitelist: true,
      // this will auto convert types (e.g. from string to number)
      transform: true,
      // this will stop at the first error that is encountered
      stopAtFirstError: true,

      // this will remove all properties that are not defined in the DTO
      skipMissingProperties: true,
      exceptionFactory: (errors) => {
        console.log('Validation errors:', errors); // Log the errors to see their structure

        const traverseErrors = (validationErrors) => {
          let detailedErrors = [];

          validationErrors.forEach((error) => {
            if (error.constraints) {
              const constraintKeys = Object.keys(error.constraints);
              detailedErrors.push({
                property: error.property,
                message: constraintKeys.length
                  ? error.constraints[constraintKeys[0]]
                  : `An unknown validation error occurred in property ${error.property}.`,
              });
            }

            if (error.children && error.children.length) {
              detailedErrors = [
                ...detailedErrors,
                ...traverseErrors(error.children),
              ];
            }
          });

          return detailedErrors;
        };

        const result = traverseErrors(errors);

        console.log('Validation result:', result); // Log the result before sending it as a response
        return new BadRequestException(result);
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
