import { Component, signal, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  TngDrawerContainer,
  TngDrawerContent,
  type TngDrawerMode,
  type TngDrawerPosition,
} from '@tailng-ui/primitives';
import { afterEach, describe, expect, it } from 'vitest';
import { TngDrawerComponent } from '../tng-drawer.component';

function getDrawer(fixture: { nativeElement: HTMLElement }): HTMLElement {
  const el = fixture.nativeElement.querySelector('[data-slot="drawer"]');
  if (el === null) {
    throw new Error('Expected [data-slot="drawer"] to exist.');
  }
  return el;
}

function getContent(fixture: { nativeElement: HTMLElement }): HTMLElement {
  const el = fixture.nativeElement.querySelector('[data-testid="content"]');
  if (el === null) {
    throw new Error('Expected [data-testid="content"] to exist.');
  }
  return el;
}

function pressKey(target: EventTarget, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
  });
  target.dispatchEvent(event);
  return event;
}

@Component({
  imports: [TngDrawerComponent, TngDrawerContainer, TngDrawerContent],
  template: `
    <section tngDrawerContainer [animate]="false" [dir]="dir()">
      <tng-drawer
        #drawer="tngDrawerComponent"
        data-testid="drawer"
        [ariaLabel]="ariaLabel()"
        [opened]="opened()"
        [mode]="mode()"
        [position]="position()"
        [disabled]="disabled()"
        [backdrop]="false"
        [closeOnEscape]="closeOnEscape()"
        (openedChange)="onOpenedChange($event)"
      >
        <button type="button" data-testid="inside-first">First</button>
        <button type="button" data-testid="inside-last">Last</button>
      </tng-drawer>

      <main tngDrawerContent data-testid="content">Content</main>
    </section>
  `,
})
class DrawerHostComponent {
  readonly opened = signal(false);
  readonly ariaLabel = signal('Test drawer');
  readonly mode = signal<TngDrawerMode>('overlay');
  readonly position = signal<TngDrawerPosition>('start');
  readonly disabled = signal(false);
  readonly closeOnEscape = signal(true);
  readonly dir = signal<'ltr' | 'rtl'>('ltr');
  readonly openedChanges: boolean[] = [];

  @ViewChild('drawer', { static: true }) drawer!: TngDrawerComponent;

  onOpenedChange(next: boolean): void {
    this.openedChanges.push(next);
    this.opened.set(next);
  }
}

@Component({
  imports: [TngDrawerComponent, TngDrawerContainer, TngDrawerContent],
  template: `
    <section tngDrawerContainer [animate]="false" [closeOthersOnOpen]="false">
      <tng-drawer
        #drawerStart="tngDrawerComponent"
        data-testid="drawer-start"
        [opened]="openedStart()"
        position="start"
        [backdrop]="false"
        (openedChange)="openedStart.set($event)"
      >
        <p>Start drawer</p>
      </tng-drawer>

      <tng-drawer
        #drawerEnd="tngDrawerComponent"
        data-testid="drawer-end"
        [opened]="openedEnd()"
        position="end"
        [backdrop]="false"
        (openedChange)="openedEnd.set($event)"
      >
        <p>End drawer</p>
      </tng-drawer>

      <main tngDrawerContent data-testid="content">Content</main>
    </section>
  `,
})
class DualDrawerHostComponent {
  readonly openedStart = signal(false);
  readonly openedEnd = signal(false);

  @ViewChild('drawerStart', { static: true }) drawerStart!: TngDrawerComponent;
  @ViewChild('drawerEnd', { static: true }) drawerEnd!: TngDrawerComponent;
}

