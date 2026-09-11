import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  DEFAULT_TNG_FLOW_CONNECTION_OPTIONS,
  RECOMMENDED_TNG_FLOW_CONNECTION_OPTIONS,
  alignTngFlowNodes,
  distributeTngFlowNodes,
  resolveTngFlowConnectionOptions,
} from '../../index';
import type {
  TngFlowArrangementOperation,
  TngFlowConnection,
  TngFlowConnectionPathType,
  TngFlowConnectionRouting,
  TngFlowConnectionRoutingChangeRequest,
  TngFlowConnectionWaypointsChange,
  TngFlowConnectionTemplateContext,
  TngFlowContextMenuRequest,
  TngFlowEditorCommandRequest,
  TngFlowEditorConnectionOptions,
  TngFlowEditorOptions,
  TngFlowLayoutEngine,
  TngFlowLayoutGraph,
  TngFlowNodeBounds,
  TngFlowNodeMove,
  TngFlowNodesArrangementRequest,
  TngFlowNodesLayoutRequest,
  TngFlowSmartGuidesOptions,
  TngResolvedFlowLayoutOptions,
} from '../../index';

const resolvedLayoutOptions: TngResolvedFlowLayoutOptions = {
  direction: 'left-to-right',
  nodeSpacing: 48,
  levelSpacing: 120,
  componentSpacing: 64,
  preserveLockedNodes: true,
  includeDisconnectedNodes: true,
};

