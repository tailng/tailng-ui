import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TngAutocompleteComponent, TngButtonComponent } from '@tailng-ui/components';
import { COUNTRY_LIST } from '../../../../../../shared/data/country-list';
import { CURRENCY_LIST } from '../../../../../../shared/data/currency-list';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { DocsFormDemoShellComponent } from '../../../../../../shared/form-demo-shell/docs-form-demo-shell.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../autocomplete.util';

type CountryOption = {
  readonly code: string;
  readonly label: string;
};

type OwnerOption = {
  readonly id: string;
  readonly name: string;
  readonly disabled?: boolean;
};

type CurrencyOption = {
  readonly code: string;
  readonly label: string;
};

type AutocompleteSignalFormData = {
  readonly country: string;
  readonly currency: string;
};

type SharedCountryRecord = {
  readonly code: string;
  readonly name: string;
  readonly currencycode: string;
};

type SharedCurrencyRecord = {
  readonly code: string;
  readonly name: string;
};

const FLAG_STYLESHEET_ID = 'docs-country-flag-stylesheet';
const FLAG_STYLESHEET_HREF = 'assets/styles/flags.css';

const COUNTRY_OPTIONS: readonly CountryOption[] = Object.freeze([
  { code: 'ca', label: 'Canada' },
  { code: 'dk', label: 'Denmark' },
  { code: 'de', label: 'Germany' },
  { code: 'is', label: 'Iceland' },
  { code: 'id', label: 'Indonesia' },
  { code: 'in', label: 'India' },
  { code: 'jp', label: 'Japan' },
  { code: 'mx', label: 'Mexico' },
  { code: 'no', label: 'Norway' },
  { code: 'es', label: 'Spain' },
  { code: 'se', label: 'Sweden' },
  { code: 'ch', label: 'Switzerland' },
]);

const OWNER_OPTIONS: readonly OwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen' },
  { id: 'mina', name: 'Mina Lee' },
  { id: 'omar', name: 'Omar Aziz', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel' },
]);

const CURRENCY_OPTIONS: readonly CurrencyOption[] = Object.freeze([
  { code: 'cad', label: 'Canadian Dollar (CAD)' },
  { code: 'eur', label: 'Euro (EUR)' },
  { code: 'inr', label: 'Indian Rupee (INR)' },
  { code: 'jpy', label: 'Japanese Yen (JPY)' },
  { code: 'mxn', label: 'Mexican Peso (MXN)' },
  { code: 'usd', label: 'US Dollar (USD)' },
]);

const SIGNAL_FORM_COUNTRIES: readonly CountryOption[] = Object.freeze(
  (COUNTRY_LIST as readonly SharedCountryRecord[]).map((country) => ({
    code: country.code.toLowerCase(),
    label: country.name,
  })),
);

const SIGNAL_FORM_CURRENCIES: readonly CurrencyOption[] = Object.freeze(
  (CURRENCY_LIST as readonly SharedCurrencyRecord[]).map((currency) => ({
    code: currency.code.toLowerCase(),
    label: `${currency.name} (${currency.code})`,
  })),
);

const COUNTRY_TO_CURRENCY_CODE: Readonly<Record<string, string>> = Object.freeze(
  (COUNTRY_LIST as readonly SharedCountryRecord[]).reduce<Record<string, string>>((acc, country) => {
    acc[country.code.toLowerCase()] = country.currencycode.toLowerCase();
    return acc;
  }, {}),
);

function filterOptions<T>(
  options: readonly T[],
  query: string,
  getLabel: (option: T) => string,
): readonly T[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return options;
  }

  return options.filter((option) => getLabel(option).toLowerCase().includes(normalizedQuery));
}

const COUNTRY_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngAutocompleteComponent } from '@tailng-ui/components';

interface CountryOption {
  readonly code: string;
  readonly label: string;
}

const COUNTRY_OPTIONS: readonly CountryOption[] = Object.freeze([
  { code: 'ca', label: 'Canada' },
  { code: 'dk', label: 'Denmark' },
  { code: 'de', label: 'Germany' },
  { code: 'is', label: 'Iceland' },
  { code: 'id', label: 'Indonesia' },
  { code: 'in', label: 'India' },
  { code: 'jp', label: 'Japan' },
  { code: 'mx', label: 'Mexico' },
  { code: 'no', label: 'Norway' },
  { code: 'es', label: 'Spain' },
  { code: 'se', label: 'Sweden' },
  { code: 'ch', label: 'Switzerland' },
]);

