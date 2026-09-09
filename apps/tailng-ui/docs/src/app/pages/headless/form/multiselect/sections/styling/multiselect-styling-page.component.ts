import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngMultiSelect,
  TngMultiSelectListbox,
  TngMultiSelectOption,
  TngSelectContent,
  TngSelectIcon,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
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
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../multiselect.util';

interface ContractRow {
  readonly selector: string;
  readonly appliedOn: string;
  readonly purpose: string;
}

interface CategoryOption {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
}

const CATEGORY_OPTIONS: readonly CategoryOption[] = Object.freeze([
  { id: 'a11y', label: 'Accessibility' },
  { id: 'forms', label: 'Forms' },
  { id: 'overlay', label: 'Overlay' },
  { id: 'docs', label: 'Documentation', disabled: true },
  { id: 'theming', label: 'Theming' },
]);

const STATE_SELECTOR_CODE = String.raw`[data-slot="multi-select"][data-state="open"] { /* overlay is visible */ }

[data-slot="multi-select-option"][data-active] {
  background: #f8fafc;
  border-color: #cbd5e1;
}

[data-slot="multi-select-option"][data-selected] {
  background: #ecfeff;
  border-color: #5eead4;
}

[data-slot="multi-select-option"][data-selected][data-active] {
  background: #ccfbf1;
  border-color: #2dd4bf;
}

[data-slot="multi-select-option"][data-disabled] {
  opacity: 0.52;
  cursor: not-allowed;
}`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngMultiSelect,
  TngMultiSelectListbox,
  TngMultiSelectOption,
  TngSelectContent,
  TngSelectIcon,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
} from '@tailng-ui/primitives';

interface HeadlessMultiselectStylingPlainCategoryOption {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
}

const HEADLESS_MULTISELECT_STYLING_PLAIN_CATEGORY_OPTIONS: readonly HeadlessMultiselectStylingPlainCategoryOption[] = Object.freeze([
  { id: 'a11y', label: 'Accessibility' },
  { id: 'forms', label: 'Forms' },
  { id: 'overlay', label: 'Overlay' },
  { id: 'docs', label: 'Documentation', disabled: true },
  { id: 'theming', label: 'Theming' },
]);

@Component({
  selector: 'app-headless-multiselect-styling-plain-example',
  standalone: true,
  imports: [TngMultiSelect, TngSelectTrigger, TngSelectValue, TngSelectIcon, TngSelectContent, TngSelectOverlay, TngMultiSelectListbox, TngMultiSelectOption],
  templateUrl: './headless-multiselect-styling-plain-example.component.html',
  styleUrl: './headless-multiselect-styling-plain-example.component.css',
})
export class HeadlessMultiselectStylingPlainExampleComponent {
  readonly categories = HEADLESS_MULTISELECT_STYLING_PLAIN_CATEGORY_OPTIONS;
  readonly selectedCategories = signal<readonly string[]>(['a11y', 'forms']);
  readonly selectedSummary = computed(() => {
    const ids = this.selectedCategories();
    if (ids.length === 0) return 'Select categories';
    return ids.map((id) => this.categories.find((c) => c.id === id)?.label ?? id).join(', ');
  });

