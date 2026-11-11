import { describe, expect, it, vi } from 'vitest';
import type { TngAiMessagePart } from './message-part.types';
import { decodeTngAiMessagePart, TngAiPartRegistry } from './part-registry';

describe('TailNG AI part registry', () => {
  it('AI-CORE-PART-025 treats a UI part without a renderer as unsupported', () => {
    const registry = new TngAiPartRegistry<string>();
    const part: TngAiMessagePart = deepFreeze({
      id: 'ui-1',
      type: 'ui',
      protocol: 'a2ui',
      payload: { component: 'card' },
    });

    expect(registry.resolve(part)).toEqual({ supported: false, reason: 'missing-renderer' });
  });

  it('AI-CORE-PART-026 resolves an extension only by its full exact name', () => {
    const registry = new TngAiPartRegistry<string>();
    const renderer = vi.fn(() => 'rendered');
    const part: TngAiMessagePart = {
      id: 'extension-1',
      type: 'extension',
      name: 'tailng.dev/example',
      value: true,
    };

    expect(registry.registerExtension('tailng.dev/example', renderer)).toBe(true);
    expect(registry.resolve(part)).toEqual({ supported: true, renderer });
    expect(registry.resolve({ ...part, name: 'TAILNG.DEV/example' })).toEqual({
      supported: false,
      reason: 'missing-renderer',
    });
    expect(renderer).not.toHaveBeenCalled();
  });

  it('AI-CORE-PART-028 preserves an unknown future part as inert JSON data', () => {
    const input = deepFreeze({
      id: 'future-1',
      type: 'future-card',
      title: 'Untrusted title',
      payload: { enabled: true },
    });

    expect(decodeTngAiMessagePart(input)).toEqual({
      ok: true,
      part: {
        id: 'future-1',
        type: 'unsupported',
        originalType: 'future-card',
        value: input,
      },
    });
  });

  it('AI-CORE-PART-028 rejects a future part containing non-JSON data', () => {
    expect(
      decodeTngAiMessagePart({ id: 'future-1', type: 'future-card', execute: () => 'unsafe' }),
    ).toEqual({ ok: false, reason: 'invalid-json' });
  });
});

function deepFreeze<T>(value: T): T {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const nested of Object.values(value)) deepFreeze(nested);
  return value;
}