@Component({
  selector: 'app-docs-autocomplete-country-example-plain',
  standalone: true,
  imports: [TngAutocompleteComponent],
  templateUrl: './docs-autocomplete-country-example-plain.component.html',
  styleUrl: './docs-autocomplete-country-example-plain.component.css',
})
export class DocsAutocompleteCountryExamplePlainComponent {
  readonly countries = COUNTRY_OPTIONS;
  readonly selectedCountry = signal<string | null>('no');
  readonly countryQuery = signal('');
  readonly filteredCountries = computed(() =>
    this.countries.filter((country) =>
      country.label.toLowerCase().includes(this.countryQuery().toLowerCase().trim()),
    ),
  );
  readonly selectedSummary = computed(
    () => this.countries.find((country) => country.code === this.selectedCountry())?.label ?? 'none',
  );
  readonly getCountryValue = (country: CountryOption) => country.code;
  readonly getCountryLabel = (country: CountryOption) => country.label;

  onSelectedCountryChange(value: unknown): void {
    this.selectedCountry.set(typeof value === 'string' ? value : null);
  }
}
`;

const COUNTRY_PLAIN_HTML_CODE = String.raw`<section class="docs-autocomplete-country-example">
  <div class="docs-autocomplete-country-example__header">
    <span class="docs-autocomplete-country-example__eyebrow">Country directory</span>
    <p class="docs-autocomplete-country-example__copy">
      Search the release locale list and commit with keyboard or pointer selection.
    </p>
  </div>

  <div class="docs-autocomplete-country-example__control">
    <tng-autocomplete
      [options]="filteredCountries()"
      [value]="selectedCountry()"
      (valueChange)="onSelectedCountryChange($event)"
      [query]="countryQuery()"
      (queryChange)="countryQuery.set($event)"
      [getOptionValue]="getCountryValue"
      [getOptionLabel]="getCountryLabel"
      placeholder="Type a country"
      [ariaLabel]="'Country directory'"
    ></tng-autocomplete>
  </div>

  <p class="docs-autocomplete-country-example__summary">
    Selected: {{ selectedSummary() }}
  </p>
</section>
`;

const COUNTRY_PLAIN_CSS_CODE = String.raw`.docs-autocomplete-country-example {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 34rem);
  margin-inline: auto;
  padding: 1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1.1rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
}

.docs-autocomplete-country-example__header {
  display: grid;
  gap: 0.35rem;
}

.docs-autocomplete-country-example__eyebrow {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-autocomplete-country-example__copy,
.docs-autocomplete-country-example__summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-autocomplete-country-example__control {
  display: block;
  width: 100%;
}

.docs-autocomplete-country-example__control tng-autocomplete {
  display: block;
  width: 100%;
}
`;

const COUNTRY_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngAutocompleteComponent } from '@tailng-ui/components';

interface CountryOption {
  readonly code: string;
  readonly label: string;
}

const COUNTRY_OPTIONS: readonly CountryOption[] = Object.freeze([
  { code: 'ca', label: 'Canada' },
  { code: 'dk', label: 'Denmark' },
  { code: 'de', label: 'Germany' },
  { code: 'is', label: 'Iceland' },
  { code: 'id', label: 'Indonesia' },
  { code: 'in', label: 'India' },
  { code: 'jp', label: 'Japan' },
  { code: 'mx', label: 'Mexico' },
  { code: 'no', label: 'Norway' },
  { code: 'es', label: 'Spain' },
  { code: 'se', label: 'Sweden' },
  { code: 'ch', label: 'Switzerland' },
]);

@Component({
  selector: 'app-docs-autocomplete-country-example-tailwind',
  standalone: true,
  imports: [TngAutocompleteComponent],
  templateUrl: './docs-autocomplete-country-example-tailwind.component.html',
  styleUrl: './docs-autocomplete-country-example-tailwind.component.css',
})
export class DocsAutocompleteCountryExampleTailwindComponent {
  readonly countries = COUNTRY_OPTIONS;
  readonly selectedCountry = signal<string | null>('ch');
  readonly countryQuery = signal('');
  readonly filteredCountries = computed(() =>
    this.countries.filter((country) =>
      country.label.toLowerCase().includes(this.countryQuery().toLowerCase().trim()),
    ),
  );
  readonly selectedSummary = computed(
    () => this.countries.find((country) => country.code === this.selectedCountry())?.label ?? 'none',
  );
  readonly getCountryValue = (country: CountryOption) => country.code;
  readonly getCountryLabel = (country: CountryOption) => country.label;

  onSelectedCountryChange(value: unknown): void {
    this.selectedCountry.set(typeof value === 'string' ? value : null);
  }
}
`;

const COUNTRY_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[34rem] gap-4 rounded-3xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-muted)]">Country directory</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Search the release locale list and commit with keyboard or pointer selection.
    </p>
  </div>

  <div class="block w-full">
    <tng-autocomplete
      [options]="filteredCountries()"
      [value]="selectedCountry()"
      (valueChange)="onSelectedCountryChange($event)"
      [query]="countryQuery()"
      (queryChange)="countryQuery.set($event)"
      [getOptionValue]="getCountryValue"
      [getOptionLabel]="getCountryLabel"
      placeholder="Type a country"
      [ariaLabel]="'Country directory'"
    ></tng-autocomplete>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ selectedSummary() }}</p>
