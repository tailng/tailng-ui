import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  TngDrawer,
  TngDrawerAutoBoolean,
  TngDrawerAutoFocus,
  TngDrawerContainer,
  TngDrawerContent,
  TngDrawerDirection,
  TngDrawerMode,
  TngDrawerPosition,
  TngDrawerRole,
} from '../tng-drawer';

function pointerdown(target: EventTarget, init: Partial<PointerEventInit> = {}): void {
  target.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      clientX: init.clientX ?? 0,
      clientY: init.clientY ?? 0,
    }),
  );
}

function keydown(
  target: EventTarget,
  key: string,
  init: Partial<KeyboardEventInit> = {},
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    shiftKey: init.shiftKey ?? false,
  });
  target.dispatchEvent(event);
  return event;
}

function transitionend(target: EventTarget): void {
  target.dispatchEvent(new Event('transitionend', { bubbles: true }));
}

function findDrawer(fixture: { nativeElement: HTMLElement }): HTMLElement {
  return fixture.nativeElement.querySelector('[data-testid="drawer"]') as HTMLElement;
}

function findContent(fixture: { nativeElement: HTMLElement }): HTMLElement {
  return fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
}

function findBackdrop(fixture: { nativeElement: HTMLElement }): HTMLElement | null {
  return fixture.nativeElement.querySelector('[data-slot="drawer-backdrop"]');
}

@Component({
  imports: [TngDrawerContainer, TngDrawer, TngDrawerContent],
  template: `
    <button data-testid="before">Before</button>
    <section
      tngDrawerContainer
      data-testid="container"
      [hasBackdrop]="hasBackdrop()"
      [closeOthersOnOpen]="closeOthersOnOpen()"
      [animate]="animate()"
      [lockScroll]="lockScroll()"
      [dir]="dir()"
    >
      <aside
        tngDrawer
        #drawer="tngDrawer"
        data-testid="drawer"
        [opened]="opened()"
        [defaultOpened]="defaultOpened()"
        [mode]="mode()"
        [position]="position()"
        [disabled]="disabled()"
        [backdrop]="backdrop()"
        [closeOnOutsideClick]="closeOnOutsideClick()"
        [closeOnEscape]="closeOnEscape()"
        [restoreFocus]="restoreFocus()"
        [autoFocus]="autoFocus()"
        [trapFocus]="trapFocus()"
        [inertContent]="inertContent()"
        [allowBodyScroll]="allowBodyScroll()"
        [closeOnTab]="closeOnTab()"
        [role]="role()"
        [fixedInViewport]="fixedInViewport()"
        [fixedTopGap]="fixedTopGap()"
        [fixedBottomGap]="fixedBottomGap()"
        [swipeToClose]="swipeToClose()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-labelledby]="ariaLabelledby()"
        (openedChange)="openedChanges.push($event)"
        (openStart)="lifecycle.push('openStart')"
        (tngDrawerOpened)="lifecycle.push('opened')"
        (closeStart)="lifecycle.push('closeStart')"
        (tngDrawerClosed)="lifecycle.push('closed')"
        (backdropClick)="backdropClicks = backdropClicks + 1"
        (positionChange)="positionChanges.push($event)"
        [style.width.px]="drawerWidth()"
      >
        <div data-testid="nested-transition"></div>
        <button data-testid="inside-a">A</button>
        <button data-testid="inside-b">B</button>
      </aside>
      <main tngDrawerContent data-testid="content">
        <button data-testid="content-btn">Content</button>
      </main>
    </section>
    <button data-testid="outside">Outside</button>
    <button data-testid="fallback">Fallback</button>
  `,
})
class DrawerHostComponent {
  readonly hasBackdrop = signal<TngDrawerAutoBoolean>('auto');
  readonly closeOthersOnOpen = signal(true);
  readonly animate = signal(false);
  readonly lockScroll = signal<TngDrawerAutoBoolean>('auto');
  readonly dir = signal<TngDrawerDirection>('auto');

  readonly opened = signal<boolean | undefined>(undefined);
  readonly defaultOpened = signal(false);
  readonly mode = signal<TngDrawerMode>('overlay');
  readonly position = signal<TngDrawerPosition>('start');
  readonly disabled = signal(false);
  readonly backdrop = signal<TngDrawerAutoBoolean>('auto');
  readonly closeOnOutsideClick = signal<boolean | undefined>(undefined);
  readonly closeOnEscape = signal(true);
  readonly restoreFocus = signal(true);
  readonly autoFocus = signal<TngDrawerAutoFocus>('drawer');
  readonly trapFocus = signal<TngDrawerAutoBoolean>('auto');
  readonly inertContent = signal<TngDrawerAutoBoolean>('auto');
  readonly allowBodyScroll = signal<boolean | undefined>(undefined);
  readonly closeOnTab = signal(false);
  readonly role = signal<TngDrawerRole>('navigation');
  readonly fixedInViewport = signal(false);
  readonly fixedTopGap = signal(0);
  readonly fixedBottomGap = signal(0);
  readonly swipeToClose = signal(false);
  readonly drawerWidth = signal(200);
  readonly ariaLabel = signal<string | null>(null);
  readonly ariaLabelledby = signal<string | null>(null);

  readonly openedChanges: boolean[] = [];
  readonly lifecycle: string[] = [];
  readonly positionChanges: TngDrawerPosition[] = [];
  backdropClicks = 0;

  @ViewChild('drawer', { static: true }) drawer!: TngDrawer;
}

