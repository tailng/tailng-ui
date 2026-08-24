import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { TngOverlayScrollStrategy } from '@tailng-ui/cdk';

import {
  TngAutocomplete,
  TngAutocompleteContent,
  TngAutocompleteIcon,
  TngAutocompleteListbox,
  TngAutocompleteOption,
  TngAutocompleteOverlay,
  TngAutocompleteTrigger,
  TngAutocompleteTriggerContainer,
} from '../index';

function keydown(el: HTMLElement, init: Partial<KeyboardEventInit> & { key: string }): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }));
}

function focus(el: HTMLElement): void {
  el.focus();
}

function pointerdown(el: HTMLElement, init: Partial<PointerEventInit> = {}): void {
  el.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      ...init,
    }),
  );
}

function click(el: HTMLElement): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
}

function findOverlay(): HTMLElement | null {
  return document.body.querySelector('[data-testid="overlay"]') as HTMLElement | null;
}

/** Mirrors theme autocomplete host grid + open gap collapse (primitives tests do not load theme CSS). */
function injectAutocompleteHostGridStylesheetForTests(): HTMLStyleElement {
  const el = document.createElement('style');
  el.setAttribute('data-tng-autocomplete-host-grid-test', '');
  el.textContent =
    '[data-slot="autocomplete"]{display:grid;gap:0.45rem;min-width:0}' +
    '[data-slot="autocomplete"][data-state="open"]{gap:0}';
  document.head.appendChild(el);
  return el;
}

@Component({
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  template: `
    <div
      tngAutocomplete
      #api="tngAutocomplete"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="autocomplete"
    >
      <input tngAutocompleteTrigger type="text" data-testid="trigger" />

      <div tngAutocompleteContent data-testid="content">
        <div tngAutocompleteOverlay data-testid="overlay">
          <ul
            tngAutocompleteListbox
            [value]="api.value()"
            (valueChange)="api.value.set($event)"
            data-testid="listbox"
          >
            <li tngAutocompleteOption [tngValue]="'a'" data-testid="opt-a">A</li>
            <li tngAutocompleteOption [tngValue]="'b'" data-testid="opt-b">B</li>
            <li tngAutocompleteOption [tngValue]="'c'" data-testid="opt-c">C</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
}

@Component({
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  template: `
    <div data-testid="scroll-parent" style="height: 120px; overflow: auto">
      <div
        tngAutocomplete
        #api="tngAutocomplete"
        [open]="open()"
        (openChange)="open.set($event)"
        [value]="value()"
        (valueChange)="value.set($event)"
        data-testid="autocomplete"
      >
        <input tngAutocompleteTrigger type="text" data-testid="trigger" />

        <div tngAutocompleteContent data-testid="content">
          <div tngAutocompleteOverlay [scrollStrategy]="scrollStrategy()" data-testid="overlay">
            <ul
              tngAutocompleteListbox
              [value]="api.value()"
              (valueChange)="api.value.set($event)"
              data-testid="listbox"
            >
              <li tngAutocompleteOption [tngValue]="'a'" data-testid="opt-a">A</li>
              <li tngAutocompleteOption [tngValue]="'b'" data-testid="opt-b">B</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
})
class NestedScrollBlockHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  scrollStrategy = signal<TngOverlayScrollStrategy>('reposition');
  value = signal<string | null>(null);
}

