import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { FileInfo } from '../schemas/editFileSchema';
import { EditParams } from '../const';
import { TYPES } from '../../types/types';
import { ITextHandler } from '../textHandler/textHandler';

export interface IFileToolsService {
  countPhrases(params: EditParams, file: FileInfo): number;
  updatePhrases(
    params: EditParams,
    file: FileInfo,
    updatedPhrase: string
  ): string;
  deletePhrases(params: EditParams, file: FileInfo): string;
}

@injectable()
export class FileToolsService implements IFileToolsService {
  constructor(
    @inject(TYPES.ITextHandler)
    private readonly textHandler: ITextHandler
  ) {}

  countPhrases(params: EditParams, file: FileInfo): number {
    const text = file.buffer.toString();

    return this.textHandler.countPhrases(text, params);
  }

  updatePhrases(
    params: EditParams,
    file: FileInfo,
    updatedPhrase: string
  ): string {
    const text = file.buffer.toString();

    return this.textHandler.update(text, params, updatedPhrase);
  }

  deletePhrases(params: EditParams, file: FileInfo): string {
    const text = file.buffer.toString();

    return this.textHandler.delete(text, params);
  }
}
