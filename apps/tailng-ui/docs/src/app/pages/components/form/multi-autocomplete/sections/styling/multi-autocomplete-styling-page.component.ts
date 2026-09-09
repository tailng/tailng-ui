import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngMultiAutocompleteComponent } from '@tailng-ui/components';
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

interface ContractRow {
  readonly selector: string;
  readonly appliedOn: string;
  readonly purpose: string;
}

interface OwnerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly disabled?: boolean;
}

const OWNER_OPTIONS: readonly OwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

const HOST_TOKEN_GUIDANCE_CODE = String.raw`tng-multi-autocomplete.docs-component-multi-autocomplete-styling-release-owner-shell {
  --tng-semantic-background-canvas: #ffffff;
  --tng-semantic-background-surface: #f8fafc;
  --tng-semantic-border-subtle: #d8e2ef;
  --tng-semantic-border-strong: #94a3b8;
  --tng-semantic-foreground-primary: #0f172a;
  --tng-semantic-foreground-secondary: #475569;
  --tng-semantic-foreground-muted: #64748b;
  --tng-semantic-accent-brand: #2563eb;
  --tng-semantic-focus-ring: #2563eb;

  --tng-multi-autocomplete-radius: 1rem;
  --tng-multi-autocomplete-padding: 0.5rem;
  --tng-multi-autocomplete-trigger-py: 0.45rem;
  --tng-multi-autocomplete-trigger-px: 0.5rem;
  --tng-multi-autocomplete-chip-py: 0.375rem;
  --tng-multi-autocomplete-chip-px: 0.75rem;
  --tng-multi-autocomplete-option-py: 0.625rem;
  --tng-multi-autocomplete-option-px: 0.875rem;
  --tng-multi-autocomplete-bg: #ffffff;
  --tng-multi-autocomplete-surface: #f8fafc;
  --tng-multi-autocomplete-border: #d8e2ef;
  --tng-multi-autocomplete-border-strong: #94a3b8;
  --tng-multi-autocomplete-fg: #0f172a;
  --tng-multi-autocomplete-muted: #64748b;
  --tng-multi-autocomplete-brand: #2563eb;
  --tng-multi-autocomplete-focus-ring: #2563eb;
  --tng-multi-autocomplete-z-overlay: 80;
}

/* Structural slot selectors remain private to the wrapper. */
/* Move to headless or ownable when you need direct chip / option DOM ownership. */`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngMultiAutocompleteComponent } from '@tailng-ui/components';

interface ComponentStylingPlainReleaseOwnerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly disabled?: boolean;
}

const COMPONENT_STYLING_PLAIN_RELEASE_OWNER_OPTIONS: readonly ComponentStylingPlainReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

@Component({
  selector: 'app-docs-multi-autocomplete-styling-plain',
  standalone: true,
  imports: [TngMultiAutocompleteComponent],
  templateUrl: './docs-multi-autocomplete-styling-plain.component.html',
  styleUrl: './docs-multi-autocomplete-styling-plain.component.css',
})
export class DocsMultiAutocompleteStylingPlainComponent {
  readonly componentStylingPlainReleaseOwners = COMPONENT_STYLING_PLAIN_RELEASE_OWNER_OPTIONS;
  readonly componentStylingPlainSelectedOwnerIds = signal<readonly string[]>(['mina', 'sanjay']);
  readonly componentStylingPlainSelectedOwnerSummary = computed(() => {
    if (this.componentStylingPlainSelectedOwnerIds().length === 0) {
      return 'none';
    }

    return this.componentStylingPlainSelectedOwnerIds()
      .map((id) => this.componentStylingPlainReleaseOwners.find((owner) => owner.id === id)?.name ?? id)
      .join(', ');
  });
  readonly getComponentStylingPlainOwnerValue = (owner: ComponentStylingPlainReleaseOwnerOption) => owner.id;
  readonly getComponentStylingPlainOwnerLabel = (owner: ComponentStylingPlainReleaseOwnerOption) => owner.name;
  readonly isComponentStylingPlainOwnerDisabled = (owner: ComponentStylingPlainReleaseOwnerOption) => owner.disabled === true;

  onComponentStylingPlainSelectedOwnersChange(value: unknown): void {
    this.componentStylingPlainSelectedOwnerIds.set(this.toComponentStylingPlainValueArray(value));
  }

