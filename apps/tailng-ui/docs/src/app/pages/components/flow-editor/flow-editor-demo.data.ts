import type {
  TngFlowConnection,
  TngFlowNode,
  TngFlowNodesMovedEvent,
  TngFlowNodeViews,
} from '@tailng-ui/flow';

export type FlowEditorDemoData = Readonly<{
  detail: string;
}>;

export type FlowEditorDemoState = Readonly<{
  connections: readonly TngFlowConnection[];
  nodes: readonly TngFlowNode<FlowEditorDemoData>[];
}>;

type FlowEditorDeleteSelection = Readonly<{
  nodeIds: readonly string[];
  connectionIds: readonly string[];
}>;

export const flowEditorDemoNodes: readonly TngFlowNode<FlowEditorDemoData>[] = Object.freeze([
  {
    id: 'prompt',
    type: 'prompt',
    name: 'Prompt builder',
    description: 'Assemble the system and user instructions.',
    position: { x: 80, y: 140 },
    data: { detail: 'Customer support policy' },
    ports: [
      {
        id: 'prompt-output',
        label: 'Prompt',
        direction: 'output',
        kind: 'data',
        dataType: 'text',
        multiple: true,
      },
    ],
  },
  {
    id: 'model',
    type: 'model',
    name: 'Reasoning model',
    description: 'Generate a grounded response.',
    position: { x: 430, y: 80 },
    data: { detail: 'GPT reasoning pass' },
    ports: [
      {
        id: 'model-input',
        label: 'Prompt',
        direction: 'input',
        kind: 'data',
        dataType: 'text',
        multiple: true,
      },
      {
        id: 'model-output',
        label: 'Answer',
        direction: 'output',
        kind: 'data',
        dataType: 'text',
        multiple: true,
      },
    ],
  },
  {
    id: 'response',
    type: 'response',
    name: 'Response',
    description: 'Return the final answer to the agent runtime.',
    position: { x: 780, y: 140 },
    data: { detail: 'Streaming response' },
    ports: [
      {
        id: 'response-input',
        label: 'Answer',
        direction: 'input',
        kind: 'data',
        dataType: 'text',
        multiple: true,
      },
    ],
  },
]);

export const flowEditorDemoConnections: readonly TngFlowConnection[] = Object.freeze([
  {
    id: 'prompt-to-model',
    source: { nodeId: 'prompt', portId: 'prompt-output' },
    target: { nodeId: 'model', portId: 'model-input' },
    label: 'Prepared prompt',
    description: 'Send the prepared prompt to the reasoning model.',
    type: 'bezier',
  },
  {
    id: 'model-to-response',
    source: { nodeId: 'model', portId: 'model-output' },
    target: { nodeId: 'response', portId: 'response-input' },
    label: 'Generated answer',
    description: 'Deliver the generated answer to the response step.',
    type: 'bezier',
  },
]);

export const flowEditorDemoViews: TngFlowNodeViews = Object.freeze({
  model: { status: 'running', progress: 68, message: 'Generating the final response' },
  prompt: { status: 'completed', progress: 100 },
  response: { status: 'waiting', message: 'Waiting for model output' },
});

export function applyFlowNodeMoves(
  nodes: readonly TngFlowNode<FlowEditorDemoData>[],
  event: TngFlowNodesMovedEvent,
): readonly TngFlowNode<FlowEditorDemoData>[] {
  const positions = new Map(event.nodes.map((node) => [node.id, node.position]));
  return nodes.map((node) => ({ ...node, position: positions.get(node.id) ?? node.position }));
}

export function removeFlowItems(
  nodes: readonly TngFlowNode<FlowEditorDemoData>[],
  connections: readonly TngFlowConnection[],
  event: FlowEditorDeleteSelection,
): FlowEditorDemoState {
  const nodeIds = new Set(event.nodeIds);
  const connectionIds = new Set(event.connectionIds);
  return {
    nodes: nodes.filter((node) => !nodeIds.has(node.id)),
    connections: connections.filter(
      (connection) =>
        !connectionIds.has(connection.id) &&
        !nodeIds.has(connection.source.nodeId) &&
        !nodeIds.has(connection.target.nodeId),
    ),
  };
}
