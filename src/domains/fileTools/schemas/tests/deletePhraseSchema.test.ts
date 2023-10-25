import {
  DeletePhraseBodySchema,
  DeletePhraseQuerySchema,
  DeletePhraseSchema,
} from '../deletePhraseSchema';
import { MODE } from '../../types/modeType';
import { FileInfo } from '../fileSchema';

describe('Delete phrase schema', () => {
  let file: FileInfo;

  let query: {
    mode: string;
    line?: unknown;
  };

  let deletePhraseInfo: {
    body: { phrase: unknown };
    query: typeof query;
    file: FileInfo;
  };

  beforeEach(() => {
    file = {
      fieldname: 'file',
      originalname: 'note.ts',
      encoding: 'utf8',
      mimetype: 'application/octet-stream',
      size: 10,
      buffer: Buffer.from('file content', 'utf8'),
    };

    query = {
      mode: MODE.ALL,
    };

    deletePhraseInfo = {
      query,
      file,
      body: {
        phrase: 'test',
      },
    };
  });

  describe('Body schema', () => {
    it('Should return true, when phrase is a string with min length 1', () => {
      const { success } = DeletePhraseBodySchema.safeParse({
        phrase: 'pattern',
      });

      expect(success).toBe(true);
    });

    it('Should return false, when phrase is a string length is lower than 1', () => {
      const { success } = DeletePhraseBodySchema.safeParse({
        phrase: '',
      });

      expect(success).toBe(false);
    });

    it('Should return false, when phrase is not a string type', () => {
      const { success } = DeletePhraseBodySchema.safeParse({
        phrase: null,
      });

      expect(success).toBe(false);
    });
  });

  describe('Query schema', () => {
    it('Should return true, when object key "mode" value is: "first", "all"', () => {
      const { success } = DeletePhraseQuerySchema.safeParse(query);

      expect(success).toBe(true);

      query.mode = MODE.FIRST;

      const modeAllResult = DeletePhraseQuerySchema.safeParse(query);

      expect(modeAllResult.success).toBe(true);
    });

    it('Should return false, when object key "mode"  is different from: "first", "all"', () => {
      query.mode = 'test';

      const { success } = DeletePhraseQuerySchema.safeParse(query);

      expect(success).toBe(false);
    });

    it('Should return false, when object doesnt  have key "mode"', () => {
      const { success } = DeletePhraseQuerySchema.safeParse({
        new: 'test',
      });

      expect(success).toBe(false);
    });

    it('Should return true, when object key "mode" value is: "line" and value of key "line" is a number grater than 0', () => {
      query.mode = MODE.LINE;
      query.line = 1;

      const { success } = DeletePhraseQuerySchema.safeParse(query);

      expect(success).toBe(true);
    });

    it('Should return false, when object key "mode" value is: "line" and value of key "line" is a number lower than 1', () => {
      query.mode = MODE.LINE;
      query.line = 0;

      const { success } = DeletePhraseQuerySchema.safeParse(query);

      expect(success).toBe(false);
    });

    it('Should return false, when object key "mode" value is: "line" and value of key "line" doesnt exist or is not number', () => {
      query.mode = MODE.LINE;

      const { success } = DeletePhraseQuerySchema.safeParse(query);

      expect(success).toBe(false);

      query.line = 'test';

      const result = DeletePhraseQuerySchema.safeParse(query);

      expect(result.success).toBe(false);
    });
  });

  describe('Delete phrase schema', () => {
    it('Should return true, when phrase is string with at least 1 character, and and query "mode" is all | first ', () => {
      const { success } = DeletePhraseSchema.safeParse(deletePhraseInfo);

      expect(success).toBe(true);
    });

    it('Should return true, when phrase is string with at least 1 character, and and query "mode" is line with line number >=1 ', () => {
      deletePhraseInfo.query.mode = MODE.LINE;
      deletePhraseInfo.query.line = 1;

      const { success } = DeletePhraseSchema.safeParse(deletePhraseInfo);

      expect(success).toBe(true);
    });

    it('Should return false, when phrase is not string', () => {
      deletePhraseInfo.body.phrase = 10;

      const { success } = DeletePhraseSchema.safeParse(deletePhraseInfo);

      expect(success).toBe(false);
    });

    it('Should return false, when mode is line without line number', () => {
      deletePhraseInfo.query.mode = MODE.LINE;

      const { success } = DeletePhraseSchema.safeParse(deletePhraseInfo);

      expect(success).toBe(false);
    });
  });
});
