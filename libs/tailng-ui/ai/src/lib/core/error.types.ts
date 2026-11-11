import type { TngAiJsonValue } from './json.types';

export type TngAiError = {
  readonly code: string;
  readonly message: string;
  readonly retryable?: boolean;
  readonly details?: TngAiJsonValue;
}

export type TngAiFinishReason =
  | 'stop'
  | 'length'
  | 'content-filter'
  | 'tool-calls'
  | 'cancelled'
  | 'error'
  | 'other';

export type TngAiUsage = {
  readonly inputTokens?: number;
  readonly outputTokens?: number;
  readonly totalTokens?: number;
  readonly cachedInputTokens?: number;
  readonly metadata?: Readonly<Record<string, TngAiJsonValue>>;
}