  onValueChange(value: unknown): void {
    this.selectedCategories.set(this.toValueArray(value));
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-headless-multiselect-styling-plain-shell">
  <div class="docs-headless-multiselect-styling-plain-header">
    <span class="docs-headless-multiselect-styling-plain-kicker">Categories</span>
    <p class="docs-headless-multiselect-styling-plain-copy">
      The primitive stays native while your wrapper card and option rows carry the visual style.
    </p>
  </div>

  <section
    tngMultiSelect
    class="docs-headless-multiselect-styling-plain-root"
    [value]="selectedCategories()"
    (valueChange)="onValueChange($event)"
  >
    <button type="button" tngSelectTrigger class="docs-headless-multiselect-styling-plain-trigger">
      <span tngSelectValue class="docs-headless-multiselect-styling-plain-value">
        {{ selectedSummary() }}
      </span>
      <span tngSelectIcon class="docs-headless-multiselect-styling-plain-icon" aria-hidden="true">▾</span>
    </button>

    <div tngSelectContent class="docs-headless-multiselect-styling-plain-content">
      <div tngSelectOverlay class="docs-headless-multiselect-styling-plain-overlay">
        <ul
          tngMultiSelectListbox
          class="docs-headless-multiselect-styling-plain-listbox"
          [multiple]="true"
          [value]="selectedCategories()"
        >
          @for (category of categories; track category.id) {
            <li
              tngMultiSelectOption
              class="docs-headless-multiselect-styling-plain-option"
              [tngValue]="category.id"
              [disabled]="category.disabled === true"
            >
              {{ category.label }}
            </li>
          }
        </ul>
      </div>
    </div>
  </section>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-headless-multiselect-styling-plain-shell {
  display: grid;
  gap: 1rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.1rem;
  border: 1px solid #cbd5e1;
  border-radius: 1.25rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.docs-headless-multiselect-styling-plain-header { display: grid; gap: 0.35rem; }
.docs-headless-multiselect-styling-plain-kicker { font-size: 0.8rem; font-weight: 700; color: #64748b; }
.docs-headless-multiselect-styling-plain-copy { margin: 0; color: #475569; }
.docs-headless-multiselect-styling-plain-root { display: block; width: 100%; }

.docs-headless-multiselect-styling-plain-trigger {
  display: flex; width: 100%; min-width: 0; align-items: center;
  justify-content: space-between; gap: 0.75rem; padding: 0.85rem 1rem;
  border: 1px solid #94a3b8; border-radius: 1rem; background: #fff;
  color: #0f172a; cursor: pointer;
  transition: border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease;
}
.docs-headless-multiselect-styling-plain-trigger:focus,
.docs-headless-multiselect-styling-plain-trigger:focus-visible {
  outline: none; border-color: #0f766e; box-shadow: 0 0 0 3px rgba(15,118,110,0.16);
}
.docs-headless-multiselect-styling-plain-icon { color: #64748b; font-size: 0.75rem; }
.docs-headless-multiselect-styling-plain-content { display: contents; }
.docs-headless-multiselect-styling-plain-overlay {
  max-inline-size: min(92vw, 36rem); border: 1px solid #d8e2ef;
  border-radius: 1rem; background: #fff; color: #0f172a; color-scheme: light;
  padding: 0.4rem; box-shadow: 0 18px 38px rgba(15,23,42,0.14);
}
.docs-headless-multiselect-styling-plain-listbox { display: grid; gap: 0.3rem; list-style: none; margin: 0; padding: 0; }
.docs-headless-multiselect-styling-plain-option {
  padding: 0.8rem 0.9rem; border: 1px solid transparent; border-radius: 0.85rem;
  color: #0f172a; font-weight: 500;
  transition: border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
}
.docs-headless-multiselect-styling-plain-option[data-active] { background: #f8fafc; border-color: #cbd5e1; }
.docs-headless-multiselect-styling-plain-option[data-selected] { background: #ecfeff; border-color: #5eead4; }
.docs-headless-multiselect-styling-plain-option[data-selected][data-active] {
  background: #ccfbf1; border-color: #2dd4bf; box-shadow: 0 0 0 1px rgba(15,118,110,0.14);
}
.docs-headless-multiselect-styling-plain-option[data-disabled] { opacity: 0.52; cursor: not-allowed; }`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngMultiSelect,
  TngMultiSelectListbox,
  TngMultiSelectOption,
  TngSelectContent,
  TngSelectIcon,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
} from '@tailng-ui/primitives';

interface HeadlessMultiselectStylingTailwindCategoryOption {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
}

const HEADLESS_MULTISELECT_STYLING_TAILWIND_CATEGORY_OPTIONS: readonly HeadlessMultiselectStylingTailwindCategoryOption[] = Object.freeze([
  { id: 'a11y', label: 'Accessibility' },
  { id: 'forms', label: 'Forms' },
  { id: 'overlay', label: 'Overlay' },
  { id: 'docs', label: 'Documentation', disabled: true },
  { id: 'theming', label: 'Theming' },
]);

@Component({
  selector: 'app-headless-multiselect-styling-tailwind-example',
  standalone: true,
  imports: [TngMultiSelect, TngSelectTrigger, TngSelectValue, TngSelectIcon, TngSelectContent, TngSelectOverlay, TngMultiSelectListbox, TngMultiSelectOption],
  templateUrl: './headless-multiselect-styling-tailwind-example.component.html',
  styleUrl: './headless-multiselect-styling-tailwind-example.component.css',
})
export class HeadlessMultiselectStylingTailwindExampleComponent {
  readonly categories = HEADLESS_MULTISELECT_STYLING_TAILWIND_CATEGORY_OPTIONS;
  readonly selectedCategories = signal<readonly string[]>(['overlay']);
  readonly selectedSummary = computed(() => {
    const ids = this.selectedCategories();
    if (ids.length === 0) return 'Select categories';
    return ids.map((id) => this.categories.find((c) => c.id === id)?.label ?? id).join(', ');
  });

  onValueChange(value: unknown): void {
    this.selectedCategories.set(this.toValueArray(value));
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm [color-scheme:light]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Categories</span>
    <p class="m-0 text-sm text-slate-600">The primitive stays native while your wrapper and option rows carry the visual style.</p>
  </div>

  <section tngMultiSelect class="block w-full" [value]="selectedCategories()" (valueChange)="onValueChange($event)">
    <button type="button" tngSelectTrigger class="flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-left text-slate-900 shadow-sm transition hover:border-slate-400 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-100">
      <span tngSelectValue class="min-w-0 truncate">{{ selectedSummary() }}</span>
      <span tngSelectIcon class="text-xs text-slate-500" aria-hidden="true">▾</span>
    </button>

    <div tngSelectContent class="contents">
      <div tngSelectOverlay class="max-w-[min(92vw,36rem)] rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl [color-scheme:light]">
        <ul tngMultiSelectListbox class="m-0 grid list-none gap-1 p-0" [multiple]="true" [value]="selectedCategories()">
          @for (category of categories; track category.id) {
            <li
              tngMultiSelectOption
              class="rounded-xl border border-transparent px-4 py-3 transition data-[active]:border-slate-200 data-[active]:bg-slate-50 data-[selected]:border-teal-200 data-[selected]:bg-teal-50 data-[selected]:text-teal-800 [&[data-selected][data-active]]:border-teal-400 [&[data-selected][data-active]]:bg-teal-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45"
              [tngValue]="category.id"
              [disabled]="category.disabled === true"
            >{{ category.label }}</li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ selectedSummary() }}</p>
</section>`;

const TAILWIND_CSS_CODE = String.raw`/* No additional CSS required. Tailwind utility classes define the shell. */`;

@Component({
  selector: 'app-headless-multiselect-styling-page',
  imports: [
    TngCodeBlockComponent,
    TngMultiSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngMultiSelectListbox,
    TngMultiSelectOption,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './multiselect-styling-page.component.html',
  styleUrl: './multiselect-styling-page.component.css',
})
export class HeadlessMultiselectStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly categoryLabelById = new Map(
    CATEGORY_OPTIONS.map((c) => [c.id, c.label]),
  );

  readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;
  protected readonly categories = CATEGORY_OPTIONS;
  protected readonly stateSelectorCode = STATE_SELECTOR_CODE;

  protected readonly stylingPlainSelectedCategories = signal<readonly string[]>(['a11y', 'forms']);
  protected readonly stylingTailwindSelectedCategories = signal<readonly string[]>(['overlay']);

  protected readonly stylingPlainSummary = computed(() => this.resolveLabels(this.stylingPlainSelectedCategories()));
  protected readonly stylingTailwindSummary = computed(() => this.resolveLabels(this.stylingTailwindSelectedCategories()));

  protected readonly contractRows: readonly ContractRow[] = Object.freeze([
    { selector: '[data-slot="multi-select"]', appliedOn: 'Root host', purpose: 'State container and token surface for the multiselect root.' },
    { selector: '[data-slot="select-trigger"]', appliedOn: 'Trigger control', purpose: 'Trigger surface, focus ring, and open/closed state feedback.' },
    { selector: '[data-slot="select-overlay"]', appliedOn: 'Portaled overlay', purpose: 'Panel border, radius, elevation, and max-height constraints.' },
    { selector: '--tng-select-z-overlay', appliedOn: 'Root host or overlay theme source', purpose: 'Controls the shared select overlay stacking level; falls back to --tng-z-overlay.' },
    { selector: '[data-slot="multi-select-listbox"]', appliedOn: 'Listbox host', purpose: 'Option stack spacing and scrolling behavior.' },
    { selector: '[data-slot="multi-select-option"]', appliedOn: 'Option host', purpose: 'Keyboard active highlight, committed selection, and disabled styling.' },
  ]);

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-multiselect-styling-plain.component.ts', code: PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-multiselect-styling-plain.component.html', code: PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-multiselect-styling-plain.component.css', code: PLAIN_CSS_CODE },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-multiselect-styling-tailwind.component.ts', code: TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-multiselect-styling-tailwind.component.html', code: TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-multiselect-styling-tailwind.component.css', code: TAILWIND_CSS_CODE },
  ]);

  protected onStylingPlainValueChange(value: unknown): void {
    this.stylingPlainSelectedCategories.set(this.toValueArray(value));
  }

  protected onStylingTailwindValueChange(value: unknown): void {
    this.stylingTailwindSelectedCategories.set(this.toValueArray(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private resolveLabels(values: readonly string[]): string {
    if (values.length === 0) return 'none';
    return values.map((id) => this.categoryLabelById.get(id) ?? id).join(', ');
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}
