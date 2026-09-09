import { Component, computed, signal } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import {
  TngFlowEditorComponent,
  TngFlowPaletteItemDirective,
  createTngFlowCustomPointId,
  createTngFlowCustomPointPort,
  ensureTngFlowCustomPointPorts,
  isTngFlowCustomPointPortId,
  parseTngFlowCustomPointId,
  pruneUnusedTngFlowCustomPointPorts,
  type TngFlowConnectionCandidate,
  type TngFlowConnectionCreateRequest,
  type TngFlowConnectionReconnectRequest,
  type TngFlowConnectionRejectedEvent,
  type TngFlowConnectionsDeleteRequest,
  type TngFlowConnectionValidation,
  type TngFlowDefinition,
  type TngFlowNode,
  type TngFlowNodeCreateRequest,
  type TngFlowNodePositionChange,
  type TngFlowNodesDeleteRequest,
  type TngFlowPaletteItem,
  type TngFlowPoint,
  type TngFlowPort,
  type TngFlowSelection,
} from '@tailng-ui/flow';

type BuilderCategory = 'Actions' | 'Data' | 'Logic' | 'Outputs' | 'Triggers';

type BuilderNodeData = Readonly<{
  blueprintId: string;
  category: BuilderCategory;
  acceptsInput: boolean;
  outputs: readonly Readonly<{ id: string; name: string }>[];
}>;

type BuilderDefinition = TngFlowDefinition<BuilderNodeData>;
type BuilderPaletteItem = TngFlowPaletteItem<BuilderNodeData> & Readonly<{ data: BuilderNodeData }>;

const emptySelection = (): TngFlowSelection => ({
  nodeIds: new Set<string>(),
  connectionIds: new Set<string>(),
});

const paletteItems: readonly BuilderPaletteItem[] = Object.freeze([
  {
    id: 'webhook-trigger',
    type: 'trigger',
    name: 'Webhook',
    description: 'Start when an HTTP event arrives.',
    icon: 'webhook',
    data: {
      blueprintId: 'webhook',
      category: 'Triggers',
      acceptsInput: false,
      outputs: [{ id: 'next', name: 'Event' }],
    },
  },
  {
    id: 'schedule-trigger',
    type: 'trigger',
    name: 'Schedule',
    description: 'Run on a recurring schedule.',
    icon: 'calendar-clock',
    data: {
      blueprintId: 'schedule',
      category: 'Triggers',
      acceptsInput: false,
      outputs: [{ id: 'next', name: 'Run' }],
    },
  },
  {
    id: 'http-request-action',
    type: 'action',
    name: 'HTTP request',
    description: 'Call an external API endpoint.',
    icon: 'send',
    data: {
      blueprintId: 'http-request',
      category: 'Actions',
      acceptsInput: true,
      outputs: [{ id: 'next', name: 'Response' }],
    },
  },
  {
    id: 'send-email-action',
    type: 'action',
    name: 'Send email',
    description: 'Deliver a transactional message.',
    icon: 'mail',
    data: {
      blueprintId: 'send-email',
      category: 'Actions',
      acceptsInput: true,
      outputs: [{ id: 'next', name: 'Sent' }],
    },
  },
  {
    id: 'transform-data',
    type: 'data',
    name: 'Transform data',
    description: 'Map fields into a new payload.',
    icon: 'braces',
    data: {
      blueprintId: 'transform',
      category: 'Data',
      acceptsInput: true,
      outputs: [{ id: 'next', name: 'Result' }],
    },
  },
  {
    id: 'database-query',
    type: 'data',
    name: 'Database query',
    description: 'Read or update application data.',
    icon: 'database',
    data: {
      blueprintId: 'database',
      category: 'Data',
      acceptsInput: true,
      outputs: [{ id: 'next', name: 'Rows' }],
    },
  },
  {
    id: 'condition-logic',
    type: 'logic',
    name: 'Condition',
    description: 'Route the flow using a rule.',
    icon: 'git-branch',
    data: {
      blueprintId: 'condition',
      category: 'Logic',
      acceptsInput: true,
      outputs: [
        { id: 'true', name: 'Yes' },
        { id: 'false', name: 'No' },
      ],
    },
  },
  {
    id: 'delay-logic',
    type: 'logic',
    name: 'Delay',
    description: 'Wait before continuing execution.',
    icon: 'timer',
    data: {
      blueprintId: 'delay',
      category: 'Logic',
      acceptsInput: true,
      outputs: [{ id: 'next', name: 'Continue' }],
    },
  },
  {
    id: 'notification-output',
    type: 'output',
    name: 'Notification',
    description: 'Notify a person or a channel.',
    icon: 'bell-ring',
    data: {
      blueprintId: 'notification',
      category: 'Outputs',
      acceptsInput: true,
      outputs: [],
    },
  },
  {
    id: 'archive-output',
    type: 'output',
    name: 'Archive record',
    description: 'Store the completed result.',
    icon: 'archive',
    data: {
      blueprintId: 'archive',
      category: 'Outputs',
      acceptsInput: true,
      outputs: [],
    },
  },
]);

