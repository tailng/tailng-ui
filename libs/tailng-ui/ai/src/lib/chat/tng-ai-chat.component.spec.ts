import { Component, inject, type OnDestroy, type Provider } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngAiChatComponent } from './tng-ai-chat.component';
import {
  provideTngAiMessagePartRenderer,
  TNG_AI_CHAT_HEADER_CONTEXT,
  TNG_AI_MESSAGE_PART_CONTEXT,
  type TngAiChatPartActionEvent,
  type TngAiMessagePartRenderer,
} from './tng-ai-chat.types';
import type { TngAiExtensionPart } from '../core/message-part.types';
import type { TngAiMessage } from '../core/message.types';

function message(id: string, role: TngAiMessage['role'], text: string): TngAiMessage {
  return {
    id,
    threadId: 'thread-1',
    role,
    status: 'complete',
    parts: [{ id: `${id}-text`, type: 'text', text, format: 'plain' }],
  };
}

function extensionMessage(id: string, name = 'example.dev/card', label = 'First'): TngAiMessage {
  return {
    id,
    threadId: 'thread-1',
    role: 'assistant',
    status: 'complete',
    parts: [
      {
        id: `${id}-extension`,
        type: 'extension',
        name,
        value: { label },
      },
    ],
  };
}

@Component({
  selector: 'tng-ai-test-header',
  template: `
    <div data-testid="custom-header">
      {{ context.title() }} · {{ context.status() }} · {{ context.assistantLabel() }}
    </div>
  `,
})
class TestHeaderComponent {
  public static instances = 0;
  public readonly context = inject(TNG_AI_CHAT_HEADER_CONTEXT);

  public constructor() {
    TestHeaderComponent.instances += 1;
  }
}

@Component({
  selector: 'tng-ai-test-part',
  template: `
    <button data-testid="custom-part" type="button" (click)="select()">
      {{ label }} · {{ context.message().id }}
    </button>
  `,
})
class TestPartComponent implements OnDestroy {
  public static instances = 0;
  public static destructions = 0;
  public readonly context = inject(TNG_AI_MESSAGE_PART_CONTEXT);

  public constructor() {
    TestPartComponent.instances += 1;
  }

  protected get label(): string {
    const part = this.context.part();
    return part.type === 'extension' && typeof part.value === 'object' && part.value !== null
      ? String(part.value.label)
      : 'Unsupported';
  }

  protected select(): void {
    this.context.emitAction({ name: 'select', value: 'selected' });
  }

  public ngOnDestroy(): void {
    TestPartComponent.destructions += 1;
  }
}

@Component({
  selector: 'tng-ai-provider-test-part',
  template: `<span data-testid="provider-part">Provider renderer</span>`,
})
class ProviderPartComponent {}

@Component({
  imports: [TngAiChatComponent],
  template: `<tng-ai-chat [messages]="messages" />`,
})
class SelectorHostComponent {
  protected readonly messages: readonly TngAiMessage[] = [];
}

function createChat(
  messages: readonly TngAiMessage[] = [],
  providers: readonly Provider[] = [],
): {
  fixture: ComponentFixture<TngAiChatComponent>;
  host: HTMLElement;
} {
  const fixture = TestBed.configureTestingModule({
    imports: [TngAiChatComponent, TestHeaderComponent, TestPartComponent, ProviderPartComponent],
    providers,
  }).createComponent(TngAiChatComponent);
  fixture.componentRef.setInput('messages', messages);
  fixture.detectChanges();
  return { fixture, host: fixture.nativeElement as HTMLElement };
}

