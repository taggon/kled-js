import { expect, describe, it } from 'bun:test';
import { distance, matches } from './lib';

describe('distance()', () => {
  it('returns the other string length when one string is empty', () => {
    expect(distance('', 'foo')).toBe(3);
    expect(distance('hello', '')).toBe(5);
    expect(distance('', '한글')).toBe(2);
  });

  it('adds 0.1 when every korean character partially matches', () => {
    expect(distance('A학급', 'B학급')).toBe(1);
    expect(distance('Aㅎㄱ', 'B학급')).toBe(1.02);
  });
});

describe('matches()', () => {
  it('returns 1 when needle is same with haystack', () => {
    expect(matches('foo', 'foo')).toBe(1);

    // Case-insensitive by default
    expect(matches('foo', 'FOo')).toBe(1);

    // Case-sensitive when specified
    expect(matches('foo', 'FOo', true)).toBe(0);

    // Korean
    expect(matches('홍길동', '홍길동')).toBe(1);
  });

  it('returns  when needle is not in heystock', () => {
    expect(matches('foo', 'bar')).toBe(0);

    // Case-sensitive
    expect(matches('foo', 'FOO', true)).toBe(0);
  });

  it('throws an error when needle is longer than haystack', () => {
    expect(() => matches('greater', 'great')).toThrow();
  });

  it('returns zero when haystack does not contain needle', () => {
    expect(matches('dog', 'digging')).toBe(0);
  });

  it('returns a number that shows how much similar two strings are', () => {
    expect(matches('brb', 'Be Right Back')).toBeGreaterThan(0);
    expect(matches('brb', 'bring back')).toBeGreaterThan(0);
    expect(matches('brb', 'bring back')).toBeGreaterThan(matches('brb', 'Be Right Back'));
    expect(matches('강성', '서울시 강남구 삼성동')).toBeGreaterThan(0);
    expect(matches('강남', '서울시 강남구 삼성동')).toBeGreaterThan(0);
    expect(matches('강남', '서울시 강남구 삼성동')).toBeGreaterThan(matches('강성', '서울시 강남구 삼성동'));
  });

  it('returns non-zero value if korean characters partially match', () => {
    expect(matches('ㅎㄱ', '한글')).toBeGreaterThan(0);
    expect(matches('하그', '한글')).toBeGreaterThan(0);
    expect(matches('하ㄱ', '한글')).toBeGreaterThan(0);
    expect(matches('하그', '한글')).toBe(matches('ㅎㄱ', '한글'));
    expect(matches('하그', '한글')).toBe(matches('하ㄱ', '한글'));
  });
});
