import { Component, computed, signal } from '@angular/core';
import { TngLineChartComponent, type TngChartData } from '@tailng-ui/charts';
import {
  TngAccordionComponent,
  TngAccordionItemComponent,
  TngAccordionPanelComponent,
  TngAccordionTriggerComponent,
  TngAutocompleteComponent,
  TngDateRangePickerComponent,
  TngProgressBarComponent,
  TngSliderComponent,
  TngStepperComponent,
  TngTabsComponent,
  type TngStepperStep,
} from '@tailng-ui/components';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';

const previewStyles = `
  :host { display: block; min-width: 0; }
  .preview-shell { display: grid; gap: 0.55rem; min-width: 0; }
  .preview-label { color: var(--tng-semantic-foreground-secondary); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
  .preview-value { font-size: 0.8rem; margin: 0; }
`;

type Assignee = Readonly<{ id: string; name: string; team: string }>;

const assignees: readonly Assignee[] = Object.freeze([
  Object.freeze({ id: 'sofia', name: 'Sofia Reyes', team: 'Design' }),
  Object.freeze({ id: 'liam', name: 'Liam Chen', team: 'Platform' }),
  Object.freeze({ id: 'noah', name: 'Noah Park', team: 'Growth' }),
  Object.freeze({ id: 'ava', name: 'Ava Patel', team: 'Quality' }),
]);

const adoptionData: TngChartData = [
  { week: 'W1', teams: 12 },
  { week: 'W2', teams: 18 },
  { week: 'W3', teams: 25 },
  { week: 'W4', teams: 31 },
  { week: 'W5', teams: 39 },
  { week: 'W6', teams: 48 },
];

@Component({
  selector: 'app-component-assistant-project-range-preview',
  imports: [TngDateRangePickerComponent],
  template: `
    <section class="preview-shell" aria-label="Project date range preview">
      <span class="preview-label">Project window</span>
      <tng-date-range-picker
        [defaultValue]="{ start: '2026-02-02', end: '2026-02-20' }"
        [today]="'2026-02-02'"
        [fullWidth]="true"
        calendarLayout="single"
        ariaLabel="Choose the project date range"
      />
    </section>
  `,
  styles: [previewStyles],
})
export class ComponentAssistantProjectRangePreviewComponent {}

@Component({
  selector: 'app-component-assistant-assignee-preview',
  imports: [TngAutocompleteComponent],
  template: `
    <section class="preview-shell" aria-label="Assignee autocomplete preview">
      <span class="preview-label">Assignee</span>
      <tng-autocomplete
        [options]="filteredAssignees()"
        [query]="query()"
        (queryChange)="query.set($event)"
        [getOptionValue]="getAssigneeValue"
        [getOptionLabel]="getAssigneeLabel"
        placeholder="Search teammates…"
        ariaLabel="Choose an assignee"
      />
    </section>
  `,
  styles: [previewStyles],
})
export class ComponentAssistantAssigneePreviewComponent {
  protected readonly query = signal('');
  protected readonly filteredAssignees = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    return query.length === 0
      ? assignees
      : assignees.filter(
          ({ name, team }) =>
            name.toLocaleLowerCase().includes(query) || team.toLocaleLowerCase().includes(query),
        );
  });
  protected readonly getAssigneeValue = (assignee: Assignee): string => assignee.id;
  protected readonly getAssigneeLabel = (assignee: Assignee): string =>
    `${assignee.name} · ${assignee.team}`;
}

@Component({
  selector: 'app-component-assistant-rollout-preview',
  imports: [TngSliderComponent],
  template: `
    <section class="preview-shell" aria-label="Rollout percentage preview">
      <span class="preview-label">Rollout</span>
      <tng-slider
        [min]="0"
        [max]="100"
        [step]="5"
        [value]="rollout()"
        (valueChange)="rollout.set($event)"
        aria-label="Release rollout percentage"
        [ariaValueText]="rollout() + ' percent'"
      />
      <p class="preview-value" aria-live="polite">{{ rollout() }}% of users</p>
    </section>
  `,
  styles: [previewStyles],
})
export class ComponentAssistantRolloutPreviewComponent {
  protected readonly rollout = signal(60);
}

