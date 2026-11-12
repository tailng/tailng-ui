import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AiChatLiveDemoComponent } from './ai-chat-live-demo.component';

class ComponentAssistantResizeObserver implements ResizeObserver {
  public static readonly instances: ComponentAssistantResizeObserver[] = [];

  public readonly observed = new Set<Element>();
  public disconnected = false;

  public constructor(private readonly callback: ResizeObserverCallback) {
    ComponentAssistantResizeObserver.instances.push(this);
  }

  public observe(target: Element): void {
    this.observed.add(target);
  }

  public unobserve(target: Element): void {
    this.observed.delete(target);
  }

  public disconnect(): void {
    this.disconnected = true;
    this.observed.clear();
  }

  public takeRecords(): ResizeObserverEntry[] {
    return [];
  }

  public emit(): void {
    this.callback([], this);
  }
}

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

type TranscriptGeometry = Readonly<{
  getScrollTop: () => number;
  setScrollTop: (value: number) => void;
  setScrollHeight: (value: number) => void;
}>;

function installTranscriptGeometry(
  transcript: HTMLElement,
  initial: Readonly<{ scrollHeight: number; clientHeight: number; scrollTop: number }>,
): TranscriptGeometry {
  let scrollHeight = initial.scrollHeight;
  let scrollTop = initial.scrollTop;
  Object.defineProperties(transcript, {
    clientHeight: { configurable: true, get: () => initial.clientHeight },
    scrollHeight: { configurable: true, get: () => scrollHeight },
    scrollTop: {
      configurable: true,
      get: () => scrollTop,
      set: (value: number) => {
        scrollTop = Math.max(0, Math.min(value, scrollHeight - initial.clientHeight));
      },
    },
  });
  Object.defineProperty(transcript, 'scrollTo', {
    configurable: true,
    value: (options: ScrollToOptions | number, y?: number): void => {
      const requested =
        typeof options === 'number' ? (y ?? 0) : (options.top ?? transcript.scrollTop);
      transcript.scrollTop = requested;
    },
  });
  return {
    getScrollTop: () => scrollTop,
    setScrollTop: (value) => {
      scrollTop = value;
    },
    setScrollHeight: (value) => {
      scrollHeight = value;
    },
  };
}

