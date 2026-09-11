import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TngProgressBarComponent, TngCardComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons/core';
import { resolveTngFlowValidationSeverity } from '../model/tng-flow-issue-index';
import type { TngFlowProgressDisplayMode } from '../types/tng-flow-presentation.types';
import type {
  TngFlowValidationIssue,
  TngFlowValidationSeverity,
} from '../types/tng-flow-validation.types';
import { TngFlowValidationBadgeComponent } from '../validation-badge/tng-flow-validation-badge.component';

export type TngFlowStatusTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';

export type TngFlowNodeProgressState = Readonly<{
  indeterminate: boolean;
  value: number;
  visible: boolean;
}>;

const statusTones: Readonly<Record<string, TngFlowStatusTone>> = {
  'awaiting-input': 'warning',
  cancelled: 'danger',
  completed: 'success',
  failed: 'danger',
  paused: 'warning',
  retrying: 'info',
  running: 'info',
  waiting: 'warning',
};

export function resolveTngFlowStatusTone(status: string): TngFlowStatusTone {
  return statusTones[status] ?? 'neutral';
}

export function resolveTngFlowNodeProgressState(
  status: string,
  progress: number | null,
  progressSpecified: boolean,
  displayMode: TngFlowProgressDisplayMode,
): TngFlowNodeProgressState {
  if (displayMode === 'status-driven') {
    if (status === 'completed') {
      return { indeterminate: false, value: 100, visible: true };
    }
    if (status === 'running') {
      return { indeterminate: true, value: 0, visible: true };
    }

    return { indeterminate: false, value: 0, visible: true };
  }

  return {
    indeterminate: progress === null,
    value: normalizeProgress(progress),
    visible: progressSpecified || progress !== null,
  };
}

function normalizeProgress(progress: number | null): number {
  if (progress === null || !Number.isFinite(progress)) {
    return 0;
  }

  return Math.min(100, Math.max(0, progress));
}

@Component({
  selector: 'tng-flow-node',
  imports: [TngCardComponent, TngFlowValidationBadgeComponent, TngIcon, TngProgressBarComponent],
  templateUrl: './tng-flow-node.component.html',
  styleUrl: './tng-flow-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-selected]': "selected() ? '' : null",
    '[attr.data-disabled]': "disabled() ? '' : null",
    '[attr.data-locked]': "locked() ? '' : null",
    '[attr.data-status]': 'status()',
    '[attr.data-validation]': 'resolvedValidationSeverity()',
    '[attr.aria-invalid]': "resolvedValidationSeverity() === 'error' ? 'true' : null",
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
  },
})
export class TngFlowNodeComponent {
  public readonly name = input.required<string>();
  public readonly description = input<string | null>(null);
  public readonly icon = input<string | null>(null);
  public readonly status = input<string>('idle');
  public readonly progress = input<number | null>(null);
  public readonly progressSpecified = input(false);
  public readonly progressDisplayMode = input<TngFlowProgressDisplayMode>('status-driven');
  public readonly selected = input(false);
  public readonly disabled = input(false);
  public readonly locked = input(false);
  /** @deprecated Supply validation issues instead. */
  public readonly invalid = input(false);
  public readonly validationSeverity = input<TngFlowValidationSeverity | null>(null);
  public readonly validationIssues = input<readonly TngFlowValidationIssue[]>([]);
  public readonly statusMessage = input<string | null>(null);
  /** @deprecated Use `statusMessage`. */
  public readonly message = input<string | null>(null);
  public readonly issueActivated = output<TngFlowValidationIssue>();

  protected readonly statusTone = computed<TngFlowStatusTone>(() =>
    resolveTngFlowStatusTone(this.status()),
  );
  protected readonly resolvedValidationSeverity = computed(
    () =>
      resolveTngFlowValidationSeverity(this.validationIssues()) ??
      this.validationSeverity() ??
      (this.invalid() ? 'error' : null),
  );
  protected readonly resolvedStatusMessage = computed(() => this.statusMessage() ?? this.message());
  protected readonly progressState = computed<TngFlowNodeProgressState>(() =>
    resolveTngFlowNodeProgressState(
      this.status(),
      this.progress(),
      this.progressSpecified(),
      this.progressDisplayMode(),
    ),
  );
  protected readonly completedProgressMessage = computed<string | null>(() =>
    this.status() === 'completed'
      ? (this.resolvedStatusMessage() ?? 'Completed successfully')
      : null,
  );
  protected readonly showStandaloneStatusMessage = computed(
    () => this.resolvedStatusMessage() !== null && this.completedProgressMessage() === null,
  );
  protected readonly progressAriaValueText = computed<string | null>(() => {
    const message = this.completedProgressMessage();
    return message === null ? null : `${message.replace(/[.!?]+$/, '')}, 100%`;
  });

  protected activateIssue(issue: TngFlowValidationIssue): void {
    this.issueActivated.emit(issue);
  }
}
