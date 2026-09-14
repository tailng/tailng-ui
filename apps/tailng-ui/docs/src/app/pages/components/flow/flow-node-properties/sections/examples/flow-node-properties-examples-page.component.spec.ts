import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FlowNodePropertiesExamplesPageComponent } from './flow-node-properties-examples-page.component';

describe('FlowNodePropertiesExamplesPageComponent', () => {
  let fixture: ComponentFixture<FlowNodePropertiesExamplesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowNodePropertiesExamplesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlowNodePropertiesExamplesPageComponent);
    fixture.detectChanges();
  });

  it('renders live Plain CSS and Tailwind examples', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-docs-example-tabs-section')).not.toBeNull();
    expect(element.querySelectorAll('tng-flow-node-properties')).toHaveLength(2);
    expect(element.textContent).toContain('Incident triage properties');
    expect(element.textContent).toContain('Classify impact');
    expect(element.textContent).toContain('Readonly');
  });

  it('provides TS, HTML, and CSS source tabs for both variants', () => {
    const component = fixture.componentInstance as unknown as {
      plainCssCodeTabs: readonly { code: string; value: string }[];
      tailwindCodeTabs: readonly { code: string; value: string }[];
    };

    expect(component.plainCssCodeTabs.map((tab) => tab.value)).toEqual(['ts', 'html', 'css']);
    expect(component.tailwindCodeTabs.map((tab) => tab.value)).toEqual(['ts', 'html', 'css']);
    expect(component.plainCssCodeTabs.find((tab) => tab.value === 'html')?.code).toContain(
      'tngFlowNodePropertiesData',
    );
    expect(component.tailwindCodeTabs.find((tab) => tab.value === 'html')?.code).toContain(
      'md:grid-cols-[minmax(13rem,17rem)_minmax(0,1fr)]',
    );
  });

  it('applies emitted property changes to the controlled definition', () => {
    const internalComponent = fixture.componentInstance as unknown as {
      applyNodeChanges(
        state: unknown,
        request: {
          changes: { name: string };
          node: { id: string; name: string };
          nodeId: string;
          source: 'field';
        },
      ): void;
      plainExample: unknown;
    };
    const state = internalComponent.plainExample as {
      definition: () => { nodes: readonly { id: string; name: string }[] };
      status: () => string;
    };
    const node = state.definition().nodes[1];

    internalComponent.applyNodeChanges(internalComponent.plainExample, {
      changes: { name: 'Classify customer impact' },
      node,
      nodeId: node.id,
      source: 'field',
    });
    fixture.detectChanges();

    expect(state.definition().nodes[1]?.name).toBe('Classify customer impact');
    expect(state.status()).toBe('Classify impact updated from field.');
  });
});
