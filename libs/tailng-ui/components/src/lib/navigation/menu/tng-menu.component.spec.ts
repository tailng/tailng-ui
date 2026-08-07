import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TngMenuItem } from '@tailng-ui/primitives';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { TngMenuTriggerFor } from './tng-menu-trigger-for.directive';

import { TngMenuComponent } from './tng-menu.component';

@Component({
  imports: [TngMenuComponent, TngMenuItem],
  template: `
    <tng-menu ariaLabel="Actions" data-testid="menu">
      <button type="button" tngMenuItem>Item</button>
    </tng-menu>
  `,
})
class HostComponent {}

@Component({
  imports: [TngMenuComponent, TngMenuItem, TngMenuTriggerFor],
  template: `
    <button type="button" [tngMenuTriggerFor]="menu" data-testid="trigger">Open</button>
    <tng-menu
      #menu="tngMenu"
      ariaLabel="Actions"
      data-testid="menu"
      style="--tng-menu-z-overlay: 7"
    >
      <button type="button" tngMenuItem>Item</button>
    </tng-menu>
  `,
})
class PositionedHostComponent {}

@Component({
  imports: [TngMenuComponent, TngMenuItem, TngMenuTriggerFor],
  template: `
    <button type="button" [tngMenuTriggerFor]="menu" data-testid="trigger">Open</button>
    <tng-menu #menu="tngMenu" ariaLabel="Actions" data-testid="menu" scrollStrategy="close">
      <button type="button" tngMenuItem>Item</button>
    </tng-menu>
  `,
})
class CloseOnScrollHostComponent {}

@Component({
  imports: [TngMenuComponent, TngMenuItem, TngMenuTriggerFor],
  template: `
    <button type="button" [tngMenuTriggerFor]="menu" data-testid="trigger">Open</button>
    <tng-menu #menu="tngMenu" ariaLabel="Actions" data-testid="menu" scrollStrategy="block">
      <button type="button" tngMenuItem>Item</button>
    </tng-menu>
  `,
})
class BlockScrollHostComponent {}

@Component({
  imports: [TngMenuComponent, TngMenuItem, TngMenuTriggerFor],
  template: `
    <button type="button" [tngMenuTriggerFor]="rootMenu" data-testid="root-trigger">Open</button>
    <tng-menu #rootMenu="tngMenu" ariaLabel="Root menu" data-testid="root-menu">
      <button
        type="button"
        tngMenuItem
        [tngMenuItemSubmenu]="childMenu"
        data-testid="child-trigger"
      >
        Child menu
      </button>

      <tng-menu #childMenu="tngMenu" ariaLabel="Child menu" data-testid="child-menu">
        <button
          type="button"
          tngMenuItem
          tngMenuItemValue="First child"
          data-testid="child-item-first"
        >
          First child
        </button>
        <button
          type="button"
          tngMenuItem
          tngMenuItemValue="Second child"
          data-testid="child-item-second"
        >
          Second child
        </button>
      </tng-menu>
    </tng-menu>
  `,
})
class CascadedMenuHostComponent {}

function keydown(el: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });

  el.dispatchEvent(event);
  return event;
}

function pointerenter(el: HTMLElement, pointerType = 'mouse'): PointerEvent {
  const event = new PointerEvent('pointerenter', {
    bubbles: true,
    cancelable: true,
    pointerType,
  });

  el.dispatchEvent(event);
  return event;
}

function mockElementRect(
  element: HTMLElement,
  rect: Readonly<{ height: number; left: number; top: number; width: number }>,
): void {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    x: rect.left,
    y: rect.top,
    toJSON: () => ({}),
  } as DOMRect);
}

function mockOverlayRects(trigger: HTMLElement, menu: HTMLElement): void {
  mockElementRect(trigger, {
    left: 24,
    top: 40,
    width: 120,
    height: 36,
  });
  mockElementRect(menu, {
    left: 0,
    top: 0,
    width: 180,
    height: 120,
  });
}

