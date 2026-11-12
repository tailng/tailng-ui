import { NgComponentOutlet } from '@angular/common';
import { Component, inject, Injector, input, output, type Type } from '@angular/core';
import type { TngAiChatPartActionEvent } from './tng-ai-chat.types';
import {
  TNG_AI_MESSAGE_PART_CONTEXT,
  type TngAiMessagePartAction,
  type TngAiMessagePartContext,
} from './tng-ai-chat.types';
import type { TngAiMessagePart } from '../core/message-part.types';
import type { TngAiMessage } from '../core/message.types';

@Component({
  selector: 'tng-ai-chat-part-outlet',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="component(); injector: rendererInjector" />`,
})
export class TngAiChatPartOutletComponent {
  public readonly component = input.required<Type<unknown>>();
  public readonly message = input.required<TngAiMessage>();
  public readonly part = input.required<TngAiMessagePart>();
  public readonly disabled = input<boolean>(false);
  public readonly readonlyState = input<boolean>(false);
  public readonly partAction = output<TngAiChatPartActionEvent>();

  protected readonly context: TngAiMessagePartContext = {
    disabled: this.disabled,
    emitAction: (action) => this.emitAction(action),
    message: this.message,
    part: this.part,
    readonly: this.readonlyState,
  };
  protected readonly rendererInjector = Injector.create({
    providers: [{ provide: TNG_AI_MESSAGE_PART_CONTEXT, useValue: this.context }],
    parent: inject(Injector),
  });

  private emitAction(action: TngAiMessagePartAction): void {
    this.partAction.emit({
      action,
      messageId: this.message().id,
      partId: this.part().id,
    });
  }
}
