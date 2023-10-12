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
import { IZipHandler } from '../../zipHandler/zipHandler';

export type CountedPhrases = {
  fileName: string;
  foundPhrases: number;
};

export interface IFileToolsService {
  countPhrases(phrase: string, query: FindPhraseQuery, file: FileInfo): number;
  countPhrasesFromZip(
    phrase: string,
    query: FindPhraseQuery,
    file: FileInfo
  ): Promise<CountedPhrases[]>;
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
    private readonly textHandler: ITextHandler,
    @inject(TYPES.IZipHandler)
    private readonly zipHandler: IZipHandler
  ) {}

  countPhrases(phrase: string, query: FindPhraseQuery, file: FileInfo): number {
    const text = file.buffer.toString();

    return this.textHandler.countPhrases(phrase, query, text);
  }

  async countPhrasesFromZip(
    phrase: string,
    query: FindPhraseQuery,
    file: FileInfo
  ): Promise<CountedPhrases[]> {
    const filesInfo = await this.zipHandler.getFilesInformation(file.buffer);

    return filesInfo.map((file) => {
      const filePhraseCounter = this.textHandler.countPhrases(
        phrase,
        query,
        file.content
      );

      return {
        fileName: file.originalName,
        foundPhrases: filePhraseCounter,
      };
    });
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