@Component({
  imports: [TngDrawerContainer, TngDrawer, TngDrawerContent],
  template: `
    <section
      tngDrawerContainer
      [closeOthersOnOpen]="closeOthersOnOpen()"
      [dir]="dir()"
      [animate]="false"
    >
      <aside
        tngDrawer
        #startDrawer="tngDrawer"
        data-testid="start"
        [opened]="startOpened()"
        [mode]="mode()"
        [position]="'start'"
        [backdrop]="backdrop()"
        style="width: 120px"
      ></aside>
      <aside
        tngDrawer
        #endDrawer="tngDrawer"
        data-testid="end"
        [opened]="endOpened()"
        [mode]="mode()"
        [position]="'end'"
        [backdrop]="backdrop()"
        style="width: 140px"
      ></aside>
      <main tngDrawerContent data-testid="content"></main>
    </section>
  `,
})
class MultiDrawerHostComponent {
  readonly closeOthersOnOpen = signal(true);
  readonly dir = signal<TngDrawerDirection>('ltr');
  readonly mode = signal<TngDrawerMode>('overlay');
  readonly startOpened = signal<boolean | undefined>(false);
  readonly endOpened = signal<boolean | undefined>(false);
  readonly backdrop = signal<TngDrawerAutoBoolean>('auto');
}

@Component({
  imports: [TngDrawerContainer, TngDrawer, TngDrawerContent],
  template: `
    @if (showContainer()) {
      <section tngDrawerContainer [animate]="false" data-testid="container">
        @if (showDrawer()) {
          <aside
            tngDrawer
            #drawer="tngDrawer"
            [defaultOpened]="drawerDefaultOpened()"
            [mode]="mode()"
            [restoreFocus]="true"
            (closeStart)="lifecycle.push('closeStart')"
            (tngDrawerClosed)="lifecycle.push('closed')"
            data-testid="drawer"
            style="width: 160px"
          >
            <button data-testid="drawer-btn">Drawer button</button>
          </aside>
        }
        @if (showContent()) {
          <main tngDrawerContent data-testid="content"></main>
        }
      </section>
    }
    <button data-testid="fallback">Fallback</button>
  `,
})
class DynamicDrawerHostComponent {
  readonly showContainer = signal(true);
  readonly showDrawer = signal(true);
  readonly showContent = signal(true);
  readonly drawerDefaultOpened = signal(true);
  readonly mode = signal<TngDrawerMode>('overlay');
  readonly lifecycle: string[] = [];

  @ViewChild('drawer') drawer?: TngDrawer;
}