function paletteItem(blueprintId: string): BuilderPaletteItem {
  const item = paletteItems.find((candidate) => candidate.data?.blueprintId === blueprintId);
  if (item === undefined) {
    throw new Error(`Unknown professional flow builder blueprint: ${blueprintId}`);
  }
  return item;
}

function customPointPort(
  direction: 'input' | 'output',
  side: 'left' | 'right' | 'top' | 'bottom',
  index: number,
): TngFlowPort {
  const id = createTngFlowCustomPointId(direction, side, index);
  const slot = parseTngFlowCustomPointId(id);
  if (slot === undefined) {
    throw new Error(`Invalid custom point id: ${id}`);
  }
  return createTngFlowCustomPointPort(slot);
}

function withConnectedPorts(
  node: TngFlowNode<BuilderNodeData>,
  ports: readonly TngFlowPort[],
): TngFlowNode<BuilderNodeData> {
  return { ...node, ports: [...ports] };
}

function createNode(
  id: string,
  item: TngFlowPaletteItem<BuilderNodeData>,
  position: TngFlowPoint,
): TngFlowNode<BuilderNodeData> {
  const data = item.data;
  if (data === undefined) {
    throw new Error(`Palette item ${item.id} is missing builder data.`);
  }
  return {
    id,
    type: item.type,
    name: item.name,
    description: item.description,
    icon: item.icon,
    position,
    ports: [],
    data,
  };
}

const starterDefinition = Object.freeze({
  id: 'professional-customer-onboarding-flow',
  name: 'Customer onboarding automation',
  nodes: [
    withConnectedPorts(createNode('incoming-webhook', paletteItem('webhook'), { x: 70, y: 220 }), [
      customPointPort('output', 'right', 1),
    ]),
    withConnectedPorts(
      createNode('normalize-profile', paletteItem('transform'), { x: 380, y: 220 }),
      [customPointPort('input', 'left', 1), customPointPort('output', 'right', 1)],
    ),
    withConnectedPorts(
      createNode('check-eligibility', paletteItem('condition'), { x: 690, y: 220 }),
      [
        customPointPort('input', 'left', 1),
        customPointPort('output', 'right', 0),
        customPointPort('output', 'right', 2),
      ],
    ),
    withConnectedPorts(createNode('welcome-email', paletteItem('send-email'), { x: 1010, y: 70 }), [
      customPointPort('input', 'left', 1),
    ]),
    withConnectedPorts(
      createNode('manual-review-notification', paletteItem('notification'), {
        x: 1010,
        y: 370,
      }),
      [customPointPort('input', 'left', 1)],
    ),
  ],
  connections: [
    {
      id: 'webhook-to-transform',
      source: { nodeId: 'incoming-webhook', portId: createTngFlowCustomPointId('output', 'right', 1) },
      target: {
        nodeId: 'normalize-profile',
        portId: createTngFlowCustomPointId('input', 'left', 1),
      },
      type: 'bezier',
    },
    {
      id: 'transform-to-condition',
      source: {
        nodeId: 'normalize-profile',
        portId: createTngFlowCustomPointId('output', 'right', 1),
      },
      target: {
        nodeId: 'check-eligibility',
        portId: createTngFlowCustomPointId('input', 'left', 1),
      },
      type: 'bezier',
    },
    {
      id: 'eligible-to-email',
      source: {
        nodeId: 'check-eligibility',
        portId: createTngFlowCustomPointId('output', 'right', 0),
      },
      target: { nodeId: 'welcome-email', portId: createTngFlowCustomPointId('input', 'left', 1) },
      type: 'bezier',
    },
    {
      id: 'review-to-notification',
      source: {
        nodeId: 'check-eligibility',
        portId: createTngFlowCustomPointId('output', 'right', 2),
      },
      target: {
        nodeId: 'manual-review-notification',
        portId: createTngFlowCustomPointId('input', 'left', 1),
      },
      type: 'bezier',
    },
  ],
} satisfies BuilderDefinition);