</section>
`;

const COUNTRY_TAILWIND_CSS_CODE = String.raw`/* No additional CSS file is required for this Tailwind example. */`;

const OWNER_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngAutocompleteComponent } from '@tailng-ui/components';

interface OwnerOption {
  readonly id: string;
  readonly name: string;
  readonly disabled?: boolean;
}

const OWNER_OPTIONS: readonly OwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen' },
  { id: 'mina', name: 'Mina Lee' },
  { id: 'omar', name: 'Omar Aziz', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel' },
]);

@Component({
  selector: 'app-docs-autocomplete-owner-example-plain',
  standalone: true,
  imports: [TngAutocompleteComponent],
  templateUrl: './docs-autocomplete-owner-example-plain.component.html',
  styleUrl: './docs-autocomplete-owner-example-plain.component.css',
})
export class DocsAutocompleteOwnerExamplePlainComponent {
  readonly owners = OWNER_OPTIONS;
  readonly selectedOwner = signal<string | null>('abigail');
  readonly ownerQuery = signal('');
  readonly filteredOwners = computed(() =>
    this.owners.filter((owner) =>
      owner.name.toLowerCase().includes(this.ownerQuery().toLowerCase().trim()),
    ),
  );
  readonly selectedSummary = computed(
    () => this.owners.find((owner) => owner.id === this.selectedOwner())?.name ?? 'none',
  );
  readonly getOwnerValue = (owner: OwnerOption) => owner.id;
  readonly getOwnerLabel = (owner: OwnerOption) => owner.name;
  readonly isOwnerDisabled = (owner: OwnerOption) => owner.disabled === true;

  onSelectedOwnerChange(value: unknown): void {
    this.selectedOwner.set(typeof value === 'string' ? value : null);
  }
}
`;

const OWNER_PLAIN_HTML_CODE = String.raw`<section class="docs-autocomplete-owner-example">
  <div class="docs-autocomplete-owner-example__header">
    <span class="docs-autocomplete-owner-example__eyebrow">Release owner handoff</span>
    <p class="docs-autocomplete-owner-example__copy">
      Disabled owners stay visible for context while the next available handoff stays searchable.
    </p>
  </div>

  <div class="docs-autocomplete-owner-example__control">
    <tng-autocomplete
      [options]="filteredOwners()"
      [value]="selectedOwner()"
      (valueChange)="onSelectedOwnerChange($event)"
      [query]="ownerQuery()"
      (queryChange)="ownerQuery.set($event)"
      [getOptionValue]="getOwnerValue"
      [getOptionLabel]="getOwnerLabel"
      [isOptionDisabled]="isOwnerDisabled"
      placeholder="Assign a release owner"
      [ariaLabel]="'Release owner handoff'"
    ></tng-autocomplete>
  </div>

  <p class="docs-autocomplete-owner-example__summary">
    Selected: {{ selectedSummary() }}
  </p>
</section>
`;

