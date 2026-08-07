import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TngTagIcon } from '@tailng-ui/primitives';
import { afterEach, describe, expect, it } from 'vitest';
import { TngTagComponent } from '../tng-tag.component';

function getByTestId<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Expected element for data-testid="${testId}".`);
  }

  return element as T;
}

function queryByTestId<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): T | null {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return fixture.nativeElement.querySelector(`[data-testid="${testId}"]`) as T | null;
}

function dispatchEvent(target: EventTarget, type: string): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

function dispatchKeyboard(target: EventTarget, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
  });
  target.dispatchEvent(event);
  return event;
}

function queryTagRoot(host: HTMLElement): HTMLElement {
  const root = host.querySelector('.tng-tag');
  if (!(root instanceof HTMLElement)) {
    throw new Error('Expected .tng-tag root element.');
  }

  return root;
}

@Component({
  imports: [TngTagComponent, TngTagIcon],
  template: `
    <tng-tag
      data-testid="tag-host"
      [appearance]="appearance()"
      [tone]="tone()"
      [shape]="shape()"
      [size]="size()"
      [label]="label()"
      [removable]="removable()"
      [disabled]="disabled()"
      [closeAriaLabel]="closeAriaLabel()"
      (removed)="onRemoved()"
    >
      @if (withIcon()) {
        <span data-testid="tag-icon" tngTagIcon aria-hidden="true">●</span>
      }
      <span data-testid="tag-label">{{ label() }}</span>
    </tng-tag>
  `,
})
class TagComponentHost {
  public readonly appearance = signal<'outline' | 'soft' | 'solid'>('soft');
  public readonly closeAriaLabel = signal<string | null>(null);
  public readonly disabled = signal(false);
  public readonly label = signal('Stable');
  public readonly removable = signal(false);
  public readonly removedCount = signal(0);
  public readonly shape = signal<'pill' | 'rounded'>('pill');
  public readonly size = signal<'sm' | 'md'>('md');
  public readonly tone = signal<'danger' | 'info' | 'neutral' | 'success' | 'warning'>('neutral');
  public readonly withIcon = signal(true);

  public onRemoved(): void {
    this.removedCount.update((value) => value + 1);
  }
}

describe('tng-tag component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the public TngTagComponent symbol', () => {
    expect(typeof TngTagComponent).toBe('function');
  });

  it('renders slot and state attributes on the internal tag root', () => {
    const fixture = TestBed.configureTestingModule({ imports: [TagComponentHost] }).createComponent(
      TagComponentHost,
    );
    fixture.detectChanges();

    const root = queryTagRoot(getByTestId<HTMLElement>(fixture, 'tag-host'));
    expect(root.getAttribute('data-slot')).toBe('tag');
    expect(root.getAttribute('data-appearance')).toBe('soft');
    expect(root.getAttribute('data-tone')).toBe('neutral');
    expect(root.getAttribute('data-shape')).toBe('pill');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.getAttribute('data-removable')).toBeNull();
  });

  it('supports projected icon content through tngTagIcon', () => {
    const fixture = TestBed.configureTestingModule({ imports: [TagComponentHost] }).createComponent(
      TagComponentHost,
    );
    fixture.detectChanges();

    const icon = getByTestId<HTMLElement>(fixture, 'tag-icon');
    expect(icon.getAttribute('data-slot')).toBe('tag-icon');

    fixture.componentInstance.withIcon.set(false);
    fixture.detectChanges();
    expect(queryByTestId(fixture, 'tag-icon')).toBeNull();
  });

  it('renders close control only when removable=true', () => {
    const fixture = TestBed.configureTestingModule({ imports: [TagComponentHost] }).createComponent(
      TagComponentHost,
    );
    fixture.detectChanges();

    expect(queryByTestId(fixture, 'tag-close')).toBeNull();

    fixture.componentInstance.removable.set(true);
    fixture.detectChanges();

    const closeButton = queryTagRoot(getByTestId<HTMLElement>(fixture, 'tag-host')).querySelector(
      '.tng-tag__close',
    );
    expect(closeButton).not.toBeNull();
  });

  it('uses default close aria label from tag label when removable', () => {
    const fixture = TestBed.configureTestingModule({ imports: [TagComponentHost] }).createComponent(
      TagComponentHost,
    );
    fixture.componentInstance.label.set('Preview');
    fixture.componentInstance.removable.set(true);
    fixture.detectChanges();

    const closeButton = queryTagRoot(getByTestId<HTMLElement>(fixture, 'tag-host')).querySelector(
      '.tng-tag__close',
    );
    expect(closeButton?.getAttribute('aria-label')).toBe('Remove Preview');
  });

  it('uses explicit close aria label when provided', () => {
    const fixture = TestBed.configureTestingModule({ imports: [TagComponentHost] }).createComponent(
      TagComponentHost,
    );
    fixture.componentInstance.removable.set(true);
    fixture.componentInstance.closeAriaLabel.set('Remove release tag');
    fixture.detectChanges();

    const closeButton = queryTagRoot(getByTestId<HTMLElement>(fixture, 'tag-host')).querySelector(
      '.tng-tag__close',
    );
    expect(closeButton?.getAttribute('aria-label')).toBe('Remove release tag');
  });

  it('emits removed when close button is clicked', () => {
    const fixture = TestBed.configureTestingModule({ imports: [TagComponentHost] }).createComponent(
      TagComponentHost,
    );
    fixture.componentInstance.removable.set(true);
    fixture.detectChanges();

    const closeButton = queryTagRoot(getByTestId<HTMLElement>(fixture, 'tag-host')).querySelector(
      '.tng-tag__close',
    )!;
    dispatchEvent(closeButton, 'click');
    fixture.detectChanges();

    expect(fixture.componentInstance.removedCount()).toBe(1);
  });

  it('emits removed when close button receives Enter/Space', () => {
    const fixture = TestBed.configureTestingModule({ imports: [TagComponentHost] }).createComponent(
      TagComponentHost,
    );
    fixture.componentInstance.removable.set(true);
    fixture.detectChanges();

    const closeButton = queryTagRoot(getByTestId<HTMLElement>(fixture, 'tag-host')).querySelector(
      '.tng-tag__close',
    )!;
    dispatchKeyboard(closeButton, 'Enter');
    dispatchKeyboard(closeButton, ' ');
    fixture.detectChanges();

    expect(fixture.componentInstance.removedCount()).toBe(2);
  });

  it('prevents removal when disabled=true', () => {
    const fixture = TestBed.configureTestingModule({ imports: [TagComponentHost] }).createComponent(
      TagComponentHost,
    );
    fixture.componentInstance.removable.set(true);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const root = queryTagRoot(getByTestId<HTMLElement>(fixture, 'tag-host'));
    const closeButton = root.querySelector('.tng-tag__close')!;
    dispatchEvent(closeButton, 'click');
    dispatchKeyboard(closeButton, 'Enter');
    fixture.detectChanges();

    expect(root.getAttribute('data-disabled')).toBe('');
    expect(closeButton.hasAttribute('disabled')).toBe(true);
    expect(fixture.componentInstance.removedCount()).toBe(0);
  });

  it('updates visual state attributes when inputs change', () => {
    const fixture = TestBed.configureTestingModule({ imports: [TagComponentHost] }).createComponent(
      TagComponentHost,
    );
    fixture.componentInstance.appearance.set('outline');
    fixture.componentInstance.tone.set('warning');
    fixture.componentInstance.shape.set('rounded');
    fixture.componentInstance.size.set('sm');
    fixture.componentInstance.removable.set(true);
    fixture.detectChanges();

    const root = queryTagRoot(getByTestId<HTMLElement>(fixture, 'tag-host'));
    expect(root.getAttribute('data-appearance')).toBe('outline');
    expect(root.getAttribute('data-tone')).toBe('warning');
    expect(root.getAttribute('data-shape')).toBe('rounded');
    expect(root.getAttribute('data-size')).toBe('sm');
    expect(root.getAttribute('data-removable')).toBe('');
  });
});