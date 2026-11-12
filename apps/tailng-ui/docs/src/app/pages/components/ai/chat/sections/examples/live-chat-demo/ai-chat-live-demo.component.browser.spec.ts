import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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
    throw new Error('Missing component assistant composer.');
  }
  return result;
}

function transcript(host: HTMLElement): HTMLOListElement {
  const result = host.querySelector<HTMLOListElement>('[data-slot="ai-chat-transcript"]');
  if (result === null) {
    throw new Error('Missing component assistant transcript.');
  }
  result.style.height = '7rem';
  result.style.maxHeight = '7rem';
  result.style.minHeight = '0';
  result.style.overflow = 'auto';
  return result;
}

function distanceFromBottom(element: HTMLElement): number {
  return Math.max(0, element.scrollHeight - element.clientHeight - element.scrollTop);
}

async function settle(milliseconds = 0): Promise<void> {
  if (milliseconds > 0) {
    await new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
  }
  await new Promise<void>((resolve) =>
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve())),
  );
}

describe('AiChatLiveDemoComponent browser scrolling', () => {
  let fixture: ComponentFixture<AiChatLiveDemoComponent>;
  let host: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [AiChatLiveDemoComponent],
    }).createComponent(AiChatLiveDemoComponent);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('AI-DEMO-SCROLL-001..004/006 keeps incoming streamed content visible while following', async () => {
    const list = transcript(host);
    await settle();
    expect(distanceFromBottom(list)).toBeLessThanOrEqual(1);
    expect(list.getAttribute('data-following')).toBe('true');

    submitPrompt('hi');

    await settle(650);
    fixture.detectChanges();
    await settle();

    expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
    expect(distanceFromBottom(list)).toBeLessThanOrEqual(1);
    expect(list.getAttribute('data-following')).toBe('true');
  });

  it.each([
    { label: 'Choose a release date', previewId: 'release-date' },
    { label: 'Plan a project date range', previewId: 'project-date-range' },
    { label: 'Find a teammate', previewId: 'assignee-search' },
    { label: 'Set rollout percentage', previewId: 'rollout-slider' },
    { label: 'Show monthly installs', previewId: 'monthly-installs' },
    { label: 'Show adoption trend', previewId: 'adoption-trend' },
    { label: 'Display a team table', previewId: 'team-table' },
    { label: 'Show release FAQ', previewId: 'release-faq' },
    { label: 'Build release settings tabs', previewId: 'release-tabs' },
    { label: 'Show release steps', previewId: 'release-steps' },
    { label: 'Create status labels', previewId: 'release-status' },
    { label: 'Track release progress', previewId: 'release-progress' },
  ])(
    'AI-DEMO-EXPAND-015/018/020..027 resumes follow for $previewId tool preview',
    async ({ label, previewId }) => {
      const list = transcript(host);
      submitPrompt('hi');
      await settle(650);
      fixture.detectChanges();

      list.scrollTop = 0;
      list.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(list.getAttribute('data-following')).toBe('false');

      button(host, label).click();
      fixture.detectChanges();
      await settleStream(850);

      expect(host.querySelector('[data-tool-call-id]')).toBeTruthy();
      expect(host.querySelector(`[data-component-preview-id="${previewId}"]`)).toBeTruthy();
      expect(distanceFromBottom(list)).toBeLessThanOrEqual(1);
      expect(list.getAttribute('data-following')).toBe('true');
    },
  );

  it('AI-DEMO-SCROLL-010/015 preserves reading position and jumps back to latest', async () => {
    const list = transcript(host);
    submitPrompt('hi');
    await settle();

    list.scrollTop = 0;
    list.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    await settle(650);
    fixture.detectChanges();
    await settle();

    expect(list.scrollTop).toBe(0);
    expect(list.getAttribute('data-following')).toBe('false');
    expect(button(host, 'Jump to latest').textContent).toContain('1 new message');

    const latest = button(host, 'Jump to latest');
    latest.focus();
    latest.click();
    fixture.detectChanges();
    await settle();

    expect(distanceFromBottom(list)).toBeLessThanOrEqual(1);
    expect(list.getAttribute('data-following')).toBe('true');
    expect(list.contains(document.activeElement)).toBe(false);
  });

  function submitPrompt(value: string): void {
    const input = composer(host);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    button(host, 'Send').click();
    fixture.detectChanges();
  }

  async function settleStream(milliseconds: number): Promise<void> {
    const interval = 100;
    for (let elapsed = 0; elapsed < milliseconds; elapsed += interval) {
      await settle(Math.min(interval, milliseconds - elapsed));
      fixture.detectChanges();
      await settle();
    }
  }
});