function mapNumber(index: ReadonlyMap<string, number>, key: string, fallback = 0): number {
  return index.get(key) ?? fallback;
}

function outgoingIndex(definition: BuilderDefinition): Map<string, string[]> {
  const outgoing = new Map(definition.nodes.map((node) => [node.id, [] as string[]]));
  for (const connection of definition.connections) {
    const targets = outgoing.get(connection.source.nodeId);
    if (targets !== undefined) {
      targets.push(connection.target.nodeId);
    }
  }
  return outgoing;
}

function layoutLevels(
  definition: BuilderDefinition,
  outgoing: ReadonlyMap<string, readonly string[]>,
): Readonly<{ levels: ReadonlyMap<string, number>; visited: ReadonlySet<string> }> {
  const indegree = new Map(definition.nodes.map((node) => [node.id, 0]));
  for (const connection of definition.connections) {
    indegree.set(connection.target.nodeId, mapNumber(indegree, connection.target.nodeId) + 1);
  }
  const levels = new Map(definition.nodes.map((node) => [node.id, 0]));
  const queue = definition.nodes
    .filter((node) => indegree.get(node.id) === 0)
    .map((node) => node.id);
  const visited = new Set<string>();
  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (nodeId === undefined) {
      continue;
    }
    visited.add(nodeId);
    for (const targetId of outgoing.get(nodeId) ?? []) {
      levels.set(targetId, Math.max(mapNumber(levels, targetId), mapNumber(levels, nodeId) + 1));
      const nextIndegree = mapNumber(indegree, targetId, 1) - 1;
      indegree.set(targetId, nextIndegree);
      if (nextIndegree === 0) {
        queue.push(targetId);
      }
    }
  }
  return { levels, visited };
}

function autoLayoutNodes(definition: BuilderDefinition): readonly TngFlowNode<BuilderNodeData>[] {
  const outgoing = outgoingIndex(definition);
  const { levels, visited } = layoutLevels(definition, outgoing);
  const fallbackLevel = Math.max(0, ...levels.values()) + 1;
  const rowsByLevel = new Map<number, number>();
  return definition.nodes.map((node) => {
    const level = visited.has(node.id) ? mapNumber(levels, node.id) : fallbackLevel;
    const row = rowsByLevel.get(level) ?? 0;
    rowsByLevel.set(level, row + 1);
    return { ...node, position: { x: 72 + level * 320, y: 72 + row * 230 } };
  });
}

function reachableNodes(
  startNodeId: string,
  outgoing: ReadonlyMap<string, readonly string[]>,
): ReadonlySet<string> {
  const pending = [startNodeId];
  const visited = new Set<string>();
  while (pending.length > 0) {
    const nodeId = pending.pop();
    if (nodeId === undefined) {
      continue;
    }
    if (visited.has(nodeId)) {
      continue;
    }
    visited.add(nodeId);
    pending.push(...(outgoing.get(nodeId) ?? []));
  }
  return visited;
}

