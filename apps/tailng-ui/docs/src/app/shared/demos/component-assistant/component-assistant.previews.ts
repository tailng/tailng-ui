import { Component, computed, input, signal, type Signal } from '@angular/core';
import type { TngTableSortDirection } from '@tailng-ui/cdk';
import { TngBarChartComponent, type TngChartData } from '@tailng-ui/charts';
import {
  TngDatepickerComponent,
  TngTableComponent,
  TngTag,
  type TngTableColumn,
} from '@tailng-ui/components';
import type { TngTableSortChange } from '@tailng-ui/primitives';
import {
  ComponentAssistantAdoptionPreviewComponent,
  ComponentAssistantAssigneePreviewComponent,
  ComponentAssistantFaqPreviewComponent,
  ComponentAssistantProgressPreviewComponent,
  ComponentAssistantProjectRangePreviewComponent,
  ComponentAssistantRolloutPreviewComponent,
  ComponentAssistantStepperPreviewComponent,
  ComponentAssistantTabsPreviewComponent,
} from './component-assistant-expanded.previews';
import type { ComponentAssistantPreviewId } from './component-assistant.catalog';

type TeamRow = Readonly<{
  name: string;
  role: string;
  team: string;
}>;

const TEAM_ROWS: readonly TeamRow[] = [
  { name: 'Sofia Reyes', role: 'Product Designer', team: 'Design' },
  { name: 'Liam Chen', role: 'Frontend Engineer', team: 'Platform' },
  { name: 'Noah Park', role: 'Product Manager', team: 'Growth' },
];

const TEAM_COLUMNS: readonly TngTableColumn<TeamRow>[] = [
  { id: 'name', label: 'Name', accessor: 'name', sortable: true },
  { id: 'role', label: 'Role', accessor: 'role', sortable: true },
  { id: 'team', label: 'Team', accessor: 'team', sortable: true },
];

const INSTALL_DATA: TngChartData = [
  { month: 'Jan', installs: 11 },
  { month: 'Feb', installs: 18 },
  { month: 'Mar', installs: 27 },
  { month: 'Apr', installs: 36 },
  { month: 'May', installs: 49 },
  { month: 'Jun', installs: 64 },
];

@Component({
  selector: 'app-component-assistant-release-date-preview',
  imports: [TngDatepickerComponent],
  template: `
    <section class="preview-card" aria-label="Release date picker preview">
      <span class="preview-label">Release date</span>
      <tng-datepicker
        [defaultValue]="'2026-01-15'"
        [fullWidth]="true"
        ariaLabel="Choose the planned release date"
      />
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .preview-card {
        display: grid;
        gap: 0.55rem;
        min-width: min(18rem, 100%);
      }
      .preview-label {
        color: var(--tng-semantic-foreground-secondary);
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
      }
    `,
  ],
})
export class ComponentAssistantReleaseDatePreviewComponent {}

@Component({
  selector: 'app-component-assistant-installs-preview',
  imports: [TngBarChartComponent],
  template: `
    <figure class="preview-chart" aria-label="Monthly TailNG installs from January to June">
      <figcaption>Monthly installs</figcaption>
      <tng-bar-chart
        [data]="data"
        xField="month"
        yField="installs"
        [height]="180"
        [legend]="false"
      />
    </figure>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
        width: min(28rem, 100%);
      }
      .preview-chart {
        margin: 0;
        min-width: 0;
      }
      figcaption {
        color: var(--tng-semantic-foreground-secondary);
        font-size: 0.75rem;
        font-weight: 700;
        margin-bottom: 0.35rem;
        text-transform: uppercase;
      }
    `,
  ],
})
export class ComponentAssistantInstallsPreviewComponent {
  protected readonly data = INSTALL_DATA;
}

