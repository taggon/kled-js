# kled.js

KLED: 한국어를 지원하는 레벤슈타인 편집 거리 알고리즘 기반 퍼지 매칭 라이브러리

## APIs

### `distance(a: string, b: string, caseSensitive: bool): number`

두 문자열 간의 레벤슈타인 거리를 계산합니다.

**파라미터**

- `a`: 문자열
- `b`: 문자열
- `caseSensitive`: (선택사항) 대소문자를 구분할 때는 true, 그렇지 않으면 false. 기본값: false

**반환값**

두 문자열 간의 레벤슈타인 거리를 의미하는 숫자.

### `matches(needle: string, haystack: string, caseSensitive: bool): number`

두 문자열의 간의 유사도를 0부터 1까지의 숫자로 반환합니다. 대상 문자열(haystack)이 검색어(needle)를 포함하지 않으면 0을 반환합니다.

한국어 부분 매칭도 지원합니다. 예를 들어 "ㅇㄴ"이나 "아녀"는 "안녕"에 매칭되지만 완벽하게 일치하는 "안녕"보다는 유사도 점수가 낮습니다.

**파라미터**

- `needle`: 검색할 문자열
- `haystack`: 검색의 대상이 되는 문자열
- `caseSensitive`: (선택사항) 대소문자를 구분할 때는 true, 그렇지 않으면 false. 기본값: false

**반환값**

0부터 1까지의 숫자. 0은 전혀 매칭되지 않는다는 의미이고 1은 두 문자열이 완전하게 동일하다는 의미입니다.

## Usage


```ts
import { distance, matches } from 'kled';

const levenshteinDistance = distance('hello', 'hola');
console.log(`Levenshtein Distance: ${levenshteinDistance}`);

const similarityScore = matches('abc', 'abCde');
console.log(`Similarity Score: ${similarityScore}`);
```

## 버그 신고

문제를 발견하면 [저장소](https://github.com/taggon/kled-js)로 보고해주세요.

## 라이선스

MIT
