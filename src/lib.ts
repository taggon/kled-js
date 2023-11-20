import * as korean from "./korean";

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

      if (bChar !== aChar && korean.isKorean(bChar) && korean.isKorean(bChar)) {
        if (korean.isSimilar(aChar, bChar)) {
          korSimilarity = 0.01;
        }
      }

      if (korSimilarity > 0 || bChar === aChar) {
        table[i][j] = table[i - 1][j - 1] + korSimilarity;
      } else {
        table[i][j] = Math.min(table[i - 1][j - 1] + 1, table[i][j - 1] + 1, table[i - 1][j] + 1);
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
export function matches(needle: string, haystack: string, caseSensitive = false): number {
  if (needle.length > haystack.length) {
    throw new Error("haystack cannot be shorter than needle.");
  }

  if (!caseSensitive) {
    needle = needle.toLowerCase();
    haystack = haystack.toLowerCase();
  }

  const _needle = needle.split("");
  let _haystack = haystack.split("");

  while (_needle.length > 0) {
    const ch = _needle[0];
    let idx = 0;

    if (!korean.isKorean(ch) || korean.hasFinal(ch)) {
      idx = _haystack.indexOf(ch);
    } else {
      idx = _haystack.findIndex((c) => korean.isSimilar(c, ch) && (c >= ch));
    }

    if (idx === -1) {
      return 0;
    }

    _needle.shift();
    _haystack = _haystack.slice(idx + 1);
  }

  return (haystack.length - distance(needle, haystack, caseSensitive)) / haystack.length;
}
