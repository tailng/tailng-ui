import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';

const componentCode = [
  "import { Component, signal } from '@angular/core';",
  "import type { TngFlowSelection, TngFlowViewport } from '@tailng-ui/flow';",
  "import { TngFlowExecutionGraphComponent } from '@tailng-ui/flow/execution';",
  "import { runningSnapshot, supportWorkflow } from './support-workflow.data';",
  '',
  '@Component({',
  "  selector: 'app-running-workflow-graph',",
  '  standalone: true,',
  '  imports: [TngFlowExecutionGraphComponent],',
  "  templateUrl: './running-workflow-graph.component.html',",
  "  styleUrl: './running-workflow-graph.component.css',",
  '})',
  'export class RunningWorkflowGraphComponent {',
  '  protected readonly definition = supportWorkflow;',
  '  protected readonly snapshot = runningSnapshot;',
  '  protected readonly selection = signal<TngFlowSelection>({',
  "    nodeIds: new Set(['risk']),",
  '    connectionIds: new Set(),',
  '  });',
  "  protected readonly inspectedNodeId = signal<string | null>('risk');",
  "  protected readonly selectedExecutionId = signal<string | null>('running-node-risk');",
  '  protected readonly viewport = signal<TngFlowViewport>({',
  '    position: { x: -80, y: -75 },',
  '    scale: 0.68,',
  '  });',
  '}',
].join('\n');

function graphMarkup(className: string): string {
  return [
    '<tng-flow-execution-graph',
    '  flowId="running-workflow"',
    '  ariaLabel="Running support workflow execution graph"',
    `  class="${className}"`,
    '  [definition]="definition"',
    '  [snapshot]="snapshot"',
    '  [selection]="selection()"',
    '  [inspectedNodeId]="inspectedNodeId()"',
    '  [selectedExecutionId]="selectedExecutionId()"',
    '  [viewport]="viewport()"',
    '  mode="inspect"',
    '  [showMinimap]="true"',
    '  [showControls]="true"',
    '  [showSelectionArea]="false"',
    '  [fitOnInit]="false"',
    '  (selectionChange)="selection.set($event)"',
    '  (inspectedNodeIdChange)="inspectedNodeId.set($event)"',
    '  (selectedExecutionIdChange)="selectedExecutionId.set($event)"',
    '  (viewportChange)="viewport.set($event)"',
    '/>',
  ].join('\n');
}

function codeTabs(html: string, css: string): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'running-workflow-graph.component.ts',
      code: componentCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'running-workflow-graph.component.html',
      code: html,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'running-workflow-graph.component.css',
      code: css,
    },
  ]);
}

export const flowExecutionGraphOverviewPlainCssCodeTabs = codeTabs(
  graphMarkup('running-workflow-graph'),
  [
    '.running-workflow-graph {',
    '  display: block;',
    '  height: 28rem;',
    '  min-height: 24rem;',
    '  overflow: hidden;',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.5rem;',
    '}',
  ].join('\n'),
);

export const flowExecutionGraphOverviewTailwindCodeTabs = codeTabs(
  graphMarkup(
    'block h-[28rem] min-h-[24rem] overflow-hidden rounded-lg border border-tng-border-subtle bg-tng-bg-base',
  ),
  '/* Tailwind utilities are applied directly in the template. */',
);
