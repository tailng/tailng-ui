import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly details: string;
}

interface SlotRow {
  readonly slot: string;
  readonly selector: string;
  readonly details: string;
}

const ROOT_ATTACHMENT_CODE = String.raw`<section
  tngAutocomplete
  [open]="open()"
  (openChange)="open.set($event)"
  [value]="value()"
  (valueChange)="value.set($event)"
  [query]="query()"
  (queryChange)="query.set($event)"
></section>
`;

const CREATE_MODE_CODE = String.raw`<section
  tngAutocomplete
  [allowCreate]="true"
  [strict]="false"
  (create)="onCreate($event.query)"
>
  ...
</section>
`;

@Component({
  selector: 'app-headless-autocomplete-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './headless-autocomplete-api-page.component.html',
  styleUrl: './headless-autocomplete-api-page.component.css',
})
export class HeadlessAutocompleteApiPageComponent {
  protected readonly rootAttachmentCode = ROOT_ATTACHMENT_CODE;
  protected readonly createModeCode = CREATE_MODE_CODE;

  protected readonly primitiveRows: readonly ApiRow[] = Object.freeze([
    { name: 'open', type: 'model<boolean>', details: 'Controls whether the overlay is open.' },
    { name: 'value', type: 'model<T | null>', details: 'Selected option value.' },
    { name: 'query', type: 'model<string>', details: 'Current input query used for filtering.' },
    {
      name: 'disabled',
      type: 'input<boolean>',
      details: 'Disables trigger focus, typing, and selection.',
    },
    {
      name: 'allowCreate',
      type: 'input<boolean>',
      details: 'Allows Enter to emit a create event when no option is active.',
    },
    {
      name: 'strict',
      type: 'input<boolean>',
      details: 'When true, blocks free-form create and requires list selection.',
    },
    {
      name: 'loading',
      type: 'input<boolean>',
      details: 'Marks the autocomplete as loading and reflects data-loading.',
    },
    {
      name: 'invalid',
      type: 'input<boolean>',
      details:
        'Marks the autocomplete invalid and reflects data-invalid plus aria-invalid on the trigger.',
    },
    {
      name: 'labelId',
      type: 'input<string | null>',
      details: 'Used for trigger aria-labelledby when aria-label is not present on the input.',
    },
    {
      name: 'descriptionId',
      type: 'input<string | null>',
      details: 'Used for trigger aria-describedby.',
    },
    {
      name: 'errorId',
      type: 'input<string | null>',
      details: 'Appended to aria-describedby when invalid.',
    },
    {
      name: 'openChange',
      type: 'output<boolean>',
      details: 'Emitted when the primitive opens or closes.',
    },
    {
      name: 'valueChange',
      type: 'output<T | null>',
      details: 'Emitted when the committed option value changes.',
    },
    {
      name: 'queryChange',
      type: 'output<string>',
      details: 'Emitted on typing and open-on-focus query sync.',
    },
    {
      name: 'create',
      type: 'output<{ query: string }>',
      details: 'Emitted on Enter with no active option when create mode is enabled.',
    },
  ]);

  protected readonly slotRows: readonly SlotRow[] = Object.freeze([
    {
      slot: 'autocomplete',
      selector: '[tngAutocomplete]',
      details: 'Root state owner. Reflects open, disabled, loading, and invalid state.',
    },
    {
      slot: 'autocomplete-trigger',
      selector: '[tngAutocompleteTrigger]',
      details:
        'Combobox input trigger. Owns aria-expanded, aria-controls, and aria-activedescendant wiring.',
    },
    {
      slot: 'autocomplete-trigger-container',
      selector: '[tngAutocompleteTriggerContainer]',
      details:
        'Optional wrapper around the trigger and icon. Overlay width/position uses this element when present.',
    },
    {
      slot: 'autocomplete-icon',
      selector: '[tngAutocompleteIcon]',
      details: 'Optional icon slot. Clicking it focuses the trigger.',
    },
    {
      slot: 'autocomplete-content',
      selector: '[tngAutocompleteContent]',
      details: 'Content container that hides when closed.',
    },
    {
      slot: 'autocomplete-overlay',
      selector: '[tngAutocompleteOverlay]',
      details:
        'Portaled overlay surface. Moves to document.body while open; scrollStrategy defaults to reposition and also accepts close or block.',
    },
    {
      slot: 'autocomplete-listbox',
      selector: '[tngAutocompleteListbox]',
      details: 'Listbox bridge that manages active option and selection sync.',
    },
    {
      slot: 'autocomplete-option',
      selector: '[tngAutocompleteOption]',
      details: 'Interactive option. Receives active, selected, and disabled state markers.',
    },
  ]);

  protected readonly reflectedRows: readonly SlotRow[] = Object.freeze([
    {
      slot: 'data-state',
      selector: '[data-slot="autocomplete"]',
      details: 'open | closed on the root primitive.',
    },
    {
      slot: 'data-disabled',
      selector: '[data-slot="autocomplete"]',
      details: 'Present when the autocomplete is disabled.',
    },
    {
      slot: 'data-loading',
      selector: '[data-slot="autocomplete"]',
      details: 'Present when loading is true.',
    },
    {
      slot: 'data-invalid',
      selector: '[data-slot="autocomplete"]',
      details: 'Present when invalid is true.',
    },
    {
      slot: 'data-active',
      selector: '[data-slot="autocomplete-option"]',
      details: 'Present on the currently active option.',
    },
    {
      slot: 'data-selected',
      selector: '[data-slot="autocomplete-option"]',
      details: 'Present on the committed option that matches the current value.',
    },
    {
      slot: 'data-disabled',
      selector: '[data-slot="autocomplete-option"]',
      details: 'Present on disabled options.',
    },
    {
      slot: 'data-slot="autocomplete-empty"',
      selector: '[data-slot="autocomplete-empty"]',
      details: 'Reserved empty-state marker for your no-results row.',
    },
  ]);
}
