import { MODE } from '../../types/modeType';
import { FileInfo } from '../fileSchema';
import {
  UpdatePhraseBodySchema,
  UpdatePhraseQuerySchema,
  UpdatePhraseSchema,
} from '../updatePhraseSchema';

describe('Update phrase schema', () => {
  let file: FileInfo;

  let query: {
    mode: string;
    line?: unknown;
  };

  let body: {
    currentPhrase: unknown;
    newPhrase: unknown;
  };

  let updatePhraseInfo: {
    body: typeof body;
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

    body = {
      currentPhrase: 'oldPhrase',
      newPhrase: 'newPhrase',
    };

    updatePhraseInfo = {
      query,
      file,
      body,
    };
  });

  describe('Body schema', () => {
    it('Should return true, when currentPhrase, newPhrase is a string with min length 1', () => {
      const { success } = UpdatePhraseBodySchema.safeParse(body);

      expect(success).toBe(true);
    });

    it('Should return false, when currentPhrase length is lower than 1', () => {
      body.currentPhrase = '';

      const { success } = UpdatePhraseBodySchema.safeParse(body);

      expect(success).toBe(false);
    });

    it('Should return false, when newPhrase length is lower than 1', () => {
      body.newPhrase = '';

      const { success } = UpdatePhraseBodySchema.safeParse(body);

      expect(success).toBe(false);
    });

    it('Should return false, when phrase is not a string type', () => {
      body.currentPhrase = null;

      const { success } = UpdatePhraseBodySchema.safeParse(body);

      expect(success).toBe(false);
    });
  });

  describe('Query schema', () => {
    it('Should return true, when object key "mode" value is: "first", "all"', () => {
      const { success } = UpdatePhraseQuerySchema.safeParse(query);

      expect(success).toBe(true);

      query.mode = MODE.FIRST;

      const modeAllResult = UpdatePhraseQuerySchema.safeParse(query);

      expect(modeAllResult.success).toBe(true);
    });

    it('Should return false, when object key "mode"  is different from: "first", "all"', () => {
      query.mode = 'test';

      const { success } = UpdatePhraseQuerySchema.safeParse(query);

      expect(success).toBe(false);
    });

    it('Should return false, when object doesnt  have key "mode"', () => {
      const { success } = UpdatePhraseQuerySchema.safeParse({
        new: 'test',
      });

      expect(success).toBe(false);
    });

    it('Should return true, when object key "mode" value is: "line" and value of key "line" is a number grater than 0', () => {
      query.mode = MODE.LINE;
      query.line = 1;

      const { success } = UpdatePhraseQuerySchema.safeParse(query);

      expect(success).toBe(true);
    });

    it('Should return false, when object key "mode" value is: "line" and value of key "line" is a number lower than 1', () => {
      query.mode = MODE.LINE;
      query.line = 0;

      const { success } = UpdatePhraseQuerySchema.safeParse(query);

      expect(success).toBe(false);
    });

    it('Should return false, when object key "mode" value is: "line" and value of key "line" doesnt exist or is not number', () => {
      query.mode = MODE.LINE;

      const { success } = UpdatePhraseQuerySchema.safeParse(query);

      expect(success).toBe(false);

      query.line = 'test';

      const result = UpdatePhraseQuerySchema.safeParse(query);

      expect(result.success).toBe(false);
    });
  });

  describe('Update phrase schema', () => {
    it('Should return true, when phrase is string with at least 1 character, and and query "mode" is all | first ', () => {
      const { success } = UpdatePhraseSchema.safeParse(updatePhraseInfo);

      expect(success).toBe(true);
    });

    it('Should return true, when phrase is string with at least 1 character, and and query "mode" is line with line number >=1 ', () => {
      updatePhraseInfo.query.mode = MODE.LINE;
      updatePhraseInfo.query.line = 1;

      const { success } = UpdatePhraseSchema.safeParse(updatePhraseInfo);

      expect(success).toBe(true);
    });

    it('Should return false, when currentPhrase or newPhrase is not string', () => {
      updatePhraseInfo.body.currentPhrase = 10;

      const { success } = UpdatePhraseSchema.safeParse(updatePhraseInfo);

      expect(success).toBe(false);
    });

    it('Should return false, when mode is line without line number', () => {
      updatePhraseInfo.query.mode = MODE.LINE;

      const { success } = UpdatePhraseSchema.safeParse(updatePhraseInfo);

      expect(success).toBe(false);
    });
  });
});
