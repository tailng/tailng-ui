import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngSelect,
  TngSelectContent,
  TngSelectIcon,
  TngSelectListbox,
  TngSelectOption,
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
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../selectbox.util';

interface ContractRow {
  readonly appliedOn: string;
  readonly purpose: string;
  readonly selector: string;
}

interface ReleaseOwnerOption {
  readonly disabled?: boolean;
  readonly id: string;
  readonly name: string;
  readonly team: string;
}

type SelectboxValue = string | readonly string[] | null;

const RELEASE_OWNER_OPTIONS: readonly ReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

const STATE_SELECTOR_CODE = String.raw`[data-slot='select'][data-state='open'] { ... }
[data-slot='select-trigger']:focus-visible { ... }
[data-slot='select-option'][data-active] { ... }
[data-slot='select-option'][data-selected] { ... }
[data-slot='select-option'][data-selected][data-active] { ... }
[data-slot='select-option'][data-disabled] { ... }`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngSelect,
  TngSelectContent,
  TngSelectIcon,
  TngSelectListbox,
  TngSelectOption,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
} from '@tailng-ui/primitives';

interface HeadlessSelectboxStylingPlainReleaseOwnerOption {
  readonly disabled?: boolean;
  readonly id: string;
  readonly name: string;
  readonly team: string;
}

type HeadlessSelectboxStylingPlainValue = string | readonly string[] | null;

const HEADLESS_SELECTBOX_STYLING_PLAIN_RELEASE_OWNER_OPTIONS: readonly HeadlessSelectboxStylingPlainReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

@Component({
  selector: 'app-headless-selectbox-styling-plain-example',
  standalone: true,
  imports: [
    TngSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
  ],
  templateUrl: './headless-selectbox-styling-plain-example.component.html',
  styleUrl: './headless-selectbox-styling-plain-example.component.css',
})
export class HeadlessSelectboxStylingPlainExampleComponent {
  readonly headlessSelectboxStylingPlainReleaseOwners =
    HEADLESS_SELECTBOX_STYLING_PLAIN_RELEASE_OWNER_OPTIONS;
  readonly headlessSelectboxStylingPlainSelectedOwnerId = signal<string | null>('mina');
  readonly headlessSelectboxStylingPlainSelectedOwnerLabel = computed(() => {
    const selectedValue = this.headlessSelectboxStylingPlainSelectedOwnerId();
    if (selectedValue === null) {
      return null;
    }

    return (
      this.headlessSelectboxStylingPlainReleaseOwners.find(
        (owner) => owner.id === selectedValue,
      )?.name ?? null
    );
  });

  onHeadlessSelectboxStylingPlainSelectedOwnerChange(
    value: HeadlessSelectboxStylingPlainValue,
  ): void {
    this.headlessSelectboxStylingPlainSelectedOwnerId.set(
      this.toHeadlessSelectboxStylingPlainSingleValue(value),
    );
  }

  private toHeadlessSelectboxStylingPlainSingleValue(
    value: HeadlessSelectboxStylingPlainValue,
  ): string | null {
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === 'string' ? first : null;
    }

