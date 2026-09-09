import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngMultiAutocomplete,
  TngMultiAutocompleteChip,
  TngMultiAutocompleteContent,
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
  TngMultiAutocompleteOverlay,
  TngMultiAutocompleteTrigger,
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
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../multi-autocomplete.util';

interface OwnerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly disabled?: boolean;
}

type MultiAutocompleteValueChange = unknown;

const OWNER_OPTIONS: readonly OwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

const CSS_CONTRACT_CODE = String.raw`[data-slot='multi-autocomplete']
[data-slot='multi-autocomplete-trigger']
[data-slot='multi-autocomplete-chip']
[data-slot='multi-autocomplete-content']
[data-slot='multi-autocomplete-overlay']
[data-slot='multi-autocomplete-listbox']
[data-slot='multi-autocomplete-option']
[data-slot='multi-autocomplete-empty']

/* Portaled overlay stacking level; falls back to --tng-z-overlay. */
--tng-multi-autocomplete-z-overlay: 80;`;

const STATE_SELECTOR_CODE = String.raw`[data-slot='multi-autocomplete'][data-state='open']
[data-slot='multi-autocomplete'][data-disabled]
[data-slot='multi-autocomplete'][data-invalid]
[data-slot='multi-autocomplete-option'][data-active]
[data-slot='multi-autocomplete-option'][data-selected]
[data-slot='multi-autocomplete-option'][data-selected][data-active]
[data-slot='multi-autocomplete-option'][data-disabled]`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngMultiAutocomplete,
  TngMultiAutocompleteChip,
  TngMultiAutocompleteContent,
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
  TngMultiAutocompleteOverlay,
  TngMultiAutocompleteTrigger,
} from '@tailng-ui/primitives';

interface HeadlessStylingPlainReleaseOwnerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly disabled?: boolean;
}

const HEADLESS_STYLING_PLAIN_RELEASE_OWNER_OPTIONS: readonly HeadlessStylingPlainReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

@Component({
  selector: 'app-headless-multi-autocomplete-styling-plain',
  standalone: true,
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteChip,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  templateUrl: './headless-multi-autocomplete-styling-plain.component.html',
  styleUrl: './headless-multi-autocomplete-styling-plain.component.css',
})
export class HeadlessMultiAutocompleteStylingPlainComponent {
  readonly headlessStylingPlainReleaseOwners = HEADLESS_STYLING_PLAIN_RELEASE_OWNER_OPTIONS;
  readonly headlessStylingPlainReleaseOwnersOpen = signal(false);
  readonly headlessStylingPlainReleaseOwnerQuery = signal('');
  readonly headlessStylingPlainSelectedOwnerIds = signal<readonly string[]>(['mina']);

