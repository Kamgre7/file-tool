import { MODE } from '../../types/modeType';
import { FileInfo } from '../fileSchema';
import {
  FindPhraseBodySchema,
  FindPhraseQuerySchema,
  FindPhraseSchema,
} from '../findPhraseSchema';

describe('Find phrase schema', () => {
  let file: FileInfo;

  let query: {
    mode: string;
    line?: unknown;
  };

  let findPhraseInfo: {
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

    findPhraseInfo = {
      query,
      file,
      body: {
        phrase: 'test',
      },
    };
  });

  describe('Body schema', () => {
    it('Should return true, when phrase is a string with min length 1', () => {
      const { success } = FindPhraseBodySchema.safeParse({
        phrase: 'pattern',
      });

      expect(success).toBe(true);
    });

    it('Should return false, when phrase is a string length is lower than 1', () => {
      const { success } = FindPhraseBodySchema.safeParse({
        phrase: '',
      });

      expect(success).toBe(false);
    });

    it('Should return false, when phrase is not a string type', () => {
      const { success } = FindPhraseBodySchema.safeParse({
        phrase: null,
      });

      expect(success).toBe(false);
    });
  });

  describe('Query schema', () => {
    it('Should return true, when object key "mode" value is "all"', () => {
      const { success } = FindPhraseQuerySchema.safeParse(query);

      expect(success).toBe(true);
    });

    it('Should return false, when object key "mode"  is different from "all"', () => {
      query.mode = 'test';

      const { success } = FindPhraseQuerySchema.safeParse(query);

      expect(success).toBe(false);
    });

    it('Should return false, when object doesnt  have key "mode"', () => {
      const { success } = FindPhraseQuerySchema.safeParse({
        new: 'test',
      });

      expect(success).toBe(false);
    });

    it('Should return true, when object key "mode" value is: "line" and value of key "line" is a number grater than 0', () => {
      query.mode = MODE.LINE;
      query.line = 1;

      const { success } = FindPhraseQuerySchema.safeParse(query);

      expect(success).toBe(true);
    });

    it('Should return false, when object key "mode" value is: "line" and value of key "line" is a number lower than 1', () => {
      query.mode = MODE.LINE;
      query.line = 0;

      const { success } = FindPhraseQuerySchema.safeParse(query);

      expect(success).toBe(false);
    });

    it('Should return false, when object key "mode" value is: "line" and value of key "line" doesnt exist or is not number', () => {
      query.mode = MODE.LINE;

      const { success } = FindPhraseQuerySchema.safeParse(query);

      expect(success).toBe(false);

      query.line = 'test';

      const result = FindPhraseQuerySchema.safeParse(query);

      expect(result.success).toBe(false);
    });
  });

  describe('Find phrase schema', () => {
    it('Should return true, when phrase is string with at least 1 character, and and query "mode" is all', () => {
      const { success } = FindPhraseSchema.safeParse(findPhraseInfo);

      expect(success).toBe(true);
    });

    it('Should return true, when phrase is string with at least 1 character, and and query "mode" is line with line number >=1 ', () => {
      findPhraseInfo.query.mode = MODE.LINE;
      findPhraseInfo.query.line = 1;

      const { success } = FindPhraseSchema.safeParse(findPhraseInfo);

      expect(success).toBe(true);
    });

    it('Should return false, when phrase is not string', () => {
      findPhraseInfo.body.phrase = 10;

      const { success } = FindPhraseSchema.safeParse(findPhraseInfo);

      expect(success).toBe(false);
    });

    it('Should return false, when mode is line without line number', () => {
      findPhraseInfo.query.mode = MODE.LINE;

      const { success } = FindPhraseSchema.safeParse(findPhraseInfo);

      expect(success).toBe(false);
    });
  });
});