    return null;
  }
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-headless-selectbox-styling-plain-shell">
  <div class="docs-headless-selectbox-styling-plain-header">
    <span class="docs-headless-selectbox-styling-plain-kicker">Release owners</span>
    <p class="docs-headless-selectbox-styling-plain-copy">
      The primitive stays native while your wrapper card and option rows carry the visual style.
    </p>
  </div>

  <section
    tngSelect
    class="docs-headless-selectbox-styling-plain-root"
    [value]="headlessSelectboxStylingPlainSelectedOwnerId()"
    (valueChange)="onHeadlessSelectboxStylingPlainSelectedOwnerChange($event)"
  >
    <button type="button" tngSelectTrigger class="docs-headless-selectbox-styling-plain-trigger">
      <span
        tngSelectValue
        class="docs-headless-selectbox-styling-plain-value"
        [attr.data-placeholder]="headlessSelectboxStylingPlainSelectedOwnerLabel() === null ? '' : null"
      >
        {{ headlessSelectboxStylingPlainSelectedOwnerLabel() ?? 'Assign release owner' }}
      </span>
      <span tngSelectIcon class="docs-headless-selectbox-styling-plain-icon" aria-hidden="true">▾</span>
    </button>

    <div tngSelectContent class="docs-headless-selectbox-styling-plain-content">
      <div tngSelectOverlay class="docs-headless-selectbox-styling-plain-overlay">
        <div
          tngSelectListbox
          class="docs-headless-selectbox-styling-plain-listbox"
          [value]="headlessSelectboxStylingPlainSelectedOwnerId()"
          (valueChange)="onHeadlessSelectboxStylingPlainSelectedOwnerChange($event)"
        >
          @for (owner of headlessSelectboxStylingPlainReleaseOwners; track owner.id) {
            <div
              tngSelectOption
              class="docs-headless-selectbox-styling-plain-option"
              [tngValue]="owner.id"
              [disabled]="owner.disabled === true"
            >
              <p class="docs-headless-selectbox-styling-plain-option-label">{{ owner.name }}</p>
              <p class="docs-headless-selectbox-styling-plain-option-meta">{{ owner.team }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  </section>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-headless-selectbox-styling-plain-shell {
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

.docs-headless-selectbox-styling-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-headless-selectbox-styling-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-headless-selectbox-styling-plain-copy {
  margin: 0;
  color: #475569;
}

.docs-headless-selectbox-styling-plain-root {
  display: block;
  width: 100%;
}

.docs-headless-selectbox-styling-plain-trigger {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border: 1px solid #94a3b8;
  border-radius: 1rem;
  background: #ffffff;
  color: #0f172a;
  cursor: pointer;
  transition: border-color 140ms ease, box-shadow 140ms ease;
}

.docs-headless-selectbox-styling-plain-trigger:focus,
.docs-headless-selectbox-styling-plain-trigger:focus-visible {
  outline: none;
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.16);
}

.docs-headless-selectbox-styling-plain-value[data-placeholder] {
  color: #64748b;
}

.docs-headless-selectbox-styling-plain-icon {
  color: #64748b;
  font-size: 0.75rem;
}

.docs-headless-selectbox-styling-plain-content {
  display: contents;
}

.docs-headless-selectbox-styling-plain-overlay {
  max-inline-size: min(92vw, 36rem);
  border: 1px solid #d8e2ef;
  border-radius: 1rem;
  background: #ffffff;
  padding: 0.4rem;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.14);
}

.docs-headless-selectbox-styling-plain-listbox {
  display: grid;
  gap: 0.3rem;
}

.docs-headless-selectbox-styling-plain-option {
  display: grid;
  gap: 0.15rem;
  padding: 0.8rem 0.9rem;
  border: 1px solid transparent;
  border-radius: 0.85rem;
  background: transparent;
  transition: border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
}

.docs-headless-selectbox-styling-plain-option[data-active] {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.docs-headless-selectbox-styling-plain-option[data-selected] {
  background: #ecfeff;
  border-color: #5eead4;
}

.docs-headless-selectbox-styling-plain-option[data-selected][data-active] {
  background: #ccfbf1;
  border-color: #2dd4bf;
  box-shadow: 0 0 0 1px rgba(15, 118, 110, 0.14);
}

.docs-headless-selectbox-styling-plain-option[data-disabled] {
  opacity: 0.52;
  cursor: not-allowed;
}

.docs-headless-selectbox-styling-plain-option-label,
.docs-headless-selectbox-styling-plain-option-meta {
  margin: 0;
}

.docs-headless-selectbox-styling-plain-option-label {
  font-weight: 600;
  color: #0f172a;
}

.docs-headless-selectbox-styling-plain-option-meta {
  color: #64748b;
  font-size: 0.875rem;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngSelect,
  TngSelectContent,
  TngSelectIcon,
  TngSelectListbox,
  TngSelectOption,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
} from '@tailng-ui/primitives';

interface HeadlessSelectboxStylingTailwindReleaseOwnerOption {
  readonly disabled?: boolean;
  readonly id: string;
  readonly name: string;
  readonly team: string;
}

type HeadlessSelectboxStylingTailwindValue = string | readonly string[] | null;

const HEADLESS_SELECTBOX_STYLING_TAILWIND_RELEASE_OWNER_OPTIONS: readonly HeadlessSelectboxStylingTailwindReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

@Component({
  selector: 'app-headless-selectbox-styling-tailwind-example',
  standalone: true,
  imports: [
    TngSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
  ],
  templateUrl: './headless-selectbox-styling-tailwind-example.component.html',
  styleUrl: './headless-selectbox-styling-tailwind-example.component.css',
})
export class HeadlessSelectboxStylingTailwindExampleComponent {
  readonly headlessSelectboxStylingTailwindReleaseOwners =
    HEADLESS_SELECTBOX_STYLING_TAILWIND_RELEASE_OWNER_OPTIONS;
  readonly headlessSelectboxStylingTailwindSelectedOwnerId = signal<string | null>('abigail');
  readonly headlessSelectboxStylingTailwindSelectedOwnerLabel = computed(() => {
    const selectedValue = this.headlessSelectboxStylingTailwindSelectedOwnerId();
    if (selectedValue === null) {
      return null;
    }

    return (
      this.headlessSelectboxStylingTailwindReleaseOwners.find(
        (owner) => owner.id === selectedValue,
      )?.name ?? null
    );
  });

  onHeadlessSelectboxStylingTailwindSelectedOwnerChange(
    value: HeadlessSelectboxStylingTailwindValue,
  ): void {
    this.headlessSelectboxStylingTailwindSelectedOwnerId.set(
      this.toHeadlessSelectboxStylingTailwindSingleValue(value),
    );
  }

  private toHeadlessSelectboxStylingTailwindSingleValue(
    value: HeadlessSelectboxStylingTailwindValue,
  ): string | null {
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === 'string' ? first : null;
    }

    return null;
  }
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm [color-scheme:light]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Release owners</span>
    <p class="m-0 text-sm text-slate-600">
      The primitive stays native while your wrapper card and option rows carry the visual style.
    </p>
  </div>

  <section
    tngSelect
    class="block w-full"
    [value]="headlessSelectboxStylingTailwindSelectedOwnerId()"
    (valueChange)="onHeadlessSelectboxStylingTailwindSelectedOwnerChange($event)"
  >
    <button
      type="button"
      tngSelectTrigger
      class="flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-left text-slate-900 shadow-sm transition hover:border-slate-400 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-100"
    >
      <span
        tngSelectValue
        class="min-w-0 truncate"
        [attr.data-placeholder]="headlessSelectboxStylingTailwindSelectedOwnerLabel() === null ? '' : null"
      >
        {{ headlessSelectboxStylingTailwindSelectedOwnerLabel() ?? 'Assign release owner' }}
      </span>
      <span tngSelectIcon class="text-xs text-slate-500" aria-hidden="true">▾</span>
    </button>

    <div tngSelectContent class="contents">
      <div tngSelectOverlay class="max-w-[min(92vw,36rem)] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
        <div
          tngSelectListbox
          class="grid gap-1"
          [value]="headlessSelectboxStylingTailwindSelectedOwnerId()"
          (valueChange)="onHeadlessSelectboxStylingTailwindSelectedOwnerChange($event)"
        >
          @for (owner of headlessSelectboxStylingTailwindReleaseOwners; track owner.id) {
            <div
              tngSelectOption
              class="grid gap-1 rounded-xl border border-transparent px-4 py-3 transition data-[active]:border-slate-200 data-[active]:bg-slate-50 data-[selected]:border-teal-200 data-[selected]:bg-teal-50 data-[selected]:text-teal-800 [&[data-selected][data-active]]:border-teal-400 [&[data-selected][data-active]]:bg-teal-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45"
              [tngValue]="owner.id"
              [disabled]="owner.disabled === true"
            >
              <p class="m-0 text-sm font-semibold text-current">{{ owner.name }}</p>
              <p class="m-0 text-sm text-slate-500">{{ owner.team }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  </section>
</section>`;

const TAILWIND_CSS_CODE = String.raw`/* No additional CSS required. Tailwind utility classes define the shell. */`;

@Component({
  selector: 'app-headless-selectbox-styling-page',
  imports: [
    TngCodeBlockComponent,
    TngSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './selectbox-styling-page.component.html',
  styleUrl: './selectbox-styling-page.component.css',
})
export class HeadlessSelectboxStylingPageComponent implements OnDestroy {
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
  protected readonly releaseOwners = RELEASE_OWNER_OPTIONS;
  protected readonly stateSelectorCode = STATE_SELECTOR_CODE;

  protected readonly contractRows: readonly ContractRow[] = Object.freeze([
    {
      selector: "[data-slot='select']",
      appliedOn: 'root host',
      purpose: 'Own the outer shell, root spacing, and open-state driven layout changes.',
    },
    {
      selector: "[data-slot='select-trigger']",
      appliedOn: 'trigger button',
      purpose: 'Apply focus ring, border, surface, and text treatment to the visible trigger.',
    },
    {
      selector: "[data-slot='select-listbox']",
      appliedOn: 'listbox container',
      purpose: 'Define overlay padding, option spacing, and owned scrolling behavior.',
    },
    {
      selector: '--tng-select-z-overlay',
      appliedOn: 'root host or overlay theme source',
      purpose: 'Controls the portaled overlay stacking level; falls back to --tng-z-overlay.',
    },
    {
      selector: "[data-slot='select-option']",
      appliedOn: 'option row',
      purpose: 'Style idle option rows before layering active, selected, and disabled states on top.',
    },
    {
      selector: '[data-active] / [data-selected] / [data-disabled]',
      appliedOn: 'option state',
      purpose: 'Represent focus movement, committed selection, and unavailable rows without custom JavaScript.',
    },
  ]);

  protected readonly stylingPlainSelectedOwnerId = signal<string | null>('mina');
  protected readonly stylingTailwindSelectedOwnerId = signal<string | null>('abigail');

  protected readonly stylingPlainSelectedOwnerLabel = computed(() =>
    this.findOwnerLabel(this.stylingPlainSelectedOwnerId()),
  );
  protected readonly stylingTailwindSelectedOwnerLabel = computed(() =>
    this.findOwnerLabel(this.stylingTailwindSelectedOwnerId()),
  );

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-selectbox-styling-plain.component.ts', code: PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-selectbox-styling-plain.component.html', code: PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-selectbox-styling-plain.component.css', code: PLAIN_CSS_CODE },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-selectbox-styling-tailwind.component.ts', code: TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-selectbox-styling-tailwind.component.html', code: TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-selectbox-styling-tailwind.component.css', code: TAILWIND_CSS_CODE },
  ]);

  protected onStylingPlainSelectedOwnerChange(value: SelectboxValue): void {
    this.stylingPlainSelectedOwnerId.set(this.toSingleValue(value));
  }

  protected onStylingTailwindSelectedOwnerChange(value: SelectboxValue): void {
    this.stylingTailwindSelectedOwnerId.set(this.toSingleValue(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private findOwnerLabel(value: string | null): string | null {
    if (value === null) {
      return null;
    }

    return this.releaseOwners.find((owner) => owner.id === value)?.name ?? null;
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
  }
}
