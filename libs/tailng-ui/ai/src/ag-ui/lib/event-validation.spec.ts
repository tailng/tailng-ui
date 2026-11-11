import { describe, expect, it } from 'vitest';
import { validateTngAgUiEvent } from './event-validation';

describe('AG-UI 1.0 event validation', () => {
  it('AI-AGUI-BASE-001 validates a minimal required-profile event', () => {
    const event = { type: 'TEXT_MESSAGE_END', messageId: 'message-1' };

    expect(validateTngAgUiEvent(event)).toEqual({ valid: true, event });
  });

  it('AI-AGUI-BASE-002 rejects an event without a discriminator', () => {
    expect(validateTngAgUiEvent({ messageId: 'message-1' })).toMatchObject({
      valid: false,
      diagnostic: { code: 'invalid-event' },
    });
  });

  it('AI-AGUI-BASE-003 rejects an unknown event under the required profile', () => {
    expect(validateTngAgUiEvent({ type: 'FUTURE_EVENT' })).toMatchObject({
      valid: false,
      diagnostic: { code: 'unsupported-event' },
    });
  });

  it('AI-AGUI-BASE-003 rejects a complete-profile event under the required profile', () => {
    expect(validateTngAgUiEvent({ type: 'STEP_STARTED', stepName: 'research' })).toMatchObject({
      valid: false,
      diagnostic: { code: 'unsupported-event' },
    });
  });

  it('AI-AGUI-BASE-004 preserves an informational timestamp', () => {
    const event = { type: 'TEXT_MESSAGE_END', messageId: 'message-1', timestamp: 123 };

    expect(validateTngAgUiEvent(event)).toEqual({ valid: true, event });
  });

  it('AI-AGUI-BASE-006 preserves bounded raw diagnostic data', () => {
    const event = {
      type: 'TEXT_MESSAGE_END',
      messageId: 'message-1',
      rawEvent: { provider: 'example', sequence: 2 },
    };

    expect(validateTngAgUiEvent(event)).toEqual({ valid: true, event });
  });

  it('AI-AGUI-BASE-007 preserves open metadata keys', () => {
    const event = {
      type: 'TEXT_MESSAGE_END',
      messageId: 'message-1',
      metadata: { 'example.dev/key': { enabled: true } },
    };

    expect(validateTngAgUiEvent(event)).toEqual({ valid: true, event });
  });

  it('AI-AGUI-BASE-009 leaves absent optional fields absent', () => {
    const result = validateTngAgUiEvent({ type: 'TEXT_MESSAGE_END', messageId: 'message-1' });

    expect(result.valid).toBe(true);
    if (!result.valid) return;
    expect('timestamp' in result.event).toBe(false);
    expect('metadata' in result.event).toBe(false);
  });

  it('AI-AGUI-BASE-010 rejects null where the schema forbids it', () => {
    expect(
      validateTngAgUiEvent({
        type: 'TEXT_MESSAGE_END',
        messageId: 'message-1',
        metadata: null,
      }),
    ).toMatchObject({ valid: false, diagnostic: { code: 'invalid-event' } });
  });

  it('AI-AGUI-BASE-011 preserves opaque identifiers exactly', () => {
    const event = { type: 'TEXT_MESSAGE_END', messageId: 'tenant:/消息?✓' };

    expect(validateTngAgUiEvent(event)).toEqual({ valid: true, event });
  });

  it('AI-AGUI-BASE-012 rejects an event beyond the configured byte limit', () => {
    const event = { type: 'TEXT_MESSAGE_CONTENT', messageId: 'message-1', delta: 'x'.repeat(200) };

    expect(validateTngAgUiEvent(event, { maxBytes: 100 })).toMatchObject({
      valid: false,
      diagnostic: { code: 'limit-exceeded' },
    });
  });

  it('AI-AGUI-BASE-013 rejects metadata beyond configured structural limits', () => {
    const event = {
      type: 'TEXT_MESSAGE_END',
      messageId: 'message-1',
      metadata: { a: { b: { c: true } } },
    };

    expect(validateTngAgUiEvent(event, { maxDepth: 2 })).toMatchObject({
      valid: false,
      diagnostic: { code: 'limit-exceeded' },
    });
  });

  it('AI-AGUI-BASE-014 validates deeply frozen input without mutation', () => {
    const event = deepFreeze({
      type: 'TEXT_MESSAGE_CONTENT',
      messageId: 'message-1',
      delta: 'hello',
      metadata: { stable: true },
    });

    expect(validateTngAgUiEvent(event)).toMatchObject({ valid: true });
    expect(Object.isFrozen(event.metadata)).toBe(true);
  });
});

function deepFreeze<T>(value: T): T {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const nested of Object.values(value)) deepFreeze(nested);
  return value;
}
