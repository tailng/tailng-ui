import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngDialogComponent, type TngDialogCloseReason } from '../tng-dialog.component';

function getByTestId<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Expected element [data-testid="${testId}"] to exist.`);
  }

  return element as T;
}

function findPanel(fixture: { nativeElement: HTMLElement }): HTMLElement | null {
  return fixture.nativeElement.querySelector('.tng-dialog-panel');
}

function findBackdrop(fixture: { nativeElement: HTMLElement }): HTMLElement | null {
  return fixture.nativeElement.querySelector('.tng-dialog-backdrop');
}

function findContentSlot(fixture: { nativeElement: HTMLElement }): HTMLElement | null {
  return fixture.nativeElement.querySelector('[data-slot="dialog-content"]');
}

function keydown(
  target: EventTarget,
  key: string,
  init: Partial<KeyboardEventInit> = {},
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
    shiftKey: init.shiftKey ?? false,
  });
  target.dispatchEvent(event);
  return event;
}

function pointerdown(target: EventTarget): PointerEvent {
  const event = new PointerEvent('pointerdown', {
    bubbles: true,
    cancelable: true,
    button: 0,
  });
  target.dispatchEvent(event);
  return event;
}

async function settle(fixture: {
  detectChanges(): void;
  whenStable(): Promise<unknown>;
}): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

@Component({
  imports: [TngDialogComponent],
  template: `
    <button type="button" data-testid="trigger" (click)="open.set(true)">Open</button>

    <tng-dialog
      [open]="open()"
      [title]="title()"
      [description]="description()"
      [closeOnBackdrop]="closeOnBackdrop()"
      [closeOnEscape]="closeOnEscape()"
      (openChange)="onOpenChange($event)"
      (closed)="closedReasons.push($event)"
    >
      <button type="button" data-testid="inside-first" data-tng-dialog-initial-focus>
        First action
      </button>
      <button type="button" data-testid="inside-last">Last action</button>
    </tng-dialog>

    <button type="button" data-testid="after">After</button>
  `,
})
class ManagedDialogHostComponent {
  public open = signal(false);
  public title = signal('Create Session');
  public description = signal('Configure project, owner, and notes.');
  public closeOnBackdrop = signal(true);
  public closeOnEscape = signal(true);
  public syncOpenOnChange = signal(true);

  public openChanges: boolean[] = [];
  public closedReasons: TngDialogCloseReason[] = [];

  public onOpenChange(next: boolean): void {
    this.openChanges.push(next);
    if (this.syncOpenOnChange()) {
      this.open.set(next);
    }
  }
}

@Component({
  imports: [TngDialogComponent],
  template: `
    <tng-dialog
      [open]="open()"
      (openChange)="openChanges.push($event)"
      (closed)="closedReasons.push($event)"
    >
      <button type="button" data-testid="inside">Inside</button>
    </tng-dialog>
  `,
})
class ControlledNoSyncHostComponent {
  public open = signal(true);
  public openChanges: boolean[] = [];
  public closedReasons: TngDialogCloseReason[] = [];
}

describe('tng-dialog component behavior', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('does not render backdrop/panel when open=false', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ManagedDialogHostComponent],
    }).createComponent(ManagedDialogHostComponent);

    await settle(fixture);

    expect(findBackdrop(fixture)).toBeNull();
    expect(findPanel(fixture)).toBeNull();
    expect(findContentSlot(fixture)).toBeNull();
  });

  it('exposes data-slot="dialog-content" on the projected content wrapper when open', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ManagedDialogHostComponent],
    }).createComponent(ManagedDialogHostComponent);
    fixture.componentInstance.open.set(true);

    await settle(fixture);

    const content = findContentSlot(fixture);
    expect(content).not.toBeNull();
    expect(content?.classList.contains('tng-dialog-content')).toBe(true);
    expect(content?.getAttribute('data-slot')).toBe('dialog-content');
  });

  it('projects slotted content inside the dialog-content wrapper', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ManagedDialogHostComponent],
    }).createComponent(ManagedDialogHostComponent);
    fixture.componentInstance.open.set(true);

    await settle(fixture);

    const content = findContentSlot(fixture);
    const first = getByTestId<HTMLButtonElement>(fixture, 'inside-first');
    const last = getByTestId<HTMLButtonElement>(fixture, 'inside-last');

    expect(content?.contains(first)).toBe(true);
    expect(content?.contains(last)).toBe(true);
  });

  it('renders aria semantics when open=true', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ManagedDialogHostComponent],
    }).createComponent(ManagedDialogHostComponent);
    fixture.componentInstance.open.set(true);

    await settle(fixture);

    const panel = findPanel(fixture);
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute('role')).toBe('dialog');
    expect(panel?.getAttribute('aria-modal')).toBe('true');
    expect(panel?.getAttribute('aria-labelledby')).toContain('tng-dialog');
    expect(panel?.getAttribute('aria-describedby')).toContain('tng-dialog');
  });

  it('close button emits close-button and closes when host syncs openChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ManagedDialogHostComponent],
    }).createComponent(ManagedDialogHostComponent);
    fixture.componentInstance.open.set(true);

    await settle(fixture);

    const closeButton = fixture.nativeElement.querySelector(
      '.tng-dialog-close',
    ) as HTMLButtonElement | null;
    expect(closeButton).not.toBeNull();
    closeButton?.click();
    await settle(fixture);

    expect(fixture.componentInstance.closedReasons).toEqual(['close-button']);
    expect(fixture.componentInstance.openChanges).toContain(false);
    expect(findPanel(fixture)).toBeNull();
  });

  it('Escape closes and restores focus to trigger when enabled', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ManagedDialogHostComponent],
    }).createComponent(ManagedDialogHostComponent);

    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    trigger.focus();
    trigger.click();
    await settle(fixture);

    const event = keydown(document, 'Escape');
    await settle(fixture);

    expect(event.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.closedReasons).toEqual(['escape']);
    expect(document.activeElement).toBe(trigger);
  });

  it('does not close on Escape when closeOnEscape=false', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ManagedDialogHostComponent],
    }).createComponent(ManagedDialogHostComponent);
    fixture.componentInstance.open.set(true);
    fixture.componentInstance.closeOnEscape.set(false);

    await settle(fixture);

    keydown(document, 'Escape');
    await settle(fixture);

    expect(fixture.componentInstance.closedReasons).toEqual([]);
    expect(findPanel(fixture)).not.toBeNull();
  });

  it('backdrop pointerdown closes when closeOnBackdrop=true', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ManagedDialogHostComponent],
    }).createComponent(ManagedDialogHostComponent);
    fixture.componentInstance.open.set(true);

    await settle(fixture);

    const backdrop = findBackdrop(fixture);
    expect(backdrop).not.toBeNull();
    pointerdown(backdrop!);
    await settle(fixture);

    expect(fixture.componentInstance.closedReasons).toEqual(['backdrop']);
    expect(findPanel(fixture)).toBeNull();
  });

  it('traps Tab focus inside panel', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ManagedDialogHostComponent],
    }).createComponent(ManagedDialogHostComponent);
    fixture.componentInstance.open.set(true);

    await settle(fixture);

    const close = fixture.nativeElement.querySelector(
      '.tng-dialog-close',
    ) as HTMLButtonElement | null;
    const last = getByTestId<HTMLButtonElement>(fixture, 'inside-last');
    expect(close).not.toBeNull();

    last.focus();
    const forward = keydown(last, 'Tab');
    await settle(fixture);
    expect(forward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(close);

    close!.focus();
    const backward = keydown(close!, 'Tab', { shiftKey: true });
    await settle(fixture);
    expect(backward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  it.each([
    ['Enter', 'Enter'],
    ['Space', ' '],
  ])('does not intercept %s on the last focusable control', async (_name, key) => {
    const fixture = TestBed.configureTestingModule({
      imports: [ManagedDialogHostComponent],
    }).createComponent(ManagedDialogHostComponent);
    fixture.componentInstance.open.set(true);

    await settle(fixture);

    const last = getByTestId<HTMLButtonElement>(fixture, 'inside-last');
    last.focus();

    const event = keydown(last, key);
    await settle(fixture);

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(last);
  });

  it('isolates nested background content while open', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ManagedDialogHostComponent],
    }).createComponent(ManagedDialogHostComponent);
    fixture.componentInstance.open.set(true);

    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    const after = getByTestId<HTMLButtonElement>(fixture, 'after');
    const host = fixture.nativeElement.querySelector('tng-dialog') as HTMLElement | null;
    const panel = findPanel(fixture);

    expect(host).not.toBeNull();
    expect(panel).not.toBeNull();
    expect(host?.getAttribute('aria-hidden')).toBeNull();
    expect(panel?.getAttribute('aria-hidden')).toBeNull();
    expect(trigger.getAttribute('aria-hidden')).toBe('true');
    expect(trigger.getAttribute('inert')).toBe('');
    expect(after.getAttribute('aria-hidden')).toBe('true');
    expect(after.getAttribute('inert')).toBe('');

    fixture.componentInstance.open.set(false);
    await settle(fixture);

    expect(trigger.getAttribute('aria-hidden')).toBeNull();
    expect(trigger.getAttribute('inert')).toBeNull();
    expect(after.getAttribute('aria-hidden')).toBeNull();
    expect(after.getAttribute('inert')).toBeNull();
  });

  it('redirects document Tab back into the dialog when focus escapes to background content', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ManagedDialogHostComponent],
    }).createComponent(ManagedDialogHostComponent);
    fixture.componentInstance.open.set(true);

    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    const after = getByTestId<HTMLButtonElement>(fixture, 'after');
    const close = fixture.nativeElement.querySelector(
      '.tng-dialog-close',
    ) as HTMLButtonElement | null;
    const last = getByTestId<HTMLButtonElement>(fixture, 'inside-last');
    expect(close).not.toBeNull();

    trigger.focus();
    const tabForward = keydown(document, 'Tab');
    await settle(fixture);
    expect(tabForward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(close);

    after.focus();
    const tabBackward = keydown(document, 'Tab', { shiftKey: true });
    await settle(fixture);
    expect(tabBackward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  it('does not redirect focus for non-Tab document keys when focus is outside the panel', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ManagedDialogHostComponent],
    }).createComponent(ManagedDialogHostComponent);
    fixture.componentInstance.open.set(true);

    await settle(fixture);

    const after = getByTestId<HTMLButtonElement>(fixture, 'after');
    after.focus();

    const event = keydown(document, 'ArrowDown');
    await settle(fixture);

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(after);
  });

  it('controlled mode emits close events but stays open until host updates input', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledNoSyncHostComponent],
    }).createComponent(ControlledNoSyncHostComponent);

    await settle(fixture);

    const closeButton = fixture.nativeElement.querySelector(
      '.tng-dialog-close',
    ) as HTMLButtonElement | null;
    expect(closeButton).not.toBeNull();
    closeButton?.click();
    await settle(fixture);

    expect(fixture.componentInstance.closedReasons).toEqual(['close-button']);
    expect(fixture.componentInstance.openChanges).toEqual([false]);
    expect(fixture.componentInstance.open()).toBe(true);
    expect(findPanel(fixture)).not.toBeNull();
  });
});
