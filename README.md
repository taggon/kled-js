# kled.js

Also available in: [한국어](https://github.com/taggon/kled-js/blob/main/docs/README-ko.md)

KLED: Fuzzy Matching Library with Levenshtein Edit Distance, Tailored for Korean Language Support

## APIs

### `distance(a: string, b: string, caseSensitive: bool): number`

Calculate the Levenshtein distance between two strings.

**Parameters**

- `a`: a string
- `b`: another string
- `caseSensitive`: optional parameter (default: false), determines whether to consider case sensitivity.

**Returns**

The Levenshtein distance between the input strings.

### `matches(needle: string, haystack: string, caseSensitive: bool): number`

Calculate the similarity score between two strings, providing a numerical value between 0 and 1. If the "haystack" does not contain the "needle," the function returns 0.

It also supports partial Korean letter matching. For example, "ㅇㄴ" and "아녀" matches "안녕" with a slightly lower score than "안녕", which exactly matches the haystack.

**Parameters**

- `needle`: a string to search for
- `haystack`: a string to search in
- `caseSensitive`: optional parameter (default: false), determines whether to consider case sensitivity.

**Returns**

A similarity score between the input strings, where 0 indicates no similarity, and 1 indicates a perfect match based on the number of matched letters and their positions.

## Usage


```ts
import { distance, matches } from 'kled';

const levenshteinDistance = distance('hello', 'hola');
console.log(`Levenshtein Distance: ${levenshteinDistance}`);

const similarityScore = matches('abc', 'abCde');
console.log(`Similarity Score: ${similarityScore}`);
```

## Reporting Issues

Please report issues [here](https://github.com/taggon/kled-js) if you find any.

## License

MIT
