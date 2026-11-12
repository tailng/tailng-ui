import { describe, expect, it } from 'vitest';
import {
  addComponentAssistantUnseenMessage,
  componentAssistantDistanceFromBottom,
  componentAssistantIsNearBottom,
  componentAssistantUnseenLabel,
} from './component-assistant-scroll';

describe('component assistant transcript follow policy', () => {
  it('AI-DEMO-SCROLL-001/009 applies the 48 CSS-pixel near-bottom threshold', () => {
    expect(
      componentAssistantDistanceFromBottom({
        scrollHeight: 1_000,
        clientHeight: 300,
        scrollTop: 652,
      }),
    ).toBe(48);
    expect(
      componentAssistantIsNearBottom({
        scrollHeight: 1_000,
        clientHeight: 300,
        scrollTop: 652,
      }),
    ).toBe(true);
    expect(
      componentAssistantIsNearBottom({
        scrollHeight: 1_000,
        clientHeight: 300,
        scrollTop: 651,
      }),
    ).toBe(false);
  });

  it('AI-DEMO-SCROLL-009 clamps overscroll and invalid geometry safely', () => {
    expect(
      componentAssistantDistanceFromBottom({
        scrollHeight: 300,
        clientHeight: 300,
        scrollTop: 8,
      }),
    ).toBe(0);
    expect(
      componentAssistantDistanceFromBottom({
        scrollHeight: Number.NaN,
        clientHeight: 300,
        scrollTop: 0,
      }),
    ).toBe(0);
  });

  it('AI-DEMO-SCROLL-011 deduplicates unseen logical message IDs', () => {
    const first = addComponentAssistantUnseenMessage(new Set(), 'assistant-1');
    const duplicate = addComponentAssistantUnseenMessage(first, 'assistant-1');
    const second = addComponentAssistantUnseenMessage(duplicate, 'assistant-2');

    expect([...first]).toEqual(['assistant-1']);
    expect(duplicate).toBe(first);
    expect([...second]).toEqual(['assistant-1', 'assistant-2']);
  });

  it('AI-DEMO-SCROLL-012/013 returns accessible bounded unseen labels', () => {
    expect(componentAssistantUnseenLabel(0)).toBe('Jump to latest');
    expect(componentAssistantUnseenLabel(1)).toBe('Jump to latest — 1 new message');
    expect(componentAssistantUnseenLabel(3)).toBe('Jump to latest — 3 new messages');
    expect(componentAssistantUnseenLabel(100)).toBe('Jump to latest — 99+ new messages');
  });
});
