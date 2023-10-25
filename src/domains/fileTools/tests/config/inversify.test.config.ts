import 'reflect-metadata';
import { injectable } from 'inversify';
import { IPdfHandler } from '../../../pdfHandler/pdfHandler';
import { UpdatedFiles } from '../../services/fileToolsService';

@injectable()
export class PdfHandlerMock implements IPdfHandler {
  constructor() {}

  create = async (text: string) => Buffer.from(text);

  createMultiple = async (filesInfo: UpdatedFiles[]) => [
    {
      filename: 'test1.pdf',
      content: Buffer.from('test1'),
    },
    {
      filename: 'test2.pdf',
      content: Buffer.from('test2'),
    },
  ];
}