  readonly headlessStylingPlainFilteredReleaseOwners = computed(() => {
    const normalizedQuery = this.headlessStylingPlainReleaseOwnerQuery().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.headlessStylingPlainReleaseOwners;
    }

    return this.headlessStylingPlainReleaseOwners.filter((owner) =>
      (owner.name + ' ' + owner.team).toLowerCase().includes(normalizedQuery),
    );
  });

  onHeadlessStylingPlainReleaseOwnerInput(event: Event): void {
    this.headlessStylingPlainReleaseOwnerQuery.set((event.target as HTMLInputElement).value);
  }

  onHeadlessStylingPlainReleaseOwnerValueChange(value: unknown): void {
    this.headlessStylingPlainSelectedOwnerIds.set(this.toHeadlessStylingPlainValueArray(value));
  }

  resolveHeadlessStylingPlainReleaseOwnerLabel(id: string): string {
    return this.headlessStylingPlainReleaseOwners.find((owner) => owner.id === id)?.name ?? id;
  }

  isHeadlessStylingPlainReleaseOwnerDisabled(owner: HeadlessStylingPlainReleaseOwnerOption): boolean {
    return owner.disabled === true;
  }

  private toHeadlessStylingPlainValueArray(value: unknown): readonly string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => (typeof item === 'string' ? item : String(item)))
      .filter((item) => item.length > 0);
  }
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-headless-multi-autocomplete-styling-plain-shell">
  <div class="docs-headless-multi-autocomplete-styling-plain-header">
    <span class="docs-headless-multi-autocomplete-styling-plain-kicker">Release owners</span>
    <p class="docs-headless-multi-autocomplete-styling-plain-copy">
      Keep the primitive native while your wrapper card and option rows carry the visual style.
    </p>
  </div>

  <section
    tngMultiAutocomplete
    class="docs-headless-multi-autocomplete-styling-plain-control"
    [open]="headlessStylingPlainReleaseOwnersOpen()"
    (openChange)="headlessStylingPlainReleaseOwnersOpen.set($event)"
    [query]="headlessStylingPlainReleaseOwnerQuery()"
    (queryChange)="headlessStylingPlainReleaseOwnerQuery.set($event)"
    [value]="headlessStylingPlainSelectedOwnerIds()"
    (valueChange)="onHeadlessStylingPlainReleaseOwnerValueChange($event)"
  >
    @for (id of headlessStylingPlainSelectedOwnerIds(); track id) {
      <span tngMultiAutocompleteChip [tngValue]="id">{{ resolveHeadlessStylingPlainReleaseOwnerLabel(id) }}</span>
    }

    <input
      tngMultiAutocompleteTrigger
      type="text"
      [value]="headlessStylingPlainReleaseOwnerQuery()"
      (input)="onHeadlessStylingPlainReleaseOwnerInput($event)"
      placeholder="Search release owners"
      aria-label="Release owners"
    />

    <div tngMultiAutocompleteContent class="contents">
      <div class="docs-headless-multi-autocomplete-styling-plain-overlay" tngMultiAutocompleteOverlay>
        <ul tngMultiAutocompleteListbox [value]="headlessStylingPlainSelectedOwnerIds()">
          @for (owner of headlessStylingPlainFilteredReleaseOwners(); track owner.id) {
            <li
              tngMultiAutocompleteOption
              class="docs-headless-multi-autocomplete-styling-plain-option"
              [tngValue]="owner.id"
              [disabled]="isHeadlessStylingPlainReleaseOwnerDisabled(owner)"
            >
              <span>{{ owner.name }}</span>
              <small>{{ owner.team }}</small>
            </li>
          }
        </ul>
      </div>
    </div>
  </section>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-headless-multi-autocomplete-styling-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 1rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
}

.docs-headless-multi-autocomplete-styling-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-headless-multi-autocomplete-styling-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-headless-multi-autocomplete-styling-plain-copy {
  margin: 0;
  color: #475569;
}

.docs-headless-multi-autocomplete-styling-plain-control {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  min-height: 3rem;
  padding: 0.45rem;
  border: 1px solid #94a3b8;
  border-radius: 1rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.docs-headless-multi-autocomplete-styling-plain-control [data-slot='multi-autocomplete-chip'] {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2rem;
  padding: 0.375rem 0.8rem;
  border: 1px solid #dbeafe;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.15;
  white-space: nowrap;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 1px 2px rgba(37, 99, 235, 0.08);
}

.docs-headless-multi-autocomplete-styling-plain-control [data-slot='multi-autocomplete-chip']:focus-visible {
  border-color: #60a5fa;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 0 0 2px rgba(37, 99, 235, 0.14);
}

.docs-headless-multi-autocomplete-styling-plain-control [data-slot='multi-autocomplete-trigger'] {
  flex: 1 1 8rem;
  min-width: 8rem;
  align-self: center;
  border: 0;
  background: transparent;
  color: #0f172a;
  outline: none;
  font-size: 0.95rem;
}

.docs-headless-multi-autocomplete-styling-plain-overlay[data-slot='multi-autocomplete-overlay'] {
  max-inline-size: min(100vw - 2rem, 36rem);
  border-color: #dbeafe;
  background: #ffffff;
}

.docs-headless-multi-autocomplete-styling-plain-option {
  display: grid;
  gap: 0.2rem;
  border-radius: 0.85rem;
  padding: 0.8rem 0.95rem;
  border: 1px solid transparent;
  cursor: pointer;
  color: #0f172a;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease,
    color 140ms ease;
}

.docs-headless-multi-autocomplete-styling-plain-option small {
  color: #64748b;
}

.docs-headless-multi-autocomplete-styling-plain-option[data-active] {
  background: #f8fafc;
  border-color: #cbd5e1;
  box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.08);
}