@Component({
  selector: 'app-professional-flow-builder-demo',
  imports: [TngButtonComponent, TngFlowEditorComponent, TngFlowPaletteItemDirective],
  templateUrl: './professional-flow-builder-demo.component.html',
  styleUrl: './professional-flow-builder-demo.component.css',
})
export class ProfessionalFlowBuilderDemoComponent {
  protected readonly definition = signal<BuilderDefinition>(starterDefinition);
  protected readonly selection = signal<TngFlowSelection>(emptySelection());
  protected readonly workflowName = signal(starterDefinition.name ?? 'Untitled workflow');
  protected readonly paletteQuery = signal('');
  protected readonly snapToGrid = signal(true);
  protected readonly published = signal(false);
  protected readonly eventMessage = signal(
    'Ready — select a step, then drag from a border point to a valid target point.',
  );
  protected readonly undoDepth = signal(0);
  protected readonly redoDepth = signal(0);
  protected readonly paletteItems = paletteItems;

  private undoStack: BuilderDefinition[] = [];
  private redoStack: BuilderDefinition[] = [];
  private nextNodeId = 1;
  private nextConnectionId = 1;

  protected readonly filteredPaletteItems = computed(() => {
    const query = this.paletteQuery().trim().toLowerCase();
    return query === ''
      ? this.paletteItems
      : this.paletteItems.filter((item) =>
          [item.name, item.description, item.data?.category]
            .filter((value): value is string => value !== undefined)
            .some((value) => value.toLowerCase().includes(query)),
        );
  });

  protected readonly selectedNode = computed<TngFlowNode<BuilderNodeData> | null>(() => {
    const id = this.selection().nodeIds.values().next().value;
    return this.definition().nodes.find((node) => node.id === id) ?? null;
  });

  protected readonly selectedConnection = computed(() => {
    const id = this.selection().connectionIds.values().next().value;
    return this.definition().connections.find((connection) => connection.id === id) ?? null;
  });

  protected readonly validateConnection = (
    candidate: TngFlowConnectionCandidate<BuilderNodeData>,
  ): TngFlowConnectionValidation => {
    if (candidate.sourcePort.direction !== 'output' || candidate.targetPort.direction !== 'input') {
      return {
        valid: false,
        code: 'invalid-direction',
        reason: 'Connect an output port to an input port.',
      };
    }
    if (this.wouldCreateCycle(candidate.source.nodeId, candidate.target.nodeId)) {
      return {
        valid: false,
        code: 'cycle-detected',
        reason: 'This connection would create a cycle in the workflow.',
      };
    }
    return { valid: true };
  };

  protected createFlowNode(request: TngFlowNodeCreateRequest<BuilderNodeData>): void {
    const blueprint = request.item.data?.blueprintId ?? request.item.type;
    const id = `${blueprint}-${this.nextNodeId++}`;
    const node = createNode(id, request.item, request.position);
    this.commit(
      { ...this.definition(), nodes: [...this.definition().nodes, node] },
      `Added ${node.name} to the workflow.`,
    );
    this.selection.set({ nodeIds: new Set([id]), connectionIds: new Set() });
  }

  protected moveNode(event: TngFlowNodePositionChange): void {
    this.commit(
      {
        ...this.definition(),
        nodes: this.definition().nodes.map((node) =>
          node.id === event.nodeId ? { ...node, position: event.position } : node,
        ),
      },
      `Moved ${this.nodeName(event.nodeId)} and saved its position.`,
    );
  }

  protected createConnection(request: TngFlowConnectionCreateRequest): void {
    const definition = this.definition();
    const nodes = ensureTngFlowCustomPointPorts(definition.nodes, [
      request.source,
      request.target,
    ]);
    const id = `builder-connection-${this.nextConnectionId++}`;
    this.commit(
      {
        ...definition,
        nodes,
        connections: [
          ...definition.connections,
          { id, source: request.source, target: request.target, type: 'bezier' },
        ],
      },
      `Connected ${this.nodeName(request.source.nodeId)} to ${this.nodeName(request.target.nodeId)}.`,
    );
  }

