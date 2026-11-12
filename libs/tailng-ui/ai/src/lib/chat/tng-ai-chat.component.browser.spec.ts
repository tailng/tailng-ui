import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TngAiChatComponent } from './tng-ai-chat.component';
import type { TngAiMessage } from '../core/message.types';

function message(index: number): TngAiMessage {
  const id = `message-${index}`;
  return {
    id,
    threadId: 'browser-thread',
    role: index % 2 === 0 ? 'assistant' : 'user',
    status: 'complete',
    parts: [
      {
        id: `${id}-text`,
        type: 'text',
        format: 'plain',
        text: `Message ${index}: ${'content '.repeat(12)}`,
      },
    ],
  };
}

function transcript(host: HTMLElement): HTMLOListElement {
  const result = host.querySelector<HTMLOListElement>('[data-slot="ai-chat-transcript"]');
  if (result === null) {
    throw new Error('Missing AI chat transcript.');
  }
  result.style.height = '8rem';
  result.style.maxHeight = '8rem';
  result.style.minHeight = '0';
  return result;
}

function distanceFromBottom(element: HTMLElement): number {
  return Math.max(0, element.scrollHeight - element.clientHeight - element.scrollTop);
}

async function settle(): Promise<void> {
  await new Promise<void>((resolve) =>
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve())),
  );
}

describe('TngAiChatComponent browser scrolling', () => {
  let fixture: ComponentFixture<TngAiChatComponent>;
  let host: HTMLElement;
  let messages: TngAiMessage[];

  beforeEach(async () => {
    messages = Array.from({ length: 20 }, (_, index) => message(index + 1));
    fixture = TestBed.configureTestingModule({ imports: [TngAiChatComponent] }).createComponent(
      TngAiChatComponent,
    );
    fixture.componentRef.setInput('messages', messages);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
    transcript(host);
    fixture.detectChanges();
    await settle();
  });

  afterEach(() => fixture.destroy());

  it('AIC-BROWSER-001 follows new content while the reader is at the bottom', async () => {
    const list = transcript(host);
    expect(distanceFromBottom(list)).toBeLessThanOrEqual(1);

    messages = [...messages, message(21)];
    fixture.componentRef.setInput('messages', messages);
    fixture.detectChanges();
    await settle();

    expect(distanceFromBottom(list)).toBeLessThanOrEqual(1);
    expect(list.getAttribute('data-following')).toBe('true');
  });

  it('AIC-BROWSER-002 and AIC-BROWSER-003 pause and resume follow mode', async () => {
    const list = transcript(host);
    list.scrollTop = 0;
    list.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    messages = [...messages, message(21)];
    fixture.componentRef.setInput('messages', messages);
    fixture.detectChanges();
    await settle();

    expect(list.scrollTop).toBe(0);
    expect(list.getAttribute('data-following')).toBe('false');
    const latest = host.querySelector<HTMLButtonElement>('[data-slot="ai-chat-jump-latest"]');
    expect(latest?.textContent).toContain('1 new message');

    latest?.click();
    fixture.detectChanges();
    await settle();

    expect(distanceFromBottom(list)).toBeLessThanOrEqual(1);
    expect(list.getAttribute('data-following')).toBe('true');
  });

  it('AIC-BROWSER-004 preserves the reading position when history is prepended', async () => {
    const list = transcript(host);
    fixture.componentRef.setInput('hasEarlierMessages', true);
    fixture.detectChanges();
    list.scrollTop = Math.max(1, Math.floor(list.scrollHeight / 3));
    list.dispatchEvent(new Event('scroll'));
    const beforeTop = list.scrollTop;
    const beforeHeight = list.scrollHeight;

    host.querySelector<HTMLButtonElement>('[data-slot="ai-chat-load-earlier"]')?.click();
    messages = [message(-2), message(-1), message(0), ...messages];
    fixture.componentRef.setInput('messages', messages);
    fixture.detectChanges();
    await settle();

    expect(list.scrollTop).toBeCloseTo(beforeTop + (list.scrollHeight - beforeHeight), 0);
    expect(list.getAttribute('data-following')).toBe('false');
  });
});
