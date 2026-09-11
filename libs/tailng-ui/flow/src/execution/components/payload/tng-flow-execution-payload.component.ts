import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChild, input } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { formatTngFlowExecutionPayload } from '../../model/tng-flow-execution.model';
import type { TngFlowExecutionPayload } from '../../model/tng-flow-execution.types';
import {
  TngFlowExecutionPayloadTemplateDirective,
  type TngFlowExecutionPayloadTemplateContext,
} from '../../templates/tng-flow-execution-templates';

@Component({
  selector: 'tng-flow-execution-payload',
  imports: [NgTemplateOutlet, TngCodeBlockComponent],
  templateUrl: './tng-flow-execution-payload.component.html',
  styleUrl: './tng-flow-execution-payload.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tng-flow-execution-payload',
    '[attr.data-state]': 'payloadView().state',
  },
})
export class TngFlowExecutionPayloadComponent<TPayload = unknown> {
  public readonly payload = input<TngFlowExecutionPayload<TPayload> | null | undefined>(undefined);
  public readonly title = input<string>('Payload');
  public readonly copy = input<boolean>(true);
  public readonly maxHeight = input<string | number | null>('24rem');

  protected readonly customTemplate = contentChild(
    TngFlowExecutionPayloadTemplateDirective<TPayload>,
  );

  protected readonly payloadView = computed(() =>
    formatTngFlowExecutionPayload(this.payload(), this.title()),
  );

  protected readonly templateContext = computed<TngFlowExecutionPayloadTemplateContext<TPayload>>(
    () => ({
      $implicit: this.payload(),
      payload: this.payload(),
      view: this.payloadView(),
      title: this.title(),
    }),
  );
}
