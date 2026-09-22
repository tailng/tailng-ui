import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { toTngProgressBarPercent, TngProgressBarComponent } from '../tng-progress-bar.component';

const progressBarComponentCss = readFileSync(
  join(
    process.cwd(),
    'libs/tailng-ui/components/src/lib/feedback/progress-bar/tng-progress-bar.component.css',
  ),
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

function getRequired<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector(selector);
  if (!(element instanceof Element)) {
    throw new Error(`Expected selector "${selector}" to resolve.`);
  }

  return element as T;
}

@Component({
  imports: [TngProgressBarComponent],
  template: `
    <tng-progress-bar
      data-testid="progress-host"
      [ariaLabel]="ariaLabel()"
      [ariaLabelledby]="ariaLabelledby()"
      [ariaValueText]="ariaValueText()"
      [indeterminate]="indeterminate()"
      [max]="max()"
      [min]="min()"
      [value]="value()"
    ></tng-progress-bar>
  `,
})
class ProgressBarComponentHostComponent {
  public readonly ariaLabel = signal<string | null>('Upload progress');
  public readonly ariaLabelledby = signal<string | null>(null);
  public readonly ariaValueText = signal<string | null>(null);
  public readonly indeterminate = signal(false);
  public readonly max = signal(100);
  public readonly min = signal(0);
  public readonly value = signal(60);
}

describe('tng-progress-bar component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the public TngProgressBar symbol', () => {
    expect(typeof TngProgressBarComponent).toBe('function');
  });

  it('uses the shared control radius as the default themed border radius', () => {
    expect(progressBarComponentCss).toContain(
      'border-radius: var(--tng-progress-bar-radius, var(--tng-radius-control, 0.5rem));',
    );
    expect(progressBarComponentCss).not.toContain('var(--tng-progress-bar-radius, 9999px)');
  });

  it('maps values to percentage for the indicator width', () => {
    expect(toTngProgressBarPercent(0, 100, 25)).toBe(25);
    expect(toTngProgressBarPercent(50, 150, 100)).toBe(50);
    expect(toTngProgressBarPercent(100, 200, 50)).toBe(0);
    expect(toTngProgressBarPercent(0, 0, 10)).toBe(100);
  });

  it('renders determinate progress semantics and indicator width', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgressBarComponentHostComponent],
    }).createComponent(ProgressBarComponentHostComponent);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'progress-host');
    const root = getRequired<HTMLElement>(host, '[data-slot="progress-bar"]');
    const indicator = getRequired<HTMLElement>(host, '[data-slot="progress-bar-indicator"]');

    expect(root.getAttribute('role')).toBe('progressbar');
    expect(root.getAttribute('data-state')).toBe('determinate');
    expect(root.getAttribute('aria-label')).toBe('Upload progress');
    expect(root.getAttribute('aria-valuemin')).toBe('0');
    expect(root.getAttribute('aria-valuemax')).toBe('100');
    expect(root.getAttribute('aria-valuenow')).toBe('60');
    expect(root.hasAttribute('data-indeterminate')).toBe(false);
    expect(indicator.style.width).toBe('60%');
    expect(indicator.getAttribute('data-state')).toBe('determinate');
  });

  it('switches to indeterminate mode without aria range values', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgressBarComponentHostComponent],
    }).createComponent(ProgressBarComponentHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.indeterminate.set(true);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'progress-host');
    const root = getRequired<HTMLElement>(host, '[data-slot="progress-bar"]');
    const indicator = getRequired<HTMLElement>(host, '[data-slot="progress-bar-indicator"]');

    expect(root.getAttribute('aria-valuemin')).toBeNull();
    expect(root.getAttribute('aria-valuemax')).toBeNull();
    expect(root.getAttribute('aria-valuenow')).toBeNull();
    expect(root.hasAttribute('data-indeterminate')).toBe(true);
    expect(root.getAttribute('data-state')).toBe('indeterminate');
    expect(indicator.hasAttribute('data-indeterminate')).toBe(true);
    expect(indicator.getAttribute('data-state')).toBe('indeterminate');
    expect(indicator.style.width).toBe('40%');
  });

  it('recomputes indicator width using clamped range values', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgressBarComponentHostComponent],
    }).createComponent(ProgressBarComponentHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.min.set(80);
    fixture.componentInstance.max.set(20);
    fixture.componentInstance.value.set(120);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'progress-host');
    const root = getRequired<HTMLElement>(host, '[data-slot="progress-bar"]');
    const indicator = getRequired<HTMLElement>(host, '[data-slot="progress-bar-indicator"]');

    expect(root.getAttribute('aria-valuemin')).toBe('80');
    expect(root.getAttribute('aria-valuemax')).toBe('80');
    expect(root.getAttribute('aria-valuenow')).toBe('80');
    expect(indicator.style.width).toBe('100%');
  });

  it('forwards referenced naming and human-readable value text', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgressBarComponentHostComponent],
    }).createComponent(ProgressBarComponentHostComponent);
    fixture.componentInstance.ariaLabel.set(null);
    fixture.componentInstance.ariaLabelledby.set('upload-label');
    fixture.componentInstance.ariaValueText.set('Three of five files');
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'progress-host');
    const root = getRequired<HTMLElement>(host, '[data-slot="progress-bar"]');
    expect(root.getAttribute('aria-label')).toBeNull();
    expect(root.getAttribute('aria-labelledby')).toBe('upload-label');
    expect(root.getAttribute('aria-valuetext')).toBe('Three of five files');
  });
});