.docs-headless-multi-autocomplete-styling-plain-option[data-active] small {
  color: #475569;
}

.docs-headless-multi-autocomplete-styling-plain-option[data-selected] {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 1px 2px rgba(37, 99, 235, 0.08);
}

.docs-headless-multi-autocomplete-styling-plain-option[data-selected] small {
  color: #2563eb;
}

.docs-headless-multi-autocomplete-styling-plain-option[data-selected][data-active] {
  background: #dbeafe;
  border-color: #60a5fa;
  color: #1e40af;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 0 0 2px rgba(37, 99, 235, 0.12);
}

.docs-headless-multi-autocomplete-styling-plain-option[data-selected][data-active] small {
  color: #1d4ed8;
}

.docs-headless-multi-autocomplete-styling-plain-option[data-disabled] {
  cursor: not-allowed;
  border-color: #e2e8f0;
  background: #f8fafc;
  color: #94a3b8;
  box-shadow: none;
}

.docs-headless-multi-autocomplete-styling-plain-option[data-disabled] small {
  color: #94a3b8;
}`;

const TAILWIND_TS_CODE = PLAIN_TS_CODE
  .replace(/HeadlessMultiAutocompleteStylingPlainComponent/g, 'HeadlessMultiAutocompleteStylingTailwindComponent')
  .replace(/app-headless-multi-autocomplete-styling-plain/g, 'app-headless-multi-autocomplete-styling-tailwind')
  .replace(/headless-multi-autocomplete-styling-plain\.component/g, 'headless-multi-autocomplete-styling-tailwind.component')
  .replace(/HeadlessStylingPlainReleaseOwnerOption/g, 'HeadlessStylingTailwindReleaseOwnerOption')
  .replace(/HEADLESS_STYLING_PLAIN_RELEASE_OWNER_OPTIONS/g, 'HEADLESS_STYLING_TAILWIND_RELEASE_OWNER_OPTIONS');

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Release owners</span>
    <p class="m-0 text-sm text-slate-600">
      Use a light wrapper card and let the primitive state attributes drive the option styling.
    </p>
  </div>

  <section
    tngMultiAutocomplete
    class="relative flex min-h-12 flex-wrap gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-sm shadow-slate-900/5 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15"
    [open]="headlessStylingPlainReleaseOwnersOpen()"
    (openChange)="headlessStylingPlainReleaseOwnersOpen.set($event)"
    [query]="headlessStylingPlainReleaseOwnerQuery()"
    (queryChange)="headlessStylingPlainReleaseOwnerQuery.set($event)"
    [value]="headlessStylingPlainSelectedOwnerIds()"
    (valueChange)="onHeadlessStylingPlainReleaseOwnerValueChange($event)"
  >
    @for (id of headlessStylingPlainSelectedOwnerIds(); track id) {
      <span
        tngMultiAutocompleteChip
        class="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
        [tngValue]="id"
      >
        {{ id }}
      </span>
    }

    <input
      tngMultiAutocompleteTrigger
      type="text"
      class="min-w-[9rem] flex-1 bg-transparent px-2 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
      [value]="headlessStylingPlainReleaseOwnerQuery()"
      (input)="onHeadlessStylingPlainReleaseOwnerInput($event)"
      placeholder="Search release owners"
      aria-label="Release owners"
    />

    <div tngMultiAutocompleteContent class="contents">
      <div
        tngMultiAutocompleteOverlay
        class="max-w-[min(100vw-2rem,36rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
      >
        <ul tngMultiAutocompleteListbox>
          @for (owner of headlessStylingPlainFilteredReleaseOwners(); track owner.id) {
            <li
              tngMultiAutocompleteOption
              class="group grid gap-1 rounded-xl border border-transparent px-4 py-3 text-sm text-slate-900 transition data-[active]:border-slate-300 data-[active]:bg-slate-50 data-[active]:shadow-[0_0_0_1px_rgba(148,163,184,0.08)] data-[selected]:border-blue-200 data-[selected]:bg-blue-50 data-[selected]:text-blue-700 data-[selected]:shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_1px_2px_rgba(37,99,235,0.08)] data-[disabled]:cursor-not-allowed data-[disabled]:border-slate-200 data-[disabled]:bg-slate-50 data-[disabled]:text-slate-400 data-[disabled]:shadow-none [&[data-selected][data-active]]:border-blue-400 [&[data-selected][data-active]]:bg-blue-100 [&[data-selected][data-active]]:text-blue-800 [&[data-selected][data-active]]:shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_0_0_2px_rgba(37,99,235,0.12)]"
              [tngValue]="owner.id"
              [disabled]="isHeadlessStylingPlainReleaseOwnerDisabled(owner)"
            >
              <span class="font-medium">{{ owner.name }}</span>
              <small class="text-xs text-slate-500 group-data-[disabled]:text-slate-400">{{ owner.team }}</small>
            </li>
          }
        </ul>
      </div>
    </div>
  </section>
</section>`;

