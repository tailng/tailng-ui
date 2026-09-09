import type {
  TngFlowConnectionPathType,
  TngFlowConnectionWaypointsChange,
  TngFlowDefinition,
  TngFlowEditorOptions,
  TngFlowPresentation,
} from '@tailng-ui/flow';
import { describe, expect, it } from 'vitest';
import { ConnectionRoutingDemoComponent } from './connection-routing-demo.component';

type DemoHarness = Readonly<{
  pathType: {
    (): TngFlowConnectionPathType;
    set(value: TngFlowConnectionPathType): void;
  };
  definition: () => TngFlowDefinition;
  presentation: () => TngFlowPresentation;
  editorOptions: () => TngFlowEditorOptions;
  updateWaypoints(event: TngFlowConnectionWaypointsChange): void;
}>;

describe('ConnectionRoutingDemoComponent', () => {
  it('keeps routing in the definition and runtime state in presentation', () => {
    const demo = new ConnectionRoutingDemoComponent() as unknown as DemoHarness;

    expect(demo.definition().connections[0].routing).toEqual({
      waypoints: [{ x: 350, y: 230 }],
    });
    expect(demo.editorOptions().defaultConnection?.routing).toMatchObject({
      type: 'orthogonal-rounded',
      offset: 24,
      radius: 16,
    });
    expect(demo.presentation().connections?.['extract-to-validate']).toMatchObject({
      status: 'active',
      motion: 'flow',
    });

    demo.pathType.set('straight');
    expect(demo.editorOptions().defaultConnection?.routing?.type).toBe('straight');
  });

  it('applies a committed waypoint event through an immutable definition snapshot', () => {
    const demo = new ConnectionRoutingDemoComponent() as unknown as DemoHarness;
    const before = demo.definition();

    demo.updateWaypoints({
      connectionId: 'extract-to-validate',
      previousWaypoints: [{ x: 350, y: 230 }],
      waypoints: [{ x: 420, y: 280 }],
    });

    expect(demo.definition()).not.toBe(before);
    expect(demo.definition().connections[0].routing?.waypoints).toEqual([{ x: 420, y: 280 }]);
    expect(before.connections[0].routing?.waypoints).toEqual([{ x: 350, y: 230 }]);
  });
});
