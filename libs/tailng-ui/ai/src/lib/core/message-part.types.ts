import type { TngAiJsonValue } from './json.types';

export type TngAiPartBase = {
  readonly id: string;
  readonly metadata?: Readonly<Record<string, TngAiJsonValue>>;
}

export type TngAiTextAnnotation = {
  readonly type: 'source';
  readonly sourceId: string;
  readonly start: number;
  readonly end: number;
}

export type TngAiTextPart = {
  readonly type: 'text';
  readonly text: string;
  readonly format: 'plain' | 'markdown';
  readonly status?: 'streaming' | 'complete';
  readonly annotations?: readonly TngAiTextAnnotation[];
} & TngAiPartBase

export type TngAiReasoningPart = {
  readonly type: 'reasoning';
  readonly visibility: 'hidden' | 'summary';
  readonly text?: string;
  readonly status?: 'streaming' | 'complete';
  readonly encryptedValue?: string;
} & TngAiPartBase

export type TngAiToolCallStatus =
  | 'input-streaming'
  | 'awaiting-approval'
  | 'running'
  | 'complete'
  | 'failed'
  | 'cancelled';

export type TngAiToolApproval = {
  readonly interruptId?: string;
  readonly status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  readonly payload?: TngAiJsonValue;
}

export type TngAiToolCallPart = {
  readonly type: 'tool-call';
  readonly toolCallId: string;
  readonly name: string;
  readonly input?: TngAiJsonValue;
  readonly rawInput?: string;
  readonly status: TngAiToolCallStatus;
  readonly approval?: TngAiToolApproval;
} & TngAiPartBase

export type TngAiToolResultPart = {
  readonly type: 'tool-result';
  readonly toolCallId: string;
  readonly output?: TngAiJsonValue;
  readonly text?: string;
  readonly isError?: boolean;
} & TngAiPartBase

export type TngAiFilePart = {
  readonly type: 'file';
  readonly fileId: string;
  readonly name: string;
  readonly mediaType: string;
  readonly size?: number;
  readonly url?: string;
  readonly previewUrl?: string;
} & TngAiPartBase

export type TngAiSourcePart = {
  readonly type: 'source';
  readonly sourceId: string;
  readonly title?: string;
  readonly url?: string;
  readonly mediaType?: string;
  readonly excerpt?: string;
} & TngAiPartBase

export type TngAiDataPart = {
  readonly type: 'data';
  readonly name: string;
  readonly value: TngAiJsonValue;
} & TngAiPartBase

export type TngAiActivityPart = {
  readonly type: 'activity';
  readonly name: string;
  readonly status: 'pending' | 'active' | 'complete' | 'failed';
  readonly description?: string;
  readonly data?: TngAiJsonValue;
} & TngAiPartBase

export type TngAiUiPart = {
  readonly type: 'ui';
  readonly protocol: 'a2ui' | 'mcp-app';
  readonly payload: TngAiJsonValue;
} & TngAiPartBase

export type TngAiExtensionPart = {
  readonly type: 'extension';
  readonly name: string;
  readonly value: TngAiJsonValue;
} & TngAiPartBase

export type TngAiUnsupportedPart = {
  readonly type: 'unsupported';
  readonly originalType: string;
  readonly value: TngAiJsonValue;
} & TngAiPartBase

export type TngAiMessagePart =
  | TngAiTextPart
  | TngAiReasoningPart
  | TngAiToolCallPart
  | TngAiToolResultPart
  | TngAiFilePart
  | TngAiSourcePart
  | TngAiDataPart
  | TngAiActivityPart
  | TngAiUiPart
  | TngAiExtensionPart
  | TngAiUnsupportedPart;
