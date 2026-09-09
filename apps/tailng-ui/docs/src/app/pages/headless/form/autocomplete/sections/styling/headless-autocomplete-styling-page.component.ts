import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngAutocomplete,
  TngAutocompleteContent,
  TngAutocompleteIcon,
  TngAutocompleteListbox,
  TngAutocompleteOption,
  TngAutocompleteOverlay,
  TngAutocompleteTrigger,
  TngAutocompleteTriggerContainer,
} from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../autocomplete.util';

interface ContractRow {
  readonly selector: string;
  readonly details: string;
}

interface PersonOption {
  readonly id: string;
  readonly label: string;
}

const PEOPLE: readonly PersonOption[] = Object.freeze([
  { id: 'abigail', label: 'Abigail Chen' },
  { id: 'kiran', label: 'Kiran Rao' },
  { id: 'lucy', label: 'Lucy Martin' },
  { id: 'mina', label: 'Mina Lee' },
  { id: 'omar', label: 'Omar Aziz' },
]);

const STATE_SELECTOR_CODE = String.raw`[data-slot='autocomplete'][data-state='open'] { ... }
[data-slot='autocomplete'][data-invalid] [data-slot='autocomplete-trigger-container'] { ... }
[data-slot='autocomplete-option'][data-active] { ... }
[data-slot='autocomplete-option'][data-selected] { ... }
[data-slot='autocomplete-option'][data-disabled] { ... }
`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngAutocomplete,
  TngAutocompleteContent,
  TngAutocompleteIcon,
  TngAutocompleteListbox,
  TngAutocompleteOption,
  TngAutocompleteOverlay,
  TngAutocompleteTrigger,
  TngAutocompleteTriggerContainer,
} from '@tailng-ui/primitives';

interface ReleaseOwnerAutocompleteOption {
  readonly id: string;
  readonly label: string;
}

const RELEASE_OWNER_AUTOCOMPLETE_OPTIONS: readonly ReleaseOwnerAutocompleteOption[] = Object.freeze([
  { id: 'abigail', label: 'Abigail Chen' },
  { id: 'kiran', label: 'Kiran Rao' },
  { id: 'lucy', label: 'Lucy Martin' },
  { id: 'mina', label: 'Mina Lee' },
  { id: 'omar', label: 'Omar Aziz' },
]);

@Component({
  selector: 'app-headless-release-owner-autocomplete-shell-plain',
  standalone: true,
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteIcon,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  templateUrl: './headless-release-owner-autocomplete-shell-plain.component.html',
  styleUrl: './headless-release-owner-autocomplete-shell-plain.component.css',
})
export class HeadlessReleaseOwnerAutocompleteShellPlainComponent {
  readonly releaseOwnerAutocompleteOptions = RELEASE_OWNER_AUTOCOMPLETE_OPTIONS;
  readonly releaseOwnerAutocompleteOpen = signal(false);
  readonly releaseOwnerAutocompleteValue = signal<string | null>('mina');
  readonly releaseOwnerAutocompleteQuery = signal('');

