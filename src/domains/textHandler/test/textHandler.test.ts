import { FindPhraseQuery } from '../../fileTools/schemas/findPhraseSchema';
import {
  UpdatePhraseBody,
  UpdatePhraseQuery,
} from '../../fileTools/schemas/updatePhraseSchema';
import { MODE } from '../../fileTools/types/modeType';
import { KmpAlgorithm } from '../kmpAlgorithm/kmpAlgorithm';
import { ITextHandler, TextHandler } from '../textHandler';

describe('Text handler', () => {
  let findPhraseInfo: FindPhraseQuery;
  let updatePhraseInfo: UpdatePhraseBody;
  let updateQuery: UpdatePhraseQuery;
  let text: string;
  let textHandler: ITextHandler;

  beforeAll(() => {
    textHandler = new TextHandler(new KmpAlgorithm());
  });

  beforeEach(() => {
    findPhraseInfo = {
      mode: MODE.ALL,
    };

    updatePhraseInfo = {
      currentPhrase: 'Algorithm',
      newPhrase: 'Change',
    };

    updateQuery = {
      mode: MODE.ALL,
    };

    text =
      'Algorithm Knuth-Morris-Pratt.\n Test all options with phrase "Algorithm". Algorithm.';
  });

  describe('Phrase counter', () => {
    it('Should count all phrases from text', () => {
      const counter = textHandler.countPhrases(
        'algorithm',
        findPhraseInfo,
        text
      );

      expect(counter).toEqual(3);
    });

    it('Should count all phrases from recommended line', () => {
      findPhraseInfo = {
        mode: MODE.LINE,
        line: 2,
      };

      const counter = textHandler.countPhrases(
        'algorithm',
        findPhraseInfo,
        text
      );

      expect(counter).toEqual(2);
    });
  });

  describe('Replacing words in text', () => {
    it('Should replace all phrases in text', () => {
      const newText = textHandler.update(updatePhraseInfo, updateQuery, text);

      expect(newText).toBe(
        'Change Knuth-Morris-Pratt.\n Test all options with phrase "Change". Change.'
      );
    });

    it('Should replace first phrase in text', () => {
      updateQuery = {
        mode: 'first',
      };

      const newText = textHandler.update(updatePhraseInfo, updateQuery, text);

      expect(newText).toBe(
        'Change Knuth-Morris-Pratt.\n Test all options with phrase "Algorithm". Algorithm.'
      );
    });

    it('Should replace all phrases from recommended line in text', () => {
      updateQuery = {
        mode: 'line',
        line: 2,
      };

      const newText = textHandler.update(updatePhraseInfo, updateQuery, text);

      expect(newText).toBe(
        'Algorithm Knuth-Morris-Pratt.\n Test all options with phrase "Change". Change.'
      );
    });
  });

  describe('Deleting words in text', () => {
    it('Should delete all phrases in text', () => {
      const newText = textHandler.delete('algorithm', updateQuery, text);

      expect(newText).toBe(
        ' Knuth-Morris-Pratt.\n Test all options with phrase "". .'
      );
    });

    it('Should delete first phrase in text', () => {
      updateQuery = {
        mode: 'first',
      };

      const newText = textHandler.delete('algorithm', updateQuery, text);

      expect(newText).toBe(
        ' Knuth-Morris-Pratt.\n Test all options with phrase "Algorithm". Algorithm.'
      );
    });

    it('Should delete all phrases from recommended line in text', () => {
      updateQuery = {
        mode: 'line',
        line: 2,
      };

      const newText = textHandler.delete('algorithm', updateQuery, text);

      expect(newText).toBe(
        'Algorithm Knuth-Morris-Pratt.\n Test all options with phrase "". .'
      );
    });
  });

  describe('Should throw error', () => {
    describe('Phrase counter', () => {
      it('Should throw error when recommended line is grater than number of lines in text', () => {
        findPhraseInfo = {
          mode: MODE.LINE,
          line: 10,
        };

        expect(() => {
          textHandler.countPhrases(
            updatePhraseInfo.currentPhrase,
            findPhraseInfo,
            text
          );
        }).toThrow();
      });
    });

    describe('Updating phrase', () => {
      it('Should throw error when recommended line is grater than number of lines in text', () => {
        updateQuery = {
          mode: MODE.LINE,
          line: 10,
        };

        expect(() => {
          textHandler.update(updatePhraseInfo, updateQuery, text);
        }).toThrow();
      });
    });

    describe('Deleting phrase', () => {
      it('Should throw error when recommended line is grater than number of lines in text', () => {
        updateQuery = {
          mode: MODE.LINE,
          line: 10,
        };

        expect(() => {
          textHandler.delete('algorithm', updateQuery, text);
        }).toThrow();
      });
    });
  });
});
