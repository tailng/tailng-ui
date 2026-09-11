import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { TngFlowExecutionPayloadComponent } from './tng-flow-execution-payload.component';
import type { TngFlowExecutionPayload } from '../../model/tng-flow-execution.types';
import { TngFlowExecutionPayloadTemplateDirective } from '../../templates/tng-flow-execution-templates';

@Component({
  imports: [TngFlowExecutionPayloadComponent, TngFlowExecutionPayloadTemplateDirective],
  template: `
    <tng-flow-execution-payload [payload]="payload()" title="Result">
      <ng-template tngFlowExecutionPayload let-view="view">
        <strong data-testid="custom-payload">{{ view.title }}:{{ view.state }}</strong>
      </ng-template>
    </tng-flow-execution-payload>
  `,
})
class PayloadHost {
  public readonly payload = signal<TngFlowExecutionPayload | null | undefined>(undefined);
}

describe('TngFlowExecutionPayloadComponent', () => {
  it('renders custom payload templates with normalized view context', () => {
    const fixture = TestBed.createComponent(PayloadHost);
    fixture.componentInstance.payload.set({ state: 'redacted', reason: 'Hidden' });
    fixture.detectChanges();

    const custom = fixture.debugElement.query(By.css('[data-testid="custom-payload"]'));
    expect(custom.nativeElement.textContent.trim()).toBe('Result:redacted');
  });
});