  protected reconnectConnection(request: TngFlowConnectionReconnectRequest): void {
    const definition = this.definition();
    const nodes = ensureTngFlowCustomPointPorts(definition.nodes, [
      request.source,
      request.target,
    ]);
    const connections = definition.connections.map((connection) =>
      connection.id === request.connectionId
        ? { ...connection, source: request.source, target: request.target }
        : connection,
    );
    this.commit(
      pruneUnusedTngFlowCustomPointPorts({ ...definition, nodes, connections }),
      `Updated the ${request.changedEndpoint} endpoint of the connection.`,
    );
  }

  protected deleteNodes(request: TngFlowNodesDeleteRequest): void {
    this.removeItems(
      new Set(request.nodeIds),
      new Set(),
      `Removed ${request.nodeIds.length} step(s).`,
    );
  }

  protected deleteConnections(request: TngFlowConnectionsDeleteRequest): void {
    this.removeItems(
      new Set(),
      new Set(request.connectionIds),
      `Removed ${request.connectionIds.length} connection(s).`,
    );
  }

  protected deleteSelection(): void {
    const selected = this.selection();
    this.removeItems(
      new Set(selected.nodeIds),
      new Set(selected.connectionIds),
      'Removed the selected workflow items.',
    );
  }

  protected duplicateSelectedNode(): void {
    const selected = this.selectedNode();
    if (selected === null) {
      return;
    }
    const id = `${selected.data?.blueprintId ?? selected.type}-${this.nextNodeId++}`;
    const copy: TngFlowNode<BuilderNodeData> = {
      ...selected,
      id,
      name: `${selected.name} copy`,
      position: { x: selected.position.x + 48, y: selected.position.y + 48 },
      ports: [],
    };
    this.commit(
      { ...this.definition(), nodes: [...this.definition().nodes, copy] },
      `Duplicated ${selected.name}.`,
    );
    this.selection.set({ nodeIds: new Set([id]), connectionIds: new Set() });
  }

  protected updateSelectedNode(field: 'description' | 'name', event: Event): void {
    const selected = this.selectedNode();
    if (selected === null) {
      return;
    }
    const rawValue = this.eventValue(event).trim();
    const value = field === 'name' && rawValue === '' ? 'Untitled step' : rawValue;
    if ((selected[field] ?? '') === value) {
      return;
    }
    this.commit(
      {
        ...this.definition(),
        nodes: this.definition().nodes.map((node) =>
          node.id === selected.id ? { ...node, [field]: value } : node,
        ),
      },
      `Updated ${field === 'name' ? 'the step name' : 'the step description'}.`,
    );
  }

  protected updateWorkflowName(event: Event): void {
    const nextName = this.eventValue(event).trim() || 'Untitled workflow';
    if (nextName === this.workflowName()) {
      return;
    }
    this.workflowName.set(nextName);
    this.commit({ ...this.definition(), name: nextName }, 'Renamed the workflow.');
  }

  protected updatePaletteQuery(event: Event): void {
    this.paletteQuery.set(this.eventValue(event));
  }

  protected updateSelection(nextSelection: TngFlowSelection): void {
    this.selection.set(nextSelection);
  }

  protected rejectConnection(event: TngFlowConnectionRejectedEvent): void {
    this.eventMessage.set(`Connection rejected — ${event.reason}`);
  }

  protected toggleSnapToGrid(): void {
    this.snapToGrid.update((value) => !value);
    this.eventMessage.set(`Snap to grid ${this.snapToGrid() ? 'enabled' : 'disabled'}.`);
  }

  protected autoLayout(): void {
    const definition = this.definition();
    if (definition.nodes.length === 0) {
      this.eventMessage.set('Add at least one step before arranging the workflow.');
      return;
    }
    this.commit(
      { ...definition, nodes: autoLayoutNodes(definition) },
      'Auto-arranged the workflow from left to right.',
    );
  }

