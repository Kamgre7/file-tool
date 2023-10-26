import { inject, injectable } from 'inversify';
import { ITextHandler } from '../../textHandler/textHandler';
import { FileInfo } from '../schemas/fileSchema';
import { FindPhraseQuery } from '../schemas/findPhraseSchema';
import {
  UpdatePhraseBody,
  UpdatePhraseQuery,
} from '../schemas/updatePhraseSchema';
import { DeletePhraseQuery } from '../schemas/deletePhraseSchema';
import { IZipHandler } from '../../zipHandler/zipHandler';
import { TYPES } from '../../../ioc/types/types';
import { IPdfHandler } from '../../pdfHandler/pdfHandler';
import path from 'path';

export type CountedPhrases = {
  fileName: string;
  filePhraseCount: number;
};

export type UpdatedFiles = {
  filename: string;
  content: string;
};

export interface IFileToolsService {
  countPhrases(
    phrase: string,
    query: FindPhraseQuery,
    file: FileInfo
  ): CountedPhrases;
  countPhrasesFromZip(
    phrase: string,
    query: FindPhraseQuery,
    file: FileInfo
  ): Promise<CountedPhrases[]>;
  updatePhrases(
    phrasesInfo: UpdatePhraseBody,
    query: UpdatePhraseQuery,
    file: FileInfo
  ): Promise<Buffer>;
  updatePhrasesFromZip(
    phrasesInfo: UpdatePhraseBody,
    query: UpdatePhraseQuery,
    file: FileInfo
  ): Promise<Buffer>;
  deletePhrases(
    phrase: string,
    query: DeletePhraseQuery,
    file: FileInfo
  ): Promise<Buffer>;
  deletePhrasesFromZip(
    phrase: string,
    query: DeletePhraseQuery,
    file: FileInfo
  ): Promise<Buffer>;
  getFilename(filenameWithExt: string): string;
}

@injectable()
export class FileToolsService implements IFileToolsService {
  constructor(
    @inject(TYPES.TextHandlerToken)
    private readonly textHandler: ITextHandler,
    @inject(TYPES.ZipHandlerToken)
    private readonly zipHandler: IZipHandler,
    @inject(TYPES.PdfHandlerToken)
    private readonly pdfHandler: IPdfHandler
  ) {}

  countPhrases(
    phrase: string,
    query: FindPhraseQuery,
    file: FileInfo
  ): CountedPhrases {
    const text = file.buffer.toString();

    const filePhraseCount = this.textHandler.countPhrases(phrase, query, text);

    return {
      fileName: file.originalname,
      filePhraseCount,
    };
  }

  async countPhrasesFromZip(
    phrase: string,
    query: FindPhraseQuery,
    file: FileInfo
  ): Promise<CountedPhrases[]> {
    const filesInfo = await this.zipHandler.getFilesInformation(file.buffer);

    return filesInfo.map((file) => {
      const filePhraseCount = this.textHandler.countPhrases(
        phrase,
        query,
        file.content
      );

      return {
        fileName: file.originalName,
        filePhraseCount,
      };
    });
  }

  async updatePhrases(
    phrasesInfo: UpdatePhraseBody,
    query: UpdatePhraseQuery,
    file: FileInfo
  ): Promise<Buffer> {
    const text = file.buffer.toString();

    const updatedText = this.textHandler.update(phrasesInfo, query, text);

    return await this.pdfHandler.create(updatedText);
  }

  async updatePhrasesFromZip(
    phrasesInfo: UpdatePhraseBody,
    query: UpdatePhraseQuery,
    file: FileInfo
  ): Promise<Buffer> {
    const filesInfo = await this.zipHandler.getFilesInformation(file.buffer);

    const updatedFiles = filesInfo.map((file) => ({
      filename: file.originalName,
      content: this.textHandler.update(phrasesInfo, query, file.content),
    }));

    const pdfFilesData = await this.pdfHandler.createMultiple(updatedFiles);

    const zip = await this.zipHandler.create(pdfFilesData);

    return zip;
  }

  async deletePhrases(
    phrase: string,
    query: DeletePhraseQuery,
    file: FileInfo
  ): Promise<Buffer> {
    const text = file.buffer.toString();

    const updatedText = this.textHandler.delete(phrase, query, text);

    return await this.pdfHandler.create(updatedText);
  }

  async deletePhrasesFromZip(
    phrase: string,
    query: DeletePhraseQuery,
    file: FileInfo
  ): Promise<Buffer> {
    const filesInfo = await this.zipHandler.getFilesInformation(file.buffer);

    const updatedFiles = filesInfo.map((file) => ({
      filename: file.originalName,
      content: this.textHandler.delete(phrase, query, file.content),
    }));

    const pdfFilesData = await this.pdfHandler.createMultiple(updatedFiles);

    const zip = await this.zipHandler.create(pdfFilesData);

    return zip;
  }

  getFilename(fileNameWithExt: string): string {
    return path.parse(fileNameWithExt).name;
  }
}
