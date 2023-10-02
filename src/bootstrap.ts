import express, { Application } from 'express';
import 'reflect-metadata';
import 'express-async-errors';
import { appConfig } from './config/appConfig';
import { errorHandler } from './middlewares/errorHandler';
import { fileToolsRouter } from './domains/fileTools/routes/fileToolsRouter';

export class Bootstrap {
  private readonly app: Application;

  constructor() {
    this.app = express();

    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandler();
    this.startServer();
  }

  private configureMiddleware(): void {
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    this.app.use('/tool', fileToolsRouter);
  }

  private configureErrorHandler(): void {
    this.app.use(errorHandler);
  }

  private startServer(): void {
    this.app.listen(appConfig.port, () => {
      console.log(
        `Application is running on ${appConfig.host}:${appConfig.port}`
      );
    });
  }
}

new Bootstrap();
