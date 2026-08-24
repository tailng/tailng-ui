// tng-multi-select.overlay.spec.ts - shared overlay works with TngMultiSelect
import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

import { TngMultiSelect } from '../tng-multi-select';
import { TngSelectTrigger, TngSelectContent } from '../tng-multi-select.parts';
import { TngSelectOverlay } from '../tng-multi-select.overlay';

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

@Component({
  imports: [TngMultiSelect, TngSelectTrigger, TngSelectContent, TngSelectOverlay],
  template: `
    <div
      tngMultiSelect
      #api="tngMultiSelect"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="multi-select"
      style="--tng-select-z-overlay: 2"
    >
      <button tngSelectTrigger data-testid="trigger">Trigger</button>

      <div tngSelectContent data-testid="content">
        <div tngSelectOverlay data-testid="overlay">
          Overlay panel
        </div>
      </div>
    </div>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngMultiSelect<string>;
  open = signal(false);
  value = signal<readonly string[]>([]);
}

describe('tng-multi-select overlay (shared overlay)', () => {
  let bodyChildrenBefore: number;

  beforeEach(() => {
    bodyChildrenBefore = document.body.children.length;
  });

  afterEach(() => {
    while (document.body.children.length > bodyChildrenBefore) {
      document.body.removeChild(document.body.lastElementChild!);
    }
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('is mounted in DOM but hidden when closed', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('[data-testid="overlay"]') as HTMLElement;
    expect(overlay).toBeTruthy();
    expect(overlay.hasAttribute('hidden')).toBe(true);
  });

  it('portals overlay to body when open and restores under host when closed', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    const overlay = fixture.nativeElement.querySelector('[data-testid="overlay"]') as HTMLElement;
    expect(overlay).toBeTruthy();
    expect(overlay.parentElement).not.toBe(document.body);
    expect(overlay.hasAttribute('hidden')).toBe(true);

    pointerdown(trigger);
    fixture.detectChanges();
    expect(host.api.open()).toBe(true);
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('');

    expect(overlay.parentElement).toBe(document.body);
    expect(overlay.hasAttribute('hidden')).toBe(false);
    expect(overlay.style.getPropertyValue('--tng-select-z-overlay').trim()).toBe('2');
    expect(overlay.style.zIndex).toBe(
      'var(--tng-select-z-overlay, var(--tng-select-overlay-z-index, var(--tng-z-overlay, 2)))',
    );

    host.open.set(false);
    fixture.detectChanges();
    expect(host.api.open()).toBe(false);
    expect(document.body.style.overflow).toBe('');

    expect(overlay.parentElement).not.toBe(document.body);
    expect(overlay.hasAttribute('hidden')).toBe(true);
    expect(overlay.style.getPropertyValue('--tng-select-z-overlay').trim()).toBe('');
    expect(overlay.style.zIndex).toBe('');
  });

  it('positions overlay relative to trigger - sets inline left/top', async () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const realTrigger = fixture.nativeElement.querySelector('[data-slot="select-trigger"]') as HTMLElement;
    const overlay = fixture.nativeElement.querySelector('[data-testid="overlay"]') as HTMLElement;

    vi.spyOn(realTrigger, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 100,
      width: 80,
      height: 30,
      right: 180,
      bottom: 130,
      x: 100,
      y: 100,
      toJSON: () => ({}),
    } as any);

    vi.spyOn(overlay, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 120,
      height: 60,
      right: 120,
      bottom: 60,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as any);

    pointerdown(realTrigger);
    fixture.detectChanges();

    expect(overlay.parentElement).toBe(document.body);

    await Promise.resolve();

    expect(overlay.style.left).toBe('80px');
    expect(overlay.style.top).toBe('130px');
  });

  it('closes on outside pointerdown', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    pointerdown(trigger);
    fixture.detectChanges();
    expect(host.api.open()).toBe(true);

    document.body.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }),
    );
    fixture.detectChanges();

    expect(host.api.open()).toBe(false);
  });

  it('pointerdown inside overlay does not close', async () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    pointerdown(trigger);
    fixture.detectChanges();
    expect(host.api.open()).toBe(true);

    const overlayInBody = document.body.querySelector('[data-testid="overlay"]') as HTMLElement;
    expect(overlayInBody).toBeTruthy();

    pointerdown(overlayInBody);
    fixture.detectChanges();

    expect(host.api.open()).toBe(true);
  });
});