@Component({
  imports: [TngDrawerComponent, TngDrawerContainer, TngDrawerContent],
  template: `
    <section tngDrawerContainer [animate]="false">
      <tng-drawer
        #drawer="tngDrawerComponent"
        data-testid="drawer"
        [defaultOpened]="true"
        [backdrop]="false"
      >
        <button type="button" data-testid="inside">Inside</button>
      </tng-drawer>

      <main tngDrawerContent data-testid="content">Content</main>
    </section>
  `,
})
class DefaultOpenedHostComponent {
  @ViewChild('drawer', { static: true }) drawer!: TngDrawerComponent;
}

describe('tng-drawer component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  // ── exports ──

  it('exports the drawer component', () => {
    expect(typeof TngDrawerComponent).toBe('function');
  });

  // ── rendering ──

  it('renders with data-slot="drawer" and correct initial state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.detectChanges();

    const drawer = getDrawer(fixture);
    expect(drawer.getAttribute('data-slot')).toBe('drawer');
    expect(drawer.getAttribute('data-state')).toBe('closed');
    expect(drawer.hasAttribute('hidden')).toBe(true);
  });

  it('renders open state when opened is true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.componentInstance.opened.set(true);
    fixture.detectChanges();

    const drawer = getDrawer(fixture);
    expect(drawer.getAttribute('data-state')).toBe('open');
    expect(drawer.hasAttribute('hidden')).toBe(false);
  });

  it('renders defaultOpened=true as initially open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DefaultOpenedHostComponent],
    }).createComponent(DefaultOpenedHostComponent);
    fixture.detectChanges();

    const drawer = getDrawer(fixture);
    expect(drawer.getAttribute('data-state')).toBe('open');
    expect(fixture.componentInstance.drawer.isOpen()).toBe(true);
  });

  it('projects content inside the drawer', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.componentInstance.opened.set(true);
    fixture.detectChanges();

    const drawer = getDrawer(fixture);
    expect(drawer.querySelector('[data-testid="inside-first"]')).not.toBeNull();
    expect(drawer.querySelector('[data-testid="inside-last"]')).not.toBeNull();
  });

  // ── aria-label ──

  it('forwards ariaLabel input to the host element', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.detectChanges();

    const drawer = getDrawer(fixture);
    expect(drawer.getAttribute('aria-label')).toBe('Test drawer');
  });

  it('updates aria-label when input changes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.ariaLabel.set('Settings panel');
    fixture.detectChanges();

    const drawer = getDrawer(fixture);
    expect(drawer.getAttribute('aria-label')).toBe('Settings panel');
  });

  it('uses "Drawer" as the default aria-label', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DefaultOpenedHostComponent],
    }).createComponent(DefaultOpenedHostComponent);
    fixture.detectChanges();

    const drawer = getDrawer(fixture);
    expect(drawer.getAttribute('aria-label')).toBe('Drawer');
  });

  // ── data attributes ──

  it('applies data-position reflecting the position input', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.detectChanges();

    const drawer = getDrawer(fixture);
    expect(drawer.getAttribute('data-position')).toBe('start');

    fixture.componentInstance.position.set('end');
    fixture.detectChanges();
    expect(drawer.getAttribute('data-position')).toBe('end');
  });

  it('applies data-mode reflecting the mode input', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.detectChanges();

    const drawer = getDrawer(fixture);
    expect(drawer.getAttribute('data-mode')).toBe('overlay');

    fixture.componentInstance.mode.set('push');
    fixture.detectChanges();
    expect(drawer.getAttribute('data-mode')).toBe('push');

    fixture.componentInstance.mode.set('side');
    fixture.detectChanges();
    expect(drawer.getAttribute('data-mode')).toBe('side');
  });

  it('applies data-disabled when disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const drawer = getDrawer(fixture);
    expect(drawer.getAttribute('data-disabled')).not.toBeNull();
  });

  // ── imperative API ──

  it('open() opens the drawer', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.drawer.open();
    fixture.detectChanges();

    expect(fixture.componentInstance.drawer.isOpen()).toBe(true);
    expect(getDrawer(fixture).getAttribute('data-state')).toBe('open');
  });

  it('close() closes the drawer', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.componentInstance.opened.set(true);
    fixture.detectChanges();

    fixture.componentInstance.drawer.close();
    fixture.detectChanges();

    expect(fixture.componentInstance.drawer.isOpen()).toBe(false);
    expect(getDrawer(fixture).getAttribute('data-state')).toBe('closed');
  });

  it('toggle() toggles the drawer state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.drawer.toggle(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.drawer.isOpen()).toBe(true);

    fixture.componentInstance.drawer.toggle(false);
    fixture.detectChanges();
    expect(fixture.componentInstance.drawer.isOpen()).toBe(false);

    fixture.componentInstance.drawer.toggle();
    fixture.detectChanges();
    expect(fixture.componentInstance.drawer.isOpen()).toBe(true);
  });

  it('isOpen() reflects current open state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.drawer.isOpen()).toBe(false);

    fixture.componentInstance.opened.set(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.drawer.isOpen()).toBe(true);
  });

  // ── controlled state ──

  it('emits openedChange when opened via imperative API', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.drawer.open();
    fixture.detectChanges();

    expect(fixture.componentInstance.openedChanges).toContain(true);
  });

  it('emits openedChange when closed via imperative API', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.componentInstance.opened.set(true);
    fixture.detectChanges();

    fixture.componentInstance.drawer.close();
    fixture.detectChanges();

    expect(fixture.componentInstance.openedChanges).toContain(false);
  });

  // ── disabled ──

  it('does not open when disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    fixture.componentInstance.drawer.open();
    fixture.detectChanges();

    expect(fixture.componentInstance.drawer.isOpen()).toBe(false);
    expect(getDrawer(fixture).getAttribute('data-state')).toBe('closed');
  });

  // ── Escape key ──

  it('Escape closes the drawer when closeOnEscape is true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.componentInstance.opened.set(true);
    fixture.detectChanges();

    pressKey(document, 'Escape');
    fixture.detectChanges();

    expect(fixture.componentInstance.drawer.isOpen()).toBe(false);
  });

  it('Escape does not close when closeOnEscape is false', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.componentInstance.opened.set(true);
    fixture.componentInstance.closeOnEscape.set(false);
    fixture.detectChanges();

    pressKey(document, 'Escape');
    fixture.detectChanges();

    expect(fixture.componentInstance.drawer.isOpen()).toBe(true);
  });

  // ── dual drawers ──

  it('supports start and end drawers simultaneously', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DualDrawerHostComponent],
    }).createComponent(DualDrawerHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.drawerStart.open();
    fixture.componentInstance.drawerEnd.open();
    fixture.detectChanges();

    const start = fixture.nativeElement.querySelector('[data-testid="drawer-start"]') as HTMLElement;
    const end = fixture.nativeElement.querySelector('[data-testid="drawer-end"]') as HTMLElement;

    expect(start.getAttribute('data-state')).toBe('open');
    expect(start.getAttribute('data-position')).toBe('start');
    expect(end.getAttribute('data-state')).toBe('open');
    expect(end.getAttribute('data-position')).toBe('end');
  });

  // ── container ──

  it('renders within a drawer container with data-slot="drawer-container"', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[data-slot="drawer-container"]');
    expect(container).not.toBeNull();
  });

  it('drawer content receives data-slot="drawer-content"', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.detectChanges();

    const content = getContent(fixture);
    expect(content.getAttribute('data-slot')).toBe('drawer-content');
  });

  // ── CSS styling ──

  it('host element is hidden when closed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.detectChanges();

    const drawer = getDrawer(fixture);
    expect(drawer.hasAttribute('hidden')).toBe(true);
  });

  it('host element is visible when open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerHostComponent],
    }).createComponent(DrawerHostComponent);
    fixture.componentInstance.opened.set(true);
    fixture.detectChanges();

    const drawer = getDrawer(fixture);
    expect(drawer.hasAttribute('hidden')).toBe(false);
  });
});