/** Overlay with wide content to test min-width vs grow. */
@Component({
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  template: `
    <div
      tngAutocomplete
      #api="tngAutocomplete"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="autocomplete"
    >
      <input tngAutocompleteTrigger type="text" data-testid="trigger" style="width: 100px" />

      <div tngAutocompleteContent data-testid="content">
        <div tngAutocompleteOverlay data-testid="overlay">
          <ul
            tngAutocompleteListbox
            [value]="api.value()"
            (valueChange)="api.value.set($event)"
            data-testid="listbox"
            style="min-width: 300px"
          >
            <li tngAutocompleteOption [tngValue]="'a'" data-testid="opt-a">
              Option A – very long label
            </li>
            <li tngAutocompleteOption [tngValue]="'b'" data-testid="opt-b">
              Option B – very long label
            </li>
            <li tngAutocompleteOption [tngValue]="'c'" data-testid="opt-c">Option C</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
class WideContentHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
}

/** Trigger + icon in container; overlay should use container width for min-width. */
@Component({
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteIcon,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  template: `
    <div
      tngAutocomplete
      #api="tngAutocomplete"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="autocomplete"
    >
      <div
        tngAutocompleteTriggerContainer
        data-testid="container"
        style="display: flex; width: 180px; align-items: center"
      >
        <input
          tngAutocompleteTrigger
          type="text"
          data-testid="trigger"
          style="flex: 1; min-width: 0"
        />
        <span tngAutocompleteIcon data-testid="icon" style="flex-shrink: 0; padding: 4px">▾</span>
      </div>

      <div tngAutocompleteContent data-testid="content">
        <div tngAutocompleteOverlay data-testid="overlay">
          <ul
            tngAutocompleteListbox
            [value]="api.value()"
            (valueChange)="api.value.set($event)"
            data-testid="listbox"
          >
            <li tngAutocompleteOption [tngValue]="'a'" data-testid="opt-a">A</li>
            <li tngAutocompleteOption [tngValue]="'b'" data-testid="opt-b">B</li>
            <li tngAutocompleteOption [tngValue]="'c'" data-testid="opt-c">C</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
class TriggerContainerHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
}

@Component({
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  template: `
    <header data-testid="sticky-header" style="position: sticky; top: 0; z-index: 50; height: 64px">
      Header
    </header>

    <main style="height: 2000px; overflow: auto">
      <div style="height: 320px"></div>

      <div
        tngAutocomplete
        #api="tngAutocomplete"
        [open]="open()"
        (openChange)="open.set($event)"
        [value]="value()"
        (valueChange)="value.set($event)"
        data-testid="autocomplete"
        style="--tng-autocomplete-z-overlay: 2"
      >
        <input tngAutocompleteTrigger type="text" data-testid="trigger" />

        <div tngAutocompleteContent data-testid="content">
          <div tngAutocompleteOverlay [scrollStrategy]="scrollStrategy()" data-testid="overlay">
            <ul
              tngAutocompleteListbox
              [value]="api.value()"
              (valueChange)="api.value.set($event)"
              data-testid="listbox"
            >
              <li tngAutocompleteOption [tngValue]="'india'" data-testid="country-india">India</li>
              <li tngAutocompleteOption [tngValue]="'japan'" data-testid="country-japan">Japan</li>
              <li tngAutocompleteOption [tngValue]="'spain'" data-testid="country-spain">Spain</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="height: 1200px"></div>
    </main>
  `,
})
class StickyHeaderScrollHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
  scrollStrategy = signal<TngOverlayScrollStrategy>('reposition');
}

async function openAutocomplete(
  fixture: { detectChanges: () => void },
  trigger: HTMLElement,
): Promise<void> {
  focus(trigger);
  fixture.detectChanges();
  await Promise.resolve();
  fixture.detectChanges();
}

