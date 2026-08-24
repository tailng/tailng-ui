import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

type ApiRow = Readonly<{
  default?: string;
  details: string;
  name: string;
  type?: string;
}>;

type ApiGroup = Readonly<{
  description?: string;
  rows: readonly ApiRow[];
  title: string;
}>;

type MethodRow = Readonly<{
  details: string;
  name: string;
}>;

@Component({
  selector: 'app-datepicker-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './datepicker-api-page.component.html',
  styleUrl: './datepicker-api-page.component.css',
})
export class DatepickerApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly wrapperAttachCode = [
    '<tng-datepicker',
    '  [defaultValue]="\'2024-04-22\'"',
    '  [minDate]="\'2024-04-01\'"',
    '  [maxDate]="\'2026-03-31\'"',
    '  selectionMode="single"',
    '  ariaLabel="Invoice date"',
    '></tng-datepicker>',
    '',
  ].join('\n');

  protected readonly headlessAttachCode = [
    "import { bindTngDatepicker, createDatepickerController } from '@tailng-ui/primitives';",
    '',
    'readonly controller = createDatepickerController<Date>({',
    '  ownerDocument: document,',
    "  value: '2024-04-22',",
    "  today: '2024-04-18',",
    "  minDate: '2024-04-01',",
    "  maxDate: '2026-03-31',",
    '  closeOnSelect: true,',
    '  trapFocus: true,',
    '});',
    '',
    'readonly datepicker = bindTngDatepicker(this.controller);',
    '',
  ].join('\n');

  protected readonly directiveAttachCode = [
    '<section [tngDatepickerHost]="controller">',
    '  <div data-slot="datepicker-field">',
    '    <div #anchorShell>',
    '      <div',
    '        data-slot="datepicker-input-shell"',
    '        [attr.data-invalid]="datepicker.outputs().validationError !== null ? \'true\' : null"',
    '        [attr.data-open]="datepicker.outputs().getTriggerAttributes()[\'data-open\']"',
    '      >',
    '        <input [tngDatepickerInput]="controller" type="text" placeholder="MM-DD-YYYY" />',
    '        <button [tngDatepickerTrigger]="controller" type="button">Open</button>',
    '      </div>',
    '',
    '      <section [tngDatepickerOverlay]="controller" [tngDatepickerOverlayAnchor]="anchorShell">',
    '        <button [tngDatepickerPrevButton]="controller" type="button">‹</button>',
    '        <button [tngDatepickerPeriodButton]="controller" type="button">',
    '          {{ datepicker.periodLabel() }}',
    '        </button>',
    '        <button [tngDatepickerNextButton]="controller" type="button">›</button>',
    '',
    '        <div [tngDatepickerDayGrid]="controller">',
    '          @for (cell of datepicker.outputs().cells; track cell.id) {',
    '            <button [tngDatepickerDayCell]="cell" type="button">{{ cell.label }}</button>',
    '          }',
    '        </div>',
    '      </section>',
    '    </div>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  protected readonly wrapperInputGroups: readonly ApiGroup[] = Object.freeze([
    {
      title: 'Selection and value',
      rows: [
        {
          name: 'defaultValue',
          type: 'TngDateSelectionInput<TDate> | undefined',
          default: 'undefined',
          details: 'Sets the uncontrolled initial selection.',
        },
        {
          name: 'value',
          type: 'TngDateSelectionInput<TDate> | undefined',
          default: 'undefined',
          details: 'Controls the committed selection from the outside.',
        },
        {
          name: 'selectionMode',
          type: "'single' | 'range' | 'multiple'",
          default: "'single'",
          details:
            'Changes the value model and selection behavior without changing the wrapper UI contract.',
        },
        {
          name: 'allowDeselect',
          type: 'boolean',
          default: 'false',
          details: 'Lets a second click clear the current selection in single mode.',
        },
        {
          name: 'minDate / maxDate',
          type: 'TngDateInputValue<TDate> | undefined',
          default: 'undefined',
          details: 'Disables out-of-range days, months, and years.',
        },
        {
          name: 'disableDate',
          type: '((date: TDate) => boolean) | null',
          default: 'null',
          details: 'Disables individual dates inside the otherwise valid range.',
        },
        {
          name: 'today',
          type: 'TngDateInputValue<TDate> | undefined',
          default: 'undefined',
          details: 'Overrides which date is marked as today in the grid.',
        },
      ],
    },
    {
      title: 'Interaction and behavior',
      rows: [
        {
          name: 'allowManualInput',
          type: 'boolean',
          default: 'true',
          details: 'Allows typing directly into the field and committing valid values.',
        },
        {
          name: 'autoCommitView',
          type: 'boolean',
          default: 'false',
          details:
            'Controls whether the wrapper should auto-commit when drilling between year, month, and day views.',
        },
        {
          name: 'closeOnEscape',
          type: 'boolean',
          default: 'true',
          details: 'Closes the popup when Escape is pressed.',
        },
        {
          name: 'closeOnOutsideClick',
          type: 'boolean',
          default: 'true',
          details: 'Dismisses the popup when pointer or focus moves outside.',
        },
        {
          name: 'closeOnSelect',
          type: 'boolean',
          default: 'true',
          details: 'Closes after a committed date selection.',
        },
        {
          name: 'closeOthersOnOpen',
          type: 'boolean',
          default: 'false',
          details: 'Asks other registered datepickers to close when this one opens.',
        },
        {
          name: 'restoreFocus',
          type: 'boolean',
          default: 'true',
          details: 'Restores focus to the trigger after the popup closes.',
        },
        {
          name: 'showOutsideDays',
          type: 'boolean',
          default: 'true',
          details: 'Keeps adjacent-month days visible in day view.',
        },
        {
          name: 'trapFocus',
          type: 'boolean',
          default: 'true',
          details: 'Keeps focus inside the popup while it is open.',
        },
        {
          name: 'weekStartsOn',
          type: 'TngWeekdayIndex',
          default: '0',
          details: 'Overrides the locale-derived start of week.',
        },
      ],
    },
    {
      title: 'Overlay and layout',
      rows: [
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          details: 'Sets the uncontrolled initial open state.',
        },
        {
          name: 'open',
          type: 'boolean | undefined',
          default: 'undefined',
          details: 'Controls the popup state from the outside.',
        },
        {
          name: 'placement',
          type: "'auto' | 'bottom' | 'top'",
          default: "'auto'",
          details:
            'Auto-flips the popup when needed. The popup uses logical end alignment against the complete input and trigger shell.',
        },
        {
          name: 'scrollStrategy',
          type: "'block' | 'close' | 'reposition'",
          default: "'reposition'",
          details:
            'Repositions with page scroll and closes if the field leaves view. Use block to lock scrolling while preserving the document scrollbar.',
        },
        {
          name: 'overlayRuntime',
          type: 'TngOverlayRuntime | null | undefined',
          default: 'Internal runtime',
          details: 'Lets advanced apps share an overlay layer registry across surfaces.',
        },
        {
          name: 'overlayMinSize',
          type: 'number',
          default: '288',
          details: 'Sets the minimum popup width before the available viewport width is applied.',
        },
        {
          name: 'overlaySize',
          type: 'number',
          default: '320',
          details:
            'Sets the maximum popup width. Between the bounds, the popup follows the input-shell width.',
        },
        {
          name: 'yearPageSize',
          type: 'number',
          default: '24',
          details: 'Controls how many years are shown per year page.',
        },
        {
          name: 'direction',
          type: "'ltr' | 'rtl'",
          default: "'ltr'",
          details: 'Flips navigation semantics and keyboard movement for RTL flows.',
        },
      ],
    },
    {
      title: 'Accessibility and presentation',
      rows: [
        {
          name: 'adapter',
          type: 'TngDateAdapter<TDate> | undefined',
          default: 'Default date adapter',
          details: 'Controls parsing, formatting, and visible month or period labels.',
        },
        {
          name: 'ariaDescribedBy',
          type: 'string | null',
          default: 'null',
          details: 'Forwards an external description id to the host.',
        },
        {
          name: 'ariaLabel',
          type: 'string | null',
          default: 'null',
          details: 'Sets a root accessible name when no visible label is present.',
        },
        {
          name: 'ariaLabelledBy',
          type: 'string | null',
          default: 'null',
          details: 'Points the host at an external labeling element.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          details: 'Disables the field, trigger, and all calendar interaction.',
        },
        {
          name: 'fullWidth',
          type: 'boolean',
          default: 'true',
          details: 'Makes the host fill the available inline size.',
        },
        {
          name: 'id',
          type: 'string | null',
          default: 'null',
          details: 'Seeds the generated input id and overlay relationship ids.',
        },
        {
          name: 'inputAriaLabel',
          type: 'string',
          default: "'Date input'",
          details: 'Labels the editable text input itself.',
        },
        {
          name: 'invalid',
          type: 'boolean',
          default: 'false',
          details: 'Forces invalid styling in addition to manual input validation state.',
        },
        {
          name: 'locale',
          type: 'string',
          default: 'Angular LOCALE_ID',
          details: 'Drives weekday names, month labels, and adapter locale defaults.',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: "'MM-DD-YYYY'",
          details: 'Changes the visible hint only. Parsing still comes from the adapter.',
        },
        {
          name: 'readonly',
          type: 'boolean',
          default: 'false',
          details: 'Makes the text field read-only while still allowing popup selection.',
        },
      ],
    },
  ]);

  protected readonly wrapperOutputRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'valueChange',
      type: 'TngDateValue<TDate>',
      details: 'Emits after click, keyboard commit, or a successful manual input commit.',
    },
    {
      name: 'openChange',
      type: 'boolean',
      details: 'Emits whenever the popup opens or closes.',
    },
    {
      name: 'closed',
      type: 'TngDatepickerCloseReason',
      details: 'Reports escape, outside, programmatic, or select close reasons.',
    },
    {
      name: 'activeDateChange',
      type: 'TDate',
      details: 'Emits as keyboard focus moves through the calendar model.',
    },
    {
      name: 'viewChange',
      type: "'day' | 'month' | 'year'",
      details: 'Tracks the current visible panel.',
    },
    {
      name: 'monthChange',
      type: 'TDate',
      details: 'Emits when the visible month block changes.',
    },
    {
      name: 'yearChange',
      type: 'number',
      details: 'Emits when the visible year page anchor changes.',
    },
  ]);

  protected readonly wrapperMethodRows: readonly MethodRow[] = Object.freeze([
    {
      name: 'clear()',
      details:
        'Clears the current selection for the active selection mode and returns the wrapper to day view.',
    },
    {
      name: 'close(reason?)',
      details: 'Programmatically closes the popup with an optional close reason.',
    },
    {
      name: 'openDatepicker()',
      details: 'Programmatically opens the popup.',
    },
    {
      name: 'showDaysPanel() / showMonthsPanel() / showYearsPanel()',
      details:
        'Drives the visible panel explicitly when the default drill-down flow is not enough.',
    },
    {
      name: 'toggleOpen()',
      details: 'Toggles the popup state.',
    },
  ]);

  protected readonly headlessBindingRows: readonly MethodRow[] = Object.freeze([
    {
      name: 'bindTngDatepicker(controller)',
      details:
        'Returns signals for outputs() and periodLabel() so Angular templates can stay declarative.',
    },
    {
      name: '[tngDatepickerHost]',
      details: 'Applies the public root attributes such as data-open, data-view, and ARIA labels.',
    },
    {
      name: '[tngDatepickerInput] / [tngDatepickerTrigger]',
      details:
        'Forward manual input editing, trigger registration, and wrapper-grade open and keyboard behavior.',
    },
    {
      name: '[tngDatepickerOverlay]',
      details:
        'Ports the popup to document.body, syncs public overlay attributes, and keeps focus and positioning aligned.',
    },
    {
      name: '[tngDatepickerPrevButton] / [tngDatepickerNextButton] / [tngDatepickerPeriodButton]',
      details:
        'Own the standard navigation and drill-down flow without per-view branching in your component.',
    },
    {
      name: '[tngDatepickerDayGrid] / [tngDatepickerDayCell]',
      details:
        'Forward day-grid keyboarding, click handling, hover range behavior, and the public day-cell state hooks.',
    },
    {
      name: '[tngDatepickerMonthGrid] / [tngDatepickerMonthOption] / [tngDatepickerYearGrid] / [tngDatepickerYearOption]',
      details:
        'Handle month and year picker keyboarding and selection while preserving the public slot contract.',
    },
  ]);

  protected readonly headlessOptionRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'initialView',
      type: "'day' | 'month' | 'year'",
      default: "'day'",
      details: 'Starts the controller on a different panel than the wrapper exposes by default.',
    },
    {
      name: 'overlayMode',
      type: "'overlay' | 'push' | 'side'",
      default: "'overlay'",
      details: 'Changes how the controller models overlay layout when you are fully headless.',
    },
    {
      name: 'position',
      type: "'start' | 'center' | 'end'",
      default: "'start'",
      details: 'Changes overlay alignment relative to the field in headless layouts.',
    },
    {
      name: 'focusStrategy',
      type: "'active-descendant' | 'roving'",
      default: "'roving'",
      details: 'Lets advanced compositions opt into a different grid focus model.',
    },
    {
      name: 'maxSelections',
      type: 'number | null',
      default: 'null',
      details: 'Caps the number of selected values in multiple mode.',
    },
    {
      name: 'onPartialInputCommit',
      type: 'boolean',
      default: 'false',
      details: 'Allows partial manual input commits in advanced headless flows.',
    },
    {
      name: 'preserveViewOnOpenClose',
      type: 'boolean',
      default: 'true',
      details: 'Keeps the current panel when reopening instead of always returning to day view.',
    },
    {
      name: 'skipDisabled',
      type: 'boolean',
      default: 'true',
      details: 'Controls whether keyboard movement jumps across disabled dates.',
    },
  ]);

  protected readonly controllerMethodRows: readonly MethodRow[] = Object.freeze([
    {
      name: 'getOutputs() / getState()',
      details: 'Read the live render model or the lower-level mutable state snapshot.',
    },
    {
      name: 'open() / close() / toggleOpen()',
      details: 'Own popup visibility when you are not using the wrapper.',
    },
    {
      name: 'setInputText(...) / commitInputText() / parseInputText(...)',
      details: 'Support manual editing with adapter validation and bound checks.',
    },
    {
      name: 'selectDate(...) / clear() / setValue(...)',
      details: 'Own the committed selection state directly.',
    },
    {
      name: 'showYearsPanel() / showMonthsPanel() / showDaysPanel()',
      details: 'Drive the visible panel explicitly.',
    },
    {
      name: 'setConfig(...)',
      details: 'Reconfigures the controller after creation for advanced custom integrations.',
    },
    {
      name: 'subscribe(...)',
      details: 'Exposes low-level controller events when the template bindings are not enough.',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