  private toComponentStylingPlainValueArray(value: unknown): readonly string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => (typeof item === 'string' ? item : String(item)))
      .filter((item) => item.length > 0);
  }
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-multi-autocomplete-styling-plain-shell">
  <div class="docs-multi-autocomplete-styling-plain-header">
    <span class="docs-multi-autocomplete-styling-plain-kicker">Release owners</span>
    <p class="docs-multi-autocomplete-styling-plain-copy">
      Host-level semantic tokens restyle the wrapper without reaching into private child selectors.
    </p>
  </div>

  <div class="docs-multi-autocomplete-styling-plain-control">
    <tng-multi-autocomplete
      [options]="componentStylingPlainReleaseOwners"
      [value]="componentStylingPlainSelectedOwnerIds()"
      (valueChange)="onComponentStylingPlainSelectedOwnersChange($event)"
      [getOptionValue]="getComponentStylingPlainOwnerValue"
      [getOptionLabel]="getComponentStylingPlainOwnerLabel"
      [isOptionDisabled]="isComponentStylingPlainOwnerDisabled"
      placeholder="Assign release owners"
      [ariaLabel]="'Release owners'"
    ></tng-multi-autocomplete>
  </div>

  <p class="docs-multi-autocomplete-styling-plain-summary">Selected: {{ componentStylingPlainSelectedOwnerSummary() }}</p>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-multi-autocomplete-styling-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1.25rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.docs-multi-autocomplete-styling-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-multi-autocomplete-styling-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-multi-autocomplete-styling-plain-copy,
.docs-multi-autocomplete-styling-plain-summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-multi-autocomplete-styling-plain-control {
  display: block;
  width: 100%;
  min-width: 0;
  --tng-multi-autocomplete-radius: 1rem;
  --tng-multi-autocomplete-padding: 0.5rem;
  --tng-multi-autocomplete-trigger-py: 0.45rem;
  --tng-multi-autocomplete-trigger-px: 0.5rem;
  --tng-multi-autocomplete-chip-py: 0.375rem;
  --tng-multi-autocomplete-chip-px: 0.75rem;
  --tng-multi-autocomplete-option-py: 0.625rem;
  --tng-multi-autocomplete-option-px: 0.875rem;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngMultiAutocompleteComponent } from '@tailng-ui/components';

interface ComponentStylingTailwindReleaseOwnerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly disabled?: boolean;
}

const COMPONENT_STYLING_TAILWIND_RELEASE_OWNER_OPTIONS: readonly ComponentStylingTailwindReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

@Component({
  selector: 'app-docs-multi-autocomplete-styling-tailwind',
  standalone: true,
  imports: [TngMultiAutocompleteComponent],
  templateUrl: './docs-multi-autocomplete-styling-tailwind.component.html',
  styleUrl: './docs-multi-autocomplete-styling-tailwind.component.css',
})
export class DocsMultiAutocompleteStylingTailwindComponent {
  readonly componentStylingTailwindReleaseOwners = COMPONENT_STYLING_TAILWIND_RELEASE_OWNER_OPTIONS;
  readonly componentStylingTailwindSelectedOwnerIds = signal<readonly string[]>(['abigail']);
  readonly componentStylingTailwindSelectedOwnerSummary = computed(() => {
    if (this.componentStylingTailwindSelectedOwnerIds().length === 0) {
      return 'none';
    }

    return this.componentStylingTailwindSelectedOwnerIds()
      .map((id) => this.componentStylingTailwindReleaseOwners.find((owner) => owner.id === id)?.name ?? id)
      .join(', ');
  });
  readonly getComponentStylingTailwindOwnerValue = (owner: ComponentStylingTailwindReleaseOwnerOption) => owner.id;
  readonly getComponentStylingTailwindOwnerLabel = (owner: ComponentStylingTailwindReleaseOwnerOption) => owner.name;
  readonly isComponentStylingTailwindOwnerDisabled = (owner: ComponentStylingTailwindReleaseOwnerOption) => owner.disabled === true;

  onComponentStylingTailwindSelectedOwnersChange(value: unknown): void {
    this.componentStylingTailwindSelectedOwnerIds.set(this.toComponentStylingTailwindValueArray(value));
  }

  private toComponentStylingTailwindValueArray(value: unknown): readonly string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => (typeof item === 'string' ? item : String(item)))
      .filter((item) => item.length > 0);
  }
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Release owners</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Host-level semantic tokens restyle the wrapper cleanly from a utility-first shell.
    </p>
  </div>

  <div class="block w-full min-w-0 [--tng-multi-autocomplete-radius:1rem] [--tng-multi-autocomplete-padding:0.5rem] [--tng-multi-autocomplete-trigger-py:0.45rem] [--tng-multi-autocomplete-trigger-px:0.5rem] [--tng-multi-autocomplete-chip-py:0.375rem] [--tng-multi-autocomplete-chip-px:0.75rem] [--tng-multi-autocomplete-option-py:0.625rem] [--tng-multi-autocomplete-option-px:0.875rem]">
    <tng-multi-autocomplete
      [options]="componentStylingTailwindReleaseOwners"
      [value]="componentStylingTailwindSelectedOwnerIds()"
      (valueChange)="onComponentStylingTailwindSelectedOwnersChange($event)"
      [getOptionValue]="getComponentStylingTailwindOwnerValue"
      [getOptionLabel]="getComponentStylingTailwindOwnerLabel"
      [isOptionDisabled]="isComponentStylingTailwindOwnerDisabled"
      placeholder="Assign release owners"
      [ariaLabel]="'Release owners'"
    ></tng-multi-autocomplete>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ componentStylingTailwindSelectedOwnerSummary() }}</p>