describe('AiChatLiveDemoComponent', () => {
  let fixture: ComponentFixture<AiChatLiveDemoComponent>;
  let host: HTMLElement;
  let animationFrames: Map<number, FrameRequestCallback>;
  let nextAnimationFrameId: number;
  let originalRequestAnimationFrame: typeof window.requestAnimationFrame;
  let originalCancelAnimationFrame: typeof window.cancelAnimationFrame;
  let originalResizeObserver: typeof window.ResizeObserver | undefined;

  beforeEach(() => {
    vi.useFakeTimers();
    animationFrames = new Map();
    nextAnimationFrameId = 1;
    originalRequestAnimationFrame = window.requestAnimationFrame;
    originalCancelAnimationFrame = window.cancelAnimationFrame;
    originalResizeObserver = window.ResizeObserver;
    ComponentAssistantResizeObserver.instances.length = 0;
    window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
      const id = nextAnimationFrameId;
      nextAnimationFrameId += 1;
      animationFrames.set(id, callback);
      return id;
    };
    window.cancelAnimationFrame = (id: number): void => {
      animationFrames.delete(id);
    };
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      value: ComponentAssistantResizeObserver,
    });
    fixture = TestBed.configureTestingModule({
      imports: [AiChatLiveDemoComponent],
    }).createComponent(AiChatLiveDemoComponent);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => {
    fixture.destroy();
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      value: originalResizeObserver,
    });
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('AI-DEMO-SURFACE-001 renders the full accessible component assistant', () => {
    expect(host.querySelector('[role="region"]')?.getAttribute('aria-label')).toBe(
      'TailNG component assistant',
    );
    expect(composer(host).getAttribute('aria-label')).toBe(
      'Message the TailNG component assistant',
    );
    expect(button(host, 'Send').disabled).toBe(true);
  });

  it('AI-DEMO-PRO-001 presents a distinct assistant identity and compact protocol badge', () => {
    const identity = host.querySelector('.component-assistant__identity');
    const avatar = identity?.querySelector('.component-assistant__avatar');
    const protocol = host.querySelector('.component-assistant__protocol');

    expect(avatar?.querySelector('tng-icon[icon="sparkles"]')).toBeTruthy();
    expect(identity?.textContent).toContain('TailNG Assistant');
    expect(identity?.textContent).toContain('Local demo');
    expect(protocol?.getAttribute('data-protocol')).toBe('ag-ui-1.0');
    expect(protocol?.textContent?.trim()).toBe('AG-UI 1.0');
  });

  it('AI-DEMO-PRO-002 gives assistant messages an avatar and content-sized message body', () => {
    const assistantMessage = host.querySelector('[data-message-role="assistant"]');

    expect(
      assistantMessage?.querySelector(
        '.component-assistant__message-avatar tng-icon[icon="sparkles"]',
      ),
    ).toBeTruthy();
    expect(assistantMessage?.querySelector('.component-assistant__message-content')).toBeTruthy();
  });

  it('AI-DEMO-PRO-003 uses labelled icon actions in the composer', () => {
    const sendButton = button(host, 'Send');

    expect(sendButton.querySelector('tng-icon[icon="send"]')).toBeTruthy();
    expect(sendButton.getAttribute('aria-label')).toBe('Send message');
  });

  it('AI-DEMO-EXPAND-013/014 shows twelve categorized options for a normalized greeting', () => {
    submitPrompt('  Hi  ');
    vi.runAllTimers();
    fixture.detectChanges();

    expect(host.textContent).toContain('Hi');
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
    expect(button(host, 'Choose a release date')).toBeTruthy();
    expect(button(host, 'Show monthly installs')).toBeTruthy();
    expect(button(host, 'Display a team table')).toBeTruthy();
    expect(button(host, 'Create status labels')).toBeTruthy();
    expect(button(host, 'Plan a project date range')).toBeTruthy();
    expect(button(host, 'Find a teammate')).toBeTruthy();
    expect(button(host, 'Set rollout percentage')).toBeTruthy();
    expect(button(host, 'Show adoption trend')).toBeTruthy();
    expect(button(host, 'Show release FAQ')).toBeTruthy();
    expect(button(host, 'Build release settings tabs')).toBeTruthy();
    expect(button(host, 'Show release steps')).toBeTruthy();
    expect(button(host, 'Track release progress')).toBeTruthy();
    expect(host.textContent).toContain('12 component options available.');
  });

  it('AI-DEMO-RUN-001/004/005 submits the option prompt and renders its component', () => {
    showOptions();
    button(host, 'Choose a release date').click();
    fixture.detectChanges();

    expect(host.textContent).toContain('Create a release date picker.');
    expect(host.querySelectorAll('[data-message-status="streaming"]')).toHaveLength(1);

    vi.runAllTimers();
    fixture.detectChanges();

    expect(host.querySelector('[data-tool-call-id]')?.textContent).toContain('render_component');
    expect(host.querySelector('[data-component-preview-id="release-date"]')).toBeTruthy();
  });

  it('AI-DEMO-GREET-004 gives help for an unsupported prompt without rendering a preview', () => {
    submitPrompt('Do something unknown');
    vi.runAllTimers();
    fixture.detectChanges();

    expect(host.textContent).toContain('Type “hi”');
    expect(host.querySelector('[data-component-preview-id]')).toBeNull();
  });

  it('AI-DEMO-RUN-006 stops before tool completion without rendering a preview', () => {
    showOptions();
    button(host, 'Show monthly installs').click();
    fixture.detectChanges();
    vi.advanceTimersByTime(350);
    fixture.detectChanges();

    button(host, 'Stop').click();
    fixture.detectChanges();
    vi.runAllTimers();
    fixture.detectChanges();

    expect(host.querySelector('[data-message-status="stopped"]')).toBeTruthy();
    expect(host.querySelector('[data-component-preview-id]')).toBeNull();
    expect(button(host, 'Retry')).toBeTruthy();
  });

  it('AI-DEMO-RUN-007 retries the stopped prompt and renders one preview', () => {
    showOptions();
    button(host, 'Show monthly installs').click();
    fixture.detectChanges();
    vi.advanceTimersByTime(350);
    fixture.detectChanges();
    button(host, 'Stop').click();
    fixture.detectChanges();

    button(host, 'Retry').click();
    fixture.detectChanges();
    vi.runAllTimers();
    fixture.detectChanges();

    expect(host.querySelectorAll('[data-component-preview-id="monthly-installs"]')).toHaveLength(1);
  });

  it('AI-DEMO-SURFACE-001 retains cursor history in the full variant', async () => {
    button(host, 'Load earlier').click();
    button(host, 'Load earlier').click();
    await vi.runAllTimersAsync();
    fixture.detectChanges();

    expect(host.textContent).toContain('Start of conversation');
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
    'AI-DEMO-EXPAND-020..027 renders the %s option through the allowlisted registry',
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

  it('AI-DEMO-EXPAND-022/028 keeps slider state local without starting another chat run', () => {
    showOptions();
    button(host, 'Set rollout percentage').click();
    fixture.detectChanges();
    vi.runAllTimers();
    fixture.detectChanges();

    submitPrompt('Create a rollout percentage slider.');
    vi.runAllTimers();
    fixture.detectChanges();

    const previews = Array.from(
      host.querySelectorAll<HTMLElement>('[data-component-preview-id="rollout-slider"]'),
    );
    expect(previews).toHaveLength(2);
    const firstInput = previews[0]?.querySelector<HTMLInputElement>('input[type="range"]');
    const secondInput = previews[1]?.querySelector<HTMLInputElement>('input[type="range"]');
    if (
      firstInput === null ||
      firstInput === undefined ||
      secondInput === null ||
      secondInput === undefined
    ) {
      throw new Error('Missing rollout slider input.');
    }
    const messageCount = host.querySelectorAll('[data-message-id]').length;
    firstInput.value = '80';
    firstInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(previews[0]?.textContent).toContain('80% of users');
    expect(previews[1]?.textContent).toContain('60% of users');
    expect(host.querySelectorAll('[data-message-id]')).toHaveLength(messageCount);
  });

  it('AI-DEMO-SURFACE-008 cancels scheduled work on destroy', () => {
    submitPrompt('hi');
    fixture.destroy();

    expect(() => vi.runAllTimers()).not.toThrow();
    expect(vi.getTimerCount()).toBe(0);
    expect(animationFrames.size).toBe(0);
  });

  it('AI-DEMO-SCROLL-001 starts in follow mode with the transcript end visible', () => {
    const transcript = componentTranscript();
    const geometry = installTranscriptGeometry(transcript, {
      scrollHeight: 1_000,
      clientHeight: 300,
      scrollTop: 0,
    });

    flushAnimationFrames();
    fixture.detectChanges();

    expect(geometry.getScrollTop()).toBe(700);
    expect(transcript.getAttribute('data-following')).toBe('true');
  });

  it('AI-DEMO-SCROLL-004 follows streaming growth after Angular renders it', () => {
    const transcript = componentTranscript();
    const geometry = installTranscriptGeometry(transcript, {
      scrollHeight: 1_000,
      clientHeight: 300,
      scrollTop: 700,
    });
    flushAnimationFrames();

    submitPrompt('hi');
    geometry.setScrollHeight(1_200);
    flushAnimationFrames();

    expect(geometry.getScrollTop()).toBe(900);
  });

  it('AI-DEMO-SCROLL-010/011/015 pauses follow, reports unseen content, and jumps to latest', () => {
    const transcript = componentTranscript();
    const geometry = installTranscriptGeometry(transcript, {
      scrollHeight: 1_000,
      clientHeight: 300,
      scrollTop: 700,
    });
    flushAnimationFrames();
    submitPrompt('hi');
    flushAnimationFrames();

    geometry.setScrollTop(400);
    transcript.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    vi.advanceTimersByTime(1);
    fixture.detectChanges();
    geometry.setScrollHeight(1_100);
    flushAnimationFrames();
    fixture.detectChanges();

    expect(geometry.getScrollTop()).toBe(400);
    expect(transcript.getAttribute('data-following')).toBe('false');
    expect(button(host, 'Jump to latest').textContent).toContain('1 new message');

    vi.advanceTimersByTime(179);
    fixture.detectChanges();
    geometry.setScrollHeight(1_180);
    flushAnimationFrames();
    fixture.detectChanges();

    expect(button(host, 'Jump to latest').textContent).toContain('1 new message');

    button(host, 'Jump to latest').click();
    fixture.detectChanges();
    flushAnimationFrames();
    fixture.detectChanges();

    expect(geometry.getScrollTop()).toBe(880);
    expect(transcript.getAttribute('data-following')).toBe('true');
    expect(host.textContent).not.toContain('1 new message');
  });

  it('AI-DEMO-SCROLL-018 preserves the reading position when history is prepended', async () => {
    const transcript = componentTranscript();
    const geometry = installTranscriptGeometry(transcript, {
      scrollHeight: 1_000,
      clientHeight: 300,
      scrollTop: 200,
    });
    flushAnimationFrames();
    geometry.setScrollTop(200);
    transcript.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    button(host, 'Load earlier').click();
    fixture.detectChanges();
    await vi.runAllTimersAsync();
    fixture.detectChanges();
    geometry.setScrollHeight(1_240);
    flushAnimationFrames();

    expect(geometry.getScrollTop()).toBe(440);
  });

  it('AI-DEMO-SCROLL-017 ignores a delayed programmatic scroll event after more growth', () => {
    const transcript = componentTranscript();
    const geometry = installTranscriptGeometry(transcript, {
      scrollHeight: 1_000,
      clientHeight: 300,
      scrollTop: 700,
    });
    flushAnimationFrames();

    submitPrompt('hi');
    flushAnimationFrames();
    geometry.setScrollHeight(1_200);
    transcript.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    flushAnimationFrames();

    expect(transcript.getAttribute('data-following')).toBe('true');
    expect(geometry.getScrollTop()).toBe(900);
  });

  it('AI-DEMO-SCROLL-022/027/028 coalesces resize follow work and disconnects on destroy', () => {
    const transcript = componentTranscript();
    const geometry = installTranscriptGeometry(transcript, {
      scrollHeight: 1_000,
      clientHeight: 300,
      scrollTop: 700,
    });
    flushAnimationFrames();
    const observer = ComponentAssistantResizeObserver.instances[0];
    if (observer === undefined) {
      throw new Error('Missing component assistant ResizeObserver.');
    }

    geometry.setScrollHeight(1_200);
    observer.emit();
    observer.emit();

    expect(animationFrames.size).toBe(1);
    flushAnimationFrames();
    expect(geometry.getScrollTop()).toBe(900);

    observer.emit();
    const pendingScrollFrameId = animationFrames.keys().next().value;
    expect(pendingScrollFrameId).toBeDefined();

    fixture.destroy();
    expect(observer.disconnected).toBe(true);
    expect(animationFrames.has(pendingScrollFrameId ?? -1)).toBe(false);
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

  function componentTranscript(): HTMLElement {
    const transcript = host.querySelector<HTMLElement>('.component-assistant__transcript');
    if (transcript === null) {
      throw new Error('Missing component assistant transcript.');
    }
    return transcript;
  }

  function flushAnimationFrames(): void {
    let rounds = 0;
    while (animationFrames.size > 0) {
      const callbacks = [...animationFrames.values()];
      animationFrames.clear();
      for (const callback of callbacks) {
        callback(rounds * 16);
      }
      rounds += 1;
      if (rounds > 20) {
        throw new Error('Animation frame reconciliation did not settle.');
      }
    }
  }
});
