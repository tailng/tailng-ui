import type { TngAiError, TngAiFinishReason, TngAiUsage } from './error.types';
import type { TngAiJsonValue } from './json.types';
import type { TngAiMessagePart } from './message-part.types';

export type TngAiThread = {
  readonly id: string;
  readonly title?: string;
  readonly createdAt?: number;
  readonly updatedAt?: number;
  readonly metadata?: Readonly<Record<string, TngAiJsonValue>>;
}

export type TngAiRunStatus =
  | 'idle'
  | 'queued'
  | 'running'
  | 'awaiting-input'
  | 'complete'
  | 'cancelled'
  | 'failed';

export type TngAiRun = {
  readonly id: string;
  readonly threadId: string;
  readonly parentRunId?: string;
  readonly status: TngAiRunStatus;
  readonly startedAt?: number;
  readonly finishedAt?: number;
  readonly error?: TngAiError;
  readonly usage?: TngAiUsage;
  readonly metadata?: Readonly<Record<string, TngAiJsonValue>>;
}

export type TngAiRole =
  | 'developer'
  | 'system'
  | 'assistant'
  | 'user'
  | 'tool'
  | 'activity'
  | 'reasoning';

export type TngAiMessageStatus =
  | 'queued'
  | 'sending'
  | 'streaming'
  | 'complete'
  | 'stopped'
  | 'failed';

export type TngAiAuthor = {
  readonly id?: string;
  readonly name?: string;
  readonly avatarUrl?: string;
  readonly metadata?: Readonly<Record<string, TngAiJsonValue>>;
}

export type TngAiMessage = {
  readonly id: string;
  readonly threadId: string;
  readonly runId?: string;
  readonly parentMessageId?: string;
  readonly role: TngAiRole;
  readonly status: TngAiMessageStatus;
  readonly parts: readonly TngAiMessagePart[];
  readonly author?: TngAiAuthor;
  readonly createdAt?: number;
  readonly updatedAt?: number;
  readonly finishReason?: TngAiFinishReason;
  readonly error?: TngAiError;
  readonly metadata?: Readonly<Record<string, TngAiJsonValue>>;
}
