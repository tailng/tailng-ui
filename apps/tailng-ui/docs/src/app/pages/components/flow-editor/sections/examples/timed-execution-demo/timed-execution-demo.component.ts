import { Component, computed, signal, type OnDestroy } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import { TngFlowEditorComponent, type TngFlowPresentation } from '@tailng-ui/flow';
import {
  timedExecutionConnectionIds,
  timedExecutionDefinition,
  timedExecutionNodeIds,
} from './timed-execution-workflow.data';

const handoffDelaySeconds = 3;

function createHandoffPresentation(activeConnectionIndex: number): TngFlowPresentation {
  return {
    nodes: Object.fromEntries(
      timedExecutionNodeIds.map((nodeId, nodeIndex) => [
        nodeId,
        nodeIndex <= activeConnectionIndex
          ? { status: 'completed', progress: 100 }
          : nodeIndex === activeConnectionIndex + 1
            ? {
                status: 'waiting',
                statusMessage: 'Waiting for the incoming handoff',
                highlighted: true,
              }
            : { status: 'idle', dimmed: true },
      ]),
    ),
    connections: Object.fromEntries(
      timedExecutionConnectionIds.map((connectionId, connectionIndex) => [
        connectionId,
        connectionIndex < activeConnectionIndex
          ? { status: 'success' }
          : connectionIndex === activeConnectionIndex
            ? {
                status: 'active',
                highlighted: true,
                motion: 'flow',
                motionSpeed: 'normal',
                motionDirection: 'forward',
              }
            : { status: 'idle', dimmed: true },
      ]),
    ),
  };
}

function createCompletedPresentation(): TngFlowPresentation {
  return {
    nodes: Object.fromEntries(
      timedExecutionNodeIds.map((nodeId) => [nodeId, { status: 'completed', progress: 100 }]),
    ),
    connections: Object.fromEntries(
      timedExecutionConnectionIds.map((connectionId) => [connectionId, { status: 'success' }]),
    ),
  };
}

@Component({
  selector: 'app-timed-execution-demo',
  imports: [TngButtonComponent, TngFlowEditorComponent],
  templateUrl: './timed-execution-demo.component.html',
  styleUrl: './timed-execution-demo.component.css',
})
export class TimedExecutionDemoComponent implements OnDestroy {
  protected readonly definition = timedExecutionDefinition;
  protected readonly presentation = signal<TngFlowPresentation>({});
  protected readonly activeConnectionIndex = signal<number | null>(null);
  protected readonly remainingSeconds = signal(0);
  protected readonly phase = signal<'idle' | 'running' | 'complete'>('idle');
  protected readonly isRunning = computed(() => this.phase() === 'running');
  protected readonly activeHandoff = computed(() => {
    const connectionIndex = this.activeConnectionIndex();
    if (connectionIndex === null) {
      return null;
    }
    const connection = this.definition.connections[connectionIndex];
    const source = this.definition.nodes.find((node) => node.id === connection.source.nodeId);
    const target = this.definition.nodes.find((node) => node.id === connection.target.nodeId);
    return source === undefined || target === undefined ? null : `${source.name} → ${target.name}`;
  });
  protected readonly statusMessage = signal(
    'Ready — every connection handoff will remain in progress for three seconds.',
  );
  private simulationTimer: ReturnType<typeof setInterval> | undefined;

  protected runSimulation(): void {
    if (this.isRunning()) {
      return;
    }
    this.stopTimer();
    this.phase.set('running');
    this.activeConnectionIndex.set(0);
    this.remainingSeconds.set(handoffDelaySeconds);
    this.presentation.set(createHandoffPresentation(0));
    this.updateRunningMessage();
    this.simulationTimer = setInterval(() => this.tickSimulation(), 1000);
  }

  protected resetSimulation(): void {
    this.stopTimer();
    this.phase.set('idle');
    this.activeConnectionIndex.set(null);
    this.remainingSeconds.set(0);
    this.presentation.set({});
    this.statusMessage.set(
      'Ready — every connection handoff will remain in progress for three seconds.',
    );
  }

  public ngOnDestroy(): void {
    this.stopTimer();
  }

  private tickSimulation(): void {
    const nextRemaining = this.remainingSeconds() - 1;
    if (nextRemaining > 0) {
      this.remainingSeconds.set(nextRemaining);
      this.updateRunningMessage();
      return;
    }
    this.advanceSimulation();
  }

  private advanceSimulation(): void {
    const activeConnectionIndex = this.activeConnectionIndex();
    if (
      activeConnectionIndex === null ||
      activeConnectionIndex >= timedExecutionConnectionIds.length - 1
    ) {
      this.stopTimer();
      this.phase.set('complete');
      this.activeConnectionIndex.set(null);
      this.remainingSeconds.set(0);
      this.presentation.set(createCompletedPresentation());
      this.statusMessage.set('Simulation complete — every workflow step finished successfully.');
      return;
    }
    const nextConnectionIndex = activeConnectionIndex + 1;
    this.activeConnectionIndex.set(nextConnectionIndex);
    this.remainingSeconds.set(handoffDelaySeconds);
    this.presentation.set(createHandoffPresentation(nextConnectionIndex));
    this.updateRunningMessage();
  }

  private updateRunningMessage(): void {
    this.statusMessage.set(
      `${this.activeHandoff() ?? 'Workflow handoff'} is in progress — next node in ${this.remainingSeconds()}s.`,
    );
  }

  private stopTimer(): void {
    if (this.simulationTimer !== undefined) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = undefined;
    }
  }
}
