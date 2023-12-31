import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { IFileToolsService } from '../services/fileToolsService';
import { FindPhraseReq } from '../schemas/findPhraseSchema';
import { ParsedRequest } from '../../../apiTypes';
import { UpdatePhraseReq } from '../schemas/updatePhraseSchema';
import { FileSchema } from '../schemas/fileSchema';
import { DeletePhraseReq } from '../schemas/deletePhraseSchema';
import { TYPES } from '../../../ioc/types/types';

export interface IFileToolsController {
  findPhrase(req: ParsedRequest<FindPhraseReq>, res: Response): Promise<void>;
  findPhraseFromZip(
    req: ParsedRequest<FindPhraseReq>,
    res: Response
  ): Promise<void>;
  updatePhrase(
    req: ParsedRequest<UpdatePhraseReq>,
    res: Response
  ): Promise<void>;
  updatePhraseFromZip(
    req: ParsedRequest<UpdatePhraseReq>,
    res: Response
  ): Promise<void>;
  deletePhrase(
    req: ParsedRequest<DeletePhraseReq>,
    res: Response
  ): Promise<void>;
  deletePhraseFromZip(
    req: ParsedRequest<DeletePhraseReq>,
    res: Response
  ): Promise<void>;
}

@injectable()
export class FileToolsController implements IFileToolsController {
  constructor(
    @inject(TYPES.FileToolsServiceToken)
    private readonly fileToolsService: IFileToolsService
  ) {}

  findPhrase = async (
    req: ParsedRequest<FindPhraseReq>,
    res: Response
  ): Promise<void> => {
    const { query, body } = req;
    const file = FileSchema.parse(req.file);

    const foundPhrasesCount = this.fileToolsService.countPhrases(
      body.phrase,
      query,
      file
    );

    res.status(200).json({
      foundPhrasesCount,
    });
  };

  findPhraseFromZip = async (
    req: ParsedRequest<FindPhraseReq>,
    res: Response
  ): Promise<void> => {
    const { query, body } = req;
    const file = FileSchema.parse(req.file);

    const foundPhrasesCount = await this.fileToolsService.countPhrasesFromZip(
      body.phrase,
      query,
      file
    );

    res.status(200).json({
      foundPhrasesCount,
    });
  };

  updatePhrase = async (
    req: ParsedRequest<UpdatePhraseReq>,
    res: Response
  ): Promise<void> => {
    const { body, query } = req;
    const file = FileSchema.parse(req.file);

    const pdf = await this.fileToolsService.updatePhrases(body, query, file);
    const filename = this.fileToolsService.getFilename(file.originalname);

    res
      .status(200)
      .type('pdf')
      .setHeader('Content-Disposition', `inline; filename=${filename}.pdf`)
      .send(pdf);
  };

  updatePhraseFromZip = async (
    req: ParsedRequest<UpdatePhraseReq>,
    res: Response
  ): Promise<void> => {
    const { body, query } = req;
    const file = FileSchema.parse(req.file);

    const zip = await this.fileToolsService.updatePhrasesFromZip(
      body,
      query,
      file
    );

    res
      .status(200)
      .type('zip')
      .setHeader(
        'Content-Disposition',
        `attachment; filename=${file.originalname}`
      )
      .send(zip);
  };

  deletePhrase = async (
    req: ParsedRequest<DeletePhraseReq>,
    res: Response
  ): Promise<void> => {
    const { body, query } = req;
    const file = FileSchema.parse(req.file);

    const pdf = await this.fileToolsService.deletePhrases(
      body.phrase,
      query,
      file
    );
    const pdfName = this.fileToolsService.getFilename(file.originalname);

    res
      .status(200)
      .type('pdf')
      .setHeader('Content-Disposition', `inline; filename=${pdfName}.pdf`)
      .send(pdf);
  };

  deletePhraseFromZip = async (
    req: ParsedRequest<DeletePhraseReq>,
    res: Response
  ): Promise<void> => {
    const { body, query } = req;
    const file = FileSchema.parse(req.file);

    const zip = await this.fileToolsService.deletePhrasesFromZip(
      body.phrase,
      query,
      file
    );

    res
      .status(200)
      .type('zip')
      .setHeader(
        'Content-Disposition',
        `attachment; filename=${file.originalname}`
      )
      .send(zip);
  };
}
