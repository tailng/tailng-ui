import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { resolveTngFlowValidationSeverity } from '../model/tng-flow-issue-index';
import type {
  TngFlowValidationIssue,
  TngFlowValidationSeverity,
} from '../types/tng-flow-validation.types';

@Component({
  selector: 'tng-flow-validation-badge',
  templateUrl: './tng-flow-validation-badge.component.html',
  styleUrl: './tng-flow-validation-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-severity]': 'resolvedSeverity()',
    '[attr.data-count]': 'issues().length',
  },
})
export class TngFlowValidationBadgeComponent {
  public readonly severity = input<TngFlowValidationSeverity | null>(null);
  public readonly issues = input.required<readonly TngFlowValidationIssue[]>();
  public readonly issueActivated = output<TngFlowValidationIssue>();

  protected readonly resolvedSeverity = computed<TngFlowValidationSeverity | null>(
    () => resolveTngFlowValidationSeverity(this.issues()) ?? this.severity(),
  );
  protected readonly symbol = computed(() => {
    switch (this.resolvedSeverity()) {
      case 'error':
        return '!';
      case 'warning':
        return '▲';
      case 'info':
        return 'i';
      case null:
        return '';
    }
  });
  protected readonly summary = computed(() => {
    const counts: Record<TngFlowValidationSeverity, number> = {
      error: 0,
      warning: 0,
      info: 0,
    };
    for (const issue of this.issues()) {
      counts[issue.severity] += 1;
    }
    return (Object.keys(counts) as TngFlowValidationSeverity[])
      .filter((severity) => counts[severity] > 0)
      .map((severity) => {
        const count = counts[severity];
        return `${count} validation ${severity}${count === 1 ? '' : 's'}`;
      })
      .join(', ');
  });

  protected activateIssue(event: MouseEvent, issue: TngFlowValidationIssue): void {
    event.stopPropagation();
    const details = (event.currentTarget as HTMLElement | null)?.closest('details');
    if (details !== null && details !== undefined) {
      details.open = false;
    }
    this.issueActivated.emit(issue);
  }

  protected stopPointerEvent(event: Event): void {
    event.stopPropagation();
  }
}
