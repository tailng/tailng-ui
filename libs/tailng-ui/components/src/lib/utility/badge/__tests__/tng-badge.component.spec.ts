import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngBadgeComponent } from '../tng-badge.component';

const badgePrimitiveSource = readFileSync(
  join(process.cwd(), 'libs/tailng-ui/primitives/src/lib/utility/badge/tng-badge.ts'),
  'utf8',
);

function getByTestId<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Expected element for data-testid="${testId}".`);
  }

  return element as T;
}

function getBadge(host: HTMLElement): HTMLSpanElement {
  const badge = host.querySelector('.tng-badge');
  if (!(badge instanceof HTMLSpanElement)) {
    throw new Error('Expected generated .tng-badge element.');
  }

  return badge;
}

@Component({
  imports: [TngBadgeComponent],
  template: `
    <button
      type="button"
      data-testid="host"
      [tngBadge]="value()"
      [tngBadgeDot]="dot()"
      [tngBadgeHidden]="hidden()"
      [tngBadgeMax]="max()"
      [tngBadgePosition]="position()"
      [tngBadgeOffsetX]="offsetX()"
      [tngBadgeOffsetY]="offsetY()"
      [tngBadgeTone]="tone()"
      [tngBadgeSize]="size()"
      [tngBadgeClass]="badgeClass()"
      [tngBadgeStyle]="badgeStyle()"
      [tngBadgeVariant]="variant()"
      [tngBadgeDisabled]="disabled()"
    >
      Inbox
    </button>
  `,
})
class BadgeWrapperHostComponent {
  public readonly value = signal<number | string | null | undefined>(8);
  public readonly dot = signal(false);
  public readonly hidden = signal(false);
  public readonly max = signal(99);
  public readonly position = signal<'top-end' | 'bottom-start'>('top-end');
  public readonly offsetX = signal<number | string | null | undefined>(null);
  public readonly offsetY = signal<number | string | null | undefined>(null);
  public readonly tone = signal<'danger' | 'success'>('danger');
  public readonly size = signal<'md' | 'lg'>('md');
  public readonly variant = signal<'solid' | 'outline'>('solid');
  public readonly disabled = signal(false);
  public readonly badgeClass = signal<string | null | undefined>(null);
  public readonly badgeStyle = signal<Readonly<Record<string, number | string>> | null | undefined>(
    null,
  );
}

describe('tng-badge component wrapper', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the public TngBadgeComponent symbol', () => {
    expect(typeof TngBadgeComponent).toBe('function');
  });

  it('uses the shared control radius as the default badge radius fallback', () => {
    expect(badgePrimitiveSource).toContain(
      "['border-radius', 'var(--tng-badge-radius, var(--tng-radius-control, 0.5rem))']",
    );
    expect(badgePrimitiveSource).not.toContain('var(--tng-badge-radius, 9999px)');
  });

  it('forwards primitive badge behavior on [tngBadge] hosts', () => {
    const fixture = TestBed.configureTestingModule({ imports: [BadgeWrapperHostComponent] }).createComponent(
      BadgeWrapperHostComponent,
    );
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'host');
    const badge = getBadge(host);

    expect(host.classList.contains('tng-badge-host')).toBe(true);
    expect(badge.textContent).toBe('8');
    expect(badge.getAttribute('data-tone')).toBe('danger');
    expect(badge.getAttribute('data-size')).toBe('md');
    expect(badge.getAttribute('data-variant')).toBe('solid');
    expect(badge.hasAttribute('data-disabled')).toBe(false);
  });

  it('updates generated badge state when wrapper host bindings change', () => {
    const fixture = TestBed.configureTestingModule({ imports: [BadgeWrapperHostComponent] }).createComponent(
      BadgeWrapperHostComponent,
    );
    fixture.detectChanges();

    fixture.componentInstance.value.set('NEW');
    fixture.componentInstance.tone.set('success');
    fixture.componentInstance.size.set('lg');
    fixture.componentInstance.variant.set('outline');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
    expect(badge.textContent).toBe('NEW');
    expect(badge.getAttribute('data-tone')).toBe('success');
    expect(badge.getAttribute('data-size')).toBe('lg');
    expect(badge.getAttribute('data-variant')).toBe('outline');
    expect(badge.hasAttribute('data-disabled')).toBe(true);
  });

  it('forwards hidden and dot visibility semantics', () => {
    const fixture = TestBed.configureTestingModule({ imports: [BadgeWrapperHostComponent] }).createComponent(
      BadgeWrapperHostComponent,
    );
    const host = getByTestId<HTMLElement>(fixture, 'host');

    fixture.componentInstance.value.set(7);
    fixture.componentInstance.hidden.set(false);
    fixture.detectChanges();
    expect(getBadge(host).textContent).toBe('7');

    fixture.componentInstance.hidden.set(true);
    fixture.detectChanges();
    expect(host.querySelector('.tng-badge')).toBeNull();

    fixture.componentInstance.hidden.set(false);
    fixture.componentInstance.value.set(null);
    fixture.componentInstance.dot.set(true);
    fixture.detectChanges();
    const badge = getBadge(host);
    expect(badge.hasAttribute('data-dot')).toBe(true);
    expect(badge.textContent).toBe('');
  });

  it('forwards placement, offset, class, and style inputs', () => {
    const fixture = TestBed.configureTestingModule({ imports: [BadgeWrapperHostComponent] }).createComponent(
      BadgeWrapperHostComponent,
    );
    fixture.componentInstance.position.set('bottom-start');
    fixture.componentInstance.offsetX.set(6);
    fixture.componentInstance.offsetY.set('0.25rem');
    fixture.componentInstance.badgeClass.set('custom-badge');
    fixture.componentInstance.badgeStyle.set({ opacity: '0.5' });
    fixture.detectChanges();

    const badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
    expect(badge.classList.contains('custom-badge')).toBe(true);
    expect(badge.getAttribute('data-position')).toBe('bottom-start');
    expect(badge.style.transform).toBe('translate(-50%, 50%) translate(6px, 0.25rem)');
    expect(badge.style.opacity).toBe('0.5');
  });
});
