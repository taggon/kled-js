import { describe, it, expect } from 'bun:test';
import { isSimilar } from './korean';

describe('isSimilar()', () => {
  it('returns true when both are the same', () => {
    expect(isSimilar('강', '강')).toBe(true);
    expect(isSimilar('나', '나')).toBe(true);
    expect(isSimilar('ㄷ', 'ㄷ')).toBe(true);
  });

  it('returns true when one is a partial letter of the other one', () => {
    expect(isSimilar('ㄱ', '강')).toBe(true);
    expect(isSimilar('ㄲ', '강')).toBe(false);
    expect(isSimilar('가', '강')).toBe(true);
    expect(isSimilar('거', '강')).toBe(false);

    expect(isSimilar('ㄴ', '날')).toBe(true);
    expect(isSimilar('ㄷ', '날')).toBe(false);
    expect(isSimilar('나', '날')).toBe(true);
    expect(isSimilar('눌', '날')).toBe(false);
  });
});
