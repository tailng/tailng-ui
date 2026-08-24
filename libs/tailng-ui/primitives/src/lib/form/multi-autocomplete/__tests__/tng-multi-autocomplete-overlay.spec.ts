import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { TngOverlayScrollStrategy } from '@tailng-ui/cdk';

import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteContent } from '../tng-multi-autocomplete.content';
import { TngMultiAutocompleteListbox } from '../tng-multi-autocomplete.listbox';
import { TngMultiAutocompleteOption } from '../tng-multi-autocomplete.listbox';
import { TngMultiAutocompleteOverlay } from '../tng-multi-autocomplete.overlay';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';

function focus(el: HTMLElement): void {
  el.dispatchEvent(new FocusEvent('focus', { bubbles: false, cancelable: false }));
  el.focus();
}

@Component({
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  template: `
    <section
      tngMultiAutocomplete
      style="
        --tng-multi-autocomplete-surface: #f8fafc;
        --tng-multi-autocomplete-border: #d8e2ef;
        --tng-multi-autocomplete-fg: #0f172a;
        --tng-multi-autocomplete-brand: #2563eb;
        --tng-multi-autocomplete-z-overlay: 2;
        color-scheme: light;
      "
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
    >
      <input tngMultiAutocompleteTrigger data-testid="trigger" type="text" autocomplete="off" />

      <div tngMultiAutocompleteContent class="contents">
        <div tngMultiAutocompleteOverlay data-testid="overlay">
          <ul tngMultiAutocompleteListbox>
            <li tngMultiAutocompleteOption [tngValue]="'India'">India</li>
            <li tngMultiAutocompleteOption [tngValue]="'Indonesia'">Indonesia</li>
          </ul>
        </div>
      </div>
    </section>

    <button type="button" data-testid="after-button">After</button>
  `,
})
class MultiAutocompleteOverlayHostComponent {
  readonly open = signal(false);
  readonly value = signal<readonly string[]>([]);
}

@Component({
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  template: `
    <div data-testid="scroll-parent" style="height: 120px; overflow: auto">
      <section
        tngMultiAutocomplete
        [open]="open()"
        (openChange)="open.set($event)"
        [value]="value()"
        (valueChange)="value.set($event)"
        data-testid="multi-autocomplete"
      >
        <input tngMultiAutocompleteTrigger data-testid="trigger" type="text" autocomplete="off" />

        <div tngMultiAutocompleteContent>
          <div
            tngMultiAutocompleteOverlay
            [scrollStrategy]="scrollStrategy()"
            data-testid="overlay"
          >
            <ul tngMultiAutocompleteListbox>
              <li tngMultiAutocompleteOption [tngValue]="'India'">India</li>
              <li tngMultiAutocompleteOption [tngValue]="'Indonesia'">Indonesia</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  `,
})
class NestedScrollBlockHostComponent {
  readonly open = signal(false);
  readonly scrollStrategy = signal<TngOverlayScrollStrategy>('reposition');
  readonly value = signal<readonly string[]>([]);
}

@Component({
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  template: `
    <header data-testid="sticky-header" style="position: sticky; top: 0; z-index: 50; height: 64px">
      Header
    </header>

    <main style="height: 2000px; overflow: auto">
      <div style="height: 320px"></div>

      <section
        tngMultiAutocomplete
        style="--tng-multi-autocomplete-z-overlay: 2"
        [open]="open()"
        (openChange)="open.set($event)"
        [value]="value()"
        (valueChange)="value.set($event)"
        data-testid="multi-autocomplete"
      >
        <input tngMultiAutocompleteTrigger data-testid="trigger" type="text" autocomplete="off" />

        <div tngMultiAutocompleteContent>
          <div
            tngMultiAutocompleteOverlay
            [scrollStrategy]="scrollStrategy()"
            data-testid="overlay"
          >
            <ul tngMultiAutocompleteListbox>
              <li tngMultiAutocompleteOption [tngValue]="'India'">India</li>
              <li tngMultiAutocompleteOption [tngValue]="'Indonesia'">Indonesia</li>
            </ul>
          </div>
        </div>
      </section>

      <div style="height: 1200px"></div>
    </main>
  `,
})
class StickyHeaderScrollHostComponent {
  readonly open = signal(false);
  readonly value = signal<readonly string[]>([]);
  readonly scrollStrategy = signal<TngOverlayScrollStrategy>('reposition');
}

