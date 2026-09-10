import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import type { FlowExecutionViewerScenario } from './flow-execution-viewer-example.data';

type FlowExecutionViewerCodeVariant = 'plain-css' | 'tailwind-css';

function flowExecutionViewerCodeTabs(
  scenario: FlowExecutionViewerScenario,
  variant: FlowExecutionViewerCodeVariant,
): readonly DocsExampleCodeTab[] {
  const slug = `${scenario.id}-execution-viewer`;
  const className = `${scenario.id
    .split('-')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('')}ExecutionViewerComponent`;
  const markup = variant === 'tailwind-css' ? tailwindMarkup(scenario) : plainCssMarkup(scenario);
  const css = variant === 'tailwind-css' ? tailwindCss() : plainCss();

  return Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${slug}.component.html`,
      code: markup,
    },
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: `${slug}.component.ts`,
      code: componentTs(scenario, className, slug),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${slug}.component.css`,
      code: css,
    },
  ]);
}

export function plainFlowExecutionViewerCodeTabs(
  scenario: FlowExecutionViewerScenario,
): readonly DocsExampleCodeTab[] {
  return flowExecutionViewerCodeTabs(scenario, 'plain-css');
}

export function tailwindFlowExecutionViewerCodeTabs(
  scenario: FlowExecutionViewerScenario,
): readonly DocsExampleCodeTab[] {
  return flowExecutionViewerCodeTabs(scenario, 'tailwind-css');
}

function componentTs(
  scenario: FlowExecutionViewerScenario,
  className: string,
  slug: string,
): string {
  const inspectedNodeId =
    scenario.inspectedNodeId === null ? 'null' : `'${scenario.inspectedNodeId}'`;
  const selectedExecutionId =
    scenario.selectedExecutionId === null ? 'null' : `'${scenario.selectedExecutionId}'`;
  const snapshotName = `${scenario.id.replace(/-/g, '')}Snapshot`;

  return [
    "import { Component, signal } from '@angular/core';",
    "import type { TngFlowSelection, TngFlowViewport } from '@tailng-ui/flow';",
    'import {',
    '  TngFlowExecutionViewerComponent,',
    '  type TngFlowExecutionActivatedEvent,',
    "} from '@tailng-ui/flow/execution';",
    "import { supportEscalationWorkflow } from './support-escalation-workflow.data';",
    `import { ${snapshotName} } from './${scenario.id}.data';`,
    '',
    '@Component({',
    `  selector: 'app-${slug}',`,
    '  standalone: true,',
    '  imports: [TngFlowExecutionViewerComponent],',
    `  templateUrl: './${slug}.component.html',`,
    `  styleUrl: './${slug}.component.css',`,
    '})',
    `export class ${className} {`,
    '  protected readonly definition = supportEscalationWorkflow;',
    `  protected readonly snapshot = ${snapshotName};`,
    `  protected readonly selection = signal<TngFlowSelection>(${selectionLiteral(scenario)});`,
    `  protected readonly inspectedNodeId = signal<string | null>(${inspectedNodeId});`,
    `  protected readonly selectedExecutionId = signal<string | null>(${selectedExecutionId});`,
    `  protected readonly viewport = signal<TngFlowViewport>(${JSON.stringify(scenario.viewport)});`,
    '  protected readonly inspectorOpen = signal(true);',
    '  protected readonly showInspector = signal(true);',
    "  protected readonly lastActivation = signal('No activation yet.');",
    '',
    '  protected toggleInspector(): void {',
    '    this.inspectorOpen.update((open) => !open);',
    '  }',
    '',
    '  protected setInspectorVisible(visible: boolean): void {',
    '    this.showInspector.set(visible);',
    '    if (visible) {',
    '      this.inspectorOpen.set(true);',
    '    }',
    '  }',
    '',
    '  protected onExecutionActivated(event: TngFlowExecutionActivatedEvent<unknown>): void {',
    "    const nodeName = event.node?.name ?? 'Run';",
    "    const phase = event.execution?.phase ?? 'none';",
    '    this.lastActivation.set(`${nodeName}: ${phase} via ${event.source}`);',
    '  }',
    '}',
  ].join('\n');
}

