/* eslint-disable max-lines-per-function -- Code-tab builders keep complete copy-ready examples together. */
import type { TngFlowViewport } from '@tailng-ui/flow';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';

type FlowExecutionGraphCodeVariant = 'plain-css' | 'tailwind-css';

export type FlowExecutionGraphCodeScenario = Readonly<{
  forcedTheme: 'dark' | null;
  id: string;
  inspectedNodeId: string | null;
  narrow: boolean;
  selectedExecutionId: string | null;
  snapshot: Readonly<{
    phase: string;
    progress?: number | null;
  }>;
  title: string;
  viewport: TngFlowViewport;
}>;

function flowExecutionGraphCodeTabs(
  scenario: FlowExecutionGraphCodeScenario,
  variant: FlowExecutionGraphCodeVariant,
): readonly DocsExampleCodeTab[] {
  const slug = `${scenario.id}-execution-graph`;
  const className = `${scenario.id
    .split('-')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('')}ExecutionGraphComponent`;
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

export function plainFlowExecutionGraphCodeTabs(
  scenario: FlowExecutionGraphCodeScenario,
): readonly DocsExampleCodeTab[] {
  return flowExecutionGraphCodeTabs(scenario, 'plain-css');
}

export function tailwindFlowExecutionGraphCodeTabs(
  scenario: FlowExecutionGraphCodeScenario,
): readonly DocsExampleCodeTab[] {
  return flowExecutionGraphCodeTabs(scenario, 'tailwind-css');
}

function componentTs(
  scenario: FlowExecutionGraphCodeScenario,
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
    'import type {',
    '  TngFlowDefinition,',
    '  TngFlowNodesMovedEvent,',
    '  TngFlowSelection,',
    '  TngFlowViewport,',
    "} from '@tailng-ui/flow';",
    'import {',
    '  TngFlowExecutionGraphComponent,',
    '  type TngFlowExecutionActivatedEvent,',
    "} from '@tailng-ui/flow/execution';",
    "import { supportEscalationWorkflow } from './support-escalation-workflow.data';",
    `import { ${snapshotName} } from './${scenario.id}.data';`,
    '',
    '@Component({',
    `  selector: 'app-${slug}',`,
    '  standalone: true,',
    '  imports: [TngFlowExecutionGraphComponent],',
    `  templateUrl: './${slug}.component.html',`,
    `  styleUrl: './${slug}.component.css',`,
    '})',
    `export class ${className} {`,
    '  protected readonly definition = signal<TngFlowDefinition<unknown>>(supportEscalationWorkflow);',
    `  protected readonly snapshot = ${snapshotName};`,
    `  protected readonly selection = signal<TngFlowSelection>(${selectionLiteral(scenario)});`,
    `  protected readonly inspectedNodeId = signal<string | null>(${inspectedNodeId});`,
    `  protected readonly selectedExecutionId = signal<string | null>(${selectedExecutionId});`,
    `  protected readonly viewport = signal<TngFlowViewport>(${JSON.stringify(scenario.viewport)});`,
    "  protected readonly lastActivation = signal('No graph activation yet.');",
    '',
    '  protected onNodesMoved(event: TngFlowNodesMovedEvent): void {',
    '    const positions = new Map(event.nodes.map((move) => [move.id, move.position]));',
    '    this.definition.update((definition) => ({',
    '      ...definition,',
    '      nodes: definition.nodes.map((node) => {',
    '        const position = positions.get(node.id);',
    '        return position === undefined ? node : { ...node, position };',
    '      }),',
    '    }));',
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

function plainCssMarkup(scenario: FlowExecutionGraphCodeScenario): string {
  const className =
    scenario.forcedTheme === 'dark' ? 'execution-graph-example dark' : 'execution-graph-example';
  return [
    '<section',
    `  class="${className}"`,
    `  data-phase="${scenario.snapshot.phase}"`,
    scenario.narrow ? '  data-narrow' : '',
    scenario.forcedTheme === 'dark' ? '  data-theme="dark"' : '',
    '>',
    '  <header class="execution-graph-example__summary">',
    '    <div>',
    `      <span>${scenario.snapshot.phase}</span>`,
    `      <strong>${scenario.title}</strong>`,
    `      <small>${progressText(scenario)}</small>`,
    '    </div>',
    '  </header>',
    '',
    '  <div class="execution-graph-example__surface">',
    '    <tng-flow-execution-graph',
    `      flowId="${scenario.id}-execution-graph"`,
    `      ariaLabel="${scenario.title} execution graph"`,
    '      class="execution-graph-example__graph"',
    '      [definition]="definition()"',
    '      [snapshot]="snapshot"',
    '      [selection]="selection()"',
    '      [inspectedNodeId]="inspectedNodeId()"',
    '      [selectedExecutionId]="selectedExecutionId()"',
    '      [viewport]="viewport()"',
    '      mode="edit"',
    `      [showMinimap]="${scenario.narrow ? 'false' : 'true'}"`,
    `      [showControls]="${scenario.narrow ? 'false' : 'true'}"`,
    '      [showSelectionArea]="false"',
    '      [fitOnInit]="false"',
    '      (nodesMoved)="onNodesMoved($event)"',
    '      (selectionChange)="selection.set($event)"',
    '      (inspectedNodeIdChange)="inspectedNodeId.set($event)"',
    '      (selectedExecutionIdChange)="selectedExecutionId.set($event)"',
    '      (viewportChange)="viewport.set($event)"',
    '      (executionActivated)="onExecutionActivated($event)"',
    '    />',
    '',
    '    <aside class="execution-graph-example__details" aria-label="Selected execution">',
    '      <span>Selected execution</span>',
    '      <strong>Attempt and activation metadata</strong>',
    '      <p>Render status, payload availability, and audit actions in your own product panel.</p>',
    '      <small>{{ lastActivation() }}</small>',
    '    </aside>',
    '  </div>',
    '</section>',
  ]
    .filter(Boolean)
    .join('\n');
}

function tailwindMarkup(scenario: FlowExecutionGraphCodeScenario): string {
  const themeClasses = scenario.forcedTheme === 'dark' ? ' dark' : '';
  return [
    '<section',
    `  class="overflow-hidden rounded-lg border border-tng-border-subtle bg-tng-bg-base p-3${themeClasses}"`,
    `  data-phase="${scenario.snapshot.phase}"`,
    scenario.narrow ? '  data-narrow' : '',
    scenario.forcedTheme === 'dark' ? '  data-theme="dark"' : '',
    '>',
    '  <header class="mb-3 flex flex-wrap items-start justify-between gap-3">',
    '    <div class="grid gap-1">',
    `      <span class="text-xs font-semibold uppercase text-tng-fg-muted">${scenario.snapshot.phase}</span>`,
    `      <strong class="text-sm text-tng-fg-primary">${scenario.title}</strong>`,
    `      <small class="text-xs text-tng-fg-secondary">${progressText(scenario)}</small>`,
    '    </div>',
    '  </header>',
    '',
    '  <div class="grid min-h-[28rem] grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] overflow-hidden rounded-lg border border-tng-border-subtle max-lg:grid-cols-1">',
    '    <tng-flow-execution-graph',
    `      flowId="${scenario.id}-execution-graph"`,
    `      ariaLabel="${scenario.title} execution graph"`,
    '      class="block min-h-[28rem]"',
    '      [definition]="definition()"',
    '      [snapshot]="snapshot"',
    '      [selection]="selection()"',
    '      [inspectedNodeId]="inspectedNodeId()"',
    '      [selectedExecutionId]="selectedExecutionId()"',
    '      [viewport]="viewport()"',
    '      mode="edit"',
    `      [showMinimap]="${scenario.narrow ? 'false' : 'true'}"`,
    `      [showControls]="${scenario.narrow ? 'false' : 'true'}"`,
    '      [showSelectionArea]="false"',
    '      [fitOnInit]="false"',
    '      (nodesMoved)="onNodesMoved($event)"',
    '      (selectionChange)="selection.set($event)"',
    '      (inspectedNodeIdChange)="inspectedNodeId.set($event)"',
    '      (selectedExecutionIdChange)="selectedExecutionId.set($event)"',
    '      (viewportChange)="viewport.set($event)"',
    '      (executionActivated)="onExecutionActivated($event)"',
    '    />',
    '',
    '    <aside class="grid content-start gap-3 border-l border-tng-border-subtle bg-tng-bg-muted p-4 text-sm max-lg:border-l-0 max-lg:border-t">',
    '      <span class="text-xs font-semibold uppercase text-tng-fg-muted">Selected execution</span>',
    '      <strong class="text-sm text-tng-fg-primary">Attempt and activation metadata</strong>',
    '      <p class="m-0 text-tng-fg-secondary">',
    '        Render status, payload availability, and audit actions in your own product panel.',
    '      </p>',
    '      <small class="text-tng-fg-secondary">{{ lastActivation() }}</small>',
    '    </aside>',
    '  </div>',
    '</section>',
  ]
    .filter(Boolean)
    .join('\n');
}

function plainCss(): string {
  return [
    '.execution-graph-example {',
    '  background: var(--tng-semantic-background-canvas);',
    '  border: 1px solid var(--tng-semantic-border-default);',
    '  border-radius: 0.5rem;',
    '  overflow: hidden;',
    '  padding: 0.75rem;',
    '}',
    '',
    '.execution-graph-example.dark {',
    '  color-scheme: dark;',
    '}',
    '',
    '.execution-graph-example__summary {',
    '  display: flex;',
    '  flex-wrap: wrap;',
    '  justify-content: space-between;',
    '  margin-bottom: 0.75rem;',
    '}',
    '',
    '.execution-graph-example__summary div {',
    '  display: grid;',
    '  gap: 0.2rem;',
    '}',
    '',
    '.execution-graph-example__summary span {',
    '  color: var(--tng-semantic-foreground-muted);',
    '  font-size: 0.75rem;',
    '  font-weight: 700;',
    '  text-transform: uppercase;',
    '}',
    '',
    '.execution-graph-example__summary strong {',
    '  color: var(--tng-semantic-foreground-primary);',
    '  font-size: 0.95rem;',
    '}',
    '',
    '.execution-graph-example__summary small {',
    '  color: var(--tng-semantic-foreground-secondary);',
    '  font-size: 0.75rem;',
    '}',
    '',
    '.execution-graph-example__surface {',
    '  display: grid;',
    '  grid-template-columns: minmax(0, 1fr) minmax(16rem, 20rem);',
    '  min-height: 28rem;',
    '  overflow: hidden;',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.5rem;',
    '}',
    '',
    '.execution-graph-example__graph {',
    '  display: block;',
    '  min-height: 28rem;',
    '}',
    '',
    '.execution-graph-example__details {',
    '  background: var(--tng-semantic-background-muted);',
    '  border-left: 1px solid var(--tng-semantic-border-subtle);',
    '  color: var(--tng-semantic-foreground-secondary);',
    '  display: grid;',
    '  gap: 0.75rem;',
    '  padding: 1rem;',
    '}',
    '',
    '.execution-graph-example[data-narrow] {',
    '  max-width: 20rem;',
    '}',
    '',
    '.execution-graph-example[data-narrow] .execution-graph-example__surface {',
    '  grid-template-columns: 1fr;',
    '}',
    '',
    '@media (max-width: 720px) {',
    '  .execution-graph-example__surface {',
    '    grid-template-columns: 1fr;',
    '  }',
    '}',
  ].join('\n');
}

function tailwindCss(): string {
  return [
    '/* Tailwind variant uses tng semantic utility tokens. */',
    '[data-theme="dark"] {',
    '  color-scheme: dark;',
    '}',
    '',
    '[data-narrow] {',
    '  max-width: 20rem;',
    '}',
  ].join('\n');
}

function selectionLiteral(scenario: FlowExecutionGraphCodeScenario): string {
  if (scenario.inspectedNodeId === null) {
    return '{ nodeIds: new Set<string>(), connectionIds: new Set<string>() }';
  }
  return `{ nodeIds: new Set(['${scenario.inspectedNodeId}']), connectionIds: new Set<string>() }`;
}

function progressText(scenario: FlowExecutionGraphCodeScenario): string {
  const progress = scenario.snapshot.progress;
  if (progress === null || progress === undefined) {
    return 'Progress pending';
  }
  return `${Math.round(progress * 100)}% complete`;
}