describe('TngAiChatComponent shell and header', () => {
  it('AIC-API-005 uses the tng-ai-chat selector', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SelectorHostComponent],
    }).createComponent(SelectorHostComponent);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('tng-ai-chat')).toBeTruthy();

    fixture.destroy();
  });

  it('AIC-SHELL-001 renders a labelled chat region', () => {
    const { fixture, host } = createChat();

    const region = host.querySelector('[role="region"]');
    expect(region?.getAttribute('aria-label')).toBe('AI Assistant conversation');

    fixture.destroy();
  });

  it('AIC-SHELL-002 and AIC-SHELL-003 render the configured default header', () => {
    const { fixture, host } = createChat();
    fixture.componentRef.setInput('title', 'Support copilot');
    fixture.componentRef.setInput('subtitle', 'Online');
    fixture.componentRef.setInput('assistantLabel', 'Acme Assistant');
    fixture.componentRef.setInput('protocolLabel', 'AG-UI 1.0');
    fixture.detectChanges();

    const header = host.querySelector('[data-slot="ai-chat-header"]');
    expect(header?.textContent).toContain('Support copilot');
    expect(header?.textContent).toContain('Online');
    expect(header?.textContent).toContain('Acme Assistant');
    expect(header?.textContent).toContain('AG-UI 1.0');

    fixture.destroy();
  });

  it('AIC-SHELL-004 omits empty optional header labels', () => {
    const { fixture, host } = createChat();

    expect(host.querySelector('[data-slot="ai-chat-subtitle"]')).toBeNull();
    expect(host.querySelector('[data-slot="ai-chat-protocol"]')).toBeNull();

    fixture.destroy();
  });

  it('AIC-SHELL-005 renders messages in one ordered transcript', () => {
    const { fixture, host } = createChat([
      message('message-1', 'user', 'First'),
      message('message-2', 'assistant', 'Second'),
    ]);

    const transcript = host.querySelector('[data-slot="ai-chat-transcript"]');
    const rows = transcript?.querySelectorAll('[data-slot="ai-chat-message"]');
    expect(transcript?.tagName).toBe('OL');
    expect(rows).toHaveLength(2);
    expect(rows?.[0]?.textContent).toContain('First');
    expect(rows?.[1]?.textContent).toContain('Second');

    fixture.destroy();
  });

  it('AIC-SHELL-006 renders a documented empty state', () => {
    const { fixture, host } = createChat();

    expect(host.querySelector('[data-slot="ai-chat-empty"]')?.textContent).toContain(
      'Start a conversation',
    );

    fixture.destroy();
  });

  it('AIC-SHELL-007 exposes busy, disabled, and readonly states', () => {
    const { fixture, host } = createChat();
    fixture.componentRef.setInput('busy', true);
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    const root = host.querySelector('[data-slot="ai-chat"]');
    expect(root?.getAttribute('data-busy')).toBe('true');
    expect(root?.getAttribute('data-disabled')).toBe('true');
    expect(root?.getAttribute('data-readonly')).toBe('true');

    fixture.destroy();
  });

  it('AIC-HEADER-001 through AIC-HEADER-004 use one reactive custom header instance', () => {
    TestHeaderComponent.instances = 0;
    const { fixture, host } = createChat();
    fixture.componentRef.setInput('headerComponent', TestHeaderComponent);
    fixture.componentRef.setInput('title', 'Custom title');
    fixture.componentRef.setInput('status', 'Thinking');
    fixture.detectChanges();

    expect(host.querySelector('[data-slot="ai-chat-default-header"]')).toBeNull();
    expect(host.querySelector('[data-testid="custom-header"]')?.textContent).toContain(
      'Custom title · Thinking · Assistant',
    );
    expect(TestHeaderComponent.instances).toBe(1);

    fixture.componentRef.setInput('status', 'Complete');
    fixture.detectChanges();

    expect(host.querySelector('[data-testid="custom-header"]')?.textContent).toContain('Complete');
    expect(TestHeaderComponent.instances).toBe(1);

    fixture.destroy();
  });

  it('AIC-HEADER-006 restores the default header after removing the override', () => {
    const { fixture, host } = createChat();
    fixture.componentRef.setInput('headerComponent', TestHeaderComponent);
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="custom-header"]')).toBeTruthy();

    fixture.componentRef.setInput('headerComponent', null);
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="custom-header"]')).toBeNull();
    expect(host.querySelector('[data-slot="ai-chat-default-header"]')).toBeTruthy();

    fixture.destroy();
  });

  it('AIC-SHELL-010 treats opaque message IDs as inert attribute values', () => {
    const unsafeId = 'message"><script>window.bad=true</script>';
    const { fixture, host } = createChat([message(unsafeId, 'assistant', 'Safe content')]);

    expect(host.querySelector('script')).toBeNull();
    expect(
      host.querySelector('[data-slot="ai-chat-message"]')?.getAttribute('data-message-id'),
    ).toBe(unsafeId);

    fixture.destroy();
  });
});