const TAILWIND_CSS_CODE = String.raw`/* No additional CSS file is required for this Tailwind example. */`;

@Component({
  selector: 'app-headless-multi-autocomplete-styling-page',
  imports: [
    TngCodeBlockComponent,
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteChip,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './headless-multi-autocomplete-styling-page.component.html',
  styleUrl: './headless-multi-autocomplete-styling-page.component.css',
})
export class HeadlessMultiAutocompleteStylingPageComponent implements OnDestroy {
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
  protected readonly owners = OWNER_OPTIONS;

  protected readonly plainOpen = signal(false);
  protected readonly plainQuery = signal('');
  protected readonly plainValues = signal<readonly string[]>(['mina']);

  protected readonly tailwindOpen = signal(false);
  protected readonly tailwindQuery = signal('');
  protected readonly tailwindValues = signal<readonly string[]>(['sanjay']);

  protected readonly plainFilteredOwners = computed(() => this.filterOwners(this.plainQuery()));
  protected readonly tailwindFilteredOwners = computed(() => this.filterOwners(this.tailwindQuery()));

  protected readonly cssContractCode = CSS_CONTRACT_CODE;
  protected readonly stateSelectorCode = STATE_SELECTOR_CODE;
  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-multi-autocomplete-styling-plain.component.ts', code: PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-multi-autocomplete-styling-plain.component.html', code: PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-multi-autocomplete-styling-plain.component.css', code: PLAIN_CSS_CODE },
  ]);
  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-multi-autocomplete-styling-tailwind.component.ts', code: TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-multi-autocomplete-styling-tailwind.component.html', code: TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-multi-autocomplete-styling-tailwind.component.css', code: TAILWIND_CSS_CODE },
  ]);

  protected onPlainInput(event: Event): void {
    this.plainQuery.set((event.target as HTMLInputElement).value);
  }

  protected onPlainValueChange(value: MultiAutocompleteValueChange): void {
    this.plainValues.set(this.toValueArray(value));
  }

  protected onTailwindInput(event: Event): void {
    this.tailwindQuery.set((event.target as HTMLInputElement).value);
  }

  protected onTailwindValueChange(value: MultiAutocompleteValueChange): void {
    this.tailwindValues.set(this.toValueArray(value));
  }

  protected resolveOwnerLabel(id: string): string {
    return this.owners.find((owner) => owner.id === id)?.name ?? id;
  }

  protected isOwnerDisabled(owner: OwnerOption): boolean {
    return owner.disabled === true;
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private filterOwners(query: string): readonly OwnerOption[] {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.owners;
    }

    return this.owners.filter((owner) =>
      `${owner.name} ${owner.team}`.toLowerCase().includes(normalizedQuery),
    );
  }

  private toValueArray(value: MultiAutocompleteValueChange): readonly string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => (typeof item === 'string' ? item : String(item)))
      .filter((item) => item.length > 0);
  }
}