describe('tng-multi-autocomplete overlay mounting', () => {
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

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('');
    expect(scrollParent.style.overflow).toBe('auto');

    host.open.set(false);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.body.style.overflow).toBe('');
    expect(scrollParent.style.overflow).toBe('auto');
  });

  it('preserves the document scrollbar and locks nested scrolling when block is explicit', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [NestedScrollBlockHostComponent],
    }).createComponent(NestedScrollBlockHostComponent);
    fixture.componentInstance.scrollStrategy.set('block');
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const scrollParent = fixture.nativeElement.querySelector(
      '[data-testid="scroll-parent"]',
    ) as HTMLElement;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('fixed');
    expect(document.documentElement.style.overflowY).toBe('scroll');
    expect(scrollParent.style.overflow).toBe('hidden');

    host.open.set(false);
    fixture.detectChanges();

    expect(document.documentElement.style.position).toBe('');
    expect(document.documentElement.style.overflowY).toBe('');
    expect(scrollParent.style.overflow).toBe('auto');
  });

  it('moves overlay to document.body while open and restores it on close', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiAutocompleteOverlayHostComponent],
    }).createComponent(MultiAutocompleteOverlayHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const multiHost = fixture.nativeElement.querySelector(
      '[data-slot="multi-autocomplete"]',
    ) as HTMLElement;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;
    const overlay = fixture.nativeElement.querySelector('[data-testid="overlay"]') as HTMLElement;

    multiHost.getBoundingClientRect = () =>
      ({
        left: 48,
        top: 72,
        width: 320,
        height: 48,
        right: 368,
        bottom: 120,
        x: 48,
        y: 72,
        toJSON: () => ({}),
      }) as DOMRect;

    expect(overlay.parentNode).not.toBe(document.body);
    expect(fixture.nativeElement.contains(overlay)).toBe(true);

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(overlay.parentNode).toBe(document.body);
    expect(fixture.nativeElement.contains(overlay)).toBe(false);
    expect(overlay.style.getPropertyValue('--tng-multi-autocomplete-surface').trim()).toBe(
      '#f8fafc',
    );
    expect(overlay.style.getPropertyValue('--tng-multi-autocomplete-border').trim()).toBe(
      '#d8e2ef',
    );
    expect(overlay.style.getPropertyValue('--tng-multi-autocomplete-fg').trim()).toBe('#0f172a');
    expect(overlay.style.getPropertyValue('--tng-multi-autocomplete-brand').trim()).toBe('#2563eb');
    expect(overlay.style.getPropertyValue('--tng-multi-autocomplete-z-overlay').trim()).toBe('2');
    expect(overlay.style.zIndex).toBe(
      'var(--tng-multi-autocomplete-z-overlay, var(--tng-multi-autocomplete-overlay-z-index, var(--tng-z-overlay, 2)))',
    );
    expect(overlay.style.colorScheme).toBe('light');
    expect(overlay.style.width).toBe('320px');
    expect(overlay.style.minWidth).toBe('320px');

    host.open.set(false);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(overlay.parentNode).not.toBe(document.body);
    expect(fixture.nativeElement.contains(overlay)).toBe(true);
    expect(overlay.style.getPropertyValue('--tng-multi-autocomplete-surface').trim()).toBe('');
    expect(overlay.style.getPropertyValue('--tng-multi-autocomplete-z-overlay').trim()).toBe('');
    expect(overlay.style.zIndex).toBe('');
    expect(overlay.style.colorScheme).toBe('');
    expect(overlay.style.width).toBe('');
    expect(overlay.style.minWidth).toBe('');
  });

  it('closes the overlay after scroll moves the trigger fully out of view', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StickyHeaderScrollHostComponent],
    }).createComponent(StickyHeaderScrollHostComponent);

    fixture.detectChanges();

    const multiHost = fixture.nativeElement.querySelector(
      '[data-testid="multi-autocomplete"]',
    ) as HTMLElement;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;
    const header = fixture.nativeElement.querySelector(
      '[data-testid="sticky-header"]',
    ) as HTMLElement;
    let hostTop = 120;
    const hostHeight = 48;

    vi.spyOn(multiHost, 'getBoundingClientRect').mockImplementation(
      () =>
        ({
          bottom: hostTop + hostHeight,
          height: hostHeight,
          left: 24,
          right: 264,
          top: hostTop,
          width: 240,
          x: 24,
          y: hostTop,
          toJSON: () => ({}),
        }) as DOMRect,
    );

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const overlay = document.body.querySelector('[data-testid="overlay"]') as HTMLElement | null;
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

    hostTop = -64;
    window.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(overlay!.style.top).toBe('');
    expect(overlay!.style.zIndex).toBe('');
    expect(Number(header.style.zIndex)).toBe(50);
  });
});