@Component({
  selector: 'app-component-assistant-team-preview',
  imports: [TngTableComponent],
  template: `
    <section class="preview-table" aria-label="Sortable team table preview">
      <tng-table
        [columns]="columns"
        [items]="sortedRows()"
        [sortActive]="sortActive()"
        [sortDirection]="sortDirection()"
        (sortChange)="onSortChange($event)"
        ariaLabel="TailNG team members"
        density="compact"
      />
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
        width: min(34rem, 100%);
      }
      .preview-table {
        max-width: 100%;
        overflow-x: auto;
      }
    `,
  ],
})
export class ComponentAssistantTeamPreviewComponent {
  protected readonly columns = TEAM_COLUMNS;
  protected readonly sortActive = signal<string | null>(null);
  protected readonly sortDirection = signal<TngTableSortDirection | null>(null);
  protected readonly sortedRows: Signal<readonly TeamRow[]> = computed(() => {
    const active = this.sortActive();
    const direction = this.sortDirection();
    if (active === null || direction === null) {
      return TEAM_ROWS;
    }
    return [...TEAM_ROWS].sort((left, right) => {
      const leftValue = String(left[active as keyof TeamRow]).toLocaleLowerCase();
      const rightValue = String(right[active as keyof TeamRow]).toLocaleLowerCase();
      const result = leftValue.localeCompare(rightValue);
      return direction === 'asc' ? result : -result;
    });
  });

  protected onSortChange(change: TngTableSortChange): void {
    this.sortActive.set(change.activeColumnId);
    this.sortDirection.set(change.direction);
  }
}

@Component({
  selector: 'app-component-assistant-status-preview',
  imports: [TngTag],
  template: `
    <section class="preview-status" aria-label="Release status tag preview">
      <tng-tag label="Draft" tone="neutral" appearance="outline" />
      <tng-tag label="Beta" tone="warning" appearance="soft" />
      <tng-tag label="Stable" tone="success" appearance="solid" />
      <tng-tag label="Deprecated" tone="danger" appearance="outline" />
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .preview-status {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
    `,
  ],
})
export class ComponentAssistantStatusPreviewComponent {}

@Component({
  selector: 'app-component-assistant-preview',
  imports: [
    ComponentAssistantReleaseDatePreviewComponent,
    ComponentAssistantInstallsPreviewComponent,
    ComponentAssistantTeamPreviewComponent,
    ComponentAssistantStatusPreviewComponent,
    ComponentAssistantProjectRangePreviewComponent,
    ComponentAssistantAssigneePreviewComponent,
    ComponentAssistantRolloutPreviewComponent,
    ComponentAssistantAdoptionPreviewComponent,
    ComponentAssistantFaqPreviewComponent,
    ComponentAssistantTabsPreviewComponent,
    ComponentAssistantStepperPreviewComponent,
    ComponentAssistantProgressPreviewComponent,
  ],
  template: `
    @switch (previewId()) {
      @case ('release-date') {
        <app-component-assistant-release-date-preview />
      }
      @case ('monthly-installs') {
        <app-component-assistant-installs-preview />
      }
      @case ('team-table') {
        <app-component-assistant-team-preview />
      }
      @case ('release-status') {
        <app-component-assistant-status-preview />
      }
      @case ('project-date-range') {
        <app-component-assistant-project-range-preview />
      }
      @case ('assignee-search') {
        <app-component-assistant-assignee-preview />
      }
      @case ('rollout-slider') {
        <app-component-assistant-rollout-preview />
      }
      @case ('adoption-trend') {
        <app-component-assistant-adoption-preview />
      }
      @case ('release-faq') {
        <app-component-assistant-faq-preview />
      }
      @case ('release-tabs') {
        <app-component-assistant-tabs-preview />
      }
      @case ('release-steps') {
        <app-component-assistant-stepper-preview />
      }
      @case ('release-progress') {
        <app-component-assistant-progress-preview />
      }
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ComponentAssistantPreviewComponent {
  public readonly previewId = input.required<ComponentAssistantPreviewId>();
}
