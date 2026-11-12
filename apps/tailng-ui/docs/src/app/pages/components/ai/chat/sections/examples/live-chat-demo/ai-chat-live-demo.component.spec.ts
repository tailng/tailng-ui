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

describe('AiChatLiveDemoComponent using TngAiChatComponent', () => {
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

  it('AI-DEMO-SURFACE-001 renders the public chat component instead of a hand-built shell', () => {
    expect(host.querySelector('tng-ai-chat')).toBeTruthy();
    expect(host.querySelector('[role="region"]')?.getAttribute('aria-label')).toBe(
      'TailNG component assistant conversation',
    );
    expect(host.textContent).toContain('TailNG Assistant');
    expect(host.textContent).toContain('AG-UI 1.0');
    expect(composer(host).getAttribute('aria-label')).toBe('Message TailNG component assistant');
    expect(button(host, 'Send').disabled).toBe(true);
  });

  it('AI-DEMO-EXPAND-013/014 renders twelve categorized options through a custom part component', () => {
    submitPrompt('  Hi  ');
    vi.runAllTimers();
    fixture.detectChanges();

    expect(host.querySelectorAll('[data-prompt-option-id]')).toHaveLength(12);
    expect(
      Array.from(host.querySelectorAll('[data-prompt-category-id]')).map((category) =>
        category.getAttribute('data-prompt-category-id'),
      ),
    ).toEqual(['forms', 'data', 'navigation-layout', 'feedback']);
    expect(
      Array.from(host.querySelectorAll('.component-assistant__option-category-title')).map(
        (heading) => heading.textContent?.trim(),
      ),
    ).toEqual(['Forms', 'Data', 'Navigation & layout', 'Feedback']);
    expect(host.textContent).toContain('12 component options available.');
  });

  it('AI-DEMO-RUN-001/004/005 submits an option action and renders its allowlisted component', () => {
    showOptions();
    button(host, 'Choose a release date').click();
    fixture.detectChanges();

    expect(host.textContent).toContain('Create a release date picker.');
    expect(host.querySelectorAll('[data-status="streaming"]')).toHaveLength(1);

    vi.runAllTimers();
    fixture.detectChanges();

    expect(host.querySelector('[data-tool-call-id]')?.textContent).toContain('render_component');
    expect(host.querySelector('[data-component-preview-id="release-date"]')).toBeTruthy();
  });

  it('AI-DEMO-GREET-004 handles unsupported prompts without rendering a component', () => {
    submitPrompt('Do something unknown');
    vi.runAllTimers();
    fixture.detectChanges();

    expect(host.textContent).toContain('Type “hi”');
    expect(host.querySelector('[data-component-preview-id]')).toBeNull();
  });

  it('AI-DEMO-RUN-006/007 stops and retries through typed chat requests', () => {
    showOptions();
    button(host, 'Show monthly installs').click();
    fixture.detectChanges();
    vi.advanceTimersByTime(350);
    fixture.detectChanges();

    button(host, 'Stop').click();
    fixture.detectChanges();
    expect(host.querySelector('[data-status="stopped"]')).toBeTruthy();
    expect(host.querySelector('[data-component-preview-id]')).toBeNull();

    button(host, 'Retry').click();
    fixture.detectChanges();
    vi.runAllTimers();
    fixture.detectChanges();
    expect(host.querySelectorAll('[data-component-preview-id="monthly-installs"]')).toHaveLength(1);
  });

  it('AI-DEMO-SURFACE-001 loads cursor history through the chat request', async () => {
    button(host, 'Load earlier').click();
    await vi.runAllTimersAsync();
    fixture.detectChanges();

    expect(host.textContent).toContain('Can this chat render interactive Angular UI?');
    expect(host.textContent).toContain('Earlier messages loaded.');
    expect(host.querySelector('[data-slot="ai-chat-load-earlier"]')).toBeNull();
  });

  it.each([
    ['Display a team table', 'team-table', '[aria-label="TailNG team members"]'],
    ['Create status labels', 'release-status', 'tng-tag[label="Stable"]'],
    ['Plan a project date range', 'project-date-range', 'tng-date-range-picker'],
    ['Find a teammate', 'assignee-search', 'tng-autocomplete'],
    ['Set rollout percentage', 'rollout-slider', 'tng-slider'],
    ['Show adoption trend', 'adoption-trend', 'tng-line-chart'],
    ['Show release FAQ', 'release-faq', 'tng-accordion'],
    ['Build release settings tabs', 'release-tabs', 'tng-tabs'],
    ['Show release steps', 'release-steps', 'tng-stepper'],
    ['Track release progress', 'release-progress', 'tng-progress-bar'],
  ])(
    'AI-DEMO-EXPAND-020..027 renders the %s custom-part option',
    (optionLabel, previewId, expectedSelector) => {
      showOptions();
      button(host, optionLabel).click();
      fixture.detectChanges();
      vi.runAllTimers();
      fixture.detectChanges();

      const preview = host.querySelector(`[data-component-preview-id="${previewId}"]`);
      expect(preview).toBeTruthy();
      expect(preview?.querySelector(expectedSelector)).toBeTruthy();
    },
  );

  it('AI-DEMO-EXPAND-022/028 keeps interactive preview state local', () => {
    showOptions();
    button(host, 'Set rollout percentage').click();
    fixture.detectChanges();
    vi.runAllTimers();
    fixture.detectChanges();

    const preview = host.querySelector<HTMLElement>('[data-component-preview-id="rollout-slider"]');
    const input = preview?.querySelector<HTMLInputElement>('input[type="range"]');
    if (preview === null || input === null || input === undefined) {
      throw new Error('Missing rollout slider preview.');
    }
    const messageCount = host.querySelectorAll('[data-message-id]').length;
    input.value = '80';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(preview.textContent).toContain('80% of users');
    expect(host.querySelectorAll('[data-message-id]')).toHaveLength(messageCount);
  });

  it('AI-DEMO-SURFACE-008 cancels scheduled work on destroy', () => {
    submitPrompt('hi');
    fixture.destroy();

    expect(() => vi.runAllTimers()).not.toThrow();
    expect(vi.getTimerCount()).toBe(0);
  });

  function showOptions(): void {
    submitPrompt('hi');
    vi.runAllTimers();
    fixture.detectChanges();
  }

  function submitPrompt(value: string): void {
    const input = composer(host);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    button(host, 'Send').click();
    fixture.detectChanges();
  }
});
