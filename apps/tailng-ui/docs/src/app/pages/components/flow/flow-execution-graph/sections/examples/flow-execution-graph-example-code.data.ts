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
  const isDelayed = scenario.id === 'delayed-execution';
  const inspectedNodeId =
    scenario.inspectedNodeId === null ? 'null' : `'${scenario.inspectedNodeId}'`;
  const selectedExecutionId =
    scenario.selectedExecutionId === null ? 'null' : `'${scenario.selectedExecutionId}'`;
  const snapshotName = `${scenario.id.replace(/-/g, '')}Snapshot`;
  const workflowName = isDelayed ? 'delayedExecutionWorkflow' : 'supportEscalationWorkflow';
  const snapshotValue = isDelayed ? 'signal(delayedExecutionTimeline[0].snapshot)' : snapshotName;

  return [
    `import { Component, signal${isDelayed ? ', type OnDestroy' : ''} } from '@angular/core';`,
    "import { TngButtonComponent } from '@tailng-ui/components';",
    'import {',
    '  ensureTngFlowCustomPointPorts,',
    '  pruneUnusedTngFlowCustomPointPorts,',
    '  type TngFlowConnectionCreateRequest,',
    '  type TngFlowConnectionReconnectRequest,',
    '  type TngFlowConnectionRoutingChangeRequest,',
    '  type TngFlowConnectionsDeleteRequest,',
    '  type TngFlowDefinition,',
    '  type TngFlowNodesMovedEvent,',
    '  type TngFlowSelection,',
    '  type TngFlowViewport,',
    "} from '@tailng-ui/flow';",
    'import {',
    '  TngFlowExecutionGraphComponent,',
    '  type TngFlowExecutionActivatedEvent,',
    "} from '@tailng-ui/flow/execution';",
    isDelayed
      ? "import { delayedExecutionTimeline, delayedExecutionWorkflow } from './delayed-execution.data';"
      : "import { supportEscalationWorkflow } from './support-escalation-workflow.data';",
    isDelayed ? '' : `import { ${snapshotName} } from './${scenario.id}.data';`,
    '',
    '@Component({',
    `  selector: 'app-${slug}',`,
    '  standalone: true,',
    '  imports: [TngButtonComponent, TngFlowExecutionGraphComponent],',
    `  templateUrl: './${slug}.component.html',`,
    `  styleUrl: './${slug}.component.css',`,
    '})',
    `export class ${className}${isDelayed ? ' implements OnDestroy' : ''} {`,
    `  protected readonly definition = signal<TngFlowDefinition<unknown>>(${workflowName});`,
    `  protected readonly snapshot = ${snapshotValue};`,
    `  protected readonly selection = signal<TngFlowSelection>(${selectionLiteral(scenario)});`,
    `  protected readonly inspectedNodeId = signal<string | null>(${inspectedNodeId});`,
    `  protected readonly selectedExecutionId = signal<string | null>(${selectedExecutionId});`,
    `  protected readonly viewport = signal<TngFlowViewport>(${JSON.stringify(scenario.viewport)});`,
    "  protected readonly lastActivation = signal('No graph activation yet.');",
    ...(isDelayed
      ? [
          '  protected readonly timelineIndex = signal(0);',
          '  protected readonly playing = signal(false);',
          '  private playbackTimer: ReturnType<typeof setInterval> | null = null;',
          '',
          '  public ngOnDestroy(): void {',
          '    this.stopPlayback();',
          '  }',
          '',
          '  protected timelineLabel(): string {',
          '    const step = delayedExecutionTimeline[this.timelineIndex()];',
          "    return `Step ${this.timelineIndex() + 1} of ${delayedExecutionTimeline.length}: ${step.label}`;",
          '  }',
          '',
          '  protected togglePlayback(): void {',
          '    if (this.playing()) {',
          '      this.stopPlayback();',
          '      return;',
          '    }',
          '    this.startPlayback();',
          '  }',
          '',
          '  protected restartPlayback(): void {',
          '    this.stopPlayback();',
          '    this.applyTimelineStep(0);',
          '    this.startPlayback();',
          '  }',
          '',
          '  private startPlayback(): void {',
          '    if (this.timelineIndex() >= delayedExecutionTimeline.length - 1) {',
          '      this.applyTimelineStep(0);',
          '    }',
          '    this.playing.set(true);',
          '    this.playbackTimer = setInterval(() => {',
          '      const nextIndex = this.timelineIndex() + 1;',
          '      if (nextIndex >= delayedExecutionTimeline.length) {',
          '        this.stopPlayback();',
          '        return;',
          '      }',
          '      this.applyTimelineStep(nextIndex);',
          '      if (nextIndex >= delayedExecutionTimeline.length - 1) {',
          '        this.stopPlayback();',
          '      }',
          '    }, 1300);',
          '  }',
          '',
          '  private stopPlayback(): void {',
          '    if (this.playbackTimer !== null) {',
          '      clearInterval(this.playbackTimer);',
          '      this.playbackTimer = null;',
          '    }',
          '    this.playing.set(false);',
          '  }',
          '',
          '  private applyTimelineStep(index: number): void {',
          '    const step = delayedExecutionTimeline[index];',
          '    this.timelineIndex.set(index);',
          '    this.snapshot.set(step.snapshot);',
          '    this.inspectedNodeId.set(step.inspectedNodeId);',
          '    this.selectedExecutionId.set(step.selectedExecutionId);',
          '    this.selection.set({ nodeIds: new Set([step.inspectedNodeId]), connectionIds: new Set() });',
          '  }',
        ]
      : []),
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
    '  protected onConnectionCreateRequested(request: TngFlowConnectionCreateRequest): void {',
    '    const definition = this.definition();',
    '    const id = this.nextConnectionId();',
    '    const nodes = ensureTngFlowCustomPointPorts(definition.nodes, [',
    '      request.source,',
    '      request.target,',
    '    ]);',
    '    this.definition.set({',
    '      ...definition,',
    '      nodes,',
    '      connections: [',
    '        ...definition.connections,',
    "        { id, source: request.source, target: request.target, routing: request.routing ?? { type: 'bezier' } },",
    '      ],',
    '    });',
    '    this.selection.set({ nodeIds: new Set(), connectionIds: new Set([id]) });',
    '  }',
    '',
    '  protected onConnectionReconnectRequested(request: TngFlowConnectionReconnectRequest): void {',
    '    const definition = this.definition();',
    '    const nodes = ensureTngFlowCustomPointPorts(definition.nodes, [',
    '      request.source,',
    '      request.target,',
    '    ]);',
    '    const connections = definition.connections.map((connection) =>',
    '      connection.id === request.connectionId',
    '        ? { ...connection, source: request.source, target: request.target }',
    '        : connection,',
    '    );',
    '    this.definition.set(',
    '      pruneUnusedTngFlowCustomPointPorts({ ...definition, nodes, connections }),',
    '    );',
    '  }',
    '',
    '  protected onConnectionsDeleteRequested(request: TngFlowConnectionsDeleteRequest): void {',
    '    const deletedIds = new Set(request.connectionIds);',
    '    this.definition.update((definition) =>',
    '      pruneUnusedTngFlowCustomPointPorts({',
    '        ...definition,',
    '        connections: definition.connections.filter((connection) => !deletedIds.has(connection.id)),',
    '      }),',
    '    );',
    '    this.selection.update((selection) => ({',
    '      nodeIds: new Set(selection.nodeIds),',
    '      connectionIds: new Set(',
    '        [...selection.connectionIds].filter((connectionId) => !deletedIds.has(connectionId)),',
    '      ),',
    '    }));',
    '  }',
    '',
    '  protected onConnectionRoutingChangeRequested(',
    '    request: TngFlowConnectionRoutingChangeRequest,',
    '  ): void {',
    '    const connectionIds = new Set(request.connectionIds);',
    '    this.definition.update((definition) => ({',
    '      ...definition,',
    '      connections: definition.connections.map((connection) =>',
    '        connectionIds.has(connection.id)',
    '          ? { ...connection, routing: { ...connection.routing, type: request.type } }',
    '          : connection,',
    '      ),',
    '    }));',
    '  }',
    '',
    '  protected deleteSelectedConnections(): void {',
    '    this.onConnectionsDeleteRequested({',
    '      connectionIds: [...this.selection().connectionIds],',
    "      source: 'api',",
    '    });',
    '  }',
    '',
    '  private nextConnectionId(): string {',
    '    const ids = new Set(this.definition().connections.map((connection) => connection.id));',
    '    let suffix = 1;',
    '    while (ids.has(`connection-${suffix}`)) {',
    '      suffix += 1;',
    '    }',
    '    return `connection-${suffix}`;',
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
  const isDelayed = scenario.id === 'delayed-execution';
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
    isDelayed
      ? '      <small>{{ timelineLabel() }}</small>'
      : `      <small>${progressText(scenario)}</small>`,
    '      <p>Select a node to reveal connection points. Drag to connect.</p>',
    '    </div>',
    isDelayed
      ? '    <div class="execution-graph-example__actions">\n      <tng-button appearance="outline" size="sm" (click)="togglePlayback()">{{ playing() ? \'Pause\' : \'Play\' }}</tng-button>\n      <tng-button appearance="outline" size="sm" (click)="restartPlayback()">Restart</tng-button>\n    </div>'
      : '',
    '    @if (selection().connectionIds.size > 0) {',
    '      <tng-button appearance="outline" size="sm" (click)="deleteSelectedConnections()">',
    '        Delete connection',
    '      </tng-button>',
    '    }',
    '  </header>',
    '',
    '  <div class="execution-graph-example__surface">',
    '    <tng-flow-execution-graph',
    `      flowId="${scenario.id}-execution-graph"`,
    `      ariaLabel="${scenario.title} execution graph"`,
    '      class="execution-graph-example__graph"',
    '      [definition]="definition()"',
    `      [snapshot]="${isDelayed ? 'snapshot()' : 'snapshot'}"`,
    '      [selection]="selection()"',
    '      [inspectedNodeId]="inspectedNodeId()"',
    '      [selectedExecutionId]="selectedExecutionId()"',
    '      [viewport]="viewport()"',
    '      mode="edit"',
    '      attachmentLayout="custom-points"',
    `      [showMinimap]="${scenario.narrow ? 'false' : 'true'}"`,
    `      [showControls]="${scenario.narrow ? 'false' : 'true'}"`,
    '      [showSelectionArea]="false"',
    '      [fitOnInit]="true"',
    '      (nodesMoved)="onNodesMoved($event)"',
    '      (connectionCreateRequested)="onConnectionCreateRequested($event)"',
    '      (connectionReconnectRequested)="onConnectionReconnectRequested($event)"',
    '      (connectionRoutingChangeRequested)="onConnectionRoutingChangeRequested($event)"',
    '      (connectionsDeleteRequested)="onConnectionsDeleteRequested($event)"',
    '      (selectionChange)="selection.set($event)"',
    '      (inspectedNodeIdChange)="inspectedNodeId.set($event)"',
    '      (selectedExecutionIdChange)="selectedExecutionId.set($event)"',
    '      (viewportChange)="viewport.set($event)"',
    '      (executionActivated)="onExecutionActivated($event)"',
    '    />',
    '  </div>',
    '</section>',
  ]
    .filter(Boolean)
    .join('\n');
}

