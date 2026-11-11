import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AiChatLiveDemoComponent } from './ai-chat-live-demo.component';

function button(host: HTMLElement, label: string): HTMLButtonElement {
  const result = Array.from(host.querySelectorAll<HTMLButtonElement>('button')).find((candidate) =>
    candidate.textContent?.includes(label),
  );
  if (result === undefined) {
    throw new Error(`Missing button: ${label}`);
  }
  return result;
}

function composer(host: HTMLElement): HTMLTextAreaElement {
  const result = host.querySelector<HTMLTextAreaElement>('textarea');
  if (result === null) {
    throw new Error('Missing chat composer.');
  }
  return result;
}

describe('AiChatLiveDemoComponent', () => {
  let fixture: ComponentFixture<AiChatLiveDemoComponent>;
  let host: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    fixture = TestBed.configureTestingModule({
      imports: [AiChatLiveDemoComponent],
    }).createComponent(AiChatLiveDemoComponent);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => {
    fixture.destroy();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('AI-DOC-DEMO-001 renders recent messages and an accessible composer', () => {
    expect(host.querySelector('[role="region"]')?.getAttribute('aria-label')).toBe(
      'AI chat working demo',
    );
    expect(host.querySelectorAll('[data-message-id]')).toHaveLength(3);
    expect(composer(host).getAttribute('aria-label')).toBe('Message the release assistant');
    expect(button(host, 'Send').disabled).toBe(true);
  });

  it('AI-DOC-DEMO-002/003 streams one stable assistant message after submit', () => {
    submitPrompt('Check the release status');

    expect(host.textContent).toContain('Check the release status');
    expect(
      host.querySelectorAll('[data-message-role="assistant"][data-message-status="streaming"]'),
    ).toHaveLength(1);

    vi.advanceTimersByTime(700);
    fixture.detectChanges();

    const streaming = host.querySelector(
      '[data-message-role="assistant"][data-message-status="streaming"]',
    );
    expect(streaming?.textContent).toContain('I’ll inspect the release checks');
    expect(
      host.querySelectorAll('[data-message-role="assistant"][data-message-status="streaming"]'),
    ).toHaveLength(1);
  });

  it('AI-DOC-DEMO-004 shows the tool call and correlated result', () => {
    submitPrompt('Inspect deployment checks');

    vi.advanceTimersByTime(2300);
    fixture.detectChanges();

    expect(host.querySelector('[data-tool-call-id]')?.textContent).toContain('check_release');
    expect(host.querySelector('[data-tool-call-id]')?.getAttribute('data-tool-status')).toBe(
      'complete',
    );
    expect(host.textContent).toContain('12 checks passed');
  });

  it('AI-DOC-DEMO-005 stops an active response and retains partial text', () => {
    submitPrompt('Check now');
    vi.advanceTimersByTime(700);
    fixture.detectChanges();
    const partial = host.querySelector('[data-message-status="streaming"]')?.textContent;

    button(host, 'Stop').click();
    fixture.detectChanges();
    vi.advanceTimersByTime(5000);
    fixture.detectChanges();

    expect(host.querySelector('[data-message-status="stopped"]')?.textContent).toContain(partial);
    expect(host.textContent).toContain('Response stopped');
    expect(button(host, 'Retry')).toBeTruthy();
  });

  it('AI-DOC-DEMO-006 retries a stopped response with a new run', () => {
    submitPrompt('Check now');
    vi.advanceTimersByTime(350);
    fixture.detectChanges();
    button(host, 'Stop').click();
    fixture.detectChanges();

    button(host, 'Retry').click();
    fixture.detectChanges();

    expect(host.querySelectorAll('[data-message-status="stopped"]')).toHaveLength(1);
    expect(host.querySelectorAll('[data-message-status="streaming"]')).toHaveLength(1);
    expect(button(host, 'Stop')).toBeTruthy();
  });

  it('AI-DOC-DEMO-007 prepends one cursor page and exposes exhaustion', async () => {
    button(host, 'Load earlier').click();
    button(host, 'Load earlier').click();
    await vi.runAllTimersAsync();
    fixture.detectChanges();

    expect(host.querySelectorAll('[data-message-id]')).toHaveLength(6);
    expect(host.textContent).toContain('Start of conversation');
  });

  it('AI-DOC-DEMO-008 cancels scheduled work on destroy', () => {
    submitPrompt('Check now');
    fixture.destroy();

    expect(() => vi.runAllTimers()).not.toThrow();
    expect(vi.getTimerCount()).toBe(0);
  });

  function submitPrompt(value: string): void {
    const input = composer(host);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    button(host, 'Send').click();
    fixture.detectChanges();
  }
});
