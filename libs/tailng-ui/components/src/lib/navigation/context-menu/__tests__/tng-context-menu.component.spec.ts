import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  TngContextMenuTrigger,
  TngMenuItem,
  type TngMenuSelectEvent,
} from '@tailng-ui/primitives';
import { afterEach, describe, expect, it } from 'vitest';

import { TngContextMenuComponent } from '../tng-context-menu.component';

function contextmenu(el: HTMLElement, x = 24, y = 48): MouseEvent {
  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
  });

  el.dispatchEvent(event);
  return event;
}

function keydown(el: HTMLElement, key: string, shiftKey = false): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
    shiftKey,
  });

  el.dispatchEvent(event);
  return event;
}

function pointerdown(el: HTMLElement): PointerEvent {
  const event = new PointerEvent('pointerdown', {
    bubbles: true,
    cancelable: true,
    button: 0,
  });

  el.dispatchEvent(event);
  return event;
}

@Component({
  imports: [TngContextMenuComponent, TngContextMenuTrigger, TngMenuItem],
  template: `
    <div
      tabindex="0"
      [tngContextMenuTrigger]="menu"
      data-testid="target"
    >
      Row target
    </div>

    <button type="button" data-testid="outside">Outside</button>

    <tng-context-menu
      #menu="tngContextMenu"
      [disabled]="disabled()"
      ariaLabel="Row actions"
      (tngMenuSelect)="onSelect($event)"
      data-testid="menu"
      style="--tng-context-menu-z-overlay: 9"
    >
      <button type="button" tngMenuItem [tngMenuItemValue]="'Duplicate row'" data-testid="duplicate">
        Duplicate
      </button>
      <button type="button" tngMenuItem [tngMenuItemValue]="'Delete row'" data-testid="delete">
        Delete
      </button>
    </tng-context-menu>
  `,
})
class ContextMenuComponentHost {
  public readonly disabled = signal(false);
  public readonly events: TngMenuSelectEvent[] = [];

  public onSelect(event: TngMenuSelectEvent): void {
    this.events.push(event);
  }
}

describe('tng-context-menu component wrapper', () => {
  afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('exports the context-menu component', () => {
    expect(typeof TngContextMenuComponent).toBe('function');
  });

  it('opens from contextmenu and keeps primitive role/state attributes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuComponentHost],
    }).createComponent(ContextMenuComponentHost);

    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    const event = contextmenu(target, 12, 34);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.getAttribute('data-slot')).toBe('menu');
    expect(menu.getAttribute('aria-label')).toBe('Row actions');
    expect(menu.getAttribute('data-state')).toBe('open');
    expect(target.getAttribute('aria-expanded')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('releases scroll lock after close', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuComponentHost],
    }).createComponent(ContextMenuComponentHost);

    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const outside = fixture.nativeElement.querySelector('[data-testid="outside"]') as HTMLButtonElement;

    contextmenu(target);
    fixture.detectChanges();
    expect(document.body.style.overflow).toBe('hidden');

    pointerdown(outside);
    fixture.detectChanges();

    expect(document.body.style.overflow).toBe('');
  });

  it('bridges context-menu overlay z-index into the shared menu z-index token', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuComponentHost],
    }).createComponent(ContextMenuComponentHost);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const styles = getComputedStyle(menu);

    expect(styles.getPropertyValue('--tng-context-menu-z-overlay').trim()).toBe('9');
    expect(styles.getPropertyValue('--tng-menu-z-overlay').trim()).toContain(
      '--tng-context-menu-z-overlay',
    );
  });

  it('opens from keyboard context-menu shortcuts and focuses the panel', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuComponentHost],
    }).createComponent(ContextMenuComponentHost);

    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    target.focus();
    const event = keydown(target, 'F10', true);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(menu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(menu);
  });

  it('emits selection and closes after item click by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuComponentHost],
    }).createComponent(ContextMenuComponentHost);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const duplicate = fixture.nativeElement.querySelector(
      '[data-testid="duplicate"]',
    ) as HTMLButtonElement;

    contextmenu(target);
    fixture.detectChanges();
    duplicate.click();
    fixture.detectChanges();

    expect(host.events).toEqual([
      {
        value: 'Duplicate row',
        itemId: duplicate.id,
        trigger: 'pointer',
      },
    ]);
    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(target.getAttribute('aria-expanded')).toBe('false');
  });

  it('moves the active item and selects it with keyboard after opening from pointer', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuComponentHost],
    }).createComponent(ContextMenuComponentHost);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const duplicate = fixture.nativeElement.querySelector(
      '[data-testid="duplicate"]',
    ) as HTMLButtonElement;

    contextmenu(target);
    fixture.detectChanges();

    expect(document.activeElement).toBe(menu);

    const arrowEvent = keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(arrowEvent.defaultPrevented).toBe(true);
    expect(menu.getAttribute('aria-activedescendant')).toBe(duplicate.id);
    expect(duplicate.hasAttribute('data-active')).toBe(true);

    const enterEvent = keydown(menu, 'Enter');
    fixture.detectChanges();

    expect(enterEvent.defaultPrevented).toBe(true);
    expect(host.events).toEqual([
      {
        value: 'Duplicate row',
        itemId: duplicate.id,
        trigger: 'keyboard',
      },
    ]);
    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('reasserts panel focus after a pointer-open frame so arrow keys keep working', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuComponentHost],
    }).createComponent(ContextMenuComponentHost);

    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const duplicate = fixture.nativeElement.querySelector(
      '[data-testid="duplicate"]',
    ) as HTMLButtonElement;

    contextmenu(target);
    fixture.detectChanges();

    target.focus();
    expect(document.activeElement).toBe(target);

    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();

    expect(document.activeElement).toBe(menu);

    keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(duplicate.id);
    expect(duplicate.hasAttribute('data-active')).toBe(true);
  });

  it('does not open when disabled is true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuComponentHost],
    }).createComponent(ContextMenuComponentHost);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    const pointerEvent = contextmenu(target);
    fixture.detectChanges();
    const keyboardEvent = keydown(target, 'ContextMenu');
    fixture.detectChanges();

    expect(pointerEvent.defaultPrevented).toBe(false);
    expect(keyboardEvent.defaultPrevented).toBe(false);
    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('closes on outside pointer and restores focus to the trigger target', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuComponentHost],
    }).createComponent(ContextMenuComponentHost);
    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const outside = fixture.nativeElement.querySelector('[data-testid="outside"]') as HTMLButtonElement;

    contextmenu(target);
    fixture.detectChanges();
    pointerdown(outside);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(target.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(target);
  });
});
