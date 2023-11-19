const KOREAN_PATTERN = /[ㄱ-ㅎ가-힣]/;

const CONSONANT_TO_SYLLABLE = {
  ㄱ: '가'.charCodeAt(0),
  ㄲ: '까'.charCodeAt(0),
  ㄴ: '나'.charCodeAt(0),
  ㄷ: '다'.charCodeAt(0),
  ㄸ: '따'.charCodeAt(0),
  ㄹ: '라'.charCodeAt(0),
  ㅁ: '마'.charCodeAt(0),
  ㅂ: '바'.charCodeAt(0),
  ㅃ: '빠'.charCodeAt(0),
  ㅅ: '사'.charCodeAt(0),
};
const CODE_OF_SIOT = 'ㅅ'.charCodeAt(0);

/**
 * Get a Levenshtein distance between two strings
 *
 * @param a a string
 * @param b another string
 * @param caseSensitive whether to consider case sensitivity (default: false)
 */
export function distance(a: string, b: string, caseSensitive = false): number {
  if (a.length == 0) return b.length;
  if (b.length == 0) return a.length;

  if (!caseSensitive) {
    a = a.toLowerCase();
    b = b.toLowerCase();
  }
  if (a === b) return 0;

  const table: number[][] = [];

  table[0] = Array(a.length + 1)
    .fill(0)
    .map((_, n) => n);

  for (let i = 1; i <= b.length; i++) {
    table[i] = [i];
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const bChar = b[i - 1];
      const aChar = a[j - 1];
      let korSimilarity = 0; // Similarity between Korean characters

      if (
        bChar !== aChar &&
        KOREAN_PATTERN.test(bChar) &&
        KOREAN_PATTERN.test(aChar)
      ) {
        if (toConsonant(bChar) === toConsonant(aChar)) {
          korSimilarity = 0.01;
        }
      }

      if (korSimilarity > 0 || bChar === aChar) {
        table[i][j] = table[i - 1][j - 1] + korSimilarity;
      } else {
        table[i][j] = Math.min(
          table[i - 1][j - 1] + 1,
          table[i][j - 1] + 1,
          table[i - 1][j] + 1
        );
      }
    }
  }

  return table[b.length][a.length];
}

/**
 * Calculate the similarity score between two strings, providing a numerical value between 0 and 1.
 * If the "haystack" does not contain the "needle," the function returns 0.
 * @param needle a string to search for
 * @param haystack a string to search in
 * @param caseSensitive whether to consider case sensitivity (default: false)
 */
export function matches(
  needle: string,
  haystack: string,
  caseSensitive = false
): number {
  if (needle.length > haystack.length) {
    throw new Error('haystack cannot be shorter than needle.');
  }

  if (!caseSensitive) {
    needle = needle.toLowerCase();
    haystack = haystack.toLowerCase();
  }

  let _needle = needle;
  let _haystack = haystack;

  while (_needle.length > 0) {
    const ch = _needle[0];
    let idx = 0;

    if (!KOREAN_PATTERN.test(ch) || hasFinal(ch)) {
      idx = _haystack.indexOf(ch);
    } else {
      const chCode = ch.charCodeAt(0);
      let pattern = '';
      if ('ㄱ' <= ch && ch <= 'ㅎ') {
        const begin =
          CONSONANT_TO_SYLLABLE[ch] ||
          (chCode - 12613) /* code of 'ㅅ' */ * 588 +
            CONSONANT_TO_SYLLABLE['ㅅ'];
        pattern = `[${ch}${String.fromCharCode(begin)}-${String.fromCharCode(
          begin + 587
        )}]`;
      } else {
        const begin = Math.floor((chCode - 0xac00) / 28) * 28 + 0xac00;
        pattern = `[${String.fromCharCode(begin)}-${String.fromCharCode(
          begin + 27
        )}]`;
      }
      idx = new RegExp(pattern).exec(_haystack)?.index ?? -1;
    }

    if (idx === -1) {
      return 0;
    }

    _needle = _needle.substring(1);
    _haystack = _haystack.substring(idx + 1);
  }

  return (
    (haystack.length - distance(needle, haystack, caseSensitive)) /
    haystack.length
  );
}

function toConsonant(ch: string): string {
  const table = {
    가: 'ㄱ',
    까: 'ㄲ',
    나: 'ㄴ',
    다: 'ㄷ',
    따: 'ㄸ',
    라: 'ㄹ',
    마: 'ㅁ',
    바: 'ㅂ',
    빠: 'ㅃ',
    사: 'ㅅ',
    싸: 'ㅆ',
    아: 'ㅇ',
    자: 'ㅈ',
    짜: 'ㅉ',
    카: 'ㅋ',
    타: 'ㅌ',
    파: 'ㅍ',
    하: 'ㅎ',
  };

  if (ch < '가' || '힣' < ch) return ch;

  const withoutFinal = String.fromCharCode(
    Math.floor((ch.charCodeAt(0) - 0xac00) / 588) * 588 + 0xac00
  ) as keyof typeof table;

  return table[withoutFinal];
}

function hasFinal(ch: string): boolean {
  if (ch < '가' || '힣' < ch) return false;
  return (ch.charCodeAt(0) - 0xac00) % 28 !== 0;
}
