import type { DocsExampleCodeTab } from '../../../../../../../shared/example-panel/docs-example-panel.component';

const componentCode = `import { Component, computed, signal } from '@angular/core';
import {
  RECOMMENDED_TNG_FLOW_CONNECTION_OPTIONS,
  TngFlowEditorComponent,
  type TngFlowConnectionPathType,
  type TngFlowConnectionWaypointsChange,
  type TngFlowDefinition,
  type TngFlowEditorOptions,
  type TngFlowPresentation,
} from '@tailng-ui/flow';

@Component({
  imports: [TngFlowEditorComponent],
  templateUrl: './connection-routing.component.html',
})
export class ConnectionRoutingComponent {
  readonly pathType = signal<TngFlowConnectionPathType>('orthogonal-rounded');
  readonly radius = signal(16);
  readonly offset = signal(24);
  readonly waypoints = signal([{ x: 350, y: 230 }]);

  readonly editorOptions = computed<TngFlowEditorOptions>(() => ({
    defaultConnection: {
      ...RECOMMENDED_TNG_FLOW_CONNECTION_OPTIONS,
      routing: {
        type: this.pathType(),
        radius: this.radius(),
        offset: this.offset(),
      },
    },
    connectionWaypointsEnabled: true,
    motionPreference: 'system',
  }));

  readonly definition = computed<TngFlowDefinition>(() => ({
    id: 'document-review',
    nodes,
    connections: [{
      id: 'extract-to-validate',
      source: { nodeId: 'extract', portId: 'output' },
      target: { nodeId: 'validate', portId: 'input' },
      label: 'Extracted data',
      routing: { waypoints: this.waypoints() },
    }],
  }));

  readonly presentation: TngFlowPresentation = {
    connections: {
      'extract-to-validate': {
        status: 'active',
        motion: 'flow',
        motionSpeed: 'normal',
        motionDirection: 'forward',
        message: 'Processing extracted document data',
      },
    },
  };

  updateWaypoints(event: TngFlowConnectionWaypointsChange): void {
    this.waypoints.set([...event.waypoints]);
  }
}`;

const markupCode = `<label>
  Path type
  <select [value]="pathType()" (change)="pathType.set($any($event.target).value)">
    <option value="straight">Straight</option>
    <option value="bezier">Bézier</option>
    <option value="orthogonal">Orthogonal</option>
    <option value="orthogonal-rounded">Rounded orthogonal</option>
    <option value="adaptive">Adaptive</option>
  </select>
</label>

<tng-flow-editor
  [definition]="definition()"
  [presentation]="presentation"
  [options]="editorOptions()"
  (connectionWaypointsChange)="updateWaypoints($event)"
/>`;

const styleCode = `tng-flow-editor {
  display: block;
  height: 33rem;

  --tng-flow-connection-active-color: #4f46e5;
  --tng-flow-connection-width: 2px;
  --tng-flow-connection-selected-width: 3px;
  --tng-flow-connection-hit-width: 14px;
  --tng-flow-connection-dash-size: 8;
  --tng-flow-connection-dash-gap: 6;
}`;

export const connectionRoutingDemoCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
  {
    value: 'ts',
    label: 'TS',
    language: 'ts',
    title: 'connection-routing.component.ts',
    code: componentCode,
  },
  {
    value: 'html',
    label: 'HTML',
    language: 'html',
    title: 'connection-routing.component.html',
    code: markupCode,
  },
  {
    value: 'css',
    label: 'CSS',
    language: 'css',
    title: 'connection-routing.component.css',
    code: styleCode,
  },
]);