describe('Flow production public contracts', () => {
  it('keeps layout engines renderer-neutral and position-only', async () => {
    const graph: TngFlowLayoutGraph = {
      nodes: [
        {
          node: {
            id: 'start',
            type: 'start',
            name: 'Start',
            position: { x: 0, y: 0 },
          },
          bounds: {
            id: 'start',
            position: { x: 0, y: 0 },
            size: { width: 280, height: 112 },
          },
        },
      ],
      connections: [],
    };
    const engine: TngFlowLayoutEngine = {
      calculate: () => Promise.resolve([{ id: 'start', position: { x: 48, y: 120 } }]),
    };

    const moves = await engine.calculate(graph, resolvedLayoutOptions);

    expect(moves).toEqual([{ id: 'start', position: { x: 48, y: 120 } }]);
    expectTypeOf(moves).toEqualTypeOf<readonly TngFlowNodeMove[]>();
  });

  it('groups a complete automatic layout into one controlled request', () => {
    const request: TngFlowNodesLayoutRequest = {
      nodes: [{ id: 'start', position: { x: 48, y: 120 } }],
      options: resolvedLayoutOptions,
      viewport: { fit: true, animated: false, padding: 48 },
      source: 'controls',
    };

    expect(request.nodes).toHaveLength(1);
    expect(request.options.direction).toBe('left-to-right');
    expectTypeOf(request.nodes).toEqualTypeOf<readonly TngFlowNodeMove[]>();
  });

  it('exports application-owned command and context-menu request shapes', () => {
    const selection = {
      nodeIds: new Set(['review']),
      connectionIds: new Set<string>(),
    };
    const command: TngFlowEditorCommandRequest = {
      command: 'duplicate',
      selection,
      source: 'keyboard',
      canvasPosition: { x: 320, y: 180 },
    };
    const contextMenu: TngFlowContextMenuRequest = {
      target: { kind: 'node', nodeId: 'review' },
      source: 'pointer',
      clientPosition: { x: 640, y: 360 },
      canvasPosition: { x: 320, y: 180 },
      selection,
    };

    expect(command.command).toBe('duplicate');
    expect(contextMenu.target).toEqual({ kind: 'node', nodeId: 'review' });
    expectTypeOf(contextMenu.clientPosition).toEqualTypeOf<Readonly<{ x: number; y: number }>>();
  });

  it('uses measured bounds for arrangement contracts', () => {
    const bounds: readonly TngFlowNodeBounds[] = [
      { id: 'draft', position: { x: 0, y: 0 }, size: { width: 120, height: 60 } },
      { id: 'review', position: { x: 260, y: 120 }, size: { width: 160, height: 80 } },
      { id: 'publish', position: { x: 520, y: 40 }, size: { width: 120, height: 60 } },
    ];
    const operation: TngFlowArrangementOperation = {
      kind: 'align',
      alignment: 'horizontal-center',
    };
    const request: TngFlowNodesArrangementRequest = {
      nodes: [{ id: 'review', position: { x: 240, y: 120 } }],
      operation,
      source: 'context-menu',
    };
    const guides: TngFlowSmartGuidesOptions = {
      enabled: true,
      alignmentThreshold: 10,
      spacingThreshold: 16,
      disableModifier: 'alt',
    };

    expect(request.operation).toEqual(operation);
    expect(guides.disableModifier).toBe('alt');
    expect(alignTngFlowNodes(bounds, 'top')).toEqual([
      { id: 'publish', position: { x: 520, y: 0 } },
      { id: 'review', position: { x: 260, y: 0 } },
    ]);
    expect(distributeTngFlowNodes(bounds, 'horizontal')).toEqual([
      { id: 'review', position: { x: 240, y: 120 } },
    ]);
  });

  it('adds label metadata without changing connection identity or endpoints', () => {
    const connection: TngFlowConnection<{ condition: string }> = {
      id: 'approved-route',
      source: { nodeId: 'review', portId: 'approved' },
      target: { nodeId: 'publish', portId: 'input' },
      label: 'Approved',
      description: 'Continue when the review is approved.',
      data: { condition: 'approved === true' },
    };

    expect(connection.label).toBe('Approved');
    expect(connection.source.nodeId).toBe('review');
    expectTypeOf<
      TngFlowConnectionTemplateContext<{ condition: string }>['connection']
    >().toEqualTypeOf<TngFlowConnection<{ condition: string }>>();
    expectTypeOf<TngFlowConnectionTemplateContext<{ condition: string }>>().toEqualTypeOf<
      Readonly<{
        $implicit: TngFlowConnection<{ condition: string }>;
        connection: TngFlowConnection<{ condition: string }>;
        view: TngFlowConnectionTemplateContext['view'];
        issues: TngFlowConnectionTemplateContext['issues'];
        mode: TngFlowConnectionTemplateContext['mode'];
        selected: boolean;
      }>
    >();
  });

  it('exports renderer-neutral connection routing, defaults, and controlled waypoint events', () => {
    const routing: TngFlowConnectionRouting = {
      type: 'orthogonal-rounded',
      offset: 24,
      radius: 12,
      waypoints: [{ x: 320, y: 180 }],
    };
    const options: TngFlowEditorConnectionOptions = {
      defaultConnection: RECOMMENDED_TNG_FLOW_CONNECTION_OPTIONS,
      waypointsEnabled: true,
      motionPreference: 'system',
    };
    const editorOptions: TngFlowEditorOptions = {
      defaultConnection: {
        routing: { type: 'orthogonal-rounded', offset: 24, radius: 12 },
        marker: 'arrow',
        labelPlacement: 'center',
      },
      connectionSelectionEnabled: true,
      connectionReassignmentEnabled: true,
      connectionWaypointsEnabled: true,
    };
    const connection: TngFlowConnection = {
      id: 'routed',
      source: { nodeId: 'source', portId: 'output' },
      target: { nodeId: 'target', portId: 'input' },
      routing,
    };
    const change: TngFlowConnectionWaypointsChange = {
      connectionId: connection.id,
      previousWaypoints: routing.waypoints ?? [],
      waypoints: [{ x: 360, y: 220 }],
    };
    const routingChange: TngFlowConnectionRoutingChangeRequest = {
      connectionIds: [connection.id],
      type: 'straight',
      source: 'controls',
    };

    expect(DEFAULT_TNG_FLOW_CONNECTION_OPTIONS.routing.type).toBe('bezier');
    expect(resolveTngFlowConnectionOptions(connection, options).routing.type).toBe(
      'orthogonal-rounded',
    );
    expect(change.waypoints).toEqual([{ x: 360, y: 220 }]);
    expect(routingChange.type).toBe('straight');
    expect(editorOptions.defaultConnection?.marker).toBe('arrow');
    expectTypeOf(routing.type).toEqualTypeOf<TngFlowConnectionPathType | undefined>();
  });
});
