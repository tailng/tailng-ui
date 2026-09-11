import type { TngFlowDefinition } from '@tailng-ui/flow';

export const timedExecutionNodeIds = ['receive', 'validate', 'approve', 'notify'] as const;

export const timedExecutionConnectionIds = [
  'receive-to-validate',
  'validate-to-approve',
  'approve-to-notify',
] as const;

export const timedExecutionDefinition = Object.freeze({
  id: 'timed-execution-workflow',
  name: 'Timed order execution',
  nodes: [
    {
      id: 'receive',
      type: 'source',
      name: 'Receive order',
      description: 'Accept the incoming order.',
      position: { x: 40, y: 150 },
      ports: [{ id: 'next', name: 'Order', direction: 'output', kind: 'control' }],
    },
    {
      id: 'validate',
      type: 'processor',
      name: 'Validate order',
      description: 'Check inventory and payment.',
      position: { x: 370, y: 150 },
      ports: [
        { id: 'input', name: 'Order', direction: 'input', kind: 'control', required: true },
        { id: 'next', name: 'Validated', direction: 'output', kind: 'control' },
      ],
    },
    {
      id: 'approve',
      type: 'decision',
      name: 'Approve order',
      description: 'Commit the fulfilment decision.',
      position: { x: 700, y: 150 },
      ports: [
        { id: 'input', name: 'Validated', direction: 'input', kind: 'control', required: true },
        { id: 'next', name: 'Approved', direction: 'output', kind: 'control' },
      ],
    },
    {
      id: 'notify',
      type: 'target',
      name: 'Notify customer',
      description: 'Send the order confirmation.',
      position: { x: 1030, y: 150 },
      ports: [
        { id: 'input', name: 'Approved', direction: 'input', kind: 'control', required: true },
      ],
    },
  ],
  connections: [
    {
      id: 'receive-to-validate',
      source: { nodeId: 'receive', portId: 'next' },
      target: { nodeId: 'validate', portId: 'input' },
    },
    {
      id: 'validate-to-approve',
      source: { nodeId: 'validate', portId: 'next' },
      target: { nodeId: 'approve', portId: 'input' },
    },
    {
      id: 'approve-to-notify',
      source: { nodeId: 'approve', portId: 'next' },
      target: { nodeId: 'notify', portId: 'input' },
    },
  ],
} satisfies TngFlowDefinition);