function plainCssMarkup(scenario: FlowExecutionViewerScenario): string {
  return [
    '<section',
    '  class="execution-viewer-example"',
    `  data-phase="${scenario.snapshot.phase}"`,
    scenario.narrow ? '  data-narrow' : '',
    '>',
    '  <header class="execution-viewer-example__summary">',
    '    <div>',
    `      <span>${scenario.snapshot.phase}</span>`,
    `      <strong>${scenario.title}</strong>`,
    `      <small>${progressText(scenario)}</small>`,
    '    </div>',
    '    <div class="execution-viewer-example__actions">',
    '      <button type="button" [disabled]="!showInspector()" (click)="toggleInspector()">',
    "        {{ inspectorOpen() ? 'Collapse panel' : 'Expand panel' }}",
    '      </button>',
    '      <button type="button" (click)="setInspectorVisible(!showInspector())">',
    "        {{ showInspector() ? 'Hide panel' : 'Show panel' }}",
    '      </button>',
    '    </div>',
    '  </header>',
    '',
    '  <tng-flow-execution-viewer',
    `    flowId="${scenario.id}-plain-execution-viewer"`,
    `    ariaLabel="${scenario.title} execution viewer"`,
    '    class="execution-viewer-example__viewer"',
    '    [definition]="definition"',
    '    [snapshot]="snapshot"',
    '    [selection]="selection()"',
    '    [inspectedNodeId]="inspectedNodeId()"',
    '    [selectedExecutionId]="selectedExecutionId()"',
    '    [viewport]="viewport()"',
    '    mode="inspect"',
    '    [readonly]="true"',
    '    [inspectorOpen]="inspectorOpen()"',
    '    [showInspector]="showInspector()"',
    '    inspectorPosition="right"',
    '    [showMinimap]="true"',
    '    [showSelectionArea]="false"',
    '    [fitOnInit]="false"',
    '    (selectionChange)="selection.set($event)"',
    '    (inspectedNodeIdChange)="inspectedNodeId.set($event)"',
    '    (selectedExecutionIdChange)="selectedExecutionId.set($event)"',
    '    (viewportChange)="viewport.set($event)"',
    '    (executionActivated)="onExecutionActivated($event)"',
    '    (inspectorOpenChange)="inspectorOpen.set($event)"',
    '  />',
    '',
    '  <p class="execution-viewer-example__feedback" aria-live="polite">',
    '    {{ lastActivation() }}',
    '  </p>',
    '</section>',
  ]
    .filter(Boolean)
    .join('\n');
}

function tailwindMarkup(scenario: FlowExecutionViewerScenario): string {
  return [
    '<section',
    '  class="overflow-hidden rounded-lg border border-tng-border-subtle bg-tng-bg-base p-3"',
    `  data-phase="${scenario.snapshot.phase}"`,
    scenario.narrow ? '  data-narrow' : '',
    '>',
    '  <header class="mb-3 flex flex-wrap items-start justify-between gap-3">',
    '    <div class="grid gap-1">',
    `      <span class="text-xs font-semibold uppercase text-tng-fg-muted">${scenario.snapshot.phase}</span>`,
    `      <strong class="text-sm text-tng-fg-primary">${scenario.title}</strong>`,
    `      <small class="text-xs text-tng-fg-secondary">${progressText(scenario)}</small>`,
    '    </div>',
    '    <div class="flex flex-wrap justify-end gap-2">',
    '      <button',
    '        type="button"',
    '        class="rounded-md border border-tng-border-subtle px-3 py-1.5 text-sm text-tng-fg-primary disabled:opacity-50"',
    '        [disabled]="!showInspector()"',
    '        (click)="toggleInspector()"',
    '      >',
    "        {{ inspectorOpen() ? 'Collapse panel' : 'Expand panel' }}",
    '      </button>',
    '      <button',
    '        type="button"',
    '        class="rounded-md border border-tng-border-subtle px-3 py-1.5 text-sm text-tng-fg-primary"',
    '        (click)="setInspectorVisible(!showInspector())"',
    '      >',
    "        {{ showInspector() ? 'Hide panel' : 'Show panel' }}",
    '      </button>',
    '    </div>',
    '  </header>',
    '',
    '  <tng-flow-execution-viewer',
    `    flowId="${scenario.id}-tailwind-execution-viewer"`,
    `    ariaLabel="${scenario.title} execution viewer"`,
    '    class="block h-[38rem] min-h-[31rem]"',
    '    [definition]="definition"',
    '    [snapshot]="snapshot"',
    '    [selection]="selection()"',
    '    [inspectedNodeId]="inspectedNodeId()"',
    '    [selectedExecutionId]="selectedExecutionId()"',
    '    [viewport]="viewport()"',
    '    mode="inspect"',
    '    [readonly]="true"',
    '    [inspectorOpen]="inspectorOpen()"',
    '    [showInspector]="showInspector()"',
    '    inspectorPosition="right"',
    '    [showMinimap]="true"',
    '    [showSelectionArea]="false"',
    '    [fitOnInit]="false"',
    '    (selectionChange)="selection.set($event)"',
    '    (inspectedNodeIdChange)="inspectedNodeId.set($event)"',
    '    (selectedExecutionIdChange)="selectedExecutionId.set($event)"',
    '    (viewportChange)="viewport.set($event)"',
    '    (executionActivated)="onExecutionActivated($event)"',
    '    (inspectorOpenChange)="inspectorOpen.set($event)"',
    '  />',
    '',
    '  <p class="mt-3 rounded-lg border border-tng-border-subtle bg-tng-bg-muted px-4 py-3 text-sm text-tng-fg-secondary" aria-live="polite">',
    '    {{ lastActivation() }}',
    '  </p>',
    '</section>',
  ]
    .filter(Boolean)
    .join('\n');
}