const OWNER_PLAIN_CSS_CODE = String.raw`.docs-autocomplete-owner-example {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 34rem);
  margin-inline: auto;
  padding: 1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1.1rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
}

.docs-autocomplete-owner-example__header {
  display: grid;
  gap: 0.35rem;
}

.docs-autocomplete-owner-example__eyebrow {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-autocomplete-owner-example__copy,
.docs-autocomplete-owner-example__summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-autocomplete-owner-example__control {
  display: block;
  width: 100%;
}

.docs-autocomplete-owner-example__control tng-autocomplete {
  display: block;
  width: 100%;
}
`;

const OWNER_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngAutocompleteComponent } from '@tailng-ui/components';

interface OwnerOption {
  readonly id: string;
  readonly name: string;
  readonly disabled?: boolean;
}

const OWNER_OPTIONS: readonly OwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen' },
  { id: 'mina', name: 'Mina Lee' },
  { id: 'omar', name: 'Omar Aziz', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel' },
]);

@Component({
  selector: 'app-docs-autocomplete-owner-example-tailwind',
  standalone: true,
  imports: [TngAutocompleteComponent],
  templateUrl: './docs-autocomplete-owner-example-tailwind.component.html',
  styleUrl: './docs-autocomplete-owner-example-tailwind.component.css',
})
export class DocsAutocompleteOwnerExampleTailwindComponent {
  readonly owners = OWNER_OPTIONS;
  readonly selectedOwner = signal<string | null>('mina');
  readonly ownerQuery = signal('');
  readonly filteredOwners = computed(() =>
    this.owners.filter((owner) =>
      owner.name.toLowerCase().includes(this.ownerQuery().toLowerCase().trim()),
    ),
  );
  readonly selectedSummary = computed(
    () => this.owners.find((owner) => owner.id === this.selectedOwner())?.name ?? 'none',
  );
  readonly getOwnerValue = (owner: OwnerOption) => owner.id;
  readonly getOwnerLabel = (owner: OwnerOption) => owner.name;
  readonly isOwnerDisabled = (owner: OwnerOption) => owner.disabled === true;

  onSelectedOwnerChange(value: unknown): void {
    this.selectedOwner.set(typeof value === 'string' ? value : null);
  }
}
`;

const OWNER_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[34rem] gap-4 rounded-3xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-muted)]">Release owner handoff</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Disabled owners stay visible for context while the next available handoff stays searchable.
    </p>
  </div>

  <div class="block w-full">
    <tng-autocomplete
      [options]="filteredOwners()"
      [value]="selectedOwner()"
      (valueChange)="onSelectedOwnerChange($event)"
      [query]="ownerQuery()"
      (queryChange)="ownerQuery.set($event)"
      [getOptionValue]="getOwnerValue"
      [getOptionLabel]="getOwnerLabel"
      [isOptionDisabled]="isOwnerDisabled"
      placeholder="Assign a release owner"
      [ariaLabel]="'Release owner handoff'"
    ></tng-autocomplete>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ selectedSummary() }}</p>
</section>
`;

const OWNER_TAILWIND_CSS_CODE = String.raw`/* No additional CSS file is required for this Tailwind example. */`;

function resolveCountryLabel(value: string | null): string {
  return COUNTRY_OPTIONS.find((country) => country.code === value)?.label ?? 'none';
}

function resolveOwnerLabel(value: string | null): string {
  return OWNER_OPTIONS.find((owner) => owner.id === value)?.name ?? 'none';
}

function resolveSignalFormCountryLabel(value: string | null): string {
  return SIGNAL_FORM_COUNTRIES.find((country) => country.code === value)?.label ?? 'none';
}

function resolveSignalFormCurrencyLabel(value: string | null): string {
  return SIGNAL_FORM_CURRENCIES.find((currency) => currency.code === value)?.label ?? 'none';
}

function ensureFlagStylesheet(documentRef: Document): void {
  if (documentRef.getElementById(FLAG_STYLESHEET_ID)) {
    return;
  }

  const linkElement = documentRef.createElement('link');
  linkElement.id = FLAG_STYLESHEET_ID;
  linkElement.rel = 'stylesheet';
  linkElement.href = FLAG_STYLESHEET_HREF;
  documentRef.head.appendChild(linkElement);
}