  readonly releaseOwnerAutocompleteFilteredOptions = computed(() => {
    const normalizedQuery = this.releaseOwnerAutocompleteQuery().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.releaseOwnerAutocompleteOptions;
    }

    return this.releaseOwnerAutocompleteOptions.filter((person) =>
      person.label.toLowerCase().includes(normalizedQuery),
    );
  });

  readonly releaseOwnerAutocompleteSelectedLabel = computed(
    () =>
      this.releaseOwnerAutocompleteOptions.find(
        (person) => person.id === this.releaseOwnerAutocompleteValue(),
      )?.label ?? 'none',
  );

  readonly releaseOwnerAutocompleteDisplayText = computed(() =>
    this.releaseOwnerAutocompleteOpen()
      ? this.releaseOwnerAutocompleteQuery()
      : (
          this.releaseOwnerAutocompleteSelectedLabel() === 'none'
            ? ''
            : this.releaseOwnerAutocompleteSelectedLabel()
        ),
  );

  onReleaseOwnerAutocompleteInput(event: Event): void {
    this.releaseOwnerAutocompleteQuery.set((event.target as HTMLInputElement).value);
  }
}
`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-release-owner-autocomplete-shell">
  <div class="docs-release-owner-autocomplete-shell__header">
    <span class="docs-release-owner-autocomplete-shell__kicker">Release owner</span>
    <p class="docs-release-owner-autocomplete-shell__copy">Assign a shipping owner before the release branch opens.</p>
  </div>

  <section
    tngAutocomplete
    class="docs-release-owner-autocomplete-shell__control"
    [open]="releaseOwnerAutocompleteOpen()"
    (openChange)="releaseOwnerAutocompleteOpen.set($event)"
    [value]="releaseOwnerAutocompleteValue()"
    (valueChange)="releaseOwnerAutocompleteValue.set($event)"
    [query]="releaseOwnerAutocompleteQuery()"
    (queryChange)="releaseOwnerAutocompleteQuery.set($event)"
  >
    <div tngAutocompleteTriggerContainer class="docs-release-owner-autocomplete-shell__trigger">
      <input
        tngAutocompleteTrigger
        type="text"
        [value]="releaseOwnerAutocompleteDisplayText()"
        (input)="onReleaseOwnerAutocompleteInput($event)"
        aria-label="Release owner"
        placeholder="Search people"
      />
      <span tngAutocompleteIcon aria-hidden="true">⌄</span>
    </div>

    <div tngAutocompleteContent class="contents">
      <div tngAutocompleteOverlay class="docs-release-owner-autocomplete-shell__overlay">
        <ul tngAutocompleteListbox [value]="releaseOwnerAutocompleteValue()">
          @for (person of releaseOwnerAutocompleteFilteredOptions(); track person.id) {
            <li
              tngAutocompleteOption
              class="docs-release-owner-autocomplete-shell__option"
              [tngValue]="person.id"
            >
              {{ person.label }}
            </li>
          }
        </ul>
      </div>
    </div>
  </section>
</section>
`;

const PLAIN_CSS_CODE = String.raw`.docs-release-owner-autocomplete-shell {
  display: grid;
  gap: 1rem;
  inline-size: min(100%, 34rem);
  margin-inline: auto;
  padding: 1rem;
  border: 1px solid #334155;
  border-radius: 1.25rem;
  background: #111827;
}

.docs-release-owner-autocomplete-shell__header {
  display: grid;
  gap: 0.35rem;
}

.docs-release-owner-autocomplete-shell__kicker {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #93c5fd;
}

.docs-release-owner-autocomplete-shell__copy {
  margin: 0;
  color: #cbd5e1;
}

.docs-release-owner-autocomplete-shell__control {
  display: grid;
  gap: 0.5rem;
}

.docs-release-owner-autocomplete-shell__trigger {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  border: 1px solid #334155;
  border-radius: 1rem;
  background: #0f172a;
}

.docs-release-owner-autocomplete-shell__trigger:has(:focus-visible) {
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
}

.docs-release-owner-autocomplete-shell__trigger [data-slot='autocomplete-trigger'] {
  flex: 1;
  min-width: 0;
  padding: 0.85rem 1rem;
  border: 0;
  background: transparent;
  color: #f8fafc;
  outline: none;
}

.docs-release-owner-autocomplete-shell__trigger [data-slot='autocomplete-trigger']::placeholder,
.docs-release-owner-autocomplete-shell__trigger [data-slot='autocomplete-icon'] {
  color: #94a3b8;
}

.docs-release-owner-autocomplete-shell__trigger [data-slot='autocomplete-icon'] {
  margin-inline-end: 1rem;
}

.docs-release-owner-autocomplete-shell__overlay {
  border: 1px solid #334155;
  border-radius: 1rem;
  background: #0f172a;
  max-inline-size: min(92vw, 34rem);
  overflow: auto;
  padding: 0.5rem;
  box-shadow: 0 24px 48px -36px rgba(15, 23, 42, 0.88);
}

.docs-release-owner-autocomplete-shell__overlay [data-slot='autocomplete-listbox'] {
  display: grid;
  gap: 0.3rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.docs-release-owner-autocomplete-shell__option {
  border: 1px solid transparent;
  border-radius: 0.8rem;
  padding: 0.75rem 0.9rem;
  color: #e2e8f0;
}

.docs-release-owner-autocomplete-shell__option[data-active] {
  background: #172554;
  border-color: #1d4ed8;
}

.docs-release-owner-autocomplete-shell__option[data-selected] {
  background: #082f49;
  border-color: #38bdf8;
  color: #bae6fd;
}
`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngAutocomplete,
  TngAutocompleteContent,
  TngAutocompleteIcon,
  TngAutocompleteListbox,
  TngAutocompleteOption,
  TngAutocompleteOverlay,
  TngAutocompleteTrigger,
  TngAutocompleteTriggerContainer,
} from '@tailng-ui/primitives';