describe('tng-autocomplete.overlay', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.documentElement.style.left = '';
    document.documentElement.style.overflowY = '';
    document.documentElement.style.position = '';
    document.documentElement.style.top = '';
    document.documentElement.style.width = '';
  });

  describe('Host layout when overlay is portalled', () => {
    it('does not apply grid row-gap under the trigger while open', async () => {
      const style = injectAutocompleteHostGridStylesheetForTests();
      try {
        const fixture = TestBed.configureTestingModule({
          imports: [HostComponent],
        }).createComponent(HostComponent);

        fixture.detectChanges();

        const host = fixture.nativeElement.querySelector(
          '[data-testid="autocomplete"]',
        ) as HTMLElement;
        const trigger = fixture.nativeElement.querySelector(
          '[data-testid="trigger"]',
        ) as HTMLInputElement;

        const heightClosed = host.getBoundingClientRect().height;

        await openAutocomplete(fixture, trigger);
        fixture.detectChanges();
        await Promise.resolve();
        fixture.detectChanges();

        expect(host.getAttribute('data-state')).toBe('open');
        expect(getComputedStyle(host).gap.startsWith('0px')).toBe(true);

        const heightOpen = host.getBoundingClientRect().height;
        expect(Math.abs(heightOpen - heightClosed)).toBeLessThan(2);
      } finally {
        style.remove();
      }
    });
  });

  describe('Overlay renders when open=true', () => {
    it('overlay is in body and not hidden when open', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;

      expect(host.open()).toBe(false);

      await openAutocomplete(fixture, trigger);

      const overlay = findOverlay();
      expect(overlay).toBeTruthy();
      expect(overlay?.getAttribute('hidden')).toBeNull();
      expect(document.body.contains(overlay)).toBe(true);
    });
  });

  describe('Scroll strategy', () => {
    it('keeps document and nested scrolling enabled by default while open', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [NestedScrollBlockHostComponent],
      }).createComponent(NestedScrollBlockHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const scrollParent = fixture.nativeElement.querySelector(
        '[data-testid="scroll-parent"]',
      ) as HTMLElement;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);

      expect(host.open()).toBe(true);
      expect(document.body.style.overflow).toBe('');
      expect(document.documentElement.style.position).toBe('');
      expect(scrollParent.style.overflow).toBe('auto');

      host.open.set(false);
      fixture.detectChanges();
    });

    it('preserves the document scrollbar and locks nested scrolling when block is explicit', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [NestedScrollBlockHostComponent],
      }).createComponent(NestedScrollBlockHostComponent);

      const host = fixture.componentInstance;
      host.scrollStrategy.set('block');
      fixture.detectChanges();

      const scrollParent = fixture.nativeElement.querySelector(
        '[data-testid="scroll-parent"]',
      ) as HTMLElement;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);

      expect(host.open()).toBe(true);
      expect(document.body.style.overflow).toBe('');
      expect(document.documentElement.style.position).toBe('fixed');
      expect(document.documentElement.style.overflowY).toBe('scroll');
      expect(scrollParent.style.overflow).toBe('hidden');

      host.open.set(false);
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(document.body.style.overflow).toBe('');
      expect(document.documentElement.style.position).toBe('');
      expect(document.documentElement.style.overflowY).toBe('');
      expect(scrollParent.style.overflow).toBe('auto');
    });
  });

  describe('Overlay hidden when closed', () => {
    it('overlay has hidden when closed', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      expect(findOverlay()?.getAttribute('hidden')).toBeNull();

      keydown(trigger, { key: 'Escape' });
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      const overlay = findOverlay();
      expect(overlay).toBeTruthy();
      expect(overlay?.getAttribute('hidden')).toBe('');
    });

    it('keeps the portalled panel inert until an exit animation completes', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;
      await openAutocomplete(fixture, trigger);

      const overlay = findOverlay();
      expect(overlay).not.toBeNull();
      overlay!.style.animationName = 'test-autocomplete-exit';
      overlay!.style.animationDuration = '10s';
      overlay!.style.animationDelay = '0s';

      fixture.componentInstance.open.set(false);
      fixture.detectChanges();

      expect(overlay?.parentNode).toBe(document.body);
      expect(overlay?.getAttribute('data-presence')).toBe('exiting');
      expect(overlay?.getAttribute('aria-hidden')).toBe('true');
      expect(overlay?.hasAttribute('inert')).toBe(true);

      overlay?.dispatchEvent(new Event('animationend', { bubbles: true }));
      await Promise.resolve();
      fixture.detectChanges();

      expect(overlay?.parentNode).not.toBe(document.body);
      expect(overlay?.getAttribute('data-presence')).toBe('closed');
      expect(overlay?.getAttribute('hidden')).toBe('');
    });
  });

  describe('Min-width equals trigger width', () => {
    it('overlay min-width matches trigger width when open', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;
      const triggerRect = trigger.getBoundingClientRect();

      await openAutocomplete(fixture, trigger);

      await Promise.resolve();
      fixture.detectChanges();

      const overlay = findOverlay();
      expect(overlay).toBeTruthy();
      const minWidth = overlay?.style.minWidth;
      expect(minWidth).toBeDefined();
      expect(parseFloat(minWidth || '0')).toBe(triggerRect.width);
    });
  });

  describe('Trigger container (trigger + icon)', () => {
    it('overlay min-width matches container width when trigger container is used', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TriggerContainerHostComponent],
      }).createComponent(TriggerContainerHostComponent);

      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector(
        '[data-testid="container"]',
      ) as HTMLElement;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;
      const containerRect = container.getBoundingClientRect();

      await openAutocomplete(fixture, trigger);

      await Promise.resolve();
      fixture.detectChanges();

      const overlay = findOverlay();
      expect(overlay).toBeTruthy();
      const minWidth = overlay?.style.minWidth;
      expect(minWidth).toBeDefined();
      expect(parseFloat(minWidth || '0')).toBe(containerRect.width);
    });

    it('pointerdown on icon does not close overlay', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TriggerContainerHostComponent],
      }).createComponent(TriggerContainerHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;
      const icon = fixture.nativeElement.querySelector('[data-testid="icon"]') as HTMLElement;

      await openAutocomplete(fixture, trigger);
      expect(host.open()).toBe(true);

      pointerdown(icon);
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.open()).toBe(true);
    });

    it('click on chevron icon opens overlay', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TriggerContainerHostComponent],
      }).createComponent(TriggerContainerHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const icon = fixture.nativeElement.querySelector('[data-testid="icon"]') as HTMLElement;

      expect(host.open()).toBe(false);
      expect(findOverlay()?.getAttribute('hidden')).toBe('');

      click(icon);
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.open()).toBe(true);
      expect(findOverlay()?.getAttribute('hidden')).toBeNull();
    });
  });

  describe('Overlay can grow wider than trigger', () => {
    it('overlay has minWidth but no maxWidth, so content can grow', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [WideContentHostComponent],
      }).createComponent(WideContentHostComponent);

      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);

      await Promise.resolve();
      fixture.detectChanges();

      const overlay = findOverlay();
      expect(overlay).toBeTruthy();
      expect(overlay?.style.minWidth).toBeDefined();
      expect(overlay?.style.maxWidth ?? '').toBe('');
    });
  });

  describe('Clicking outside closes', () => {
    it('pointerdown outside overlay closes', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      expect(host.open()).toBe(true);

      pointerdown(document.body);
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.open()).toBe(false);
    });
  });

  describe('Escape closes', () => {
    it('Escape key closes overlay', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      expect(host.open()).toBe(true);

      keydown(trigger, { key: 'Escape' });
      fixture.detectChanges();

      expect(host.open()).toBe(false);
    });
  });

  describe('Focus restore does not reopen', () => {
    it('focus on trigger after close does not reopen when _restoringFocus', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      expect(host.open()).toBe(true);

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.open()).toBe(false);
      expect(document.activeElement).toBe(trigger);
      expect(host.open()).toBe(false);
    });
  });

  describe('Scroll reposition', () => {
    it('closes the overlay after scroll moves the trigger fully out of view', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [StickyHeaderScrollHostComponent],
      }).createComponent(StickyHeaderScrollHostComponent);

      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;
      const header = fixture.nativeElement.querySelector(
        '[data-testid="sticky-header"]',
      ) as HTMLElement;
      let triggerTop = 120;
      const triggerHeight = 32;

      vi.spyOn(trigger, 'getBoundingClientRect').mockImplementation(
        () =>
          ({
            bottom: triggerTop + triggerHeight,
            height: triggerHeight,
            left: 24,
            right: 264,
            top: triggerTop,
            width: 240,
            x: 24,
            y: triggerTop,
            toJSON: () => ({}),
          }) as DOMRect,
      );

      await openAutocomplete(fixture, trigger);

      await Promise.resolve();
      fixture.detectChanges();

      const overlay = findOverlay();
      expect(overlay).toBeTruthy();

      vi.spyOn(overlay!, 'getBoundingClientRect').mockImplementation(
        () =>
          ({
            bottom: 128,
            height: 120,
            left: 0,
            right: 240,
            top: 8,
            width: 240,
            x: 0,
            y: 8,
            toJSON: () => ({}),
          }) as DOMRect,
      );

      triggerTop = -40;
      window.dispatchEvent(new Event('scroll'));
      await new Promise((resolve) => requestAnimationFrame(resolve));
      fixture.detectChanges();

      expect(fixture.componentInstance.open()).toBe(false);
      expect(overlay!.style.top).toBe('');
      expect(overlay!.style.zIndex).toBe('');
      expect(Number(header.style.zIndex)).toBe(50);
    });
  });
});
