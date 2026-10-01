import { Component } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { TngMenuItem } from '@tailng-ui/primitives';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TngMenuTriggerFor } from './tng-menu-trigger-for.directive';
import { TngMenuComponent } from './tng-menu.component';
import { TngPopoverTriggerFor } from '../../overlay/popover/tng-popover-trigger-for.directive';
import { TngPopoverComponent } from '../../overlay/popover/tng-popover.component';

@Component({
  imports: [
    TngMenuComponent,
    TngMenuItem,
    TngMenuTriggerFor,
    TngPopoverComponent,
    TngPopoverTriggerFor,
  ],
  template: `
    <tng-popover
      #popover="tngPopoverComponent"
      data-testid="popover"
      [closeOnFocusOutside]="true"
    >
      <button type="button" [tngMenuTriggerFor]="menu" data-testid="menu-trigger">Open menu</button>
      <tng-menu #menu="tngMenu" ariaLabel="Actions" data-testid="menu">
        <button type="button" tngMenuItem data-testid="menu-item">Run action</button>
      </tng-menu>
    </tng-popover>
    <button type="button" [tngPopoverTriggerFor]="popover" data-testid="popover-trigger">
      Open popover
    </button>
  `,
})
class NestedMenuHostComponent {}

@Component({
  imports: [TngMenuComponent, TngMenuItem, TngMenuTriggerFor],
  template: `
    <button type="button" [tngMenuTriggerFor]="menu" data-testid="menu-trigger">Open menu</button>
    <tng-menu #menu="tngMenu" ariaLabel="Actions" data-testid="menu">
      <button type="button" tngMenuItem>Run action</button>
    </tng-menu>
  `,
})
class StandaloneMenuHostComponent {}

type NestedMenuFixture = Readonly<{
  fixture: ComponentFixture<NestedMenuHostComponent>;
  item: HTMLButtonElement;
  menu: HTMLElement;
  menuTrigger: HTMLButtonElement;
  ownerId: string;
  popover: HTMLElement;
  popoverTrigger: HTMLButtonElement;
}>;

function createRect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

function mockRect(element: HTMLElement, rect: DOMRect): void {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(rect);
}