</section>`;

const TAILWIND_CSS_CODE = String.raw`/* No additional CSS file is required for this Tailwind example. */`;

function resolveOwnerSummary(values: readonly string[]): string {
  if (values.length === 0) {
    return 'none';
  }

  return values
    .map((id) => OWNER_OPTIONS.find((owner) => owner.id === id)?.name ?? id)
    .join(', ');
}

@Component({
  selector: 'app-multi-autocomplete-styling-page',
  imports: [
    TngCodeBlockComponent,
    TngMultiAutocompleteComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './multi-autocomplete-styling-page.component.html',
  styleUrl: './multi-autocomplete-styling-page.component.css',
})
export class MultiAutocompleteStylingPageComponent implements OnDestroy {
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
  protected readonly hostTokenGuidanceCode = HOST_TOKEN_GUIDANCE_CODE;
  protected readonly releaseOwners = OWNER_OPTIONS;
  protected readonly getOwnerValue = (owner: OwnerOption) => owner.id;
  protected readonly getOwnerLabel = (owner: OwnerOption) => owner.name;
  protected readonly isOwnerDisabled = (owner: OwnerOption) => owner.disabled === true;
  protected readonly plainOwners = signal<readonly string[]>(['mina', 'sanjay']);
  protected readonly tailwindOwners = signal<readonly string[]>(['abigail']);
  protected readonly plainSummary = computed(() => resolveOwnerSummary(this.plainOwners()));
  protected readonly tailwindSummary = computed(() => resolveOwnerSummary(this.tailwindOwners()));

  protected readonly contractRows: readonly ContractRow[] = Object.freeze([
    {
      selector: 'tng-multi-autocomplete',
      appliedOn: 'Wrapper host',
      purpose: 'Width, margins, host-level semantic tokens, and surrounding shell ownership.',
    },
    {
      selector: '--tng-multi-autocomplete-z-overlay',
      appliedOn: 'Wrapper host',
      purpose: 'Controls the portaled overlay stacking level; falls back to --tng-z-overlay.',
    },
    {
      selector: '--tng-semantic-background-canvas',
      appliedOn: 'Wrapper host',
      purpose: 'Base trigger background for the owned input shell.',
    },
    {
      selector: '--tng-semantic-background-surface',
      appliedOn: 'Wrapper host',
      purpose: 'Chip fill and overlay surface background.',
    },
    {
      selector: '--tng-semantic-border-subtle',
      appliedOn: 'Wrapper host',
      purpose: 'Overlay border and softer internal boundaries.',
    },
    {
      selector: '--tng-semantic-border-strong',
      appliedOn: 'Wrapper host',
      purpose: 'Resting shell border and stronger chip outlines.',
    },
    {
      selector: '--tng-semantic-foreground-primary',
      appliedOn: 'Wrapper host',
      purpose: 'Trigger text, chip text, and default option label color.',
    },
    {
      selector: '--tng-semantic-foreground-secondary',
      appliedOn: 'Wrapper host',
      purpose: 'Supporting copy around the control and any custom template metadata.',
    },
    {
      selector: '--tng-semantic-foreground-muted',
      appliedOn: 'Wrapper host',
      purpose: 'Placeholder text and empty-state copy.',
    },
    {
      selector: '--tng-semantic-accent-brand',
      appliedOn: 'Wrapper host',
      purpose: 'Selected option accent and brand-colored interaction states.',
    },
    {
      selector: '--tng-semantic-focus-ring',
      appliedOn: 'Wrapper host',
      purpose: 'Focus ring around the wrapper-owned trigger shell.',
    },
  ]);

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'docs-multi-autocomplete-styling-plain.component.ts', code: PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'docs-multi-autocomplete-styling-plain.component.html', code: PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'docs-multi-autocomplete-styling-plain.component.css', code: PLAIN_CSS_CODE },
  ]);
  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'docs-multi-autocomplete-styling-tailwind.component.ts', code: TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'docs-multi-autocomplete-styling-tailwind.component.html', code: TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'docs-multi-autocomplete-styling-tailwind.component.css', code: TAILWIND_CSS_CODE },
  ]);

  protected onPlainOwnersChange(value: unknown): void {
    this.plainOwners.set(this.toValueArray(value));
  }

  protected onTailwindOwnersChange(value: unknown): void {
    this.tailwindOwners.set(this.toValueArray(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private toValueArray(value: unknown): readonly string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => (typeof item === 'string' ? item : String(item)))
      .filter((item) => item.length > 0);
  }
}
