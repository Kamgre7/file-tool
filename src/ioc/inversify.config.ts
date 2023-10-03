import { Container } from 'inversify';
import {
  FileToolsController,
  IFileToolsController,
} from '../domains/fileTools/controllers/fileToolsController';
import { TYPES } from '../domains/types/types';
import {
  FileToolsService,
  IFileToolsService,
} from '../domains/fileTools/services/fileToolsService';
import {
  TextHandler,
  ITextHandler,
} from '../domains/fileTools/textHandler/textHandler';

export const container = new Container();

container
  .bind<IFileToolsController>(TYPES.IFileToolsController)
  .to(FileToolsController);

container.bind<IFileToolsService>(TYPES.IFileToolsService).to(FileToolsService);

container.bind<ITextHandler>(TYPES.ITextHandler).to(TextHandler);