async function waitForPositioningFrame(): Promise<void> {
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

async function flushOverlayLayout(): Promise<void> {
  const maxPasses = 8;
  for (let index = 0; index < maxPasses; index += 1) {
    await waitForPositioningFrame();
    if (!document.querySelector('[data-positioning-state="pending"]')) {
      break;
    }
  }
}

function expectMenuPanelRenderable(menu: HTMLElement): void {
  expect(menu.getAttribute('data-state')).toBe('open');
  expect(menu.hasAttribute('hidden')).toBe(false);
  expect(menu.getAttribute('data-positioning-state')).toBeNull();
  expect(menu.parentElement).toBe(document.body);
  expect(menu.style.position).toBe('fixed');
  expect(menu.style.left).not.toBe('');
  expect(menu.style.top).not.toBe('');
}

describe('tng-menu component', () => {
  afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    vi.restoreAllMocks();
  });

  it('attaches the primitive menu directive to host and wires aria-label', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    expect(menu).toBeTruthy();
    expect(menu.getAttribute('data-slot')).toBe('menu');
    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.getAttribute('aria-label')).toBe('Actions');
  });

  it('uses the themed z-index chain when positioning the overlay host', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PositionedHostComponent],
    }).createComponent(PositionedHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    mockOverlayRects(trigger, menu);

    trigger.click();
    fixture.detectChanges();
    await waitForPositioningFrame();
    fixture.detectChanges();

    expect(menu.style.zIndex).toBe(
      'var(--tng-menu-z-overlay, var(--tng-menu-overlay-z-index, var(--tng-z-overlay, 50)))',
    );
  });

  it('focuses the positioned root menu without scrolling the page', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PositionedHostComponent],
    }).createComponent(PositionedHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const menuFocus = vi.spyOn(menu, 'focus');
    mockOverlayRects(trigger, menu);

    trigger.click();
    fixture.detectChanges();
    await waitForPositioningFrame();
    fixture.detectChanges();

    expect(menuFocus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('portals the menu to document.body while open and restores it when closed', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PositionedHostComponent],
    }).createComponent(PositionedHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    mockOverlayRects(trigger, menu);

    trigger.click();
    fixture.detectChanges();
    await waitForPositioningFrame();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
    expect(menu.parentElement).toBe(document.body);

    trigger.click();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(fixture.nativeElement.contains(menu)).toBe(true);
    expect(menu.parentElement).not.toBe(document.body);
  });

  it('keeps the menu open and repositions on window scroll by default', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PositionedHostComponent],
    }).createComponent(PositionedHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    mockOverlayRects(trigger, menu);

    trigger.click();
    fixture.detectChanges();
    await waitForPositioningFrame();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');

    window.dispatchEvent(new Event('scroll'));
    await waitForPositioningFrame();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
  });

  it('closes on outside scroll when scrollStrategy is close', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CloseOnScrollHostComponent],
    }).createComponent(CloseOnScrollHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    mockOverlayRects(trigger, menu);

    trigger.click();
    fixture.detectChanges();
    await waitForPositioningFrame();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');

    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('locks body scrolling when scrollStrategy is block', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [BlockScrollHostComponent],
    }).createComponent(BlockScrollHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    mockOverlayRects(trigger, menu);

    trigger.click();
    fixture.detectChanges();
    await waitForPositioningFrame();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
    expect(document.body.style.overflow).toBe('hidden');

    trigger.click();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(document.body.style.overflow).toBe('');
  });

  it('renders a clicked second-level submenu as a positioned body portal', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CascadedMenuHostComponent],
    }).createComponent(CascadedMenuHostComponent);

    fixture.detectChanges();

    const rootTrigger = fixture.nativeElement.querySelector(
      '[data-testid="root-trigger"]',
    ) as HTMLButtonElement;
    const rootMenu = fixture.nativeElement.querySelector(
      '[data-testid="root-menu"]',
    ) as HTMLElement;
    const childTrigger = fixture.nativeElement.querySelector(
      '[data-testid="child-trigger"]',
    ) as HTMLButtonElement;
    const childMenu = fixture.nativeElement.querySelector(
      '[data-testid="child-menu"]',
    ) as HTMLElement;
    const childItem = fixture.nativeElement.querySelector(
      '[data-testid="child-item-first"]',
    ) as HTMLButtonElement;

    mockElementRect(rootTrigger, { left: 20, top: 24, width: 112, height: 34 });
    mockElementRect(rootMenu, { left: 0, top: 0, width: 180, height: 96 });
    mockElementRect(childTrigger, { left: 28, top: 40, width: 148, height: 32 });
    mockElementRect(childMenu, { left: 0, top: 0, width: 172, height: 88 });

    rootTrigger.click();
    fixture.detectChanges();
    await flushOverlayLayout();
    fixture.detectChanges();

    childTrigger.click();
    fixture.detectChanges();
    await flushOverlayLayout();
    fixture.detectChanges();

    expectMenuPanelRenderable(childMenu);
    expect(childMenu.querySelector('[data-testid="child-item-first"]')).toBe(childItem);
    expect(childMenu.querySelector('[data-testid="child-item-second"]')).toBeTruthy();

    childItem.click();
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(childMenu.getAttribute('data-state')).toBe('closed');
    expect(rootMenu.getAttribute('data-state')).toBe('closed');
    expect(fixture.nativeElement.contains(rootMenu)).toBe(true);
    expect(rootMenu.contains(childMenu)).toBe(true);
  });

  it('renders a hovered second-level submenu as a positioned body portal', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CascadedMenuHostComponent],
    }).createComponent(CascadedMenuHostComponent);

    fixture.detectChanges();

    const rootTrigger = fixture.nativeElement.querySelector(
      '[data-testid="root-trigger"]',
    ) as HTMLButtonElement;
    const rootMenu = fixture.nativeElement.querySelector(
      '[data-testid="root-menu"]',
    ) as HTMLElement;
    const childTrigger = fixture.nativeElement.querySelector(
      '[data-testid="child-trigger"]',
    ) as HTMLButtonElement;
    const childMenu = fixture.nativeElement.querySelector(
      '[data-testid="child-menu"]',
    ) as HTMLElement;

    mockElementRect(rootTrigger, { left: 20, top: 24, width: 112, height: 34 });
    mockElementRect(rootMenu, { left: 0, top: 0, width: 180, height: 96 });
    mockElementRect(childTrigger, { left: 28, top: 40, width: 148, height: 32 });
    mockElementRect(childMenu, { left: 0, top: 0, width: 172, height: 88 });

    rootTrigger.click();
    fixture.detectChanges();
    await flushOverlayLayout();
    fixture.detectChanges();

    pointerenter(childTrigger);
    fixture.detectChanges();
    await flushOverlayLayout();
    fixture.detectChanges();

    expect(rootMenu.getAttribute('aria-activedescendant')).toBe(childTrigger.id);
    expectMenuPanelRenderable(childMenu);
    expect(childMenu.querySelector('[data-testid="child-item-first"]')).toBeTruthy();
    expect(childMenu.querySelector('[data-testid="child-item-second"]')).toBeTruthy();
  });

  it('does not focus a cascaded submenu before its fixed position is applied', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CascadedMenuHostComponent],
    }).createComponent(CascadedMenuHostComponent);

    fixture.detectChanges();

    const rootTrigger = fixture.nativeElement.querySelector(
      '[data-testid="root-trigger"]',
    ) as HTMLButtonElement;
    const rootMenu = fixture.nativeElement.querySelector(
      '[data-testid="root-menu"]',
    ) as HTMLElement;
    const childTrigger = fixture.nativeElement.querySelector(
      '[data-testid="child-trigger"]',
    ) as HTMLButtonElement;
    const childMenu = fixture.nativeElement.querySelector(
      '[data-testid="child-menu"]',
    ) as HTMLElement;
    const childFocus = vi.spyOn(childMenu, 'focus');

    mockElementRect(rootTrigger, { left: 20, top: 24, width: 112, height: 34 });
    mockElementRect(rootMenu, { left: 0, top: 0, width: 180, height: 96 });
    mockElementRect(childTrigger, { left: 28, top: 40, width: 148, height: 32 });
    mockElementRect(childMenu, { left: 0, top: 0, width: 172, height: 88 });

    rootTrigger.click();
    fixture.detectChanges();
    await flushOverlayLayout();
    fixture.detectChanges();

    childTrigger.click();
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(childMenu.getAttribute('data-state')).toBe('open');
    expect(childMenu.getAttribute('data-positioning-state')).toBe('pending');
    expect(childFocus).not.toHaveBeenCalled();

    await flushOverlayLayout();
    fixture.detectChanges();

    expectMenuPanelRenderable(childMenu);
    expect(childFocus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('renders a keyboard-opened second-level submenu as a positioned body portal', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CascadedMenuHostComponent],
    }).createComponent(CascadedMenuHostComponent);

    fixture.detectChanges();

    const rootTrigger = fixture.nativeElement.querySelector(
      '[data-testid="root-trigger"]',
    ) as HTMLButtonElement;
    const rootMenu = fixture.nativeElement.querySelector(
      '[data-testid="root-menu"]',
    ) as HTMLElement;
    const childTrigger = fixture.nativeElement.querySelector(
      '[data-testid="child-trigger"]',
    ) as HTMLButtonElement;
    const childMenu = fixture.nativeElement.querySelector(
      '[data-testid="child-menu"]',
    ) as HTMLElement;

    mockElementRect(rootTrigger, { left: 20, top: 24, width: 112, height: 34 });
    mockElementRect(rootMenu, { left: 0, top: 0, width: 180, height: 96 });
    mockElementRect(childTrigger, { left: 28, top: 40, width: 148, height: 32 });
    mockElementRect(childMenu, { left: 0, top: 0, width: 172, height: 88 });

    rootTrigger.click();
    fixture.detectChanges();
    await flushOverlayLayout();
    fixture.detectChanges();

    keydown(rootMenu, 'ArrowDown');
    keydown(rootMenu, 'ArrowRight');
    fixture.detectChanges();
    await flushOverlayLayout();
    fixture.detectChanges();

    expect(rootMenu.getAttribute('aria-activedescendant')).toBe(childTrigger.id);
    expectMenuPanelRenderable(childMenu);
    expect(childMenu.querySelector('[data-testid="child-item-first"]')).toBeTruthy();
    expect(childMenu.querySelector('[data-testid="child-item-second"]')).toBeTruthy();
  });
});