function tailwindMarkup(scenario: FlowExecutionGraphCodeScenario): string {
  const themeClasses = scenario.forcedTheme === 'dark' ? ' dark' : '';
  const isDelayed = scenario.id === 'delayed-execution';
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
    isDelayed
      ? '      <small class="text-xs text-tng-fg-secondary">{{ timelineLabel() }}</small>'
      : `      <small class="text-xs text-tng-fg-secondary">${progressText(scenario)}</small>`,
    '      <p class="m-0 text-xs text-tng-fg-secondary">Select a node to reveal connection points. Drag to connect.</p>',
    '    </div>',
    isDelayed
      ? '    <div class="flex flex-wrap justify-end gap-2">\n      <tng-button appearance="outline" size="sm" (click)="togglePlayback()">{{ playing() ? \'Pause\' : \'Play\' }}</tng-button>\n      <tng-button appearance="outline" size="sm" (click)="restartPlayback()">Restart</tng-button>\n    </div>'
      : '',
    '    @if (selection().connectionIds.size > 0) {',
    '      <tng-button appearance="outline" size="sm" (click)="deleteSelectedConnections()">',
    '        Delete connection',
    '      </tng-button>',
    '    }',
    '  </header>',
    '',
    `  <div class="${scenario.narrow ? 'h-[22rem]' : 'h-[28rem]'} overflow-hidden rounded-lg border border-tng-border-subtle">`,
    '    <tng-flow-execution-graph',
    `      flowId="${scenario.id}-execution-graph"`,
    `      ariaLabel="${scenario.title} execution graph"`,
    '      class="block h-full"',
    '      [definition]="definition()"',
    `      [snapshot]="${isDelayed ? 'snapshot()' : 'snapshot'}"`,
    '      [selection]="selection()"',
    '      [inspectedNodeId]="inspectedNodeId()"',
    '      [selectedExecutionId]="selectedExecutionId()"',
    '      [viewport]="viewport()"',
    '      mode="edit"',
    '      attachmentLayout="custom-points"',
    `      [showMinimap]="${scenario.narrow ? 'false' : 'true'}"`,
    `      [showControls]="${scenario.narrow ? 'false' : 'true'}"`,
    '      [showSelectionArea]="false"',
    '      [fitOnInit]="true"',
    '      (nodesMoved)="onNodesMoved($event)"',
    '      (connectionCreateRequested)="onConnectionCreateRequested($event)"',
    '      (connectionReconnectRequested)="onConnectionReconnectRequested($event)"',
    '      (connectionRoutingChangeRequested)="onConnectionRoutingChangeRequested($event)"',
    '      (connectionsDeleteRequested)="onConnectionsDeleteRequested($event)"',
    '      (selectionChange)="selection.set($event)"',
    '      (inspectedNodeIdChange)="inspectedNodeId.set($event)"',
    '      (selectedExecutionIdChange)="selectedExecutionId.set($event)"',
    '      (viewportChange)="viewport.set($event)"',
    '      (executionActivated)="onExecutionActivated($event)"',
    '    />',
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
    '.execution-graph-example__actions {',
    '  display: flex;',
    '  flex-wrap: wrap;',
    '  gap: 0.5rem;',
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
    '.execution-graph-example__summary p {',
    '  color: var(--tng-semantic-foreground-secondary);',
    '  font-size: 0.75rem;',
    '  margin: 0.25rem 0 0;',
    '}',
    '',
    '.execution-graph-example__surface {',
    '  height: 28rem;',
    '  overflow: hidden;',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.5rem;',
    '}',
    '',
    '.execution-graph-example__graph {',
    '  display: block;',
    '  height: 100%;',
    '}',
    '',
    '.execution-graph-example[data-narrow] {',
    '  max-width: 20rem;',
    '}',
    '',
    '.execution-graph-example[data-narrow] .execution-graph-example__surface {',
    '  height: 22rem;',
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
