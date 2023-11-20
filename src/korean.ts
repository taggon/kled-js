/**
 * Korean letter utilities.
 * @file korean.ts
 */

const CONSONANT_SYLLABLES = 'ㄱ가ㄲ까ㄴ나ㄷ다ㄸ따ㄹ라ㅁ마ㅂ바ㅃ빠ㅅ사ㅆ싸ㅇ아ㅈ자ㅉ짜ㅋ카ㅌ타ㅍ파ㅎ하';

/**
 * Check whether a letter is a vowel.
 */
export function isConsonant(c: string): boolean {
  return 'ㄱ' <= c && c <= 'ㅎ';
}

/**
 * Check whether a letter is a syllable.
 */
export function isSyllable(c: string): boolean {
  return '가' <= c && c <= '힣';
}

/**
 * Check whether a letter is a Korean letter.
 */
export function isKorean(c: string): boolean {
  return isConsonant(c) || isSyllable(c);
}

/**
 * Check whether two Korean letters are similar.
 */
export function isSimilar(a: string, b: string): boolean {
  if (isConsonant(a) || isConsonant(b)) {
    return getConsonant(a) === getConsonant(b);
  }

  return omitFinal(a) === omitFinal(b);
}

/**
 * Check whether a Korean letter has a final consonant.
 * @param c
 */
export function hasFinal(c: string): boolean {
  if (!isSyllable(c)) return false;
  return (c.charCodeAt(0) - 0xac00) % 28 !== 0;
}

function omitFinal(c: string): string {
  if (!hasFinal(c)) return c;
  return String.fromCharCode((((c.charCodeAt(0) - 0xac00) / 28)|0) * 28 + 0xac00);
}

/**
 * Get the first consonant of a Korean letter
 */
function getConsonant(c: string): string {
  if (!isSyllable(c)) return c;

  const code = c.charCodeAt(0) - 0xac00;
  const withoutFinal = ((code / 588)|0) * 588 + 0xac00;
  const firstLetterOfTheConsonant = String.fromCharCode(withoutFinal);
  const index = CONSONANT_SYLLABLES.indexOf(firstLetterOfTheConsonant);

  return (index === -1) ? '' : CONSONANT_SYLLABLES[index - 1];
}
