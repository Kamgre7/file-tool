import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../types/types';
import { ITextHandler } from '../textHandler/textHandler';
import { FileInfo } from '../schemas/fileSchema';
import { FindPhraseQuery } from '../schemas/findPhraseSchema';
import {
  UpdatePhraseBody,
  UpdatePhraseQuery,
} from '../schemas/updatePhraseSchema';
import { DeletePhraseQuery } from '../schemas/deletePhraseSchema';

export interface IFileToolsService {
  countPhrases(phrase: string, query: FindPhraseQuery, file: FileInfo): number;
  updatePhrases(
    phrasesInfo: UpdatePhraseBody,
    query: UpdatePhraseQuery,
    file: FileInfo
  ): string;
  deletePhrases(
    phrase: string,
    query: DeletePhraseQuery,
    file: FileInfo
  ): string;
}

@injectable()
export class FileToolsService implements IFileToolsService {
  constructor(
    @inject(TYPES.ITextHandler)
    private readonly textHandler: ITextHandler
  ) {}

  countPhrases(phrase: string, query: FindPhraseQuery, file: FileInfo): number {
    const text = file.buffer.toString();

    return this.textHandler.countPhrases(phrase, query, text);
  }

  updatePhrases(
    phrasesInfo: UpdatePhraseBody,
    query: UpdatePhraseQuery,
    file: FileInfo
  ): string {
    const text = file.buffer.toString();

    return this.textHandler.update(phrasesInfo, query, text);
  }

  deletePhrases(
    phrase: string,
    query: DeletePhraseQuery,
    file: FileInfo
  ): string {
    const text = file.buffer.toString();

    return this.textHandler.delete(phrase, query, text);
  }
}
