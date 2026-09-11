import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { FlowExecutionGraphOverviewPageComponent } from './flow-execution-graph-overview-page.component';

class ResizeObserverTestDouble implements ResizeObserver {
  public constructor(private readonly callback: ResizeObserverCallback) {}

  public disconnect(): void {
    // ResizeObserver cleanup is intentionally a no-op in jsdom.
  }

  public observe(target: Element): void {
    this.callback(
      [{ target, contentRect: target.getBoundingClientRect() } as ResizeObserverEntry],
      this,
    );
  }

  public unobserve(): void {
    // Individual targets do not need tracking in this test double.
  }
}

describe('FlowExecutionGraphOverviewPageComponent', () => {
  let fixture: ComponentFixture<FlowExecutionGraphOverviewPageComponent>;

  beforeAll(() => {
    globalThis.ResizeObserver ??= ResizeObserverTestDouble;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionGraphOverviewPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlowExecutionGraphOverviewPageComponent);
    fixture.detectChanges();
  });

  it('renders a running workflow graph in Plain CSS and Tailwind variants', () => {
    const element = fixture.nativeElement as HTMLElement;
    const section = element.querySelector('app-docs-example-tabs-section');
    const graphs = element.querySelectorAll('tng-flow-execution-graph');

    expect(section).not.toBeNull();
    expect(graphs).toHaveLength(2);
    expect(element.textContent).toContain('Plain CSS');
    expect(element.textContent).toContain('Tailwind CSS');
  });

  it('provides TS, HTML, and CSS source tabs for both variants', () => {
    const component = fixture.componentInstance as unknown as {
      plainCssCodeTabs: readonly { value: string }[];
      tailwindCodeTabs: readonly { value: string }[];
    };

    expect(component.plainCssCodeTabs.map((tab) => tab.value)).toEqual(['ts', 'html', 'css']);
    expect(component.tailwindCodeTabs.map((tab) => tab.value)).toEqual(['ts', 'html', 'css']);
  });

  it('keeps both examples in inspect mode so selection and activation remain available', () => {
    const editors = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
      '.tng-flow-editor',
    );

    expect(editors).toHaveLength(2);
    for (const editor of editors) {
      expect(editor.dataset.mode).toBe('inspect');
      expect(editor.hasAttribute('data-readonly')).toBe(false);
    }
  });
});
