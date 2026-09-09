import { timedExecutionDefinition } from './timed-execution-workflow.data';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';

const componentCode = `import { Component, computed, signal, type OnDestroy } from '@angular/core';
import { TngFlowEditorComponent, type TngFlowPresentation } from '@tailng-ui/flow';
import { workflow } from './timed-workflow.data';

const nodeIds = ['receive', 'validate', 'approve', 'notify'] as const;
const connectionIds = [
  'receive-to-validate',
  'validate-to-approve',
  'approve-to-notify',
] as const;

@Component({
  selector: 'app-timed-execution',
  imports: [TngFlowEditorComponent],
  templateUrl: './timed-execution.component.html',
})
export class TimedExecutionComponent implements OnDestroy {
  readonly definition = workflow;
  readonly presentation = signal<TngFlowPresentation>({});
  readonly activeConnectionIndex = signal<number | null>(null);
  readonly remainingSeconds = signal(0);
  readonly running = computed(() => this.activeConnectionIndex() !== null);
  private timer: ReturnType<typeof setInterval> | undefined;

  runSimulation(): void {
    if (this.running()) return;
    this.activeConnectionIndex.set(0);
    this.remainingSeconds.set(3);
    this.presentation.set(this.presentationFor(0));
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private tick(): void {
    const remaining = this.remainingSeconds() - 1;
    if (remaining > 0) {
      this.remainingSeconds.set(remaining);
      return;
    }

    const current = this.activeConnectionIndex();
    if (current === null || current === connectionIds.length - 1) {
      this.stopTimer();
      this.activeConnectionIndex.set(null);
      this.remainingSeconds.set(0);
      this.presentation.set({
        nodes: Object.fromEntries(nodeIds.map((id) => [id, { status: 'completed' }])),
        connections: Object.fromEntries(
          connectionIds.map((id) => [id, { status: 'success' }]),
        ),
      });
      return;
    }

    const next = current + 1;
    this.activeConnectionIndex.set(next);
    this.remainingSeconds.set(3);
    this.presentation.set(this.presentationFor(next));
  }

  private presentationFor(activeIndex: number): TngFlowPresentation {
    return {
      nodes: Object.fromEntries(
        nodeIds.map((id, index) => [
          id,
          index <= activeIndex
            ? { status: 'completed' }
            : index === activeIndex + 1
              ? { status: 'waiting', highlighted: true }
              : { status: 'idle', dimmed: true },
        ]),
      ),
      connections: Object.fromEntries(
        connectionIds.map((id, index) => [
          id,
          index < activeIndex
            ? { status: 'success' }
            : index === activeIndex
              ? { status: 'active', motion: 'flow' }
              : { status: 'idle', dimmed: true },
        ]),
      ),
    };
  }

  private stopTimer(): void {
    if (this.timer !== undefined) clearInterval(this.timer);
    this.timer = undefined;
  }
}`;

const markupCode = `<div class="timed-execution-toolbar">
  <button type="button" [disabled]="running()" (click)="runSimulation()">
    {{ running() ? 'Simulation running…' : 'Run simulation' }}
  </button>
  @if (running()) {
    <span aria-live="polite">
      Connection in progress — next node in {{ remainingSeconds() }}s
    </span>
  }
</div>

<tng-flow-editor
  flowId="timed-execution"
  ariaLabel="Automatic timed workflow simulation"
  [definition]="definition"
  [presentation]="presentation()"
  mode="inspect"
  [showSelectionArea]="false"
/>`;

const cssCode = `.timed-execution-toolbar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

tng-flow-editor {
  display: block;
  height: 30rem;
  min-height: 26rem;
}`;

const dataCode = `import type { TngFlowDefinition } from '@tailng-ui/flow';

export const workflow: TngFlowDefinition = ${JSON.stringify(timedExecutionDefinition, null, 2)};`;

export const timedExecutionDemoCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
  {
    value: 'ts',
    label: 'TS',
    language: 'ts',
    title: 'timed-execution.component.ts',
    code: componentCode,
  },
  {
    value: 'html',
    label: 'HTML',
    language: 'html',
    title: 'timed-execution.component.html',
    code: markupCode,
  },
  {
    value: 'css',
    label: 'CSS',
    language: 'css',
    title: 'timed-execution.component.css',
    code: cssCode,
  },
  {
    value: 'data',
    label: 'Data',
    language: 'ts',
    title: 'timed-workflow.data.ts',
    code: dataCode,
  },
]);
