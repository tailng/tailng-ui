import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-flow-execution-graph-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './flow-execution-graph-api-page.component.html',
})
export class FlowExecutionGraphApiPageComponent {
  protected readonly basicUsageCode = [
    '<tng-flow-execution-graph',
    '  [definition]="definition()"',
    '  [snapshot]="snapshot()"',
    '  [selection]="selection()"',
    '  [inspectedNodeId]="inspectedNodeId()"',
    '  [selectedExecutionId]="selectedExecutionId()"',
    '  [viewport]="viewport()"',
    '  (selectionChange)="selection.set($event)"',
    '  (inspectedNodeIdChange)="inspectedNodeId.set($event)"',
    '  (selectedExecutionIdChange)="selectedExecutionId.set($event)"',
    '  (viewportChange)="viewport.set($event)"',
    '  (executionActivated)="lastActivation.set($event)"',
    '/>',
  ].join('\n');

  protected readonly authoringCode = [
    '<tng-flow-execution-graph',
    '  mode="edit"',
    '  attachmentLayout="custom-points"',
    '  [definition]="definition()"',
    '  [snapshot]="snapshot()"',
    '  [selection]="selection()"',
    "  [commandShortcuts]=\"['undo', 'redo']\"",
    '  [canUndo]="historyStatus().canUndo"',
    '  [canRedo]="historyStatus().canRedo"',
    '  (nodesMoved)="applyNodePositions($event)"',
    '  (connectionCreateRequested)="createConnection($event)"',
    '  (connectionReconnectRequested)="reconnectConnection($event)"',
    '  (connectionRoutingChangeRequested)="updateConnectionRouting($event)"',
    '  (connectionsDeleteRequested)="deleteConnections($event)"',
    '  (nodesDeleteRequested)="deleteNodes($event)"',
    '  (commandRequested)="runGraphCommand($event)"',
    '/>',
  ].join('\n');

  protected readonly createConnectionCode = [
    'import {',
    '  ensureTngFlowCustomPointPorts,',
    '  type TngFlowConnectionCreateRequest,',
    "} from '@tailng-ui/flow';",
    '',
    'protected createConnection(request: TngFlowConnectionCreateRequest): void {',
    '  const definition = this.definition();',
    '  const id = this.nextConnectionId();',
    '  const nodes = ensureTngFlowCustomPointPorts(definition.nodes, [',
    '    request.source,',
    '    request.target,',
    '  ]);',
    '',
    '  this.definition.set({',
    '    ...definition,',
    '    nodes,',
    '    connections: [',
    '      ...definition.connections,',
    '      {',
    '        id,',
    '        source: request.source,',
    '        target: request.target,',
    "        routing: request.routing ?? { type: 'bezier' },",
    '      },',
    '    ],',
    '  });',
    '}',
  ].join('\n');

  protected readonly templateCode = [
    '<tng-flow-execution-graph [definition]="definition()" [snapshot]="snapshot()">',
    '  <ng-template tngFlowNode="task" let-node let-view="view">',
    '    <article class="task-node" [attr.data-phase]="view.status">',
    '      <strong>{{ node.name }}</strong>',
    "      <small>{{ view.status ?? 'pending' }}</small>",
    '    </article>',
    '  </ng-template>',
    '',
    '  <ng-template tngFlowConnection let-connection let-view="view">',
    '    <span class="connection-label">',
    "      {{ connection.label ?? view.status ?? 'edge' }}",
    '    </span>',
    '  </ng-template>',
    '</tng-flow-execution-graph>',
  ].join('\n');

  protected readonly methodsCode = [
    '@ViewChild(TngFlowExecutionGraphComponent)',
    'private readonly graph?: TngFlowExecutionGraphComponent;',
    '',
    'protected focusFailedNode(nodeId: string): void {',
    '  this.graph?.centerNode(nodeId);',
    '}',
    '',
    'protected useOrthogonalRouting(): void {',
    "  this.graph?.requestConnectionRoutingChange('orthogonal');",
    '}',
  ].join('\n');
}
