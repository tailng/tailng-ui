import type { TngAiJsonValue } from './json.types';
import type { TngAiMessagePart } from './message-part.types';

export type TngAiActionSource = 'pointer' | 'keyboard' | 'programmatic';

export type TngAiSubmitRequest = {
  readonly type: 'submit';
  readonly threadId: string;
  readonly text: string;
  readonly attachments?: readonly TngAiMessagePart[];
  readonly source: TngAiActionSource;
}

export type TngAiStopRequest = {
  readonly type: 'stop';
  readonly threadId: string;
  readonly runId: string;
  readonly source: TngAiActionSource;
}

export type TngAiRetryRequest = {
  readonly type: 'retry';
  readonly threadId: string;
  readonly messageId: string;
  readonly runId?: string;
  readonly source: TngAiActionSource;
}

export type TngAiEditRequest = {
  readonly type: 'edit';
  readonly threadId: string;
  readonly messageId: string;
  readonly text: string;
  readonly source: TngAiActionSource;
}

export type TngAiFeedbackRequest = {
  readonly type: 'feedback';
  readonly threadId: string;
  readonly messageId: string;
  readonly value: 'positive' | 'negative' | null;
  readonly source: TngAiActionSource;
}

export type TngAiToolApprovalRequest = {
  readonly type: 'tool-approval';
  readonly threadId: string;
  readonly runId: string;
  readonly toolCallId: string;
  readonly decision: 'approve' | 'reject' | 'cancel';
  readonly payload?: TngAiJsonValue;
  readonly source: TngAiActionSource;
}

export type TngAiLoadHistoryRequest = {
  readonly type: 'load-history';
  readonly threadId: string;
  readonly cursor?: string;
  readonly limit: number;
  readonly source: TngAiActionSource;
}

export type TngAiActionRequest =
  | TngAiSubmitRequest
  | TngAiStopRequest
  | TngAiRetryRequest
  | TngAiEditRequest
  | TngAiFeedbackRequest
  | TngAiToolApprovalRequest
  | TngAiLoadHistoryRequest;
