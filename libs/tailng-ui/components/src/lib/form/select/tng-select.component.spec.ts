import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngSelectComponent } from './tng-select.component';

type SelectOption = { value: string; label: string };

function pointerdown(el: HTMLElement): void {
  el.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
    }),
  );
}

function keydown(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

function getTrigger(root: HTMLElement): HTMLElement {
  const trigger = root.querySelector('[data-slot="select-trigger"]') as HTMLElement | null;
  if (!trigger) {
    throw new Error('Expected select trigger');
  }
  return trigger;
}

function getOptions(): HTMLElement[] {
  return Array.from(document.querySelectorAll('[data-slot="select-option"]')) as HTMLElement[];
}

function getOpenOverlay(): HTMLElement {
  const overlays = Array.from(document.querySelectorAll('[data-slot="select-overlay"]'));
  const open = overlays.find((el) => el.getAttribute('hidden') === null) as HTMLElement | undefined;
  if (!open) {
    throw new Error('Expected an open select overlay');
  }
  return open;
}

@Component({
  imports: [TngSelectComponent],
  template: `
    <tng-select [ariaLabel]="'Choose item'" data-testid="host">
      <span>Content</span>
    </tng-select>
  `,
})
class HostComponent {}

/**
 * Mirrors the admin-frontend footgun: options are mapped in the template via a
 * method that allocates a new array of new objects on every change detection.
 */
@Component({
  imports: [TngSelectComponent],
  template: `
    <tng-select
      data-testid="select"
      [options]="clientSelectOptions()"
      [value]="value()"
      (valueChange)="value.set($event)"
      [getOptionValue]="getSelectValue"
      [getOptionLabel]="getSelectLabel"
      placeholder="Select…"
    />
  `,
})
class UnstableOptionsHostComponent {
  readonly clients = [
    { client_id: 'a', client_name: 'Client A' },
    { client_id: 'b', client_name: 'Client B' },
    { client_id: 'c', client_name: 'Client C' },
  ] as const;

  readonly value = signal<string | null>(null);
  readonly tick = signal(0);

  readonly getSelectValue = (opt: SelectOption): string => opt.value;
  readonly getSelectLabel = (opt: SelectOption): string => opt.label;

  /** Intentionally unstable: new object identities every call / CD. */
  clientSelectOptions(): SelectOption[] {
    // Read tick so callers can force an extra CD pass that remaps options.
    this.tick();
    return this.clients.map((c) => ({
      value: c.client_id,
      label: c.client_name,
    }));
  }

  remountOptions(): void {
    this.tick.update((n) => n + 1);
  }
}

@Component({
  imports: [TngSelectComponent],
  template: `
    <tng-select
      data-testid="select"
      [options]="options"
      [value]="value()"
      (valueChange)="value.set($event)"
      [getOptionLabel]="getOptionLabel"
      placeholder="Select orientation"
    />
  `,
})
class PrimitiveOptionsHostComponent {
  readonly options = ['ALL', 'LANDSCAPE', 'PORTRAIT'] as const;
  readonly value = signal<string | null>(null);
  readonly getOptionLabel = (option: string): string => option;
}

describe('tng-select component (headless wrapper)', () => {
  it('attaches the primitive [tngSelect] to the host and wires aria-label', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[data-testid="host"]') as HTMLElement;
    expect(host).toBeTruthy();

    // From primitive HostBinding('attr.data-slot') => 'select'
    expect(host.getAttribute('data-slot')).toBe('select');

    // From wrapper HostBinding('attr.aria-label')
    expect(host.getAttribute('aria-label')).toBe('Choose item');
  });
});

describe('tng-select component (primitive options)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    document.querySelectorAll('[data-slot="select-overlay"]').forEach((el) => el.remove());
  });

  it('uses primitive option values by default when getOptionValue is omitted', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PrimitiveOptionsHostComponent],
    }).createComponent(PrimitiveOptionsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = getTrigger(fixture.nativeElement);

    pointerdown(trigger);
    fixture.detectChanges();

    const landscape = getOptions().find((el) => el.textContent?.trim() === 'LANDSCAPE');
    expect(landscape).toBeTruthy();

    pointerdown(landscape!);
    fixture.detectChanges();

    expect(host.value()).toBe('LANDSCAPE');
    expect(trigger.textContent).toContain('LANDSCAPE');
  });
});

describe('tng-select component (unstable mapped options each CD)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    document.querySelectorAll('[data-slot="select-overlay"]').forEach((el) => el.remove());
  });

  it('keeps the selected value after option click when [options] is remapped each CD', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UnstableOptionsHostComponent],
    }).createComponent(UnstableOptionsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = getTrigger(fixture.nativeElement);

    pointerdown(trigger);
    fixture.detectChanges();
    expect(getOpenOverlay()).toBeTruthy();

    const optionB = getOptions().find((el) => el.textContent?.trim() === 'Client B');
    expect(optionB).toBeTruthy();

    pointerdown(optionB!);
    // Remount options with new object identities (default trackBy = identity).
    host.remountOptions();
    fixture.detectChanges();

    expect(host.value()).toBe('b');
    expect(trigger.textContent).toContain('Client B');
  });

  it('moves aria-activedescendant with ArrowDown across option remount churn', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UnstableOptionsHostComponent],
    }).createComponent(UnstableOptionsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = getTrigger(fixture.nativeElement);

    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();
    expect(host.value()).toBeNull();

    const activeOnOpen = trigger.getAttribute('aria-activedescendant');
    expect(activeOnOpen).toBeTruthy();

    // Recreate option nodes mid-open (same pattern as method-mapped options).
    host.remountOptions();
    fixture.detectChanges();

    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();

    const activeAfterNav = trigger.getAttribute('aria-activedescendant');
    expect(activeAfterNav).toBeTruthy();
    expect(activeAfterNav).not.toBe(activeOnOpen);

    const activeEl = document.getElementById(activeAfterNav!);
    expect(activeEl?.textContent?.trim()).toBe('Client B');
  });

  it('commits the active option with Enter after option remount churn', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UnstableOptionsHostComponent],
    }).createComponent(UnstableOptionsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = getTrigger(fixture.nativeElement);

    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();

    host.remountOptions();
    fixture.detectChanges();

    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();

    keydown(trigger, 'Enter');
    host.remountOptions();
    fixture.detectChanges();

    expect(host.value()).toBe('b');
    expect(trigger.textContent).toContain('Client B');
  });
});