describe('tng-drawer behavior blocks B-T', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.documentElement.style.left = '';
    document.documentElement.style.overflowY = '';
    document.documentElement.style.position = '';
    document.documentElement.style.top = '';
    document.documentElement.style.width = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.documentElement.style.left = '';
    document.documentElement.style.overflowY = '';
    document.documentElement.style.position = '';
    document.documentElement.style.top = '';
    document.documentElement.style.width = '';
    TestBed.resetTestingModule();
    vi.useRealTimers();
  });

  describe('B) ARIA & accessibility attributes', () => {
    it('applies the configured role on the drawer host', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.role.set('dialog');

      fixture.detectChanges();

      expect(findDrawer(fixture).getAttribute('role')).toBe('dialog');
    });

    it('preserves consumer-provided aria-label and aria-labelledby on the drawer', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.ariaLabel.set('Main navigation');
      fixture.componentInstance.ariaLabelledby.set('drawer-title');

      fixture.detectChanges();

      const drawer = findDrawer(fixture);
      expect(drawer.getAttribute('aria-label')).toBe('Main navigation');
      expect(drawer.getAttribute('aria-labelledby')).toBe('drawer-title');
    });

    it('applies aria-modal=true when role is dialog and overlay mode is open', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.role.set('dialog');
      host.defaultOpened.set(true);

      fixture.detectChanges();

      expect(findDrawer(fixture).getAttribute('aria-modal')).toBe('true');
    });

    it('does not apply aria-modal when role is not dialog or drawer is closed', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.role.set('navigation');
      fixture.componentInstance.defaultOpened.set(true);

      fixture.detectChanges();
      expect(findDrawer(fixture).getAttribute('aria-modal')).toBeNull();

      fixture.componentInstance.role.set('dialog');
      fixture.componentInstance.opened.set(false);
      fixture.detectChanges();

      expect(findDrawer(fixture).getAttribute('aria-modal')).toBeNull();
    });

    it('exposes state attributes (data-open, data-mode, data-position)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);
      host.mode.set('push');
      host.position.set('end');

      fixture.detectChanges();

      const drawer = findDrawer(fixture);
      expect(drawer.getAttribute('data-open')).toBe('true');
      expect(drawer.getAttribute('data-state')).toBe('open');
      expect(drawer.getAttribute('data-mode')).toBe('push');
      expect(drawer.getAttribute('data-position')).toBe('end');

      host.drawer.close();
      fixture.detectChanges();
      expect(drawer.getAttribute('data-open')).toBe('false');
    });

    it('backdrop is presentational and non-focusable', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);

      fixture.detectChanges();

      const backdrop = findBackdrop(fixture);
      expect(backdrop).toBeTruthy();
      expect(backdrop?.getAttribute('role')).toBe('presentation');
      expect(backdrop?.getAttribute('aria-hidden')).toBe('true');
      expect(backdrop?.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('C) controlled vs uncontrolled state', () => {
    it('respects controlled opened=true on initial render', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.opened.set(true);

      fixture.detectChanges();

      expect(findDrawer(fixture).getAttribute('data-state')).toBe('open');
    });

    it('respects controlled opened=false on initial render', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.opened.set(false);
      fixture.componentInstance.defaultOpened.set(true);

      fixture.detectChanges();

      expect(findDrawer(fixture).getAttribute('data-state')).toBe('closed');
    });

    it('respects defaultOpened only when opened is not provided', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);

      fixture.detectChanges();
      expect(findDrawer(fixture).getAttribute('data-state')).toBe('open');

      fixture.componentInstance.opened.set(false);
      fixture.detectChanges();
      expect(findDrawer(fixture).getAttribute('data-state')).toBe('closed');
    });

    it('does not mutate consumer-controlled opened state internally', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.opened.set(false);

      fixture.detectChanges();

      host.drawer.open();
      fixture.detectChanges();

      expect(findDrawer(fixture).getAttribute('data-state')).toBe('closed');
      expect(host.openedChanges).toEqual([true]);
    });

    it('does not emit openedChange on initial render', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);

      fixture.detectChanges();

      expect(fixture.componentInstance.openedChanges).toEqual([]);
    });
  });

  describe('D) public methods & idempotency', () => {
    it('open, close, and toggle update state deterministically', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      fixture.detectChanges();

      host.drawer.open();
      fixture.detectChanges();
      expect(findDrawer(fixture).getAttribute('data-state')).toBe('open');

      host.drawer.toggle();
      fixture.detectChanges();
      expect(findDrawer(fixture).getAttribute('data-state')).toBe('closed');

      host.drawer.toggle(true);
      fixture.detectChanges();
      expect(findDrawer(fixture).getAttribute('data-state')).toBe('open');

      host.drawer.toggle(false);
      fixture.detectChanges();
      expect(findDrawer(fixture).getAttribute('data-state')).toBe('closed');
    });

    it('toggles hidden attribute alongside open state', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      fixture.detectChanges();

      const drawer = findDrawer(fixture);
      expect(drawer.hasAttribute('hidden')).toBe(true);

      host.drawer.open();
      fixture.detectChanges();
      expect(drawer.hasAttribute('hidden')).toBe(false);

      host.drawer.close();
      fixture.detectChanges();
      expect(drawer.hasAttribute('hidden')).toBe(true);
    });

    it('repeated open/close calls are idempotent and do not duplicate lifecycle events', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      fixture.detectChanges();

      host.drawer.open();
      host.drawer.open();
      host.drawer.close();
      host.drawer.close();
      fixture.detectChanges();

      expect(host.lifecycle).toEqual(['openStart', 'opened', 'closeStart', 'closed']);
    });
  });

  describe('E) mode semantics', () => {
    it('overlay mode does not shift content', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);
      host.mode.set('overlay');

      fixture.detectChanges();

      const content = findContent(fixture);
      expect(content.getAttribute('data-offset-left')).toBe('0');
      expect(content.getAttribute('data-offset-right')).toBe('0');
    });

    it('push mode shifts content by drawer width', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);
      host.mode.set('push');

      fixture.detectChanges();

      const content = findContent(fixture);
      expect(content.getAttribute('data-offset-left')).toBe('200');
      expect(content.style.marginLeft).toBe('200px');
    });

    it('side mode shifts content by drawer width', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);
      host.mode.set('side');

      fixture.detectChanges();

      const content = findContent(fixture);
      expect(content.getAttribute('data-offset-left')).toBe('200');
      expect(content.style.marginLeft).toBe('200px');
    });

    it('switching mode at runtime recomputes layout', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);
      host.mode.set('overlay');

      fixture.detectChanges();
      expect(findContent(fixture).getAttribute('data-offset-left')).toBe('0');

      host.mode.set('push');
      fixture.detectChanges();
      expect(findContent(fixture).getAttribute('data-offset-left')).toBe('200');
    });

    it('overlay uses backdrop by default when backdrop auto', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);
      fixture.componentInstance.mode.set('overlay');

      fixture.detectChanges();

      expect(findBackdrop(fixture)).toBeTruthy();
    });

    it('push and side do not use backdrop by default when backdrop auto', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);
      fixture.componentInstance.mode.set('push');

      fixture.detectChanges();
      expect(findBackdrop(fixture)).toBeNull();

      fixture.componentInstance.mode.set('side');
      fixture.detectChanges();
      expect(findBackdrop(fixture)).toBeNull();
    });
  });

  describe('F) positioning and RTL', () => {
    it('maps start/end correctly in LTR and RTL', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);

      host.dir.set('ltr');
      host.position.set('start');
      fixture.detectChanges();
      expect(findDrawer(fixture).getAttribute('data-effective-position')).toBe('left');

      host.position.set('end');
      fixture.detectChanges();
      expect(findDrawer(fixture).getAttribute('data-effective-position')).toBe('right');

      host.dir.set('rtl');
      host.position.set('start');
      fixture.detectChanges();
      expect(findDrawer(fixture).getAttribute('data-effective-position')).toBe('right');

      host.position.set('end');
      fixture.detectChanges();
      expect(findDrawer(fixture).getAttribute('data-effective-position')).toBe('left');
    });

    it('recomputes effective side and offsets on runtime direction changes while open', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [MultiDrawerHostComponent],
      }).createComponent(MultiDrawerHostComponent);
      const host = fixture.componentInstance;
      host.mode.set('push');
      host.startOpened.set(true);
      host.endOpened.set(true);
      host.closeOthersOnOpen.set(false);
      host.dir.set('ltr');

      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
      expect(content.getAttribute('data-offset-left')).toBe('120');
      expect(content.getAttribute('data-offset-right')).toBe('140');

      host.dir.set('rtl');
      fixture.detectChanges();

      expect(content.getAttribute('data-offset-left')).toBe('140');
      expect(content.getAttribute('data-offset-right')).toBe('120');
    });
  });

  describe('G) backdrop and outside interaction', () => {
    it('creates backdrop only when open and enabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.detectChanges();
      expect(findBackdrop(fixture)).toBeNull();

      fixture.componentInstance.drawer.open();
      fixture.detectChanges();
      expect(findBackdrop(fixture)).toBeTruthy();

      fixture.componentInstance.backdrop.set(false);
      fixture.detectChanges();
      expect(findBackdrop(fixture)).toBeNull();
    });

    it('backdrop click emits backdropClick and closes by default', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);

      fixture.detectChanges();

      const backdrop = findBackdrop(fixture);
      expect(backdrop).toBeTruthy();

      pointerdown(backdrop as HTMLElement);
      fixture.detectChanges();

      expect(host.backdropClicks).toBe(1);
      expect(findDrawer(fixture).getAttribute('data-state')).toBe('closed');
    });

    it('backdrop click does not close when closeOnOutsideClick=false but still emits', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);
      host.closeOnOutsideClick.set(false);

      fixture.detectChanges();

      const backdrop = findBackdrop(fixture);
      pointerdown(backdrop as HTMLElement);
      fixture.detectChanges();

      expect(host.backdropClicks).toBe(1);
      expect(findDrawer(fixture).getAttribute('data-state')).toBe('open');
    });

    it('outside pointerdown closes when enabled and ignores click-only events', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);

      fixture.detectChanges();

      const outside = fixture.nativeElement.querySelector(
        '[data-testid="outside"]',
      ) as HTMLButtonElement;

      outside.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      fixture.detectChanges();
      expect(findDrawer(fixture).getAttribute('data-state')).toBe('open');

      pointerdown(outside);
      fixture.detectChanges();
      expect(findDrawer(fixture).getAttribute('data-state')).toBe('closed');
    });

    it('outside pointerdown does not close when closeOnOutsideClick=false', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);
      fixture.componentInstance.closeOnOutsideClick.set(false);

      fixture.detectChanges();

      const outside = fixture.nativeElement.querySelector(
        '[data-testid="outside"]',
      ) as HTMLButtonElement;
      pointerdown(outside);
      fixture.detectChanges();

      expect(findDrawer(fixture).getAttribute('data-state')).toBe('open');
    });

    it('pointerdown inside drawer and content does not close', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);
      fixture.detectChanges();

      pointerdown(
        fixture.nativeElement.querySelector('[data-testid="inside-a"]') as HTMLButtonElement,
      );
      pointerdown(
        fixture.nativeElement.querySelector('[data-testid="content-btn"]') as HTMLButtonElement,
      );
      fixture.detectChanges();

      expect(findDrawer(fixture).getAttribute('data-state')).toBe('open');
    });

    it('exposes data-tng-overlay-layer-id equal to the drawer id', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.detectChanges();

      const drawer = findDrawer(fixture);
      expect(drawer.getAttribute('data-tng-overlay-layer-id')).toBe(drawer.getAttribute('id'));
      expect(drawer.getAttribute('data-tng-overlay-layer-id')).toBeTruthy();
    });

    it('pointerdown on a body-portalled overlay owned by the drawer does not close', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);
      fixture.detectChanges();

      const drawer = findDrawer(fixture);
      const layerId = drawer.getAttribute('data-tng-overlay-layer-id');
      expect(layerId).toBeTruthy();

      const panel = document.createElement('div');
      panel.setAttribute('data-slot', 'select-overlay');
      panel.setAttribute('data-tng-overlay-owner-id', layerId as string);
      const option = document.createElement('button');
      option.setAttribute('data-testid', 'owned-option');
      option.textContent = 'Option';
      panel.appendChild(option);
      document.body.appendChild(panel);

      try {
        pointerdown(option);
        fixture.detectChanges();
        expect(findDrawer(fixture).getAttribute('data-state')).toBe('open');
      } finally {
        panel.remove();
      }
    });

    it('pointerdown on a body-portalled overlay with a different owner id closes the drawer', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);
      fixture.detectChanges();

      const panel = document.createElement('div');
      panel.setAttribute('data-slot', 'select-overlay');
      panel.setAttribute('data-tng-overlay-owner-id', 'other-layer');
      const option = document.createElement('button');
      option.textContent = 'Option';
      panel.appendChild(option);
      document.body.appendChild(panel);

      try {
        pointerdown(option);
        fixture.detectChanges();
        expect(findDrawer(fixture).getAttribute('data-state')).toBe('closed');
      } finally {
        panel.remove();
      }
    });
  });

  describe('H) Escape close behavior', () => {
    it('pressing Escape closes when closeOnEscape=true and drawer is open', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);
      fixture.detectChanges();

      const event = keydown(document, 'Escape');
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(true);
      expect(findDrawer(fixture).getAttribute('data-state')).toBe('closed');
    });

    it('pressing Escape does not close when closeOnEscape=false', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);
      fixture.componentInstance.closeOnEscape.set(false);
      fixture.detectChanges();

      const event = keydown(document, 'Escape');
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(false);
      expect(findDrawer(fixture).getAttribute('data-state')).toBe('open');
    });

    it('pressing Escape does nothing when drawer is already closed', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.detectChanges();

      const event = keydown(document, 'Escape');
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(false);
      expect(findDrawer(fixture).getAttribute('data-state')).toBe('closed');
    });

    it('Escape close emits closeStart before closed', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);
      fixture.detectChanges();
      fixture.componentInstance.lifecycle.splice(0);

      keydown(document, 'Escape');
      fixture.detectChanges();

      expect(fixture.componentInstance.lifecycle).toEqual(['closeStart', 'closed']);
    });
  });

  describe('I/J) focus management and Tab policy', () => {
    it('autoFocus supports drawer, first-focusable, and none', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;

      host.autoFocus.set('drawer');
      host.defaultOpened.set(true);
      fixture.detectChanges();
      expect(document.activeElement).toBe(findDrawer(fixture));

      host.drawer.close();
      fixture.detectChanges();

      host.autoFocus.set('first-focusable');
      fixture.detectChanges();
      host.drawer.open();
      fixture.detectChanges();
      expect(document.activeElement).toBe(
        fixture.nativeElement.querySelector('[data-testid="inside-a"]') as HTMLElement,
      );

      const before = fixture.nativeElement.querySelector(
        '[data-testid="before"]',
      ) as HTMLButtonElement;
      host.restoreFocus.set(false);
      fixture.detectChanges();
      before.focus();
      host.drawer.close();
      fixture.detectChanges();
      host.autoFocus.set('none');
      fixture.detectChanges();
      host.drawer.open();
      fixture.detectChanges();

      expect(document.activeElement).toBe(before);
    });

    it('restoreFocus restores to the prior target on Escape and supports fallback when removed', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(false);
      host.restoreFocus.set(true);
      fixture.detectChanges();

      const before = fixture.nativeElement.querySelector(
        '[data-testid="before"]',
      ) as HTMLButtonElement;
      const fallback = fixture.nativeElement.querySelector(
        '[data-testid="fallback"]',
      ) as HTMLButtonElement;

      before.focus();
      host.drawer.setRestoreFocusFallback(fallback);
      host.drawer.open();
      fixture.detectChanges();

      before.remove();
      keydown(document, 'Escape');
      fixture.detectChanges();

      expect(document.activeElement).toBe(fallback);
    });

    it('does not restore focus when restoreFocus=false', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.restoreFocus.set(false);
      host.defaultOpened.set(false);
      fixture.detectChanges();

      const before = fixture.nativeElement.querySelector(
        '[data-testid="before"]',
      ) as HTMLButtonElement;
      before.focus();

      host.drawer.open();
      fixture.detectChanges();
      keydown(document, 'Escape');
      fixture.detectChanges();

      expect(document.activeElement).not.toBe(before);
    });

    it('trapFocus auto in overlay traps Tab; trapFocus=false allows native Tab', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);
      host.trapFocus.set('auto');

      fixture.detectChanges();

      const first = fixture.nativeElement.querySelector(
        '[data-testid="inside-a"]',
      ) as HTMLButtonElement;
      const second = fixture.nativeElement.querySelector(
        '[data-testid="inside-b"]',
      ) as HTMLButtonElement;
      first.focus();

      const trappedTab = keydown(document, 'Tab');
      fixture.detectChanges();

      expect(trappedTab.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(second);

      host.trapFocus.set(false);
      fixture.detectChanges();
      second.focus();

      const freeTab = keydown(document, 'Tab');
      fixture.detectChanges();

      expect(freeTab.defaultPrevented).toBe(false);
    });

    it('closeOnTab closes on Tab/Shift+Tab without preventDefault and does not restore focus', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);
      host.closeOnTab.set(true);
      host.trapFocus.set(false);
      host.restoreFocus.set(true);
      fixture.detectChanges();

      const outside = fixture.nativeElement.querySelector(
        '[data-testid="outside"]',
      ) as HTMLButtonElement;
      outside.focus();

      host.drawer.open();
      fixture.detectChanges();

      const tabEvent = keydown(document, 'Tab');
      fixture.detectChanges();

      expect(tabEvent.defaultPrevented).toBe(false);
      expect(findDrawer(fixture).getAttribute('data-state')).toBe('closed');

      host.drawer.open();
      fixture.detectChanges();

      const shiftTabEvent = keydown(document, 'Tab', { shiftKey: true });
      fixture.detectChanges();

      expect(shiftTabEvent.defaultPrevented).toBe(false);
      expect(findDrawer(fixture).getAttribute('data-state')).toBe('closed');
    });

    it('inertContent auto marks content inert in overlay and releases on close', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);
      host.inertContent.set('auto');
      host.mode.set('overlay');

      fixture.detectChanges();
      const content = findContent(fixture);
      expect(content.hasAttribute('inert')).toBe(true);

      host.drawer.close();
      fixture.detectChanges();
      expect(content.hasAttribute('inert')).toBe(false);

      host.inertContent.set(false);
      fixture.detectChanges();
      host.drawer.open();
      fixture.detectChanges();
      expect(content.hasAttribute('inert')).toBe(false);
    });

    it('releases focus trap behavior after close', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);
      host.trapFocus.set('auto');
      fixture.detectChanges();

      const trappedEvent = keydown(document, 'Tab');
      fixture.detectChanges();
      expect(trappedEvent.defaultPrevented).toBe(true);

      host.drawer.close();
      fixture.detectChanges();

      const releasedEvent = keydown(document, 'Tab');
      fixture.detectChanges();
      expect(releasedEvent.defaultPrevented).toBe(false);
    });
  });

  describe('K/L) lifecycle ordering and animation completion', () => {
    it('animate=false emits openStart/opened and closeStart/closed in deterministic order', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.animate.set(false);
      fixture.detectChanges();

      host.drawer.open();
      host.drawer.close();
      fixture.detectChanges();

      expect(host.lifecycle).toEqual(['openStart', 'opened', 'closeStart', 'closed']);
    });

    it('does not emit opened/closed without matching start events', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.animate.set(true);
      fixture.detectChanges();

      transitionend(findDrawer(fixture));
      fixture.detectChanges();
      expect(host.lifecycle).toEqual([]);

      host.drawer.open();
      fixture.detectChanges();
      expect(host.lifecycle).toEqual(['openStart']);

      transitionend(findDrawer(fixture));
      fixture.detectChanges();
      expect(host.lifecycle).toEqual(['openStart', 'opened']);

      transitionend(findDrawer(fixture));
      fixture.detectChanges();
      expect(host.lifecycle).toEqual(['openStart', 'opened']);
    });

    it('animate=true emits opened/closed on host transitionend and ignores nested transitionend', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.animate.set(true);
      fixture.detectChanges();

      host.drawer.open();
      fixture.detectChanges();

      expect(host.lifecycle).toEqual(['openStart']);

      transitionend(
        fixture.nativeElement.querySelector('[data-testid="nested-transition"]') as HTMLElement,
      );
      fixture.detectChanges();
      expect(host.lifecycle).toEqual(['openStart']);

      transitionend(findDrawer(fixture));
      fixture.detectChanges();
      expect(host.lifecycle).toEqual(['openStart', 'opened']);

      host.drawer.close();
      fixture.detectChanges();
      expect(host.lifecycle).toEqual(['openStart', 'opened', 'closeStart']);

      transitionend(findDrawer(fixture));
      fixture.detectChanges();
      expect(host.lifecycle).toEqual(['openStart', 'opened', 'closeStart', 'closed']);
    });

    it('handles transition completion correctly when width changes during animated open', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.animate.set(true);
      host.drawerWidth.set(180);
      fixture.detectChanges();

      host.drawer.open();
      fixture.detectChanges();
      expect(host.lifecycle).toEqual(['openStart']);

      host.drawerWidth.set(280);
      fixture.detectChanges();
      transitionend(findDrawer(fixture));
      fixture.detectChanges();

      expect(findContent(fixture).getAttribute('data-offset-left')).toBe('0');
      expect(host.lifecycle).toEqual(['openStart', 'opened']);
    });

    it('rapid open-close preserves final state and consistent ordering', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.animate.set(false);
      fixture.detectChanges();

      host.drawer.open();
      host.drawer.close();
      fixture.detectChanges();

      expect(findDrawer(fixture).getAttribute('data-state')).toBe('closed');
      expect(host.lifecycle).toEqual(['openStart', 'opened', 'closeStart', 'closed']);
    });
  });

  describe('M) scroll and viewport policy', () => {
    it('locks viewport scroll without removing the scrollbar and unlocks on close', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);
      fixture.componentInstance.mode.set('overlay');
      fixture.componentInstance.lockScroll.set('auto');

      fixture.detectChanges();
      expect(document.body.style.overflow).toBe('');
      expect(document.documentElement.style.position).toBe('fixed');
      expect(document.documentElement.style.overflowY).toBe('scroll');

      fixture.componentInstance.drawer.close();
      fixture.detectChanges();
      expect(document.body.style.overflow).toBe('');
      expect(document.documentElement.style.position).toBe('');
      expect(document.documentElement.style.overflowY).toBe('');
    });

    it('does not lock scroll when lockScroll=false or mode is side/push', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;

      host.defaultOpened.set(true);
      host.mode.set('overlay');
      host.lockScroll.set(false);
      fixture.detectChanges();
      expect(document.body.style.overflow).toBe('');

      host.lockScroll.set('auto');
      host.mode.set('side');
      fixture.detectChanges();
      expect(document.body.style.overflow).toBe('');

      host.mode.set('push');
      fixture.detectChanges();
      expect(document.body.style.overflow).toBe('');
    });

    it('remains open on window resize and scroll when no close-on-viewport policy is configured', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);
      fixture.detectChanges();

      window.dispatchEvent(new Event('resize'));
      document.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();

      expect(findDrawer(fixture).getAttribute('data-state')).toBe('open');
    });
  });

  describe('N) multiple drawers in one container', () => {
    it('supports one start and one end drawer and closeOthersOnOpen behavior', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [MultiDrawerHostComponent],
      }).createComponent(MultiDrawerHostComponent);
      const host = fixture.componentInstance;
      host.mode.set('overlay');
      host.closeOthersOnOpen.set(true);
      host.startOpened.set(true);

      fixture.detectChanges();

      expect(
        (fixture.nativeElement.querySelector('[data-testid="start"]') as HTMLElement).getAttribute(
          'data-state',
        ),
      ).toBe('open');
      expect(
        (fixture.nativeElement.querySelector('[data-testid="end"]') as HTMLElement).getAttribute(
          'data-state',
        ),
      ).toBe('closed');

      host.startOpened.set(false);
      host.endOpened.set(true);
      fixture.detectChanges();
      expect(
        (fixture.nativeElement.querySelector('[data-testid="start"]') as HTMLElement).getAttribute(
          'data-state',
        ),
      ).toBe('closed');
      expect(
        (fixture.nativeElement.querySelector('[data-testid="end"]') as HTMLElement).getAttribute(
          'data-state',
        ),
      ).toBe('open');
    });

    it('allows both drawers open when closeOthersOnOpen=false and computes deterministic offsets', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [MultiDrawerHostComponent],
      }).createComponent(MultiDrawerHostComponent);
      const host = fixture.componentInstance;
      host.mode.set('push');
      host.closeOthersOnOpen.set(false);
      host.startOpened.set(true);
      host.endOpened.set(true);

      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
      expect(content.getAttribute('data-offset-left')).toBe('120');
      expect(content.getAttribute('data-offset-right')).toBe('140');
    });

    it('has deterministic backdrop policy when both overlay drawers are open', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [MultiDrawerHostComponent],
      }).createComponent(MultiDrawerHostComponent);
      const host = fixture.componentInstance;
      host.mode.set('overlay');
      host.closeOthersOnOpen.set(false);
      host.backdrop.set(true);
      host.startOpened.set(true);
      host.endOpened.set(true);

      fixture.detectChanges();

      const backdrops = fixture.nativeElement.querySelectorAll('[data-slot="drawer-backdrop"]');
      expect(backdrops.length).toBe(2);
    });
  });

  describe('O/P/Q/R/S/T) lifecycle, cleanup, disabled, fixed viewport, resilience, swipe', () => {
    it('removing an open drawer via ngIf closes it and emits deterministic close lifecycle', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DynamicDrawerHostComponent],
      }).createComponent(DynamicDrawerHostComponent);
      fixture.detectChanges();

      fixture.componentInstance.showDrawer.set(false);
      fixture.detectChanges();

      expect(fixture.componentInstance.lifecycle).toEqual(['closeStart', 'closed']);
    });

    it('removing content or container while open fails safely and cleans up state', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DynamicDrawerHostComponent],
      }).createComponent(DynamicDrawerHostComponent);
      fixture.detectChanges();

      fixture.componentInstance.showContent.set(false);
      expect(() => fixture.detectChanges()).not.toThrow();

      fixture.componentInstance.showContainer.set(false);
      expect(() => fixture.detectChanges()).not.toThrow();
      expect(document.body.style.overflow).toBe('');
    });

    it('re-rendering a drawer element preserves open state and does not leak global listeners', () => {
      const addSpy = vi.spyOn(document, 'addEventListener');
      const removeSpy = vi.spyOn(document, 'removeEventListener');
      const fixture = TestBed.configureTestingModule({
        imports: [DynamicDrawerHostComponent],
      }).createComponent(DynamicDrawerHostComponent);
      fixture.detectChanges();
      expect(
        (fixture.nativeElement.querySelector('[data-testid="drawer"]') as HTMLElement).getAttribute(
          'data-state',
        ),
      ).toBe('open');

      fixture.componentInstance.showDrawer.set(false);
      fixture.detectChanges();
      fixture.componentInstance.showDrawer.set(true);
      fixture.detectChanges();
      expect(
        (fixture.nativeElement.querySelector('[data-testid="drawer"]') as HTMLElement).getAttribute(
          'data-state',
        ),
      ).toBe('open');

      fixture.componentInstance.showDrawer.set(false);
      fixture.detectChanges();

      const pointerAdds = addSpy.mock.calls.filter(([type]) => type === 'pointerdown').length;
      const pointerRemoves = removeSpy.mock.calls.filter(([type]) => type === 'pointerdown').length;
      const keydownAdds = addSpy.mock.calls.filter(([type]) => type === 'keydown').length;
      const keydownRemoves = removeSpy.mock.calls.filter(([type]) => type === 'keydown').length;

      expect(pointerAdds).toBe(pointerRemoves);
      expect(keydownAdds).toBe(keydownRemoves);

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });

    it('re-rendering container preserves drawer association and open state', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DynamicDrawerHostComponent],
      }).createComponent(DynamicDrawerHostComponent);
      fixture.detectChanges();

      fixture.componentInstance.showContainer.set(false);
      fixture.detectChanges();
      fixture.componentInstance.showContainer.set(true);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector(
        '[data-testid="container"]',
      ) as HTMLElement;
      const drawer = fixture.nativeElement.querySelector('[data-testid="drawer"]') as HTMLElement;
      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

      expect(drawer.getAttribute('data-state')).toBe('open');
      expect(drawer.getAttribute('data-container-id')).toBe(container.getAttribute('id'));
      expect(content.getAttribute('data-container-id')).toBe(container.getAttribute('id'));
    });

    it('replacing the restoreFocus target while open uses the latest target on close', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(false);
      host.restoreFocus.set(true);
      fixture.detectChanges();

      const before = fixture.nativeElement.querySelector(
        '[data-testid="before"]',
      ) as HTMLButtonElement;
      const outside = fixture.nativeElement.querySelector(
        '[data-testid="outside"]',
      ) as HTMLButtonElement;

      before.focus();
      host.drawer.open();
      fixture.detectChanges();

      // Set a newer restore target while open; close should restore to this latest target.
      (
        host.drawer as unknown as { setRestoreFocusTarget: (target: HTMLElement | null) => void }
      ).setRestoreFocusTarget(outside);

      keydown(document, 'Escape');
      fixture.detectChanges();

      expect(document.activeElement).toBe(outside);
    });

    it('disabled drawer ignores open but still reflects aria-disabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.disabled.set(true);
      fixture.detectChanges();

      host.drawer.open();
      fixture.detectChanges();

      expect(findDrawer(fixture).getAttribute('data-state')).toBe('closed');
      expect(findDrawer(fixture).getAttribute('aria-disabled')).toBe('true');
    });

    it('disabled drawer cannot be opened by pointer interaction', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();

      const drawer = findDrawer(fixture);
      pointerdown(drawer);
      drawer.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      fixture.detectChanges();

      expect(drawer.getAttribute('data-state')).toBe('closed');
    });

    it('disabled drawer can still close programmatically when already open', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);
      fixture.detectChanges();

      host.disabled.set(true);
      fixture.detectChanges();
      host.drawer.close();
      fixture.detectChanges();

      expect(findDrawer(fixture).getAttribute('data-state')).toBe('closed');
    });

    it('fixedInViewport applies fixed positioning and top/bottom gaps', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.fixedInViewport.set(true);
      host.fixedTopGap.set(12);
      host.fixedBottomGap.set(20);
      host.defaultOpened.set(true);

      fixture.detectChanges();

      const drawer = findDrawer(fixture);
      expect(drawer.style.position).toBe('fixed');
      expect(drawer.style.top).toBe('12px');
      expect(drawer.style.bottom).toBe('20px');
    });

    it('fixed viewport mode does not break push offset computations', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.mode.set('push');
      host.fixedInViewport.set(true);
      host.defaultOpened.set(true);
      fixture.detectChanges();

      expect(findContent(fixture).getAttribute('data-offset-left')).toBe('200');
    });

    it('opening/closing without any trigger does not throw, including hidden containers', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector(
        '[data-testid="container"]',
      ) as HTMLElement;
      container.style.display = 'none';

      expect(() => {
        fixture.componentInstance.drawer.open();
        fixture.detectChanges();
        fixture.componentInstance.drawer.close();
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('width changes while open recompute push offsets on detectChanges', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.mode.set('push');
      host.defaultOpened.set(true);

      fixture.detectChanges();
      const drawer = findDrawer(fixture);
      const content = findContent(fixture);

      expect(content.getAttribute('data-offset-left')).toBe('200');

      host.drawerWidth.set(280);
      fixture.detectChanges();

      expect(content.getAttribute('data-offset-left')).toBe('280');
    });

    it('backdrop remains visible when open even if closeOnOutsideClick is false', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);
      fixture.componentInstance.closeOnOutsideClick.set(false);
      fixture.componentInstance.backdrop.set(true);

      fixture.detectChanges();

      expect(findBackdrop(fixture)).toBeTruthy();
    });

    it('does not close on pointerdown events that land on viewport scrollbars', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);
      fixture.detectChanges();

      pointerdown(document.documentElement, {
        clientX: Math.max(1, document.documentElement.clientWidth + 8),
        clientY: 1,
      });
      fixture.detectChanges();

      expect(findDrawer(fixture).getAttribute('data-state')).toBe('open');
    });

    it('swipe-to-close is disabled by default and enabled only for overlay', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);
      fixture.detectChanges();

      const drawer = findDrawer(fixture);
      drawer.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 120 }));
      drawer.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 10 }));
      drawer.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      fixture.detectChanges();
      expect(drawer.getAttribute('data-state')).toBe('open');

      host.swipeToClose.set(true);
      host.mode.set('overlay');
      fixture.detectChanges();
      drawer.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 120 }));
      drawer.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 10 }));
      drawer.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      fixture.detectChanges();
      expect(drawer.getAttribute('data-state')).toBe('closed');

      host.drawer.open();
      host.mode.set('side');
      fixture.detectChanges();
      drawer.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 120 }));
      drawer.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 10 }));
      drawer.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      fixture.detectChanges();
      expect(drawer.getAttribute('data-state')).toBe('open');
    });

    it('swipe-to-close respects RTL side mapping and emits close lifecycle in order', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);
      host.swipeToClose.set(true);
      host.dir.set('rtl');
      host.position.set('start');
      host.animate.set(false);

      fixture.detectChanges();
      host.lifecycle.splice(0);

      const drawer = findDrawer(fixture);
      drawer.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 20 }));
      drawer.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 120 }));
      drawer.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      fixture.detectChanges();

      expect(drawer.getAttribute('data-state')).toBe('closed');
      expect(host.lifecycle).toEqual(['closeStart', 'closed']);
    });

    it('swipe gesture does not close when movement is primarily vertical', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      const host = fixture.componentInstance;
      host.defaultOpened.set(true);
      host.swipeToClose.set(true);
      host.mode.set('overlay');
      fixture.detectChanges();

      const drawer = findDrawer(fixture);
      drawer.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, clientX: 120, clientY: 20 }),
      );
      drawer.dispatchEvent(
        new PointerEvent('pointermove', { bubbles: true, clientX: 70, clientY: 210 }),
      );
      drawer.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      fixture.detectChanges();

      expect(drawer.getAttribute('data-state')).toBe('open');
    });

    it('removes document listeners when destroyed while open', () => {
      const addSpy = vi.spyOn(document, 'addEventListener');
      const removeSpy = vi.spyOn(document, 'removeEventListener');

      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.defaultOpened.set(true);
      fixture.detectChanges();

      expect(addSpy.mock.calls.some(([type]) => type === 'pointerdown' || type === 'keydown')).toBe(
        true,
      );

      fixture.destroy();

      expect(
        removeSpy.mock.calls.some(([type]) => type === 'pointerdown' || type === 'keydown'),
      ).toBe(true);

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });

    it('teardown does not leave stale drawer/backdrop state in the document', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DrawerHostComponent],
      }).createComponent(DrawerHostComponent);
      fixture.componentInstance.role.set('dialog');
      fixture.componentInstance.defaultOpened.set(true);
      fixture.detectChanges();

      expect(findDrawer(fixture).getAttribute('data-state')).toBe('open');
      expect(findDrawer(fixture).getAttribute('aria-modal')).toBe('true');
      expect(document.querySelector('[data-slot="drawer-backdrop"]')).toBeTruthy();

      fixture.destroy();

      expect(document.querySelector('[data-slot="drawer-backdrop"]')).toBeNull();
      expect(document.body.style.overflow).toBe('');
    });
  });
});