describe('TngAiChatComponent custom message parts', () => {
  const localRenderer: TngAiMessagePartRenderer = {
    match: { type: 'extension', name: 'example.dev/card' },
    component: TestPartComponent,
  };

  it('AIC-CUSTOM-001 and AIC-CUSTOM-007 render an exact local component with context', () => {
    TestPartComponent.instances = 0;
    const { fixture, host } = createChat([extensionMessage('message-1')]);
    fixture.componentRef.setInput('partRenderers', [localRenderer]);
    fixture.detectChanges();

    expect(host.querySelector('[data-testid="custom-part"]')?.textContent).toContain(
      'First · message-1',
    );
    expect(TestPartComponent.instances).toBe(1);

    fixture.destroy();
  });

  it('AIC-CUSTOM-002 uses an injected renderer when no local renderer exists', () => {
    const { fixture, host } = createChat(
      [extensionMessage('message-1')],
      [
        provideTngAiMessagePartRenderer({
          match: { type: 'extension', name: 'example.dev/card' },
          component: ProviderPartComponent,
        }),
      ],
    );

    expect(host.querySelector('[data-testid="provider-part"]')).toBeTruthy();

    fixture.destroy();
  });

  it('AIC-CUSTOM-003 gives the local renderer precedence over an injected renderer', () => {
    const { fixture, host } = createChat(
      [extensionMessage('message-1')],
      [
        provideTngAiMessagePartRenderer({
          match: { type: 'extension', name: 'example.dev/card' },
          component: ProviderPartComponent,
        }),
      ],
    );
    fixture.componentRef.setInput('partRenderers', [localRenderer]);
    fixture.detectChanges();

    expect(host.querySelector('[data-testid="custom-part"]')).toBeTruthy();
    expect(host.querySelector('[data-testid="provider-part"]')).toBeNull();

    fixture.destroy();
  });

  it('AIC-CUSTOM-005 and AIC-CUSTOM-006 require an exact extension name', () => {
    const { fixture, host } = createChat([extensionMessage('message-1', 'example.dev/other')]);
    fixture.componentRef.setInput('partRenderers', [localRenderer]);
    fixture.detectChanges();

    expect(host.querySelector('[data-testid="custom-part"]')).toBeNull();
    expect(host.querySelector('[data-slot="ai-chat-unsupported-part"]')).toBeTruthy();

    fixture.destroy();
  });

  it('AIC-CUSTOM-009 emits one typed action with message and part identity', () => {
    const actions: TngAiChatPartActionEvent[] = [];
    const { fixture, host } = createChat([extensionMessage('message-1')]);
    fixture.componentRef.setInput('partRenderers', [localRenderer]);
    fixture.componentInstance.partAction.subscribe((event) => actions.push(event));
    fixture.detectChanges();

    host.querySelector<HTMLButtonElement>('[data-testid="custom-part"]')?.click();

    expect(actions).toEqual([
      {
        action: { name: 'select', value: 'selected' },
        messageId: 'message-1',
        partId: 'message-1-extension',
      },
    ]);

    fixture.destroy();
  });

  it('AIC-CUSTOM-011 updates context without recreating an unchanged renderer', () => {
    TestPartComponent.instances = 0;
    const { fixture, host } = createChat([extensionMessage('message-1', undefined, 'First')]);
    fixture.componentRef.setInput('partRenderers', [localRenderer]);
    fixture.detectChanges();

    fixture.componentRef.setInput('messages', [
      extensionMessage('message-1', undefined, 'Updated'),
    ]);
    fixture.detectChanges();

    expect(host.querySelector('[data-testid="custom-part"]')?.textContent).toContain('Updated');
    expect(TestPartComponent.instances).toBe(1);

    fixture.destroy();
  });

  it('AIC-CUSTOM-013 destroys a custom component when its part is removed', () => {
    TestPartComponent.destructions = 0;
    const { fixture } = createChat([extensionMessage('message-1')]);
    fixture.componentRef.setInput('partRenderers', [localRenderer]);
    fixture.detectChanges();

    fixture.componentRef.setInput('messages', []);
    fixture.detectChanges();

    expect(TestPartComponent.destructions).toBe(1);

    fixture.destroy();
  });

  it('AIC-CUSTOM-019 never treats an agent component name as executable code', () => {
    const maliciousPart: TngAiExtensionPart = {
      id: 'unsafe-part',
      type: 'extension',
      name: 'example.dev/card',
      value: { component: 'TestPartComponent', module: 'https://example.dev/component.js' },
    };
    const unsafeMessage: TngAiMessage = {
      ...extensionMessage('message-1'),
      parts: [maliciousPart],
    };
    const { fixture, host } = createChat([unsafeMessage]);

    expect(host.querySelector('[data-testid="custom-part"]')).toBeNull();
    expect(host.querySelector('[data-slot="ai-chat-unsupported-part"]')).toBeTruthy();

    fixture.destroy();
  });

  it('AIC-SEC-001 renders text containing markup inertly', () => {
    const { fixture, host } = createChat([
      message('message-1', 'assistant', '<img src=x onerror="window.bad=true">'),
    ]);

    expect(host.querySelector('[data-slot="ai-chat-part"]')?.textContent).toContain('<img src=x');
    expect(host.querySelector('img')).toBeNull();

    fixture.destroy();
  });
});