@Component({
  selector: 'app-component-assistant-adoption-preview',
  imports: [TngLineChartComponent],
  template: `
    <figure class="preview-shell" aria-label="Weekly TailNG adoption from week one to week six">
      <figcaption class="preview-label">Weekly adoption</figcaption>
      <tng-line-chart
        [data]="data"
        xField="week"
        yField="teams"
        [height]="180"
        [legend]="false"
        smooth
      />
      <p class="preview-value">Adoption grows from 12 to 48 teams.</p>
    </figure>
  `,
  styles: [previewStyles, ':host figure { margin: 0; }'],
})
export class ComponentAssistantAdoptionPreviewComponent {
  protected readonly data = adoptionData;
}

@Component({
  selector: 'app-component-assistant-faq-preview',
  imports: [
    TngAccordionComponent,
    TngAccordionItemComponent,
    TngAccordionPanelComponent,
    TngAccordionTriggerComponent,
  ],
  template: `
    <section class="preview-shell" aria-label="Release FAQ preview">
      <span class="preview-label">Release FAQ</span>
      <tng-accordion ariaLabel="Release questions" [defaultValue]="'testing'">
        <tng-accordion-item value="testing">
          <tng-accordion-trigger>What testing is required?</tng-accordion-trigger>
          <tng-accordion-panel
            >Unit, browser, and accessibility checks must pass.</tng-accordion-panel
          >
        </tng-accordion-item>
        <tng-accordion-item value="approval">
          <tng-accordion-trigger>Who approves the release?</tng-accordion-trigger>
          <tng-accordion-panel
            >The package owner and release manager approve it.</tng-accordion-panel
          >
        </tng-accordion-item>
        <tng-accordion-item value="rollback">
          <tng-accordion-trigger>How do we roll back?</tng-accordion-trigger>
          <tng-accordion-panel>Promote the last verified package version.</tng-accordion-panel>
        </tng-accordion-item>
      </tng-accordion>
    </section>
  `,
  styles: [previewStyles],
})
export class ComponentAssistantFaqPreviewComponent {}

@Component({
  selector: 'app-component-assistant-tabs-preview',
  imports: [TngTabsComponent, TngTabList, TngTab, TngTabPanel],
  template: `
    <section class="preview-shell" aria-label="Release settings tabs preview">
      <span class="preview-label">Release settings</span>
      <tng-tabs ariaLabel="Release settings" defaultValue="channel">
        <div tngTabList ariaLabel="Release settings sections">
          <button type="button" tngTab value="channel">Channel</button>
          <button type="button" tngTab value="quality">Quality</button>
          <button type="button" tngTab value="notify">Notify</button>
        </div>
        <section tngTabPanel value="channel">Publish to the next channel.</section>
        <section tngTabPanel value="quality">Require all checks to pass.</section>
        <section tngTabPanel value="notify">Notify package subscribers.</section>
      </tng-tabs>
    </section>
  `,
  styles: [previewStyles],
})
export class ComponentAssistantTabsPreviewComponent {}

const releaseSteps: readonly TngStepperStep[] = Object.freeze([
  Object.freeze({
    value: 'draft',
    label: 'Draft',
    description: 'Changes prepared',
    completed: true,
  }),
  Object.freeze({ value: 'review', label: 'Review', description: 'Checks running' }),
  Object.freeze({ value: 'publish', label: 'Publish', description: 'Package release' }),
]);

@Component({
  selector: 'app-component-assistant-stepper-preview',
  imports: [TngStepperComponent],
  template: `
    <section class="preview-shell" aria-label="Release workflow stepper preview">
      <span class="preview-label">Release workflow</span>
      <tng-stepper
        ariaLabel="Release workflow"
        orientation="vertical"
        defaultValue="review"
        [steps]="steps"
      />
    </section>
  `,
  styles: [previewStyles],
})
export class ComponentAssistantStepperPreviewComponent {
  protected readonly steps = releaseSteps;
}

@Component({
  selector: 'app-component-assistant-progress-preview',
  imports: [TngProgressBarComponent],
  template: `
    <section class="preview-shell" aria-label="Release progress preview">
      <span class="preview-label">Release progress</span>
      <tng-progress-bar
        [value]="72"
        ariaLabel="Release progress"
        ariaValueText="72 percent complete"
      />
      <p class="preview-value">72% complete</p>
    </section>
  `,
  styles: [previewStyles],
})
export class ComponentAssistantProgressPreviewComponent {}
