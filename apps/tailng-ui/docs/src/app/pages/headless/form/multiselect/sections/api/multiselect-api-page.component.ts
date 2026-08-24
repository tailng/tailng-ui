import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

interface ApiRow {
  readonly details: string;
  readonly name: string;
  readonly type: string;
}

const ATTACHMENT_CODE = String.raw`<section
  tngMultiSelect
  [value]="selectedPlanets()"
  (valueChange)="onValueChange($event)"
>
  <button type="button" tngSelectTrigger>
    <span tngSelectValue>{{ selectedSummary() }}</span>
    <span tngSelectIcon aria-hidden="true">▾</span>
  </button>

  <div tngSelectContent>
    <div tngSelectOverlay>
      <ul
        tngMultiSelectListbox
        [multiple]="true"
        [value]="selectedPlanets()"
      >
        @for (planet of planets; track planet.value) {
          <li tngMultiSelectOption [tngValue]="planet.value">{{ planet.label }}</li>
        }
      </ul>
    </div>
  </div>
</section>`;

const LISTBOX_BRIDGE_CODE = String.raw`readonly selectedPlanets = signal<readonly string[]>(['earth', 'mars']);

onValueChange(value: unknown): void {
  this.selectedPlanets.set(this.toValueArray(value));
}

private toValueArray(value: unknown): readonly string[] {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value))
    return value.filter((v): v is string => typeof v === 'string');
  return typeof value === 'string' ? [value] : [];
}`;

const REFLECTED_ATTRIBUTES_CODE = String.raw`<section tngMultiSelect data-slot="multi-select" data-state="open">
  <button
    tngSelectTrigger
    role="combobox"
    aria-expanded="true"
    aria-controls="tng-select-content-..."
    data-slot="select-trigger"
  >
    <span tngSelectValue data-slot="select-value">Earth, Mars</span>
    <span tngSelectIcon data-slot="select-icon">▾</span>
  </button>

  <div tngSelectContent data-slot="select-content">
    <div tngSelectOverlay>
      <ul tngMultiSelectListbox data-slot="multi-select-listbox">
        <li tngMultiSelectOption data-slot="multi-select-option" data-active data-selected>
          Earth
        </li>
      </ul>
    </div>
  </div>
</section>`;

@Component({
  selector: 'app-headless-multiselect-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './multiselect-api-page.component.html',
  styleUrl: './multiselect-api-page.component.css',
})
export class HeadlessMultiselectApiPageComponent {
  protected readonly attachmentCode = ATTACHMENT_CODE;
  protected readonly listboxBridgeCode = LISTBOX_BRIDGE_CODE;
  protected readonly reflectedAttributesCode = REFLECTED_ATTRIBUTES_CODE;

  protected readonly rootRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'tngMultiSelect',
      type: 'root directive',
      details:
        'Owns open state, committed array value, disabled/loading/invalid flags, and ids used by the trigger + content pair.',
    },
    {
      name: 'value / valueChange',
      type: 'readonly T[]',
      details:
        'Represents the committed set of selected option values. Emitted as an array after every toggle.',
    },
    {
      name: 'open / openChange',
      type: 'boolean',
      details:
        'Controls whether the menu is visible. Enter toggles the active option without closing; outside click or Escape closes.',
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
      details: 'Focus target and keyboard entry point. The trigger toggles the menu and owns aria-expanded + aria-controls.',
    },
    {
      name: 'tngSelectValue',
      type: 'display slot',
      details: 'Receives the committed label summary or your richer owned markup inside the trigger.',
    },
    {
      name: 'tngSelectIcon',
      type: 'display slot',
      details: 'Optional icon slot for chevrons or status glyphs without changing trigger semantics.',
    },
    {
      name: 'tngSelectContent + tngSelectOverlay',
      type: 'overlay shell',
      details:
        'The content wrapper tracks hidden state while the overlay carries the portaled menu surface. scrollStrategy defaults to reposition and also accepts close or block.',
    },
    {
      name: 'tngMultiSelectListbox + tngMultiSelectOption',
      type: 'listbox bridge',
      details: 'Connects the multiselect root to listbox active/selected state. Options expose data attributes for styling.',
    },
  ]);

  protected readonly bridgeRows: readonly ApiRow[] = Object.freeze([
    {
      name: '[value] on tngMultiSelect',
      type: 'committed model',
      details: 'The root stores the committed array of values that should show in the trigger summary.',
    },
    {
      name: '[multiple]="true" on tngMultiSelectListbox',
      type: 'multi-selection mode',
      details: 'Enables multi-selection semantics so Enter toggles instead of closing.',
    },
    {
      name: '(valueChange) on root',
      type: 'safe headless pattern',
      details: 'Emits the full updated array after each toggle. Normalize to readonly string[] in your handler.',
    },
  ]);

  protected readonly reflectedRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'data-slot',
      type: 'structural marker',
      details: 'Added to the root, trigger, value, icon, content, listbox, and option parts for styling hooks.',
    },
    {
      name: 'data-state',
      type: 'root state',
      details: 'The root reflects open or closed state so your shell can respond when the menu is visible.',
    },
    {
      name: 'data-active / data-selected / data-disabled',
      type: 'option state',
      details: 'Applied to option rows for hover-equivalent focus, committed selection, and disabled styling.',
    },
  ]);
}
