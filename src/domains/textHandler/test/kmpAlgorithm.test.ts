import { container } from '../../../ioc/inversify.config';
import { TYPES } from '../../../ioc/types/types';
import { MODE, ModeType } from '../../fileTools/types/modeType';
import { IKmpAlgorithm } from '../kmpAlgorithm/kmpAlgorithm';

describe('Knuth-Morris-Pratt algorithm', () => {
  let text: string;
  let pattern: string;
  let mode: ModeType;
  let kmp: IKmpAlgorithm;

  beforeAll(() => {
    kmp = container.get<IKmpAlgorithm>(TYPES.KmpAlgorithmToken);
  });

  beforeEach(() => {
    text =
      'Algorithm Knuth-Morris-Pratt. Test all options with phrase "Algorithm". Algorithm.';
  });

  mode = MODE.ALL;

  describe('Phrase counter', () => {
    it('Should count all pattern phrases in text', () => {
      pattern = 'algorithm';

      const counter = kmp.count(text, pattern);

      expect(counter).toEqual(3);
    });
  });

  describe('Replace phrases in text', () => {
    it('Should replace all pattern phrases in text', () => {
      pattern = 'Algorithm';
      const replacement = 'Test';

      const newText = kmp.searchAndReplace(text, pattern, replacement, mode);

      console.log({ newText });

      expect(newText).toBe(
        'Test Knuth-Morris-Pratt. Test all options with phrase "Test". Test.'
      );
    });

    it('Should replace first phrase in text', () => {
      pattern = 'Algorithm';
      mode = MODE.FIRST;

      const replacement = 'Test';

      const newText = kmp.searchAndReplace(text, pattern, replacement, mode);

      console.log({ newText });

      expect(newText).toBe(
        'Test Knuth-Morris-Pratt. Test all options with phrase "Algorithm". Algorithm.'
      );
    });
  });
});
