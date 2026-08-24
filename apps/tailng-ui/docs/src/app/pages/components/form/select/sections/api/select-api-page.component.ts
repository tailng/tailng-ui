import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

type ApiRow = {
  readonly name: string;
  readonly type: string;
  readonly details: string;
};

const WRAPPER_ATTACHMENT_CODE = String.raw`<tng-select
  [options]="workflowStages"
  [value]="selectedStage()"
  (valueChange)="onSelectedStageChange($event)"
  [getOptionValue]="getWorkflowStageValue"
  [getOptionLabel]="getWorkflowStageLabel"
  [isOptionDisabled]="isWorkflowStageDisabled"
  placeholder="Choose workflow stage"
  [ariaLabel]="'Workflow stage'"
></tng-select>`;

const ACCESSOR_CODE = String.raw`interface WorkflowStageOption {
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly disabled?: boolean;
}

readonly getWorkflowStageValue = (stage: WorkflowStageOption) => stage.value;
readonly getWorkflowStageLabel = (stage: WorkflowStageOption) => stage.label;
readonly isWorkflowStageDisabled = (stage: WorkflowStageOption) => stage.disabled === true;
readonly trackWorkflowStage = (_index: number, stage: WorkflowStageOption) => stage.value;`;

const TEMPLATE_HOOK_CODE = String.raw`<tng-select
  [options]="releaseOwners"
  [value]="selectedOwner()"
  (valueChange)="onSelectedOwnerChange($event)"
  [getOptionValue]="getOwnerValue"
  [getOptionLabel]="getOwnerLabel"
>
  <ng-template #tngSelectValueTpl let-selected>
    <div>
      <strong>{{ selected.label }}</strong>
      <small>{{ selected.option?.team }}</small>
    </div>
  </ng-template>

  <ng-template #tngSelectOptionTpl let-option>
    <div>
      <strong>{{ option.label }}</strong>
      <small>{{ option.option.team }}</small>
    </div>
  </ng-template>
</tng-select>`;

const SIGNAL_FORMS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TngSelectComponent } from '@tailng-ui/components';

type ReleaseOwner = {
  readonly id: string;
  readonly label: string;
};

@Component({
  selector: 'app-release-owner-signal-form',
  standalone: true,
  imports: [FormField, TngSelectComponent],
  template: \`
    <tng-select
      [formField]="releaseForm.owner"
      [options]="owners"
      [getOptionValue]="getOwnerValue"
      [getOptionLabel]="getOwnerLabel"
      placeholder="Choose release owner"
      aria-label="Release owner"
    ></tng-select>
  \`,
})
export class ReleaseOwnerSignalFormComponent {
  readonly releaseModel = signal({ owner: 'alex' });
  readonly releaseForm = form(this.releaseModel);

  readonly owners: readonly ReleaseOwner[] = [
    { id: 'alex', label: 'Alex' },
    { id: 'bri', label: 'Bri' },
  ];

  readonly getOwnerValue = (owner: ReleaseOwner) => owner.id;
  readonly getOwnerLabel = (owner: ReleaseOwner) => owner.label;
}`;

@Component({
  selector: 'app-select-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './select-api-page.component.html',
  styleUrl: './select-api-page.component.css',
})
export class SelectApiPageComponent {
  protected readonly wrapperAttachmentCode = WRAPPER_ATTACHMENT_CODE;
  protected readonly accessorCode = ACCESSOR_CODE;
  protected readonly signalFormsCode = SIGNAL_FORMS_CODE;
  protected readonly templateHookCode = TEMPLATE_HOOK_CODE;

  protected readonly wrapperRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'options',
      type: 'readonly O[]',
      details:
        'Full option collection rendered by the wrapper inside the portaled listbox overlay.',
    },
    {
      name: 'value / valueChange',
      type: 'V | null / output',
      details: 'Controlled single-select model for the committed option value.',
    },
    {
      name: 'open / openChange',
      type: 'boolean / output',
      details:
        'Optional controlled overlay state when a parent needs to observe or drive the menu.',
    },
    {
      name: 'scrollStrategy',
      type: "'block' | 'close' | 'reposition'",
      details:
        'Controls external scrolling. Defaults to reposition; block locks scrolling while preserving the document scrollbar.',
    },
    {
      name: 'disabled, loading, invalid',
      type: 'boolean',
      details:
        'Forwarded primitive state inputs reflected onto the wrapper host for visuals and interaction guards.',
    },
    {
      name: 'placeholder',
      type: 'string',
      details: 'Fallback trigger text when no committed value is present.',
    },
    {
      name: 'iconText',
      type: 'string',
      details:
        'Overrides the default chevron text in the trigger icon slot when you want a custom glyph.',
    },
    {
      name: 'labelId / descriptionId / errorId',
      type: 'string',
      details: 'Forwarded accessibility ids for external labels, helper copy, and error messaging.',
    },
  ]);

  protected readonly accessorRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'getOptionValue',
      type: '(option: O) => V',
      details: 'Maps each option object to the committed selection value stored in the model.',
    },
    {
      name: 'getOptionLabel',
      type: '(option: O) => string',
      details:
        'Maps each option object to the text used in the default trigger value and option rows.',
    },
    {
      name: 'isOptionDisabled',
      type: '(option: O) => boolean',
      details: 'Disables individual options while keeping them visible in the listbox.',
    },
    {
      name: 'trackBy',
      type: '(index: number, option: O) => unknown',
      details:
        'Optional identity for option rows. Defaults to getOptionValue(option) so remapped option objects stay stable across change detection.',
    },
  ]);

  protected readonly templateRows: readonly ApiRow[] = Object.freeze([
    {
      name: '#tngSelectValueTpl',
      type: 'TemplateRef<{ value, option, label }>',
      details:
        'Replaces the default trigger value markup while the wrapper keeps trigger semantics and selection state.',
    },
    {
      name: '#tngSelectOptionTpl',
      type: 'TemplateRef<{ option, value, label, disabled, selected, active }>',
      details:
        'Replaces each option row for richer metadata layouts without rebuilding the wrapper shell.',
    },
  ]);

  protected readonly primitiveFoundationRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'Trigger + overlay shell',
      type: 'Wrapper-owned',
      details:
        'The wrapper owns the trigger button, icon, portaled overlay, and listbox plumbing for the common select pattern.',
    },
    {
      name: 'Markup ownership',
      type: 'Template hooks only',
      details:
        'Use templates for richer content, or drop to headless when you need full trigger or overlay DOM ownership.',
    },
    {
      name: 'Primitive escape hatch',
      type: 'Available',
      details:
        'Use headless select when you need custom trigger composition, overlay structure, or direct primitive coordination.',
    },
  ]);
}
