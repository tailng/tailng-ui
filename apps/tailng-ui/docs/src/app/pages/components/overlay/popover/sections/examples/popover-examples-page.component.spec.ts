import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PopoverExamplesPageComponent } from './popover-examples-page.component';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';

type NestedPopoverCodeTabs = Readonly<{
  nestedMenuPlainCodeTabs: readonly DocsExampleCodeTab[];
  nestedMenuTailwindCodeTabs: readonly DocsExampleCodeTab[];
  nestedMultiSelectPlainCodeTabs: readonly DocsExampleCodeTab[];
  nestedMultiSelectTailwindCodeTabs: readonly DocsExampleCodeTab[];
  nestedSelectPlainCodeTabs: readonly DocsExampleCodeTab[];
  nestedSelectTailwindCodeTabs: readonly DocsExampleCodeTab[];
}>;

describe('PopoverExamplesPageComponent', () => {
  let fixture: ComponentFixture<PopoverExamplesPageComponent>;

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => ({ matches: false }) as MediaQueryList),
    });
    fixture = TestBed.configureTestingModule({
      imports: [PopoverExamplesPageComponent],
    }).createComponent(PopoverExamplesPageComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('renders select, multiselect, and menu as separate nested-overlay example blocks', () => {
    const root = fixture.nativeElement as HTMLElement;
    const blockIds = ['nested-select-overlay', 'nested-multiselect-overlay', 'nested-menu-overlay'];

    for (const id of blockIds) {
      const block = root.querySelector<HTMLElement>(`#${id}`);
      expect(block).not.toBeNull();
      expect(block?.querySelectorAll('app-docs-example-tabs-section')).toHaveLength(1);
    }
  });

  it('renders Plain-CSS and Tailwind CSS variants in every nested-overlay block', () => {
    const root = fixture.nativeElement as HTMLElement;
    const blocks = Array.from(
      root.querySelectorAll<HTMLElement>(
        '#nested-select-overlay, #nested-multiselect-overlay, #nested-menu-overlay',
      ),
    );

    expect(blocks).toHaveLength(3);
    for (const block of blocks) {
      const outerTabList = block.querySelector<HTMLElement>('[data-slot="tab-list"]');
      if (outerTabList === null) {
        throw new Error('Expected nested popover example to render an outer tab list.');
      }

      const labels = Array.from(
        outerTabList.querySelectorAll<HTMLElement>(':scope > [data-slot="tab"]'),
        (element) => element.textContent?.trim() ?? '',
      );
      expect(labels).toEqual(['Plain-CSS', 'Tailwind CSS']);
    }
  });

  it('provides TS, HTML, and CSS source tabs for all six nested variants', () => {
    const component = fixture.componentInstance as unknown as NestedPopoverCodeTabs;
    const collections = [
      component.nestedSelectPlainCodeTabs,
      component.nestedSelectTailwindCodeTabs,
      component.nestedMultiSelectPlainCodeTabs,
      component.nestedMultiSelectTailwindCodeTabs,
      component.nestedMenuPlainCodeTabs,
      component.nestedMenuTailwindCodeTabs,
    ];

    for (const tabs of collections) {
      expect(tabs.map((tab) => tab.value)).toEqual(['ts', 'html', 'css']);
      expect(tabs.every((tab) => tab.code.trim().length > 0)).toBe(true);
    }
  });
});
