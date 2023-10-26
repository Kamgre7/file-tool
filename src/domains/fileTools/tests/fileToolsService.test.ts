import { IPdfHandler } from '../../pdfHandler/pdfHandler';
import { KmpAlgorithm } from '../../textHandler/kmpAlgorithm/kmpAlgorithm';
import { TextHandler } from '../../textHandler/textHandler';
import { IZipHandler, ZipHandler } from '../../zipHandler/zipHandler';
import { FileInfo } from '../schemas/fileSchema';
import { FindPhraseQuery } from '../schemas/findPhraseSchema';
import {
  UpdatePhraseBody,
  UpdatePhraseQuery,
} from '../schemas/updatePhraseSchema';
import {
  FileToolsService,
  IFileToolsService,
  UpdatedFiles,
} from '../services/fileToolsService';
import { MODE } from '../types/modeType';

describe('File tools service', () => {
  let fileToolsService: IFileToolsService;
  let file: FileInfo;

  let pdfHandlerMock: IPdfHandler;
  let zipHandlerMock: IZipHandler;

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

  beforeEach(() => {
    text = 'Algorithm Knuth-Morris-Pratt.\n Algorithm.';

    pdfHandlerMock = {
      create: jest
        .fn()
        .mockImplementation(async (text: string) => Buffer.from(text)),
      createMultiple: jest
        .fn()
        .mockImplementation(async (filesInfo: UpdatedFiles[]) => [
          {
            filename: 'test1.pdf',
            content: Buffer.from('test1'),
          },
          {
            filename: 'test2.pdf',
            content: Buffer.from('test2'),
          },
        ]),
    };

    zipHandlerMock = {
      create: jest.fn().mockResolvedValue(Buffer.from(text)),
      getFilesInformation: jest.fn().mockResolvedValue([
        {
          originalName: 'text',
          content: text,
        },
      ]),
    };

    fileToolsService = new FileToolsService(
      new TextHandler(new KmpAlgorithm()),
      zipHandlerMock,
      pdfHandlerMock
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Phrase counter', () => {
    it('Should count all phrases from text', () => {
      const counter = fileToolsService.countPhrases(
        'algorithm',
        findPhraseInfo,
        file
      );

      expect(counter).toStrictEqual({ fileName: 'text', filePhraseCount: 2 });

      expect(pdfHandlerMock.create).toBeCalledTimes(0);
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

      expect(counter).toStrictEqual({ fileName: 'text', filePhraseCount: 1 });

      expect(pdfHandlerMock.create).toBeCalledTimes(0);
    });

    it('Should count all phrases from all files in zip', async () => {
      const counter = await fileToolsService.countPhrasesFromZip(
        'algorithm',
        findPhraseInfo,
        file
      );

      expect(counter).toStrictEqual([{ fileName: 'text', filePhraseCount: 2 }]);

      expect(pdfHandlerMock.create).toBeCalledTimes(0);
      expect(zipHandlerMock.getFilesInformation).toBeCalledTimes(1);
    });

    it('Should count phrases from all files - only selected line', async () => {
      findPhraseInfo = {
        mode: MODE.LINE,
        line: 2,
      };

      const counter = await fileToolsService.countPhrasesFromZip(
        'algorithm',
        findPhraseInfo,
        file
      );

      expect(counter).toStrictEqual([{ fileName: 'text', filePhraseCount: 1 }]);

      expect(pdfHandlerMock.create).toBeCalledTimes(0);
      expect(zipHandlerMock.getFilesInformation).toBeCalledTimes(1);
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

    it('Should update all phrases from text in zip files', async () => {
      const result = await fileToolsService.updatePhrasesFromZip(
        updatePhraseInfo,
        updatePhraseMode,
        file
      );

      expect(result).toBeInstanceOf(Buffer);
      expect(zipHandlerMock.getFilesInformation).toBeCalledTimes(1);
      expect(zipHandlerMock.create).toBeCalledTimes(1);
      expect(pdfHandlerMock.createMultiple).toBeCalledTimes(1);
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

    it('Should delete all phrases from text in zip files', async () => {
      const result = await fileToolsService.deletePhrasesFromZip(
        'algorithm',
        updatePhraseMode,
        file
      );

      expect(result).toBeInstanceOf(Buffer);
      expect(zipHandlerMock.getFilesInformation).toBeCalledTimes(1);
      expect(zipHandlerMock.create).toBeCalledTimes(1);
      expect(pdfHandlerMock.createMultiple).toBeCalledTimes(1);
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