interface ReleaseOwnerAutocompleteOption {
  readonly id: string;
  readonly label: string;
}

const RELEASE_OWNER_AUTOCOMPLETE_OPTIONS: readonly ReleaseOwnerAutocompleteOption[] = Object.freeze([
  { id: 'abigail', label: 'Abigail Chen' },
  { id: 'kiran', label: 'Kiran Rao' },
  { id: 'lucy', label: 'Lucy Martin' },
  { id: 'mina', label: 'Mina Lee' },
  { id: 'omar', label: 'Omar Aziz' },
]);

@Component({
  selector: 'app-headless-release-owner-autocomplete-shell-tailwind',
  standalone: true,
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteIcon,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  templateUrl: './headless-release-owner-autocomplete-shell-tailwind.component.html',
  styleUrl: './headless-release-owner-autocomplete-shell-tailwind.component.css',
})
export class HeadlessReleaseOwnerAutocompleteShellTailwindComponent {
  readonly releaseOwnerAutocompleteOptions = RELEASE_OWNER_AUTOCOMPLETE_OPTIONS;
  readonly releaseOwnerAutocompleteOpen = signal(false);
  readonly releaseOwnerAutocompleteValue = signal<string | null>('kiran');
  readonly releaseOwnerAutocompleteQuery = signal('');

  readonly releaseOwnerAutocompleteFilteredOptions = computed(() => {
    const normalizedQuery = this.releaseOwnerAutocompleteQuery().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.releaseOwnerAutocompleteOptions;
    }

    return this.releaseOwnerAutocompleteOptions.filter((person) =>
      person.label.toLowerCase().includes(normalizedQuery),
    );
  });

  readonly releaseOwnerAutocompleteSelectedLabel = computed(
    () =>
      this.releaseOwnerAutocompleteOptions.find(
        (person) => person.id === this.releaseOwnerAutocompleteValue(),
      )?.label ?? 'none',
  );

  readonly releaseOwnerAutocompleteDisplayText = computed(() =>
    this.releaseOwnerAutocompleteOpen()
      ? this.releaseOwnerAutocompleteQuery()
      : (
          this.releaseOwnerAutocompleteSelectedLabel() === 'none'
            ? ''
            : this.releaseOwnerAutocompleteSelectedLabel()
        ),
  );

  onReleaseOwnerAutocompleteInput(event: Event): void {
    this.releaseOwnerAutocompleteQuery.set((event.target as HTMLInputElement).value);
  }
}
`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[34rem] gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
  <div class="grid gap-1">
    <span class="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-500">Release owner</span>
    <p class="m-0 text-sm text-slate-600">Assign a shipping owner before the release branch opens.</p>
  </div>

  <section
    tngAutocomplete
    class="grid gap-2"
    [open]="releaseOwnerAutocompleteOpen()"
    (openChange)="releaseOwnerAutocompleteOpen.set($event)"
    [value]="releaseOwnerAutocompleteValue()"
    (valueChange)="releaseOwnerAutocompleteValue.set($event)"
    [query]="releaseOwnerAutocompleteQuery()"
    (queryChange)="releaseOwnerAutocompleteQuery.set($event)"
  >
    <div
      tngAutocompleteTriggerContainer
      class="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10"
    >
      <input
        tngAutocompleteTrigger
        type="text"
        class="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        [value]="releaseOwnerAutocompleteDisplayText()"
        (input)="onReleaseOwnerAutocompleteInput($event)"
        aria-label="Release owner"
        placeholder="Search people"
      />
      <span tngAutocompleteIcon aria-hidden="true" class="mr-4 text-slate-400">⌄</span>
    </div>

    <div tngAutocompleteContent class="contents">
      <div tngAutocompleteOverlay class="rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10">
        <ul tngAutocompleteListbox [value]="releaseOwnerAutocompleteValue()" class="grid gap-1">
          @for (person of releaseOwnerAutocompleteFilteredOptions(); track person.id) {
            <li
              tngAutocompleteOption
              class="rounded-xl border border-transparent px-3 py-2 text-sm text-slate-700 transition data-[active]:border-slate-200 data-[active]:bg-slate-50 data-[selected]:border-emerald-200 data-[selected]:bg-emerald-50 data-[selected]:font-semibold data-[selected]:text-emerald-700"
              [tngValue]="person.id"
            >
              {{ person.label }}
            </li>
          }
        </ul>
      </div>
    </div>
  </section>
</section>
`;

