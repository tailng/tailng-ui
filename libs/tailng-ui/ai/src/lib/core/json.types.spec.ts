import { describe, expect, it } from 'vitest';
import type { TngAiJsonValue } from './json.types';
import { validateTngAiJsonValue } from './json.types';

describe('TailNG AI JSON boundary', () => {
  it.each([
    ['AI-CORE-JSON-001 string', 'value'],
    ['AI-CORE-JSON-001 finite number', 42],
    ['AI-CORE-JSON-001 boolean', true],
    ['AI-CORE-JSON-001 null', null],
  ])('%s round-trips a JSON primitive', (_name, value) => {
    expect(validateTngAiJsonValue(value)).toEqual({ valid: true, value });
  });

  it('AI-CORE-JSON-002 accepts nested readonly arrays and objects', () => {
    const value = Object.freeze({
      name: 'assistant',
      flags: Object.freeze([true, null, Object.freeze({ count: 2 })]),
    });

    expect(validateTngAiJsonValue(value)).toEqual({ valid: true, value });
  });

  it.each([
    ['AI-CORE-JSON-005 cyclic value', createCycle()],
    ['AI-CORE-JSON-006 NaN', Number.NaN],
    ['AI-CORE-JSON-006 positive infinity', Number.POSITIVE_INFINITY],
    ['AI-CORE-JSON-006 negative infinity', Number.NEGATIVE_INFINITY],
    ['AI-CORE-JSON-004 date', new Date(0)],
    ['AI-CORE-JSON-004 function', () => undefined],
    ['AI-CORE-JSON-004 class instance', new ExampleClass()],
  ])('%s is rejected without throwing', (_name, value) => {
    const result = validateTngAiJsonValue(value);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error.code).toBe('invalid-json-value');
    }
  });

  it('AI-CORE-JSON-007 rejects prototype-polluting keys without changing prototypes', () => {
    const value = JSON.parse('{"safe":true,"__proto__":{"polluted":true}}') as unknown;

    expect(validateTngAiJsonValue(value).valid).toBe(false);
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
  });

  it('AI-CORE-JSON-008 enforces maximum nesting depth', () => {
    const result = validateTngAiJsonValue({ a: { b: { c: true } } }, { maxDepth: 2 });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error.code).toBe('limit-exceeded');
      expect(result.error.path).toBe('$.a.b');
    }
  });

  it('AI-CORE-JSON-009 enforces maximum entry count', () => {
    const result = validateTngAiJsonValue({ a: 1, b: 2, c: 3 }, { maxEntries: 2 });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error.code).toBe('limit-exceeded');
    }
  });

  it('AI-CORE-JSON-010 exposes readonly JSON contracts', () => {
    const value: TngAiJsonValue = { nested: ['value'] };

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // @ts-expect-error readonly JSON properties cannot be assigned.
      value.nested = null;
    }

    expect(value).toBeDefined();
  });
});

class ExampleClass {
  public readonly value = true;
}

function createCycle(): unknown {
  const value: { self?: unknown } = {};
  value.self = value;
  return value;
}