function plainCss(): string {
  return [
    '.execution-viewer-example {',
    '  background: var(--tng-semantic-background-canvas);',
    '  border: 1px solid var(--tng-semantic-border-default);',
    '  border-radius: 0.5rem;',
    '  overflow: hidden;',
    '  padding: 0.75rem;',
    '}',
    '',
    '.execution-viewer-example__summary {',
    '  display: flex;',
    '  flex-wrap: wrap;',
    '  gap: 0.75rem;',
    '  justify-content: space-between;',
    '  margin-bottom: 0.75rem;',
    '}',
    '',
    '.execution-viewer-example__summary div:first-child {',
    '  display: grid;',
    '  gap: 0.2rem;',
    '}',
    '',
    '.execution-viewer-example__summary span {',
    '  color: var(--tng-semantic-foreground-muted);',
    '  font-size: 0.75rem;',
    '  font-weight: 700;',
    '  text-transform: uppercase;',
    '}',
    '',
    '.execution-viewer-example__summary strong {',
    '  color: var(--tng-semantic-foreground-primary);',
    '  font-size: 0.95rem;',
    '}',
    '',
    '.execution-viewer-example__actions {',
    '  display: flex;',
    '  flex-wrap: wrap;',
    '  gap: 0.5rem;',
    '}',
    '',
    '.execution-viewer-example__actions button {',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.375rem;',
    '  padding: 0.375rem 0.75rem;',
    '}',
    '',
    '.execution-viewer-example__viewer {',
    '  display: block;',
    '  height: 38rem;',
    '  min-height: 31rem;',
    '}',
    '',
    '.execution-viewer-example[data-narrow] {',
    '  max-width: 46rem;',
    '}',
    '',
    '.execution-viewer-example[data-narrow] .execution-viewer-example__viewer {',
    '  height: 42rem;',
    '}',
    '',
    '.execution-viewer-example__feedback {',
    '  background: var(--tng-semantic-background-muted);',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.5rem;',
    '  color: var(--tng-semantic-foreground-secondary);',
    '  font-size: 0.875rem;',
    '  margin: 0.75rem 0 0;',
    '  padding: 0.75rem 1rem;',
    '}',
  ].join('\n');
}

function tailwindCss(): string {
  return '/* Tailwind utilities are applied directly in the template. */';
}

function progressText(scenario: FlowExecutionViewerScenario): string {
  const progress = scenario.snapshot.progress;
  if (progress === null || progress === undefined) {
    return 'Progress pending';
  }
  return `${Math.round(progress * 100)}% complete`;
}

function selectionLiteral(scenario: FlowExecutionViewerScenario): string {
  const nodeIds = Array.from(scenario.selection.nodeIds);
  const connectionIds = Array.from(scenario.selection.connectionIds);

  return [
    '{',
    `    nodeIds: new Set(${JSON.stringify(nodeIds)}),`,
    `    connectionIds: new Set(${JSON.stringify(connectionIds)}),`,
    '  }',
  ].join('\n');
}
