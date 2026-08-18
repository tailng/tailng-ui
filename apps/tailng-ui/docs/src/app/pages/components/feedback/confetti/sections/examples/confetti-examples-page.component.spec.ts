import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfettiExamplesPageComponent } from './confetti-examples-page.component';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';

type ConfettiExamplesCodeTabs = Readonly<{
  containedPlainTabs: readonly DocsExampleCodeTab[];
  containedTailwindTabs: readonly DocsExampleCodeTab[];
  resetPlainTabs: readonly DocsExampleCodeTab[];
  resetTailwindTabs: readonly DocsExampleCodeTab[];
  successPlainTabs: readonly DocsExampleCodeTab[];
  successTailwindTabs: readonly DocsExampleCodeTab[];
}>;

describe('ConfettiExamplesPageComponent', () => {
  let fixture: ComponentFixture<ConfettiExamplesPageComponent>;

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => ({ matches: false }) as MediaQueryList),
    });
    fixture = TestBed.configureTestingModule({
      imports: [ConfettiExamplesPageComponent],
    }).createComponent(ConfettiExamplesPageComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    fixture.destroy();
  });

  it('renders Plain-CSS and Tailwind CSS variants for every example group', () => {
    const root = fixture.nativeElement as HTMLElement;
    const groups = root.querySelectorAll('app-docs-example-tabs-section');
    const triggers = Array.from(groups).flatMap((group) => {
      const tabList = group.querySelector<HTMLElement>('[data-slot="tab-list"]');
      return Array.from(
        tabList?.querySelectorAll<HTMLElement>(':scope > [data-slot="tab"]') ?? [],
        (element) => element.textContent.trim(),
      );
    });

    expect(groups).toHaveLength(3);
    expect(triggers).toEqual([
      'Plain-CSS',
      'Tailwind CSS',
      'Plain-CSS',
      'Tailwind CSS',
      'Plain-CSS',
      'Tailwind CSS',
    ]);
  });

  it('provides TS, HTML, and CSS source tabs for all six variants', () => {
    const component = fixture.componentInstance as unknown as ConfettiExamplesCodeTabs;
    const collections = [
      component.successPlainTabs,
      component.successTailwindTabs,
      component.containedPlainTabs,
      component.containedTailwindTabs,
      component.resetPlainTabs,
      component.resetTailwindTabs,
    ];

    for (const tabs of collections) {
      expect(tabs.map((tab) => tab.value)).toEqual(['ts', 'html', 'css']);
      expect(tabs.every((tab) => tab.code.length > 0)).toBe(true);
    }
  });

  it('keeps variant launch state independent and resets only the completed variant', () => {
    vi.useFakeTimers();
    const root = fixture.nativeElement as HTMLElement;
    const plainButton = root.querySelector<HTMLButtonElement>('.confetti-reset-row--plain button');
    const tailwindButton = Array.from(
      root.querySelectorAll<HTMLButtonElement>('#controlled-reset button'),
    ).find((button): button is HTMLButtonElement => button.classList.contains('bg-indigo-600'));

    expect(plainButton).not.toBeNull();
    expect(tailwindButton).toBeDefined();
    plainButton?.click();
    vi.runAllTicks();
    fixture.detectChanges();

    expect(plainButton?.disabled).toBe(true);
    expect(tailwindButton?.disabled).toBe(false);

    vi.advanceTimersByTime(1800);
    fixture.detectChanges();

    const statuses = Array.from(
      root.querySelectorAll<HTMLElement>('#controlled-reset [aria-live="polite"]'),
      (element) => element.textContent.trim(),
    );
    expect(plainButton?.disabled).toBe(false);
    expect(tailwindButton?.disabled).toBe(false);
    expect(statuses).toEqual(['Completed bursts: 1', 'Completed bursts: 0']);
  });
});
