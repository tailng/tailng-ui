import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

interface ApiRow {
  readonly details: string;
  readonly name: string;
  readonly type: string;
}

const ATTACHMENT_CODE = String.raw`<section
  tngSelect
  [value]="selectedStage()"
  (valueChange)="onSelectedStageChange($event)"
>
  <button type="button" tngSelectTrigger>
    <span tngSelectValue>{{ selectedStageLabel() ?? 'Choose workflow stage' }}</span>
    <span tngSelectIcon aria-hidden="true">▾</span>
  </button>

  <div tngSelectContent>
    <div tngSelectOverlay>
      <div
        tngSelectListbox
        [value]="selectedStage()"
        (valueChange)="onSelectedStageChange($event)"
      >
        @for (stage of workflowStages; track stage.value) {
          <div tngSelectOption [tngValue]="stage.value">{{ stage.label }}</div>
        }
      </div>
    </div>
  </div>
</section>`;

const LISTBOX_BRIDGE_CODE = String.raw`type SelectboxValue = string | readonly string[] | null;

readonly selectedStage = signal<string | null>('review');

onSelectedStageChange(value: SelectboxValue): void {
  this.selectedStage.set(this.toSingleValue(value));
}

private toSingleValue(value: SelectboxValue): string | null {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : null;
  }

  return null;
}`;

const REFLECTED_ATTRIBUTES_CODE = String.raw`<section tngSelect data-slot="select" data-state="open">
  <button
    tngSelectTrigger
    role="combobox"
    aria-expanded="true"
    aria-controls="tng-select-content-..."
    data-slot="select-trigger"
  >
    <span tngSelectValue data-slot="select-value">QA ready</span>
    <span tngSelectIcon data-slot="select-icon">▾</span>
  </button>

  <div tngSelectContent data-slot="select-content">
    <div tngSelectOverlay>
      <div tngSelectListbox data-slot="select-listbox">
        <div tngSelectOption data-slot="select-option" data-active data-selected>
          QA ready
        </div>
      </div>
    </div>
  </div>
</section>`;

@Component({
  selector: 'app-headless-selectbox-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './selectbox-api-page.component.html',
  styleUrl: './selectbox-api-page.component.css',
})
export class HeadlessSelectboxApiPageComponent {
  protected readonly attachmentCode = ATTACHMENT_CODE;
  protected readonly listboxBridgeCode = LISTBOX_BRIDGE_CODE;
  protected readonly reflectedAttributesCode = REFLECTED_ATTRIBUTES_CODE;

  protected readonly rootRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'tngSelect',
      type: 'root directive',
      details:
        'Owns open state, committed single value, disabled/loading/invalid flags, and ids used by the trigger + content pair.',
    },
    {
      name: 'value / valueChange',
      type: 'string | null',
      details:
        'Represents the committed option value. Headless usage usually normalizes the primitive payload back to a single string.',
    },
    {
      name: 'open / openChange',
      type: 'boolean',
      details:
        'Controls whether the menu is visible. Pointer and keyboard activation update this automatically unless you override it.',
    },
    {
      name: 'disabled, loading, invalid',
      type: 'boolean',
      details:
        'Reflected onto the root host for semantics and styling, then consumed by the trigger and overlay parts.',
    },
  ]);

  protected readonly partRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'tngSelectTrigger',
      type: 'combobox trigger',
      details:
        'Focus target and keyboard entry point. The trigger toggles the menu and owns aria-expanded + aria-controls.',
    },
    {
      name: 'tngSelectValue',
      type: 'display slot',
      details: 'Receives the committed label text or your richer owned markup inside the trigger.',
    },
    {
      name: 'tngSelectIcon',
      type: 'display slot',
      details:
        'Optional icon slot. Use it for chevrons or status glyphs without changing trigger semantics.',
    },
    {
      name: 'tngSelectContent + tngSelectOverlay',
      type: 'overlay shell',
      details:
        'The content wrapper tracks hidden state while the overlay carries the portaled menu surface. scrollStrategy defaults to reposition and also accepts close or block.',
    },
    {
      name: 'tngSelectListbox + tngSelectOption',
      type: 'listbox bridge',
      details:
        'Connects the select root to listbox active/selected state and exposes option data attributes for styling.',
    },
  ]);

  protected readonly bridgeRows: readonly ApiRow[] = Object.freeze([
    {
      name: '[value] on tngSelect',
      type: 'committed model',
      details:
        'The root stores the committed single value that should show in the trigger when the overlay closes.',
    },
    {
      name: '[value] on tngSelectListbox',
      type: 'selection mirror',
      details:
        'Keeps the active/selected option in sync with the root when the listbox renders or the root changes.',
    },
    {
      name: '(valueChange) on both',
      type: 'safe headless pattern',
      details:
        'Binding both ends keeps pointer, keyboard, and programmatic updates aligned with the committed single value.',
    },
  ]);

  protected readonly reflectedRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'data-slot',
      type: 'structural marker',
      details:
        'Added to the root, trigger, value, icon, content, listbox, and option parts for styling hooks.',
    },
    {
      name: 'data-state',
      type: 'root state',
      details:
        'The root reflects open or closed state so your shell can respond when the menu is visible.',
    },
    {
      name: 'data-active / data-selected / data-disabled',
      type: 'option state',
      details:
        'Applied to option rows for hover-equivalent focus, committed selection, and disabled styling.',
    },
  ]);
}
