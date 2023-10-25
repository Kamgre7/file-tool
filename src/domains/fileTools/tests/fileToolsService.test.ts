import { container } from '../../../ioc/inversify.config';
import { TYPES } from '../../../ioc/types/types';
import { IPdfHandler } from '../../pdfHandler/pdfHandler';
import { FileInfo } from '../schemas/fileSchema';
import { FindPhraseQuery } from '../schemas/findPhraseSchema';
import {
  UpdatePhraseBody,
  UpdatePhraseQuery,
} from '../schemas/updatePhraseSchema';
import { IFileToolsService } from '../services/fileToolsService';
import { MODE } from '../types/modeType';
import { PdfHandlerMock } from './config/inversify.test.config';

describe('File tools service', () => {
  let fileToolsService: IFileToolsService;
  let file: FileInfo;

  let findPhraseInfo: FindPhraseQuery;

  let updatePhraseInfo: UpdatePhraseBody;
  let updatePhraseMode: UpdatePhraseQuery;

  let text: string;

  let textAfterAllUpdate: string;
  let textAfterFirstUpdate: string;
  let textAfterLineUpdate: string;

  let textAfterAllDelete: string;
  let textAfterFirstDelete: string;
  let textAfterLineDelete: string;

  beforeAll(() => {
    container.rebind<IPdfHandler>(TYPES.PdfHandlerToken).to(PdfHandlerMock);
  });

  beforeEach(() => {
    fileToolsService = container.get<IFileToolsService>(
      TYPES.FileToolsServiceToken
    );

    findPhraseInfo = {
      mode: MODE.ALL,
    };

    updatePhraseInfo = {
      currentPhrase: 'Algorithm',
      newPhrase: 'Change',
    };

    updatePhraseMode = {
      mode: MODE.ALL,
    };

    text = 'Algorithm Knuth-Morris-Pratt.\n Algorithm.';

    textAfterAllUpdate = 'Change Knuth-Morris-Pratt.\n Change.';
    textAfterFirstUpdate = 'Change Knuth-Morris-Pratt.\n Algorithm.';
    textAfterLineUpdate = 'Algorithm Knuth-Morris-Pratt.\n Change.';

    textAfterAllDelete = ' Knuth-Morris-Pratt.\n .';
    textAfterFirstDelete = ' Knuth-Morris-Pratt.\n Algorithm.';
    textAfterLineDelete = 'Algorithm Knuth-Morris-Pratt.\n .';

    file = {
      fieldname: 'file',
      originalname: 'text',
      encoding: 'utf8',
      mimetype: 'application/octet-stream',
      size: 10,
      buffer: Buffer.from(text),
    };
  });

  describe('Phrase counter', () => {
    it('Should count all phrases from text', () => {
      const counter = fileToolsService.countPhrases(
        'algorithm',
        findPhraseInfo,
        file
      );

      expect(counter).toEqual(2);
    });

    it('Should count phrases only from selected line', () => {
      findPhraseInfo = {
        mode: MODE.LINE,
        line: 2,
      };

      const counter = fileToolsService.countPhrases(
        'algorithm',
        findPhraseInfo,
        file
      );

      expect(counter).toEqual(1);
    });
  });

  describe('Phrase update', () => {
    it('Should update all phrases from text', async () => {
      const result = await fileToolsService.updatePhrases(
        updatePhraseInfo,
        updatePhraseMode,
        file
      );

      expect(result.toString()).toBe(textAfterAllUpdate);
    });

    it('Should update first phrase from text', async () => {
      updatePhraseMode.mode = 'first';

      const result = await fileToolsService.updatePhrases(
        updatePhraseInfo,
        updatePhraseMode,
        file
      );

      expect(result.toString()).toBe(textAfterFirstUpdate);
    });

    it('Should update recommended line phrase from text', async () => {
      updatePhraseMode = {
        mode: MODE.LINE,
        line: 2,
      };

      const result = await fileToolsService.updatePhrases(
        updatePhraseInfo,
        updatePhraseMode,
        file
      );

      expect(result.toString()).toBe(textAfterLineUpdate);
    });
  });

  describe('Phrase delete', () => {
    it('Should delete all phrases from text', async () => {
      const result = await fileToolsService.deletePhrases(
        'algorithm',
        updatePhraseMode,
        file
      );

      expect(result.toString()).toBe(textAfterAllDelete);
    });

    it('Should delete first phrase from text', async () => {
      updatePhraseMode.mode = 'first';

      const result = await fileToolsService.deletePhrases(
        'algorithm',
        updatePhraseMode,
        file
      );

      expect(result.toString()).toBe(textAfterFirstDelete);
    });

    it('Should delete recommended line phrase from text', async () => {
      updatePhraseMode = {
        mode: MODE.LINE,
        line: 2,
      };

      const result = await fileToolsService.deletePhrases(
        'algorithm',
        updatePhraseMode,
        file
      );

      expect(result.toString()).toBe(textAfterLineDelete);
    });
  });

  describe('Should throw error when', () => {
    describe('Phrase counter', () => {
      it('Should throw error when recommended line is grater than number of lines in text', () => {
        findPhraseInfo = {
          mode: MODE.LINE,
          line: 90,
        };

        expect(() => {
          fileToolsService.countPhrases('algorithm', findPhraseInfo, file);
        }).toThrow();
      });
    });

    describe('Update phrase', () => {
      it('Should throw error when recommended line is grater than number of lines in text', async () => {
        updatePhraseMode = {
          mode: MODE.LINE,
          line: 90,
        };

        await expect(async () => {
          await fileToolsService.updatePhrases(
            updatePhraseInfo,
            updatePhraseMode,
            file
          );
        }).rejects.toThrow();
      });
    });

    describe('Delete phrase', () => {
      it('Should throw error when recommended line is grater than number of lines in text', async () => {
        updatePhraseMode = {
          mode: MODE.LINE,
          line: 90,
        };

        await expect(async () => {
          await fileToolsService.deletePhrases(
            'algorithm',
            updatePhraseMode,
            file
          );
        }).rejects.toThrow();
      });
    });
  });
});