@Component({
  selector: 'app-autocomplete-examples-page',
  imports: [
    TngAutocompleteComponent,
    TngButtonComponent,
    FormField,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
  ],
  templateUrl: './autocomplete-examples-page.component.html',
  styleUrls: ['./autocomplete-examples-page.component.css'],
})
export class AutocompleteExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;
  protected readonly countries = COUNTRY_OPTIONS;
  protected readonly releaseOwners = OWNER_OPTIONS;
  protected readonly getCountryValue = (country: CountryOption): string => country.code;
  protected readonly getCountryLabel = (country: CountryOption): string => country.label;
  protected readonly getOwnerValue = (owner: OwnerOption): string => owner.id;
  protected readonly getOwnerLabel = (owner: OwnerOption): string => owner.name;
  protected readonly isOwnerDisabled = (owner: OwnerOption): boolean => owner.disabled === true;
  protected readonly currencies = CURRENCY_OPTIONS;
  protected readonly getCurrencyValue = (currency: CurrencyOption): string => currency.code;
  protected readonly getCurrencyLabel = (currency: CurrencyOption): string => currency.label;
  protected readonly signalFormCountries = SIGNAL_FORM_COUNTRIES;
  protected readonly signalFormCurrencies = SIGNAL_FORM_CURRENCIES;
  protected readonly getSignalFormCountryValue = (country: CountryOption): string => country.code;
  protected readonly getSignalFormCountryLabel = (country: CountryOption): string => country.label;
  protected readonly getSignalFormCurrencyValue = (currency: CurrencyOption): string => currency.code;
  protected readonly getSignalFormCurrencyLabel = (currency: CurrencyOption): string => currency.label;

  protected readonly formCountryValue = signal<string | null>('jp');
  protected readonly countryPlainValue = signal<string | null>('no');
  protected readonly countryTailwindValue = signal<string | null>('ch');
  protected readonly ownerPlainValue = signal<string | null>('abigail');
  protected readonly ownerTailwindValue = signal<string | null>('mina');
  protected readonly formCountryQuery = signal('');
  protected readonly countryPlainQuery = signal('');
  protected readonly countryTailwindQuery = signal('');
  protected readonly ownerPlainQuery = signal('');
  protected readonly ownerTailwindQuery = signal('');
  protected readonly programmaticInputQuery = signal('');
  protected readonly programmaticAutocompleteQuery = signal('');
  protected readonly programmaticCountryValue = signal<string | null>('dk');
  protected readonly programmaticAutocompleteOpen = signal(false);
  protected readonly signalFormCountryQuery = signal('');
  protected readonly signalFormCurrencyQuery = signal('');
  protected readonly signalFormData = signal<AutocompleteSignalFormData>({
    country: 'is',
    currency: 'isk',
  });
  protected readonly signalForm = form(this.signalFormData);
  protected readonly signalFormSubmitted = signal(false);
  protected readonly signalFormSubmittedSummary = signal('');

  public constructor() {
    ensureFlagStylesheet(this.documentRef);
  }

  protected readonly formCountrySummary = computed(() =>
    resolveCountryLabel(this.formCountryValue()),
  );
  protected readonly countryPlainSummary = computed(() => resolveCountryLabel(this.countryPlainValue()));
  protected readonly countryTailwindSummary = computed(() => resolveCountryLabel(this.countryTailwindValue()));
  protected readonly ownerPlainSummary = computed(() => resolveOwnerLabel(this.ownerPlainValue()));
  protected readonly ownerTailwindSummary = computed(() => resolveOwnerLabel(this.ownerTailwindValue()));
  protected readonly filteredFormCountryOptions = computed(() =>
    filterOptions(this.countries, this.formCountryQuery(), this.getCountryLabel),
  );
  protected readonly filteredCountryPlainOptions = computed(() =>
    filterOptions(this.countries, this.countryPlainQuery(), this.getCountryLabel),
  );
  protected readonly filteredCountryTailwindOptions = computed(() =>
    filterOptions(this.countries, this.countryTailwindQuery(), this.getCountryLabel),
  );
  protected readonly filteredOwnerPlainOptions = computed(() =>
    filterOptions(this.releaseOwners, this.ownerPlainQuery(), this.getOwnerLabel),
  );
  protected readonly filteredOwnerTailwindOptions = computed(() =>
    filterOptions(this.releaseOwners, this.ownerTailwindQuery(), this.getOwnerLabel),
  );
  protected readonly filteredProgrammaticCountryOptions = computed(() =>
    filterOptions(
      this.countries,
      this.programmaticAutocompleteQuery(),
      this.getCountryLabel,
    ),
  );
  protected readonly programmaticCountrySummary = computed(() =>
    resolveCountryLabel(this.programmaticCountryValue()),
  );
  protected readonly filteredSignalFormCountries = computed(() =>
    filterOptions(
      this.signalFormCountries,
      this.signalFormCountryQuery(),
      this.getSignalFormCountryLabel,
    ),
  );
  protected readonly filteredSignalFormCurrencies = computed(() =>
    filterOptions(
      this.signalFormCurrencies,
      this.signalFormCurrencyQuery(),
      this.getSignalFormCurrencyLabel,
    ),
  );
  protected readonly countryPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'autocomplete-country-plain.component.ts', code: COUNTRY_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'autocomplete-country-plain.component.html', code: COUNTRY_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'autocomplete-country-plain.component.css', code: COUNTRY_PLAIN_CSS_CODE },
  ]);

  protected readonly countryTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'autocomplete-country-tailwind.component.ts', code: COUNTRY_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'autocomplete-country-tailwind.component.html', code: COUNTRY_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'autocomplete-country-tailwind.component.css', code: COUNTRY_TAILWIND_CSS_CODE },
  ]);

  protected readonly ownerPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'autocomplete-owner-plain.component.ts', code: OWNER_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'autocomplete-owner-plain.component.html', code: OWNER_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'autocomplete-owner-plain.component.css', code: OWNER_PLAIN_CSS_CODE },
  ]);

  protected readonly ownerTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'autocomplete-owner-tailwind.component.ts', code: OWNER_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'autocomplete-owner-tailwind.component.html', code: OWNER_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'autocomplete-owner-tailwind.component.css', code: OWNER_TAILWIND_CSS_CODE },
  ]);

  protected onCountryPlainChange(value: unknown): void {
    this.countryPlainValue.set(typeof value === 'string' ? value : null);
  }

  protected onFormCountryChange(value: unknown): void {
    this.formCountryValue.set(typeof value === 'string' ? value : null);
  }

  protected onCountryTailwindChange(value: unknown): void {
    this.countryTailwindValue.set(typeof value === 'string' ? value : null);
  }

  protected onOwnerPlainChange(value: unknown): void {
    this.ownerPlainValue.set(typeof value === 'string' ? value : null);
  }

  protected onOwnerTailwindChange(value: unknown): void {
    this.ownerTailwindValue.set(typeof value === 'string' ? value : null);
  }

  protected onProgrammaticCountryChange(value: unknown): void {
    this.programmaticCountryValue.set(typeof value === 'string' ? value : null);
  }

  protected applyProgrammaticCountryQuery(): void {
    this.programmaticAutocompleteQuery.set(this.programmaticInputQuery().trim());
    this.programmaticAutocompleteOpen.set(true);
  }

  protected readonly getFlagClass = (country: CountryOption): string =>

    `flag-chip country-flag country-flag--${country.code.toLowerCase()}`;

  protected onSignalFormCountryChange(value: unknown): void {
    const countryCode = typeof value === 'string' ? value : '';
    const currencyCode = COUNTRY_TO_CURRENCY_CODE[countryCode] ?? '';

    this.signalFormData.update((current) => ({
      ...current,
      country: countryCode,
      currency: currencyCode,
    }));
  }

  protected onSignalFormCurrencyChange(value: unknown): void {
    if (typeof value !== 'string') {
      return;
    }

    this.signalFormData.update((current) => ({
      ...current,
      currency: value,
    }));
  }

  protected onSignalFormSubmit(event: Event): void {
    event.preventDefault();
    const { country, currency } = this.signalFormData();
    this.signalFormSubmittedSummary.set(
      `Country: ${resolveSignalFormCountryLabel(country)} | Currency: ${resolveSignalFormCurrencyLabel(currency)}`,
    );
    this.signalFormSubmitted.set(true);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
