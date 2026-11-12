import { InjectionToken, type Provider, type Signal, type Type } from '@angular/core';
import type { TngAiJsonValue } from '../core/json.types';
import type { TngAiMessagePart } from '../core/message-part.types';
import type { TngAiMessage } from '../core/message.types';

export type TngAiChatHeaderContext = Readonly<{
  assistantLabel: Signal<string>;
  busy: Signal<boolean>;
  protocolLabel: Signal<string | null>;
  status: Signal<string>;
  subtitle: Signal<string | null>;
  title: Signal<string>;
}>;

export type TngAiChatHeaderComponent = Type<unknown>;

export type TngAiMessagePartRenderer = Readonly<{
  component: Type<unknown>;
  match: Readonly<{
    name?: string;
    type: TngAiMessagePart['type'];
  }>;
}>;

export type TngAiMessagePartAction = Readonly<{
  name: string;
  value?: TngAiJsonValue;
}>;

export type TngAiChatPartActionEvent = Readonly<{
  action: TngAiMessagePartAction;
  messageId: string;
  partId: string;
}>;

export type TngAiMessagePartContext = Readonly<{
  disabled: Signal<boolean>;
  emitAction: (action: TngAiMessagePartAction) => void;
  message: Signal<TngAiMessage>;
  part: Signal<TngAiMessagePart>;
  readonly: Signal<boolean>;
}>;

export type TngAiChatSubmitEvent = Readonly<{
  text: string;
}>;

export type TngAiChatRetryRequest = Readonly<{
  messageId?: string;
}>;

export type TngAiChatLoadEarlierRequest = Readonly<{
  beforeMessageId?: string;
}>;

export type TngAiChatScrollState = Readonly<{
  following: boolean;
  nearBottom: boolean;
  unseenCount: number;
}>;

export type TngAiChatMessageContext = Readonly<{
  message: TngAiMessage;
}>;

export const TNG_AI_CHAT_HEADER_CONTEXT = new InjectionToken<TngAiChatHeaderContext>(
  'TNG_AI_CHAT_HEADER_CONTEXT',
);

export const TNG_AI_MESSAGE_PART_CONTEXT = new InjectionToken<TngAiMessagePartContext>(
  'TNG_AI_MESSAGE_PART_CONTEXT',
);

export const TNG_AI_MESSAGE_PART_RENDERERS = new InjectionToken<
  readonly TngAiMessagePartRenderer[]
>('TNG_AI_MESSAGE_PART_RENDERERS');

export function provideTngAiMessagePartRenderer(renderer: TngAiMessagePartRenderer): Provider {
  return {
    provide: TNG_AI_MESSAGE_PART_RENDERERS,
    multi: true,
    useValue: renderer,
  };
}
