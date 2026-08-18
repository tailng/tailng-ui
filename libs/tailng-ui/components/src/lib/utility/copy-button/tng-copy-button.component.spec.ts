import { Component } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, describe, expect, it } from 'vitest';

import {
  coerceTngCopyButtonResetDelay,
  resolveTngCopyButtonIconState,
  TngCopyButtonComponent,
} from './tng-copy-button.component';

@Component({
  imports: [TngCopyButtonComponent],
  template: `<tng-copy-button data-testid="copy-button" text="pnpm add @tailng-ui/components" />`,
})
class TngCopyButtonDefaultIconHostComponent {}

@Component({
  imports: [TngCopyButtonComponent],
  template: `
    <tng-copy-button data-testid="copy-button" text="pnpm add @tailng-ui/components">
      <span copyIcon data-testid="copy-icon">copy-icon</span>
      <span copiedIcon data-testid="copied-icon">copied-icon</span>
    </tng-copy-button>
  `,
})
class TngCopyButtonCustomIconHostComponent {}

function getByTestId<TElement extends HTMLElement>(
  fixture: { nativeElement: HTMLElement },
  id: string,
): TElement {
  const element = fixture.nativeElement.querySelector<TElement>(`[data-testid="${id}"]`);
  expect(element).not.toBeNull();
  return element!;
}

function getCopyButtonInstance(fixture: ComponentFixture<unknown>): TngCopyButtonComponent {
  const debugEl = fixture.debugElement.query(By.directive(TngCopyButtonComponent));
  expect(debugEl).not.toBeNull();
  return debugEl.componentInstance as TngCopyButtonComponent;
}

describe('tng-copy-button component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the public TngCopyButtonComponent symbol', () => {
    expect(typeof TngCopyButtonComponent).toBe('function');
  });

  it('coerces reset delay values', () => {
    expect(coerceTngCopyButtonResetDelay(Number.NaN)).toBe(1500);
    expect(coerceTngCopyButtonResetDelay(-5)).toBe(0);
    expect(coerceTngCopyButtonResetDelay(1800.2)).toBe(1800);
    expect(coerceTngCopyButtonResetDelay('950')).toBe(950);
  });

  it('resolves icon state from copy-button state', () => {
    expect(resolveTngCopyButtonIconState('idle')).toBe('copy');
    expect(resolveTngCopyButtonIconState('copying')).toBe('copy');
    expect(resolveTngCopyButtonIconState('error')).toBe('copy');
    expect(resolveTngCopyButtonIconState('copied')).toBe('copied');
  });

  it('shows default fallback icon and switches to copied icon on success', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TngCopyButtonDefaultIconHostComponent],
    }).createComponent(TngCopyButtonDefaultIconHostComponent);

    fixture.detectChanges();

    const copyButton = getByTestId<HTMLButtonElement>(fixture, 'copy-button');
    expect(copyButton.textContent?.replace(/\s+/g, ' ').trim()).toContain('⧉');

    const component = getCopyButtonInstance(fixture);
    (component as unknown as { onPrimitiveCopied: (payload: string) => void }).onPrimitiveCopied('ok');
    fixture.detectChanges();

    expect(copyButton.textContent?.replace(/\s+/g, ' ').trim()).toContain('✓');
    component.ngOnDestroy();
  });

  it('uses projected copyIcon/copiedIcon slots when provided', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TngCopyButtonCustomIconHostComponent],
    }).createComponent(TngCopyButtonCustomIconHostComponent);

    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'copy-icon').textContent?.trim()).toBe('copy-icon');
    expect(fixture.nativeElement.querySelector('[data-testid="copied-icon"]')).toBeNull();

    const component = getCopyButtonInstance(fixture);
    (component as unknown as { onPrimitiveCopied: (payload: string) => void }).onPrimitiveCopied('ok');
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'copied-icon').textContent?.trim()).toBe('copied-icon');
    expect(fixture.nativeElement.querySelector('[data-testid="copy-icon"]')).toBeNull();
    component.ngOnDestroy();
  });
});
