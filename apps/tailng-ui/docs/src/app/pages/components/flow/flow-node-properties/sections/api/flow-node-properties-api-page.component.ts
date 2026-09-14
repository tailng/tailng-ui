import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-flow-node-properties-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './flow-node-properties-api-page.component.html',
})
export class FlowNodePropertiesApiPageComponent {
  protected readonly basicUsageCode = [
    '<tng-flow-node-properties',
    '  [definition]="definition()"',
    '  [inspectedNodeId]="selectedNodeId()"',
    '  [readonly]="isLocked()"',
    '  (nodeChangeRequested)="applyNodeChanges($event)"',
    '/>',
  ].join('\n');

  protected readonly directNodeCode = [
    '<tng-flow-node-properties',
    '  [node]="selectedNode()"',
    '  [showData]="false"',
    '  [showPorts]="true"',
    '  (nodeChangeRequested)="applyNodeChanges($event)"',
    '/>',
  ].join('\n');

  protected readonly changeHandlerCode = [
    "import type { TngFlowNodePropertyChangeRequest } from '@tailng-ui/flow/execution';",
    '',
    'protected applyNodeChanges(',
    '  request: TngFlowNodePropertyChangeRequest<AgentNodeData>,',
    '): void {',
    '  this.definition.update((definition) => ({',
    '    ...definition,',
    '    nodes: definition.nodes.map((node) =>',
    '      node.id === request.nodeId ? { ...node, ...request.changes } : node,',
    '    ),',
    '  }));',
    '}',
  ].join('\n');

  protected readonly dataTemplateCode = [
    '<tng-flow-node-properties',
    '  [definition]="definition()"',
    '  [inspectedNodeId]="selectedNodeId()"',
    '  (nodeChangeRequested)="applyNodeChanges($event)"',
    '>',
    '  <ng-template',
    '    tngFlowNodePropertiesData',
    '    let-data',
    '    let-node="node"',
    '    let-readonly="readonly"',
    '    let-requestDataChange="requestDataChange"',
    '    let-requestNodeChange="requestNodeChange"',
    '  >',
    '    <label>',
    '      Owner',
    '      <input',
    '        [value]="data?.owner ?? \'\'"',
    '        [readOnly]="readonly"',
    '        (input)="requestDataChange({ owner: $any($event.target).value })"',
    '      />',
    '    </label>',
    '',
    '    <button',
    '      type="button"',
    '      [disabled]="readonly"',
    '      (click)="requestNodeChange({ description: node.name + \' owner reviewed\' })"',
    '    >',
    '      Mark reviewed',
    '    </button>',
    '  </ng-template>',
    '</tng-flow-node-properties>',
  ].join('\n');
}