describe('TngAiChatComponent composer and requests', () => {
  function textarea(host: HTMLElement): HTMLTextAreaElement {
    const result = host.querySelector<HTMLTextAreaElement>('[data-slot="ai-chat-composer-input"]');
    if (result === null) {
      throw new Error('Missing AI chat composer textarea.');
    }
    return result;
  }

  function enterDraft(fixture: ComponentFixture<TngAiChatComponent>, value: string): void {
    const input = textarea(fixture.nativeElement as HTMLElement);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }

  it('AIC-COMPOSER-001 and AIC-COMPOSER-002 label the composer and reject blank drafts', () => {
    const events: unknown[] = [];
    const { fixture, host } = createChat();
    fixture.componentInstance.messageSubmit.subscribe((event) => events.push(event));

    const input = textarea(host);
    const send = host.querySelector<HTMLButtonElement>('[data-slot="ai-chat-send"]');
    expect(input.getAttribute('aria-label')).toBe('Message AI Assistant');
    expect(send?.disabled).toBe(true);

    enterDraft(fixture, '   ');
    send?.click();
    expect(events).toEqual([]);

    fixture.destroy();
  });

  it('AIC-COMPOSER-003 through AIC-COMPOSER-006 emit a typed submit and clear local draft', () => {
    const events: unknown[] = [];
    const { fixture, host } = createChat();
    fixture.componentInstance.messageSubmit.subscribe((event) => events.push(event));
    enterDraft(fixture, '  Hello assistant  ');

    host.querySelector<HTMLButtonElement>('[data-slot="ai-chat-send"]')?.click();
    fixture.detectChanges();

    expect(events).toEqual([{ text: 'Hello assistant' }]);
    expect(textarea(host).value).toBe('');

    fixture.destroy();
  });

  it('AIC-COMPOSER-008 Enter submits and AIC-COMPOSER-009 Shift+Enter does not', () => {
    const events: unknown[] = [];
    const { fixture, host } = createChat();
    fixture.componentInstance.messageSubmit.subscribe((event) => events.push(event));
    enterDraft(fixture, 'First line');

    textarea(host).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true }),
    );
    expect(events).toEqual([]);

    textarea(host).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(events).toEqual([{ text: 'First line' }]);

    fixture.destroy();
  });

  it('AIC-COMPOSER-010 does not submit Enter during IME composition', () => {
    const events: unknown[] = [];
    const { fixture, host } = createChat();
    fixture.componentInstance.messageSubmit.subscribe((event) => events.push(event));
    enterDraft(fixture, 'Composing');

    textarea(host).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true }),
    );

    expect(events).toEqual([]);

    fixture.destroy();
  });

  it('AIC-COMPOSER-011 and AIC-COMPOSER-012 enforce disabled and readonly states', () => {
    const { fixture, host } = createChat();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(textarea(host).disabled).toBe(true);

    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    expect(textarea(host).readOnly).toBe(true);
    expect(host.querySelector<HTMLButtonElement>('[data-slot="ai-chat-send"]')?.disabled).toBe(
      true,
    );

    fixture.destroy();
  });

  it('AIC-EVENT-001 and AIC-EVENT-002 expose one stop request while allowed', () => {
    let stopCount = 0;
    const { fixture, host } = createChat();
    fixture.componentInstance.stopRequest.subscribe(() => (stopCount += 1));
    fixture.componentRef.setInput('busy', true);
    fixture.componentRef.setInput('canStop', true);
    fixture.detectChanges();

    const stop = host.querySelector<HTMLButtonElement>('[data-slot="ai-chat-stop"]');
    expect(stop?.getAttribute('aria-label')).toBe('Stop response');
    stop?.click();
    expect(stopCount).toBe(1);

    fixture.destroy();
  });

  it('AIC-EVENT-003 and AIC-EVENT-004 expose a typed retry request when allowed', () => {
    const retries: unknown[] = [];
    const { fixture, host } = createChat([message('message-1', 'assistant', 'Answer')]);
    fixture.componentInstance.retryRequest.subscribe((event) => retries.push(event));
    fixture.componentRef.setInput('canRetry', true);
    fixture.detectChanges();

    host.querySelector<HTMLButtonElement>('[data-slot="ai-chat-retry"]')?.click();
    expect(retries).toEqual([{ messageId: 'message-1' }]);

    fixture.destroy();
  });

  it('AIC-EVENT-007 emits one load-earlier request with the oldest message identity', () => {
    const requests: unknown[] = [];
    const { fixture, host } = createChat([message('message-1', 'assistant', 'Oldest')]);
    fixture.componentInstance.loadEarlierRequest.subscribe((event) => requests.push(event));
    fixture.componentRef.setInput('hasEarlierMessages', true);
    fixture.detectChanges();

    host.querySelector<HTMLButtonElement>('[data-slot="ai-chat-load-earlier"]')?.click();
    expect(requests).toEqual([{ beforeMessageId: 'message-1' }]);

    fixture.destroy();
  });
});

