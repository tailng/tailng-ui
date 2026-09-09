import { Component, computed, signal } from '@angular/core';
import {
  TngFlowEditorComponent,
  type TngFlowConnectionMarker,
  type TngFlowConnectionMotion,
  type TngFlowConnectionMotionDirection,
  type TngFlowConnectionMotionSpeed,
  type TngFlowConnectionPathType,
  type TngFlowConnectionStatus,
  type TngFlowConnectionWaypointsChange,
  type TngFlowDefinition,
  type TngFlowEditorOptions,
  type TngFlowMotionPreference,
  type TngFlowPoint,
  type TngFlowPresentation,
  type TngFlowSelection,
} from '@tailng-ui/flow';

const routingNodes = Object.freeze([
  {
    id: 'extract',
    type: 'source',
    name: 'Extract document',
    description: 'Read structured values from the uploaded document.',
    position: { x: 50, y: 190 },
    ports: [{ id: 'output', direction: 'output', kind: 'data', multiple: true }],
  },
  {
    id: 'validate',
    type: 'validator',
    name: 'Validate fields',
    description: 'Check the extracted values against business rules.',
    position: { x: 430, y: 70 },
    ports: [
      { id: 'input', direction: 'input', kind: 'data' },
      { id: 'invalid', direction: 'output', kind: 'error', multiple: true },
    ],
  },
  {
    id: 'review',
    type: 'approval',
    name: 'Manual review',
    description: 'Ask an operator to resolve validation failures.',
    position: { x: 810, y: 260 },
    ports: [{ id: 'input', direction: 'input', kind: 'error' }],
  },
] as const);

@Component({
  selector: 'app-connection-routing-demo',
  imports: [TngFlowEditorComponent],
  templateUrl: './connection-routing-demo.component.html',
  styleUrl: './connection-routing-demo.component.css',
})
export class ConnectionRoutingDemoComponent {
  protected readonly pathTypes: readonly TngFlowConnectionPathType[] = [
    'straight',
    'bezier',
    'orthogonal',
    'orthogonal-rounded',
    'adaptive',
  ];
  protected readonly markers: readonly TngFlowConnectionMarker[] = [
    'none',
    'arrow',
    'circle',
    'diamond',
  ];
  protected readonly statuses: readonly TngFlowConnectionStatus[] = [
    'idle',
    'active',
    'success',
    'warning',
    'error',
    'disabled',
  ];
  protected readonly motions: readonly TngFlowConnectionMotion[] = ['none', 'flow', 'pulse'];
  protected readonly speeds: readonly TngFlowConnectionMotionSpeed[] = ['slow', 'normal', 'fast'];
  protected readonly directions: readonly TngFlowConnectionMotionDirection[] = [
    'forward',
    'reverse',
  ];
  protected readonly motionPreferences: readonly TngFlowMotionPreference[] = [
    'system',
    'enabled',
    'disabled',
  ];

  protected readonly pathType = signal<TngFlowConnectionPathType>('orthogonal-rounded');
  protected readonly radius = signal(16);
  protected readonly offset = signal(24);
  protected readonly sourceMarker = signal<TngFlowConnectionMarker>('none');
  protected readonly targetMarker = signal<TngFlowConnectionMarker>('arrow');
  protected readonly label = signal('Extracted data');
  protected readonly status = signal<TngFlowConnectionStatus>('active');
  protected readonly motion = signal<TngFlowConnectionMotion>('flow');
  protected readonly motionSpeed = signal<TngFlowConnectionMotionSpeed>('normal');
  protected readonly motionDirection = signal<TngFlowConnectionMotionDirection>('forward');
  protected readonly motionPreference = signal<TngFlowMotionPreference>('system');
  protected readonly waypoints = signal<readonly TngFlowPoint[]>([{ x: 350, y: 230 }]);
  protected readonly selection = signal<TngFlowSelection>({
    nodeIds: new Set<string>(),
    connectionIds: new Set(['extract-to-validate']),
  });

  protected readonly editorOptions = computed<TngFlowEditorOptions>(() => ({
    defaultConnection: {
      routing: {
        type: this.pathType(),
        offset: this.offset(),
        radius: this.radius(),
      },
      sourceMarker: this.sourceMarker(),
      targetMarker: this.targetMarker(),
      labelPlacement: 'center',
    },
    connectionWaypointsEnabled: true,
    motionPreference: this.motionPreference(),
  }));

  protected readonly definition = computed<TngFlowDefinition>(() => ({
    id: 'connection-routing-lab',
    name: 'Connection routing and execution states',
    nodes: routingNodes,
    connections: [
      {
        id: 'extract-to-validate',
        source: { nodeId: 'extract', portId: 'output' },
        target: { nodeId: 'validate', portId: 'input' },
        label: this.label(),
        routing: {
          waypoints: this.waypoints(),
        },
      },
      {
        id: 'validate-to-review',
        source: { nodeId: 'validate', portId: 'invalid' },
        target: { nodeId: 'review', portId: 'input' },
        label: 'Needs review',
        routing: { type: 'adaptive' },
        sourceMarker: 'circle',
        targetMarker: 'diamond',
        labelOptions: { placement: 'end', offset: -8 },
      },
    ],
  }));

  protected readonly presentation = computed<TngFlowPresentation>(() => ({
    connections: {
      'extract-to-validate': {
        status: this.status(),
        motion: this.motion(),
        motionSpeed: this.motionSpeed(),
        motionDirection: this.motionDirection(),
        message: 'Processing extracted document data',
      },
      'validate-to-review': {
        status: 'warning',
        motion: 'pulse',
        message: 'Waiting for a reviewer',
      },
    },
  }));

  protected updateWaypoints(event: TngFlowConnectionWaypointsChange): void {
    if (event.connectionId === 'extract-to-validate') {
      this.waypoints.set(event.waypoints);
    }
  }
}