async function nextPositioningFrame(): Promise<void> {
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

function keydown(element: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
  element.dispatchEvent(event);
  return event;
}

function pointerdown(element: HTMLElement): PointerEvent {
  const event = new PointerEvent('pointerdown', { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event;
}

async function openNestedMenu(): Promise<NestedMenuFixture> {
  const fixture = TestBed.configureTestingModule({
    imports: [NestedMenuHostComponent],
  }).createComponent(NestedMenuHostComponent);
  fixture.detectChanges();

  const popover = fixture.nativeElement.querySelector('[data-testid="popover"]') as HTMLElement;
  const popoverPanel = popover.querySelector('[data-slot="popover-panel"]')!;
  const popoverTrigger = fixture.nativeElement.querySelector(
    '[data-testid="popover-trigger"]',
  ) as HTMLButtonElement;
  const menuTrigger = popover.querySelector('[data-testid="menu-trigger"]')!;
  const menu = popover.querySelector('[data-testid="menu"]')!;
  const item = menu.querySelector('[data-testid="menu-item"]')!;

  mockRect(popoverTrigger, createRect(320, 240, 140, 36));
  mockRect(popoverPanel, createRect(0, 0, 260, 140));
  mockRect(menuTrigger, createRect(336, 292, 180, 36));
  mockRect(menu, createRect(0, 0, 200, 96));

  popoverTrigger.click();
  fixture.detectChanges();
  await nextPositioningFrame();
  fixture.detectChanges();

  const layer = popover.querySelector('[data-tng-overlay-layer-id]')!;
  const ownerId = layer.getAttribute('data-tng-overlay-layer-id');
  if (ownerId === null) {
    throw new Error('Expected the popover to expose an overlay layer id.');
  }

  menuTrigger.click();
  fixture.detectChanges();
  await nextPositioningFrame();
  fixture.detectChanges();

  return { fixture, item, menu, menuTrigger, ownerId, popover, popoverTrigger };
}

describe('tng-menu nested overlay ownership', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps the owning popover open when focus moves into a portalled menu', async () => {
    const { menu, ownerId, popover } = await openNestedMenu();

    expect(menu.parentElement).toBe(document.body);
    expect(menu.getAttribute('data-tng-overlay-owner-id')).toBe(ownerId);
    expect(menu.getAttribute('data-state')).toBe('open');
    expect(popover.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(menu);
  });

  it('keeps ownership through selection exit and clears it after restoration', async () => {
    const { fixture, item, menu, ownerId, popover } = await openNestedMenu();
    menu.style.animationName = 'test-menu-exit';
    menu.style.animationDuration = '10s';
    menu.style.animationDelay = '0s';

    item.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
    item.click();
    fixture.detectChanges();

    expect(popover.getAttribute('data-state')).toBe('open');
    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(menu.getAttribute('data-presence')).toBe('exiting');
    expect(menu.getAttribute('data-tng-overlay-owner-id')).toBe(ownerId);
    expect(menu.parentElement).toBe(document.body);

    menu.dispatchEvent(new Event('animationend', { bubbles: true }));
    await Promise.resolve();
    fixture.detectChanges();

    expect(menu.getAttribute('data-presence')).toBe('closed');
    expect(menu.getAttribute('data-tng-overlay-owner-id')).toBeNull();
    expect(popover.contains(menu)).toBe(true);
  });

  it('closes the menu before its owning popover on consecutive Escape keys', async () => {
    const { fixture, menu, menuTrigger, popover } = await openNestedMenu();

    const menuEscape = keydown(menu, 'Escape');
    fixture.detectChanges();

    expect(menuEscape.defaultPrevented).toBe(true);
    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(popover.getAttribute('data-state')).toBe('open');

    const popoverEscape = keydown(menuTrigger, 'Escape');
    fixture.detectChanges();

    expect(popoverEscape.defaultPrevented).toBe(true);
    expect(popover.getAttribute('data-state')).toBe('closed');
  });

  it('keeps the parent popover positioned while it and its nested menu are exiting', async () => {
    const { fixture, menu, popover, popoverTrigger } = await openNestedMenu();
    const panel = popover.querySelector<HTMLElement>('[data-slot="popover-panel"]')!;
    panel.style.animationName = 'test-popover-exit';
    panel.style.animationDuration = '10s';
    panel.style.animationDelay = '0s';
    menu.style.animationName = 'test-menu-exit';
    menu.style.animationDuration = '10s';
    menu.style.animationDelay = '0s';
    const left = popover.style.left;
    const top = popover.style.top;

    pointerdown(popoverTrigger);
    popoverTrigger.click();
    fixture.detectChanges();

    expect(menu.getAttribute('data-presence')).toBe('exiting');
    expect(panel.getAttribute('data-presence')).toBe('exiting');
    expect(panel.hasAttribute('hidden')).toBe(false);
    expect(popover.parentElement).toBe(document.body);
    expect(popover.style.left).toBe(left);
    expect(popover.style.top).toBe(top);
    expect(popover.style.left).not.toBe('0px');
    expect(popover.style.top).not.toBe('0px');

    panel.dispatchEvent(new Event('animationend', { bubbles: true }));
    await Promise.resolve();
    fixture.detectChanges();

    expect(panel.getAttribute('data-presence')).toBe('closed');
    expect(panel.hasAttribute('hidden')).toBe(true);
    expect(fixture.nativeElement.contains(popover)).toBe(true);
  });

  it('does not stamp an owner id on a standalone portalled menu', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StandaloneMenuHostComponent],
    }).createComponent(StandaloneMenuHostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="menu-trigger"]',
    ) as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    mockRect(trigger, createRect(24, 40, 120, 36));
    mockRect(menu, createRect(0, 0, 180, 120));

    trigger.click();
    fixture.detectChanges();
    await nextPositioningFrame();
    fixture.detectChanges();

    expect(menu.parentElement).toBe(document.body);
    expect(menu.getAttribute('data-state')).toBe('open');
    expect(menu.getAttribute('data-tng-overlay-owner-id')).toBeNull();
  });

  it('closes without moving when its trigger loses usable geometry', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StandaloneMenuHostComponent],
    }).createComponent(StandaloneMenuHostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="menu-trigger"]',
    ) as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    let triggerRect = createRect(24, 40, 120, 36);
    vi.spyOn(trigger, 'getBoundingClientRect').mockImplementation(() => triggerRect);
    mockRect(menu, createRect(0, 0, 180, 120));

    trigger.click();
    fixture.detectChanges();
    await nextPositioningFrame();
    fixture.detectChanges();

    const stableLeft = menu.style.left;
    const stableTop = menu.style.top;
    menu.style.animationName = 'test-menu-exit';
    menu.style.animationDuration = '10s';
    menu.style.animationDelay = '0s';
    triggerRect = createRect(0, 0, 0, 0);

    window.dispatchEvent(new Event('resize'));
    await nextPositioningFrame();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(menu.getAttribute('data-presence')).toBe('exiting');
    expect(menu.style.left).toBe(stableLeft);
    expect(menu.style.top).toBe(stableTop);
    expect(menu.style.left).not.toBe('8px');
    expect(menu.style.top).not.toBe('8px');

    menu.dispatchEvent(new Event('animationend', { bubbles: true }));
  });
});