describe('TngAiChatComponent scrolling and bounded rendering', () => {
  type Geometry = Readonly<{
    getScrollTop: () => number;
    setScrollHeight: (value: number) => void;
    setScrollTop: (value: number) => void;
  }>;

  function installGeometry(
    transcript: HTMLOListElement,
    initial: Readonly<{ clientHeight: number; scrollHeight: number; scrollTop: number }>,
  ): Geometry {
    let scrollHeight = initial.scrollHeight;
    let scrollTop = initial.scrollTop;
    Object.defineProperties(transcript, {
      clientHeight: { configurable: true, get: () => initial.clientHeight },
      scrollHeight: { configurable: true, get: () => scrollHeight },
      scrollTop: {
        configurable: true,
        get: () => scrollTop,
        set: (value: number) => {
          scrollTop = Math.max(
            0,
            Math.min(value, Math.max(0, scrollHeight - initial.clientHeight)),
          );
        },
      },
    });
    Object.defineProperty(transcript, 'scrollTo', {
      configurable: true,
      value: (options: ScrollToOptions): void => {
        transcript.scrollTop = options.top ?? transcript.scrollTop;
      },
    });
    return {
      getScrollTop: () => scrollTop,
      setScrollHeight: (value) => (scrollHeight = value),
      setScrollTop: (value) => (scrollTop = value),
    };
  }

  function transcript(host: HTMLElement): HTMLOListElement {
    const result = host.querySelector<HTMLOListElement>('[data-slot="ai-chat-transcript"]');
    if (result === null) {
      throw new Error('Missing AI chat transcript.');
    }
    return result;
  }

  it('AIC-PERF-001 bounds rendered messages to the configured tail window', () => {
    const messages = Array.from({ length: 10 }, (_, index) =>
      message(`message-${index + 1}`, 'assistant', `Message ${index + 1}`),
    );
    const { fixture, host } = createChat(messages);
    fixture.componentRef.setInput('renderedMessageLimit', 3);
    fixture.detectChanges();

    const rows = host.querySelectorAll('[data-slot="ai-chat-message"]');
    expect(rows).toHaveLength(3);
    expect(rows[0]?.getAttribute('data-message-id')).toBe('message-8');
    expect(rows[2]?.getAttribute('data-message-id')).toBe('message-10');

    fixture.destroy();
  });

  it('AIC-SCROLL-005 through AIC-SCROLL-008 pause following and jump to unseen content', () => {
    const { fixture, host } = createChat([message('message-1', 'assistant', 'First')]);
    const list = transcript(host);
    const geometry = installGeometry(list, {
      clientHeight: 200,
      scrollHeight: 800,
      scrollTop: 600,
    });

    geometry.setScrollTop(200);
    list.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(list.getAttribute('data-following')).toBe('false');

    fixture.componentRef.setInput('messages', [
      message('message-1', 'assistant', 'First'),
      message('message-2', 'assistant', 'Second'),
    ]);
    geometry.setScrollHeight(900);
    fixture.detectChanges();

    const latest = host.querySelector<HTMLButtonElement>('[data-slot="ai-chat-jump-latest"]');
    expect(latest?.textContent).toContain('1 new message');
    expect(geometry.getScrollTop()).toBe(200);

    latest?.click();
    fixture.detectChanges();
    expect(list.getAttribute('data-following')).toBe('true');
    expect(host.querySelector('[data-slot="ai-chat-jump-latest"]')).toBeNull();

    fixture.destroy();
  });

  it('AIC-SCROLL-010 preserves reading position when earlier messages are prepended', () => {
    const { fixture, host } = createChat([
      message('message-2', 'assistant', 'Second'),
      message('message-3', 'assistant', 'Third'),
    ]);
    fixture.componentRef.setInput('hasEarlierMessages', true);
    fixture.detectChanges();
    const list = transcript(host);
    const geometry = installGeometry(list, {
      clientHeight: 200,
      scrollHeight: 600,
      scrollTop: 120,
    });

    host.querySelector<HTMLButtonElement>('[data-slot="ai-chat-load-earlier"]')?.click();
    fixture.componentRef.setInput('messages', [
      message('message-1', 'assistant', 'First'),
      message('message-2', 'assistant', 'Second'),
      message('message-3', 'assistant', 'Third'),
    ]);
    geometry.setScrollHeight(760);
    fixture.detectChanges();

    expect(geometry.getScrollTop()).toBe(280);

    fixture.destroy();
  });

  it('AIC-SCROLL-015 emits following, near-bottom, and unseen state', () => {
    const states: unknown[] = [];
    const { fixture, host } = createChat([message('message-1', 'assistant', 'First')]);
    fixture.componentInstance.scrollStateChange.subscribe((state) => states.push(state));
    const list = transcript(host);
    const geometry = installGeometry(list, {
      clientHeight: 200,
      scrollHeight: 800,
      scrollTop: 100,
    });

    list.dispatchEvent(new Event('scroll'));

    expect(states.at(-1)).toEqual({ following: false, nearBottom: false, unseenCount: 0 });
    expect(geometry.getScrollTop()).toBe(100);

    fixture.destroy();
  });
});
