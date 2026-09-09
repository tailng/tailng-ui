import type { TngFlowDefinition, TngFlowPaletteItem, TngFlowValidation } from '@tailng-ui/flow';

export type DocumentReviewNodeData = Readonly<{
  summary?: string;
  configuration?: Readonly<Record<string, unknown>>;
}>;

export const documentReviewDefinition = Object.freeze({
  id: 'document-review',
  name: 'Document review',
  nodes: [
    {
      id: 'start',
      type: 'start',
      name: 'Start',
      description: 'Begin document processing.',
      icon: 'circle-play',
      position: { x: 40, y: 220 },
      ports: [{ id: 'next', name: 'Next', direction: 'output', kind: 'control' }],
      data: { summary: 'Workflow entry point' },
    },
    {
      id: 'upload',
      type: 'input',
      name: 'Upload document',
      description: 'Receive a PDF or image.',
      icon: 'upload',
      position: { x: 360, y: 220 },
      ports: [
        { id: 'start', name: 'Start', direction: 'input', kind: 'control', required: true },
        {
          id: 'file',
          name: 'Document',
          direction: 'output',
          kind: 'data',
          dataType: 'file',
        },
      ],
      data: {
        summary: 'Accepts PDF and image files',
        configuration: { acceptedTypes: ['PDF', 'PNG', 'JPEG'] },
      },
    },
    {
      id: 'extract',
      type: 'processor',
      name: 'Extract information',
      description: 'Read structured fields from the document.',
      icon: 'scan-text',
      position: { x: 680, y: 220 },
      ports: [
        {
          id: 'document',
          name: 'Document',
          direction: 'input',
          kind: 'data',
          dataType: 'file',
          required: true,
        },
        {
          id: 'result',
          name: 'Extracted data',
          direction: 'output',
          kind: 'data',
          dataType: 'object',
        },
        { id: 'error', name: 'Error', direction: 'output', kind: 'error' },
      ],
      data: { summary: 'Extracts the title, date, and reference number' },
    },
    {
      id: 'validate',
      type: 'validator',
      name: 'Validate document',
      description: 'Check the extracted fields.',
      icon: 'list-checks',
      position: { x: 1000, y: 220 },
      ports: [
        {
          id: 'input',
          name: 'Extracted data',
          direction: 'input',
          kind: 'data',
          dataType: 'object',
          required: true,
        },
        {
          id: 'result',
          name: 'Validation result',
          direction: 'output',
          kind: 'data',
          dataType: 'validation-result',
        },
      ],
      data: {
        summary: 'Checks required fields and formats',
        configuration: { requiredFields: ['title', 'documentDate', 'referenceNumber'] },
      },
    },
    {
      id: 'valid-decision',
      type: 'decision',
      name: 'Document valid?',
      description: 'Choose the next review path.',
      icon: 'git-branch',
      position: { x: 1320, y: 220 },
      ports: [
        {
          id: 'result',
          name: 'Validation result',
          direction: 'input',
          kind: 'data',
          dataType: 'validation-result',
          required: true,
        },
        { id: 'valid', name: 'Valid', direction: 'output', kind: 'control' },
        { id: 'invalid', name: 'Invalid', direction: 'output', kind: 'control' },
      ],
      data: { summary: 'Branches on the validation result' },
    },
    {
      id: 'manual-review',
      type: 'review',
      name: 'Manual review',
      description: 'Ask a person to review exceptions.',
      icon: 'user-round-check',
      position: { x: 1640, y: 400 },
      ports: [
        { id: 'review', name: 'Review', direction: 'input', kind: 'control', required: true },
        { id: 'approved', name: 'Approved', direction: 'output', kind: 'control' },
        { id: 'rejected', name: 'Rejected', direction: 'output', kind: 'error' },
      ],
      data: {
        summary: 'Requires a reviewer before continuing',
        configuration: { assignee: null, dueIn: '1 business day' },
      },
    },
    {
      id: 'approve',
      type: 'action',
      name: 'Approve document',
      description: 'Apply the approved status.',
      icon: 'badge-check',
      position: { x: 1960, y: 220 },
      ports: [
        {
          id: 'approve',
          name: 'Approve',
          direction: 'input',
          kind: 'control',
          required: true,
          multiple: true,
        },
        { id: 'complete', name: 'Complete', direction: 'output', kind: 'control' },
      ],
      data: { summary: 'Marks the document as approved' },
    },
    {
      id: 'complete',
      type: 'end',
      name: 'Complete',
      description: 'Finish the workflow.',
      icon: 'flag',
      position: { x: 2280, y: 220 },
      ports: [
        { id: 'input', name: 'Complete', direction: 'input', kind: 'control', required: true },
      ],
      data: { summary: 'Workflow completed' },
    },
  ],
  connections: [
    {
      id: 'start-to-upload',
      source: { nodeId: 'start', portId: 'next' },
      target: { nodeId: 'upload', portId: 'start' },
    },
    {
      id: 'upload-to-extract',
      source: { nodeId: 'upload', portId: 'file' },
      target: { nodeId: 'extract', portId: 'document' },
    },
    {
      id: 'extract-to-validate',
      source: { nodeId: 'extract', portId: 'result' },
      target: { nodeId: 'validate', portId: 'input' },
    },
    {
      id: 'validate-to-decision',
      source: { nodeId: 'validate', portId: 'result' },
      target: { nodeId: 'valid-decision', portId: 'result' },
    },
    {
      id: 'valid-to-approve',
      source: { nodeId: 'valid-decision', portId: 'valid' },
      target: { nodeId: 'approve', portId: 'approve' },
    },
    {
      id: 'invalid-to-review',
      source: { nodeId: 'valid-decision', portId: 'invalid' },
      target: { nodeId: 'manual-review', portId: 'review' },
    },
    {
      id: 'review-to-approve',
      source: { nodeId: 'manual-review', portId: 'approved' },
      target: { nodeId: 'approve', portId: 'approve' },
    },
    {
      id: 'approve-to-complete',
      source: { nodeId: 'approve', portId: 'complete' },
      target: { nodeId: 'complete', portId: 'input' },
    },
  ],
} satisfies TngFlowDefinition<DocumentReviewNodeData>);

export const documentReviewValidation: TngFlowValidation = Object.freeze({
  issues: [
    {
      id: 'manual-review-assignee-required',
      code: 'required-configuration',
      severity: 'error',
      message: 'Select a reviewer for this step.',
      target: { kind: 'node', nodeId: 'manual-review' },
      data: { configurationPath: 'assignee' },
    },
  ],
});

export const notificationPaletteItem: TngFlowPaletteItem<DocumentReviewNodeData> = Object.freeze({
  id: 'document-notification',
  type: 'notification',
  name: 'Send notification',
  description: 'Notify an interested user.',
  icon: 'bell-ring',
  data: {
    summary: 'Sends a configurable workflow notification',
    configuration: { recipient: null, message: null },
  },
});

export const documentExecutionNodeIds = Object.freeze([
  'start',
  'upload',
  'extract',
  'validate',
  'valid-decision',
  'manual-review',
  'approve',
  'complete',
]);

export const documentExecutionConnectionIds = Object.freeze([
  'start-to-upload',
  'upload-to-extract',
  'extract-to-validate',
  'validate-to-decision',
  'invalid-to-review',
  'review-to-approve',
  'approve-to-complete',
]);