const TAILWIND_CSS_CODE = String.raw`/* No additional CSS file is required for this Tailwind example. */
`;

function findPersonLabel(id: string | null): string | null {
  if (id === null) {
    return null;
  }

  return PEOPLE.find((person) => person.id === id)?.label ?? null;
}

function filterPeople(query: string): readonly PersonOption[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === '') {
    return PEOPLE;
  }

  return PEOPLE.filter((person) => person.label.toLowerCase().includes(normalizedQuery));
}

@Component({
  selector: 'app-headless-autocomplete-styling-page',
  imports: [
    TngCodeBlockComponent,
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteIcon,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './headless-autocomplete-styling-page.component.html',
  styleUrl: './headless-autocomplete-styling-page.component.css',
})
export class HeadlessAutocompleteStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly contractRows: readonly ContractRow[] = Object.freeze([
    { selector: '[data-slot="autocomplete"]', details: 'Root state owner. Use for state-driven styling only, not layout assumptions.' },
    { selector: '[data-slot="autocomplete-trigger-container"]', details: 'Primary input shell. Usually the main border, background, and focus-ring surface.' },
    { selector: '[data-slot="autocomplete-trigger"]', details: 'Native input. Keep it visually quiet so the shell owns the focus treatment.' },
    { selector: '[data-slot="autocomplete-icon"]', details: 'Optional icon or affordance slot beside the trigger.' },
    { selector: '[data-slot="autocomplete-overlay"]', details: 'Portaled overlay surface. Style it directly because it moves to document.body.' },
    { selector: '--tng-autocomplete-z-overlay', details: 'Controls the portaled overlay stacking level; falls back to --tng-z-overlay.' },
    { selector: '[data-slot="autocomplete-listbox"]', details: 'Listbox stack inside the overlay.' },
    { selector: '[data-slot="autocomplete-option"]', details: 'Interactive option rows. Read active/selected/disabled state attributes here.' },
    { selector: '[data-slot="autocomplete-empty"]', details: 'Reserved empty-state slot for no results.' },
  ]);

  protected readonly stateSelectorCode = STATE_SELECTOR_CODE;

  protected readonly plainOpen = signal(false);
  protected readonly plainValue = signal<string | null>('mina');
  protected readonly plainQuery = signal('');
  protected readonly tailwindOpen = signal(false);
  protected readonly tailwindValue = signal<string | null>('kiran');
  protected readonly tailwindQuery = signal('');

  protected readonly plainDisplayText = computed(() =>
    this.plainOpen() ? this.plainQuery() : (findPersonLabel(this.plainValue()) ?? ''),
  );
  protected readonly plainFilteredPeople = computed(() => filterPeople(this.plainQuery()));

  protected readonly tailwindDisplayText = computed(() =>
    this.tailwindOpen() ? this.tailwindQuery() : (findPersonLabel(this.tailwindValue()) ?? ''),
  );
  protected readonly tailwindFilteredPeople = computed(() => filterPeople(this.tailwindQuery()));

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-release-owner-autocomplete-shell-plain.component.ts', code: PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-release-owner-autocomplete-shell-plain.component.html', code: PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-release-owner-autocomplete-shell-plain.component.css', code: PLAIN_CSS_CODE },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-release-owner-autocomplete-shell-tailwind.component.ts', code: TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-release-owner-autocomplete-shell-tailwind.component.html', code: TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-release-owner-autocomplete-shell-tailwind.component.css', code: TAILWIND_CSS_CODE },
  ]);

  protected onPlainInput(event: Event): void {
    this.plainQuery.set((event.target as HTMLInputElement).value);
  }

  protected onTailwindInput(event: Event): void {
    this.tailwindQuery.set((event.target as HTMLInputElement).value);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
