import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DateRangePickerExamplesPageComponent } from './date-range-picker-examples-page.component';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';

type DateRangePickerExampleCodeTabs = Readonly<{
  boundedPlainCodeTabs: readonly DocsExampleCodeTab[];
  boundedTailwindCodeTabs: readonly DocsExampleCodeTab[];
  customPlainCodeTabs: readonly DocsExampleCodeTab[];
  customTailwindCodeTabs: readonly DocsExampleCodeTab[];
  defaultPlainCodeTabs: readonly DocsExampleCodeTab[];
  defaultTailwindCodeTabs: readonly DocsExampleCodeTab[];
  dualBoundedPlainCodeTabs: readonly DocsExampleCodeTab[];
  dualBoundedTailwindCodeTabs: readonly DocsExampleCodeTab[];
  dualCustomPlainCodeTabs: readonly DocsExampleCodeTab[];
  dualCustomTailwindCodeTabs: readonly DocsExampleCodeTab[];
  dualDefaultPlainCodeTabs: readonly DocsExampleCodeTab[];
  dualDefaultTailwindCodeTabs: readonly DocsExampleCodeTab[];
  dualFormPlainCodeTabs: readonly DocsExampleCodeTab[];
  dualFormTailwindCodeTabs: readonly DocsExampleCodeTab[];
  dualPopupPlainCodeTabs: readonly DocsExampleCodeTab[];
  dualPopupTailwindCodeTabs: readonly DocsExampleCodeTab[];
  formPlainCodeTabs: readonly DocsExampleCodeTab[];
  formTailwindCodeTabs: readonly DocsExampleCodeTab[];
  popupPlainCodeTabs: readonly DocsExampleCodeTab[];
  popupTailwindCodeTabs: readonly DocsExampleCodeTab[];
}>;

describe('DateRangePickerExamplesPageComponent', () => {
  let fixture: ComponentFixture<DateRangePickerExamplesPageComponent>;

  function getFixtureRoot(): HTMLElement {
    const root: unknown = fixture.nativeElement;
    if (!(root instanceof HTMLElement)) {
      throw new Error('Expected the fixture root to be an HTMLElement.');
    }

    return root;
  }

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(
        () =>
          ({
            addEventListener: vi.fn(),
            matches: false,
            removeEventListener: vi.fn(),
          }) as unknown as MediaQueryList,
      ),
    });
    fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerExamplesPageComponent],
    }).createComponent(DateRangePickerExamplesPageComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('renders single and dual Plain-CSS and Tailwind variants for every scenario', () => {
    const root = getFixtureRoot();
    const groups = Array.from(root.querySelectorAll<HTMLElement>('app-docs-example-tabs-section'));
    const expectedLabels = ['Plain-CSS', 'Tailwind CSS', 'Dual Plain-CSS', 'Dual Tailwind CSS'];

    expect(groups).toHaveLength(5);
    for (const group of groups) {
      const tabList = group.querySelector<HTMLElement>('[data-slot="tab-list"]');
      const labels =
        tabList === null
          ? []
          : Array.from(
              tabList.querySelectorAll<HTMLElement>(':scope > [data-slot="tab"]'),
              (element) => element.textContent.trim(),
            );
      expect(labels).toEqual(expectedLabels);
    }
  });

  it('provides TS, HTML, and CSS source tabs for all variants', () => {
    const component = fixture.componentInstance as unknown as DateRangePickerExampleCodeTabs;
    const collections = [
      component.formPlainCodeTabs,
      component.formTailwindCodeTabs,
      component.dualFormPlainCodeTabs,
      component.dualFormTailwindCodeTabs,
      component.defaultPlainCodeTabs,
      component.defaultTailwindCodeTabs,
      component.dualDefaultPlainCodeTabs,
      component.dualDefaultTailwindCodeTabs,
      component.popupPlainCodeTabs,
      component.popupTailwindCodeTabs,
      component.dualPopupPlainCodeTabs,
      component.dualPopupTailwindCodeTabs,
      component.customPlainCodeTabs,
      component.customTailwindCodeTabs,
      component.dualCustomPlainCodeTabs,
      component.dualCustomTailwindCodeTabs,
      component.boundedPlainCodeTabs,
      component.boundedTailwindCodeTabs,
      component.dualBoundedPlainCodeTabs,
      component.dualBoundedTailwindCodeTabs,
    ];

    expect(collections).toHaveLength(20);
    for (const tabs of collections) {
      expect(tabs.map((tab) => tab.value)).toEqual(['ts', 'html', 'css']);
      expect(tabs.every((tab) => tab.code.length > 0)).toBe(true);
    }
  });

  it('sets dual calendar layout in every dual source example', () => {
    const component = fixture.componentInstance as unknown as DateRangePickerExampleCodeTabs;
    const dualCollections = [
      component.dualFormPlainCodeTabs,
      component.dualFormTailwindCodeTabs,
      component.dualDefaultPlainCodeTabs,
      component.dualDefaultTailwindCodeTabs,
      component.dualPopupPlainCodeTabs,
      component.dualPopupTailwindCodeTabs,
      component.dualCustomPlainCodeTabs,
      component.dualCustomTailwindCodeTabs,
      component.dualBoundedPlainCodeTabs,
      component.dualBoundedTailwindCodeTabs,
    ];

    expect(dualCollections).toHaveLength(10);
    for (const tabs of dualCollections) {
      const htmlCode = tabs.find((tab) => tab.value === 'html')?.code;
      expect(htmlCode).toContain('calendarLayout="dual"');
    }
  });
});
