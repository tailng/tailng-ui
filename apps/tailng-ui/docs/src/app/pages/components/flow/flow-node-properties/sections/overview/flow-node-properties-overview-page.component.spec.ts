import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FlowNodePropertiesOverviewPageComponent } from './flow-node-properties-overview-page.component';

describe('FlowNodePropertiesOverviewPageComponent', () => {
  let fixture: ComponentFixture<FlowNodePropertiesOverviewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowNodePropertiesOverviewPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlowNodePropertiesOverviewPageComponent);
    fixture.detectChanges();
  });

  it('renders live Plain CSS and Tailwind node properties variants', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-docs-example-tabs-section')).not.toBeNull();
    expect(element.querySelectorAll('tng-flow-node-properties')).toHaveLength(2);
    expect(element.textContent).toContain('Plain CSS');
    expect(element.textContent).toContain('Tailwind CSS');
    expect(element.textContent).toContain('Classify ticket');
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
      'rounded-lg border border-tng-border-subtle',
    );
  });

  it('applies emitted node property changes to the controlled definition', () => {
    const internalComponent = fixture.componentInstance as unknown as {
      applyNodeChanges(
        definition: unknown,
        status: unknown,
        request: {
          changes: { name: string };
          node: { id: string; name: string };
          nodeId: string;
          source: 'field';
        },
      ): void;
      plainDefinition: unknown;
      plainStatus: unknown;
    };
    const component = internalComponent as {
      plainDefinition: () => { nodes: readonly { id: string; name: string }[] };
      plainStatus: () => string;
    };
    const node = component.plainDefinition().nodes[0];

    internalComponent.applyNodeChanges(
      internalComponent.plainDefinition,
      internalComponent.plainStatus,
      {
        changes: { name: 'Classify urgent ticket' },
        node,
        nodeId: node.id,
        source: 'field',
      },
    );
    fixture.detectChanges();

    expect(component.plainDefinition().nodes[0]?.name).toBe('Classify urgent ticket');
    expect(component.plainStatus()).toBe('Classify ticket updated from field.');
  });
});
