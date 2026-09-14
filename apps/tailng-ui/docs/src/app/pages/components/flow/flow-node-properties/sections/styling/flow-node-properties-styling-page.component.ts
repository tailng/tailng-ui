import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-flow-node-properties-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './flow-node-properties-styling-page.component.html',
})
export class FlowNodePropertiesStylingPageComponent {
  protected readonly hostSizingCode = [
    'tng-flow-node-properties.agent-inspector {',
    '  display: block;',
    '  min-width: 20rem;',
    '  max-width: 28rem;',
    '  height: 100%;',
    '  border-left: 1px solid var(--tng-flow-execution-border-color);',
    '}',
    '',
    '@media (max-width: 56rem) {',
    '  tng-flow-node-properties.agent-inspector {',
    '    min-width: 0;',
    '    max-width: none;',
    '    height: min(60vh, 34rem);',
    '    border-left: 0;',
    '    border-top: 1px solid var(--tng-flow-execution-border-color);',
    '  }',
    '}',
  ].join('\n');

  protected readonly themeCode = [
    'tng-flow-node-properties.agent-inspector {',
    '  --tng-flow-execution-surface: var(--tng-semantic-background-surface);',
    '  --tng-flow-execution-muted-background: var(--tng-semantic-background-muted);',
    '  --tng-flow-execution-color: var(--tng-semantic-foreground-default);',
    '  --tng-flow-execution-muted-color: var(--tng-semantic-foreground-muted);',
    '  --tng-flow-execution-border-color: var(--tng-semantic-border-default);',
    '  --tng-flow-execution-focus-color: var(--tng-semantic-focus-ring);',
    '  --tng-flow-execution-inspector-padding: 1rem;',
    '}',
  ].join('\n');

  protected readonly dataTemplateCode = [
    '<tng-flow-node-properties',
    '  class="agent-inspector"',
    '  [definition]="definition()"',
    '  [inspectedNodeId]="inspectedNodeId()"',
    '  (nodeChangeRequested)="applyNodeChanges($event)"',
    '>',
    '  <ng-template',
    '    tngFlowNodePropertiesData',
    '    let-data',
    '    let-node="node"',
    '    let-readonly="readonly"',
    '    let-requestDataChange="requestDataChange"',
    '  >',
    '    <label class="agent-inspector__field">',
    '      <span>Owner</span>',
    '      <input',
    '        [value]="data?.owner ?? \'\'"',
    '        [readOnly]="readonly"',
    '        (input)="requestDataChange({ owner: $any($event.target).value })"',
    '      />',
    '    </label>',
    '    <small>{{ node.type }} node</small>',
    '  </ng-template>',
    '</tng-flow-node-properties>',
  ].join('\n');
}
