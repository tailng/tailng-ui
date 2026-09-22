import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TngCollapsibleComponent,
  createTngCollapsibleContentId,
  toggleTngCollapsibleState,
} from '../tng-collapsible.component';

function getByTestId<T extends Element>(fixture: { nativeElement: HTMLElement }, testId: string): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Expected element [data-testid="${testId}"] to exist.`);
  }

  return element;
}

function getRequired<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector(selector);
  if (element === null) {
    throw new Error(`Expected selector "${selector}" to resolve to an element.`);
  }

  return element;
}

function click(element: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event;
}

function keyboardActivate(
  element: HTMLElement,
  key: 'Enter' | ' ',
): { keydownEvent: KeyboardEvent; clickEvent: MouseEvent | null } {
  const keydownEvent = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
  });
  element.dispatchEvent(keydownEvent);

  if (keydownEvent.defaultPrevented) {
    return { keydownEvent, clickEvent: null };
  }

  const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
  element.dispatchEvent(clickEvent);
  return { keydownEvent, clickEvent };
}

@Component({
  imports: [TngCollapsibleComponent],
  template: `
    <tng-collapsible
      data-testid="collapsible-host"
      [title]="title()"
      [contentId]="contentId()"
      [open]="open()"
      [disabled]="disabled()"
      (openChange)="onOpenChange($event)"
    >
      <div data-testid="projected-content">Projected content</div>
    </tng-collapsible>
    <button type="button" data-testid="after">After</button>
  `,
})
class CollapsibleComponentHarness {
  readonly contentId = signal('collapsible-content-id');
  readonly disabled = signal(false);
  readonly open = signal(false);
  readonly title = signal('Release notes');
  readonly openChangeEvents: boolean[] = [];

  onOpenChange(nextOpen: boolean): void {
    this.openChangeEvents.push(nextOpen);
    this.open.set(nextOpen);
  }
}

describe('tng-collapsible component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports helper APIs and generates stable unique content ids', () => {
    expect(typeof TngCollapsibleComponent).toBe('function');

    const firstId = createTngCollapsibleContentId();
    const secondId = createTngCollapsibleContentId();
    expect(firstId).toContain('tng-collapsible-content-');
    expect(secondId).toContain('tng-collapsible-content-');
    expect(firstId).not.toBe(secondId);
  });

  it('toggle helper returns next state and honors disabled state', () => {
    expect(toggleTngCollapsibleState(false, false)).toBe(true);
    expect(toggleTngCollapsibleState(true, false)).toBe(false);
    expect(toggleTngCollapsibleState(false, true)).toBe(false);
    expect(toggleTngCollapsibleState(true, true)).toBe(true);
  });

  it('renders closed by default with correct aria/data attributes and hidden content', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CollapsibleComponentHarness],
    }).createComponent(CollapsibleComponentHarness);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'collapsible-host');
    const root = getRequired<HTMLElement>(host, '[data-slot="collapsible"]');
    const trigger = getRequired<HTMLButtonElement>(host, '[data-slot="collapsible-trigger"]');
    const content = getRequired<HTMLElement>(host, '[data-slot="collapsible-content"]');

    expect(root.getAttribute('data-state')).toBe('closed');
    expect(trigger.getAttribute('type')).toBe('button');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe('collapsible-content-id');
    expect(trigger.getAttribute('data-state')).toBe('closed');
    expect(content.getAttribute('id')).toBe('collapsible-content-id');
    expect(content.getAttribute('data-state')).toBe('closed');
    expect(content.getAttribute('hidden')).toBe('');
    expect(trigger.textContent).toContain('+');
  });

  it('renders open state from input and shows minus icon', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CollapsibleComponentHarness],
    }).createComponent(CollapsibleComponentHarness);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'collapsible-host');
    const root = getRequired<HTMLElement>(host, '[data-slot="collapsible"]');
    const trigger = getRequired<HTMLButtonElement>(host, '[data-slot="collapsible-trigger"]');
    const content = getRequired<HTMLElement>(host, '[data-slot="collapsible-content"]');

    expect(root.getAttribute('data-state')).toBe('open');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('data-state')).toBe('open');
    expect(content.getAttribute('data-state')).toBe('open');
    expect(content.hasAttribute('hidden')).toBe(false);
    expect(trigger.textContent).toContain('−');
  });

  it('propagates custom contentId and title input values', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CollapsibleComponentHarness],
    }).createComponent(CollapsibleComponentHarness);
    fixture.componentInstance.contentId.set('custom-collapse-content');
    fixture.componentInstance.title.set('FAQ');
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'collapsible-host');
    const trigger = getRequired<HTMLButtonElement>(host, '[data-slot="collapsible-trigger"]');
    const content = getRequired<HTMLElement>(host, '[data-slot="collapsible-content"]');
    const title = getRequired<HTMLElement>(host, '.tng-collapsible-title');

    expect(title.textContent?.trim()).toBe('FAQ');
    expect(trigger.getAttribute('aria-controls')).toBe('custom-collapse-content');
    expect(content.getAttribute('id')).toBe('custom-collapse-content');
  });

  it('click toggles and emits openChange values in controlled wiring', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CollapsibleComponentHarness],
    }).createComponent(CollapsibleComponentHarness);
    fixture.detectChanges();

    const hostInstance = fixture.componentInstance;
    const host = getByTestId<HTMLElement>(fixture, 'collapsible-host');
    const trigger = getRequired<HTMLButtonElement>(host, '[data-slot="collapsible-trigger"]');

    click(trigger);
    fixture.detectChanges();
    expect(hostInstance.open()).toBe(true);
    expect(hostInstance.openChangeEvents).toEqual([true]);

    click(trigger);
    fixture.detectChanges();
    expect(hostInstance.open()).toBe(false);
    expect(hostInstance.openChangeEvents).toEqual([true, false]);
  });

  it('keyboard activation (Enter/Space) toggles through button semantics', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CollapsibleComponentHarness],
    }).createComponent(CollapsibleComponentHarness);
    fixture.detectChanges();

    const hostInstance = fixture.componentInstance;
    const host = getByTestId<HTMLElement>(fixture, 'collapsible-host');
    const trigger = getRequired<HTMLButtonElement>(host, '[data-slot="collapsible-trigger"]');

    keyboardActivate(trigger, 'Enter');
    fixture.detectChanges();
    expect(hostInstance.open()).toBe(true);

    keyboardActivate(trigger, ' ');
    fixture.detectChanges();
    expect(hostInstance.open()).toBe(false);
  });

  it('disabled state applies attributes and keeps state unchanged on interaction', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CollapsibleComponentHarness],
    }).createComponent(CollapsibleComponentHarness);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const hostInstance = fixture.componentInstance;
    const host = getByTestId<HTMLElement>(fixture, 'collapsible-host');
    const root = getRequired<HTMLElement>(host, '[data-slot="collapsible"]');
    const trigger = getRequired<HTMLButtonElement>(host, '[data-slot="collapsible-trigger"]');

    expect(root.getAttribute('data-disabled')).toBe('');
    expect(trigger.getAttribute('data-disabled')).toBe('');
    expect(trigger.hasAttribute('disabled')).toBe(true);

    click(trigger);
    fixture.detectChanges();
    expect(hostInstance.open()).toBe(false);
    expect(hostInstance.openChangeEvents).toEqual([false]);
  });

  it('keeps trigger focusable and focus can move to next control', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CollapsibleComponentHarness],
    }).createComponent(CollapsibleComponentHarness);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'collapsible-host');
    const trigger = getRequired<HTMLButtonElement>(host, '[data-slot="collapsible-trigger"]');
    const after = getByTestId<HTMLButtonElement>(fixture, 'after');

    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    after.focus();
    expect(document.activeElement).toBe(after);
  });
});