  protected clearCanvas(): void {
    if (this.definition().nodes.length === 0) {
      return;
    }
    this.commit({ ...this.definition(), nodes: [], connections: [] }, 'Cleared the canvas.');
    this.selection.set(emptySelection());
  }

  protected resetWorkflow(): void {
    this.commit(starterDefinition, 'Restored the customer onboarding starter flow.');
    this.workflowName.set(starterDefinition.name ?? 'Customer onboarding automation');
    this.selection.set(emptySelection());
  }

  protected undo(): void {
    const previous = this.undoStack.pop();
    if (previous === undefined) {
      return;
    }
    this.redoStack.push(this.definition());
    this.definition.set(previous);
    this.workflowName.set(previous.name ?? 'Untitled workflow');
    this.selection.set(emptySelection());
    this.syncHistoryDepths();
    this.markDraft('Undid the last workflow change.');
  }

  protected redo(): void {
    const next = this.redoStack.pop();
    if (next === undefined) {
      return;
    }
    this.undoStack.push(this.definition());
    this.definition.set(next);
    this.workflowName.set(next.name ?? 'Untitled workflow');
    this.selection.set(emptySelection());
    this.syncHistoryDepths();
    this.markDraft('Redid the workflow change.');
  }

  protected togglePublished(): void {
    this.published.update((value) => !value);
    this.eventMessage.set(
      this.published()
        ? 'Workflow published — the current version is ready to run.'
        : 'Workflow returned to draft mode.',
    );
  }

  protected nodeCategory(node: TngFlowNode<BuilderNodeData>): string {
    return node.data?.category ?? 'Workflow step';
  }

  protected portSummary(port: TngFlowPort): string {
    const slot = parseTngFlowCustomPointId(port.id);
    if (slot !== undefined) {
      return `${slot.direction} · ${slot.side} · ${slot.index + 1}`;
    }
    return `${port.direction} · ${port.name ?? port.id}`;
  }

  protected connectedPorts(node: TngFlowNode<BuilderNodeData>): readonly TngFlowPort[] {
    return (node.ports ?? []).filter((port) => isTngFlowCustomPointPortId(port.id));
  }

  private commit(next: BuilderDefinition, message: string): void {
    this.undoStack.push(this.definition());
    if (this.undoStack.length > 40) {
      this.undoStack.shift();
    }
    this.redoStack = [];
    this.definition.set(next);
    this.syncHistoryDepths();
    this.markDraft(message);
  }

  private markDraft(message: string): void {
    this.published.set(false);
    this.eventMessage.set(message);
  }

  private removeItems(
    nodeIds: ReadonlySet<string>,
    connectionIds: ReadonlySet<string>,
    message: string,
  ): void {
    if (nodeIds.size === 0 && connectionIds.size === 0) {
      return;
    }
    const definition = this.definition();
    this.commit(
      pruneUnusedTngFlowCustomPointPorts({
        ...definition,
        nodes: definition.nodes.filter((node) => !nodeIds.has(node.id)),
        connections: definition.connections.filter(
          (connection) =>
            !connectionIds.has(connection.id) &&
            !nodeIds.has(connection.source.nodeId) &&
            !nodeIds.has(connection.target.nodeId),
        ),
      }),
      message,
    );
    this.selection.set(emptySelection());
  }

  private wouldCreateCycle(sourceNodeId: string, targetNodeId: string): boolean {
    return (
      sourceNodeId === targetNodeId ||
      reachableNodes(targetNodeId, outgoingIndex(this.definition())).has(sourceNodeId)
    );
  }

  private syncHistoryDepths(): void {
    this.undoDepth.set(this.undoStack.length);
    this.redoDepth.set(this.redoStack.length);
  }

  private eventValue(event: Event): string {
    const target = event.target;
    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
      ? target.value
      : '';
  }

  private nodeName(nodeId: string): string {
    return this.definition().nodes.find((node) => node.id === nodeId)?.name ?? nodeId;
  }
}
