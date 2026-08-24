import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly details: string;
}

const WRAPPER_ATTACHMENT_CODE = String.raw`<tng-multi-autocomplete
  [options]="filteredReleaseMarkets()"
  [value]="selectedMarkets()"
  (valueChange)="onSelectedMarketsChange($event)"
  [query]="marketQuery()"
  (queryChange)="marketQuery.set($event)"
  [getOptionValue]="getMarketValue"
  [getOptionLabel]="getMarketLabel"
  [isOptionDisabled]="isMarketDisabled"
  placeholder="Search launch markets"
  [ariaLabel]="'Launch markets'"
></tng-multi-autocomplete>`;

const QUERY_FILTERING_CODE = String.raw`readonly marketQuery = signal('');

readonly filteredReleaseMarkets = computed(() => {
  const query = this.marketQuery().toLowerCase().trim();

  if (!query) {
    return this.releaseMarkets;
  }

  return this.releaseMarkets.filter((market) =>
    market.label.toLowerCase().includes(query),
  );
});
`;

const ACCESSOR_CODE = String.raw`interface ReleaseMarketOption {
  readonly code: string;
  readonly label: string;
  readonly region: string;
  readonly disabled?: boolean;
}

readonly getMarketValue = (market: ReleaseMarketOption) => market.code;
readonly getMarketLabel = (market: ReleaseMarketOption) => market.label;
readonly isMarketDisabled = (market: ReleaseMarketOption) => market.disabled === true;
readonly trackMarket = (_index: number, market: ReleaseMarketOption) => market.code;`;

const TEMPLATE_HOOK_CODE = String.raw`<tng-multi-autocomplete
  [options]="releaseOwners"
  [value]="selectedOwners()"
  (valueChange)="onSelectedOwnersChange($event)"
  [getOptionValue]="getOwnerValue"
  [getOptionLabel]="getOwnerLabel"
>
  <ng-template #tngMultiAutocompleteChipTpl let-chip>
    <span>{{ chip.label }}</span>
    <button
      type="button"
      (click)="chip.removeItem(chip.value); $event.preventDefault(); $event.stopPropagation()"
      [attr.aria-label]="'Remove ' + chip.label"
    >
      ×
    </button>
  </ng-template>

  <ng-template #tngMultiAutocompleteOptionTpl let-option>
    <div>
      <strong>{{ option.label }}</strong>
      <small>{{ option.option.team }}</small>
    </div>
  </ng-template>
</tng-multi-autocomplete>`;

const SIGNAL_FORMS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TngMultiAutocompleteComponent } from '@tailng-ui/components';

type MarketOption = {
  readonly code: string;
  readonly label: string;
};

@Component({
  selector: 'app-launch-markets-signal-form',
  standalone: true,
  imports: [FormField, TngMultiAutocompleteComponent],
  template: \`
    <tng-multi-autocomplete
      [formField]="launchForm.markets"
      [options]="markets"
      [getOptionValue]="getMarketValue"
      [getOptionLabel]="getMarketLabel"
      placeholder="Search launch markets"
      ariaLabel="Launch markets"
    ></tng-multi-autocomplete>
  \`,
})
export class LaunchMarketsSignalFormComponent {
  readonly launchModel = signal({
    markets: ['in'] as readonly string[],
  });
  readonly launchForm = form(this.launchModel);

  readonly markets: readonly MarketOption[] = [
    { code: 'in', label: 'India' },
    { code: 'sg', label: 'Singapore' },
    { code: 'us', label: 'United States' },
  ];

  readonly getMarketValue = (market: MarketOption) => market.code;
  readonly getMarketLabel = (market: MarketOption) => market.label;
}`;

@Component({
  selector: 'app-multi-autocomplete-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './multi-autocomplete-api-page.component.html',
  styleUrl: './multi-autocomplete-api-page.component.css',
})
export class MultiAutocompleteApiPageComponent {
  protected readonly wrapperAttachmentCode = WRAPPER_ATTACHMENT_CODE;
  protected readonly queryFilteringCode = QUERY_FILTERING_CODE;
  protected readonly accessorCode = ACCESSOR_CODE;
  protected readonly signalFormsCode = SIGNAL_FORMS_CODE;
  protected readonly templateHookCode = TEMPLATE_HOOK_CODE;

  protected readonly wrapperRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'options',
      type: 'readonly O[]',
      details:
        'Options rendered by the wrapper. Pass a pre-filtered list for local or server-side search.',
    },
    {
      name: 'value / valueChange',
      type: 'readonly V[] / output',
      details: 'Controlled multi-select model containing the committed option values.',
    },
    {
      name: 'open / openChange',
      type: 'boolean / output',
      details:
        'Optional controlled overlay state when the parent needs to observe or drive the menu.',
    },
    {
      name: 'scrollStrategy',
      type: "'block' | 'close' | 'reposition'",
      details:
        'Controls external scrolling. Defaults to reposition; block locks scrolling while preserving the document scrollbar.',
    },
    {
      name: 'query / queryChange',
      type: 'string / output',
      details:
        'Controlled trigger text for local filtering, debounced requests, or server-driven results.',
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
      details: 'Trigger input placeholder while no query text is present.',
    },
    {
      name: 'emptyText',
      type: 'string',
      details: 'Fallback copy rendered when the filtered option list is empty.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      details:
        'Accessible name applied to the owned trigger input when no external label element is present.',
    },
  ]);

  protected readonly accessorRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'getOptionValue',
      type: '(option: O) => V',
      details:
        'Maps each option object to the committed selection value stored in the model array.',
    },
    {
      name: 'getOptionLabel',
      type: '(option: O) => string',
      details:
        'Maps each option object to the text used for chips and the default option template.',
    },
    {
      name: 'isOptionDisabled',
      type: '(option: O) => boolean',
      details: 'Disables individual options while keeping them visible in the results list.',
    },
    {
      name: 'trackBy',
      type: '(index: number, option: O) => unknown',
      details:
        'Custom identity function for stable option rendering when the input list is refreshed.',
    },
  ]);

  protected readonly templateRows: readonly ApiRow[] = Object.freeze([
    {
      name: '#tngMultiAutocompleteChipTpl',
      type: 'TemplateRef<{ option, value, label, removeItem }>',
      details:
        'Overrides the chip body while keeping the wrapper-owned chip container and remove semantics.',
    },
    {
      name: '#tngMultiAutocompleteOptionTpl',
      type: 'TemplateRef<{ option, value, label, disabled, selected, active }>',
      details:
        'Overrides each option row for richer metadata layouts without rebuilding the primitive plumbing.',
    },
  ]);

  protected readonly primitiveFoundationRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'Query model',
      type: 'Wrapper API',
      details:
        'Bind query/queryChange when a parent component needs local filtering, debounced requests, or server-driven results.',
    },
    {
      name: 'Overlay markup',
      type: 'Wrapper-owned',
      details:
        'The wrapper owns the trigger, chip host, overlay container, and listbox wiring for the common multi-tag experience.',
    },
    {
      name: 'Primitive escape hatch',
      type: 'Available',
      details:
        'Use headless multi autocomplete when you need bespoke trigger markup or custom overlay structure.',
    },
  ]);
}
