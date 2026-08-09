import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngSliderComponent } from '@tailng-ui/components';
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
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../slider.util';

const STEP_PLAIN_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-slider-examples-step-plain',
  standalone: true,
  imports: [TngSliderComponent],
  templateUrl: './component-slider-examples-step-plain.component.html',
  styleUrl: './component-slider-examples-step-plain.component.css',
})
export class ComponentSliderExamplesStepPlainComponent {
  readonly componentSliderExamplesPlainBuffer = signal(30);
}`;

const STEP_PLAIN_HTML_CODE = String.raw`<section class="docs-component-slider-examples-step-plain-shell">
  <div class="docs-component-slider-examples-step-plain-header">
    <span class="docs-component-slider-examples-step-plain-kicker">Cache buffer</span>
    <p class="docs-component-slider-examples-step-plain-copy">
      Stepped values keep a predictable set of allowed choices.
    </p>
  </div>

  <tng-slider
    class="docs-component-slider-examples-step-plain-control"
    [value]="componentSliderExamplesPlainBuffer()"
    (valueChange)="componentSliderExamplesPlainBuffer.set($event)"
    [min]="0"
    [max]="60"
    [step]="5"
    aria-label="Cache buffer minutes"
  />

  <div class="docs-component-slider-examples-step-plain-footer">
    <span>0m</span>
    <strong>{{ componentSliderExamplesPlainBuffer() }}m</strong>
    <span>60m</span>
  </div>
</section>`;

const STEP_PLAIN_CSS_CODE = String.raw`.docs-component-slider-examples-step-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1.25rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
}

.docs-component-slider-examples-step-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-slider-examples-step-plain-kicker {
  color: var(--tng-semantic-foreground-muted);
  font-size: 0.8rem;
  font-weight: 700;
}

.docs-component-slider-examples-step-plain-copy {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-component-slider-examples-step-plain-control {
  --tng-semantic-accent-brand: #2563eb;
}

.docs-component-slider-examples-step-plain-footer {
  display: flex;
  justify-content: space-between;
  color: var(--tng-semantic-foreground-muted);
  font-size: 0.8rem;
}`;

const STEP_TAILWIND_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-slider-examples-step-tailwind',
  standalone: true,
  imports: [TngSliderComponent],
  templateUrl: './component-slider-examples-step-tailwind.component.html',
})
export class ComponentSliderExamplesStepTailwindComponent {
  readonly componentSliderExamplesTailwindBuffer = signal(45);
}`;

const STEP_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.25rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-muted)]">Cache buffer</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Stepped values keep a predictable set of allowed choices.
    </p>
  </div>

  <tng-slider
    class="[--tng-semantic-accent-brand:#2563eb]"
    [value]="componentSliderExamplesTailwindBuffer()"
    (valueChange)="componentSliderExamplesTailwindBuffer.set($event)"
    [min]="0"
    [max]="60"
    [step]="5"
    aria-label="Cache buffer minutes"
  />

  <div class="flex justify-between text-xs text-[var(--tng-semantic-foreground-muted)]">
    <span>0m</span>
    <strong>{{ componentSliderExamplesTailwindBuffer() }}m</strong>
    <span>60m</span>
  </div>
</section>`;

@Component({
  selector: 'app-slider-examples-page',
  imports: [
    TngSliderComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
  ],
  templateUrl: './slider-examples-page.component.html',
  styleUrl: './slider-examples-page.component.css',
})
export class SliderExamplesPageComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  protected readonly codeBlockTheme = signal(resolveDocsCodeBlockTheme(this.document));
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.document,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;
  protected readonly formPriority = signal(70);
  protected readonly stepPlainValue = signal(30);
  protected readonly stepTailwindValue = signal(45);
  protected readonly stepPlainCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'component-slider-examples-step-plain.component.ts',
      code: STEP_PLAIN_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'component-slider-examples-step-plain.component.html',
      code: STEP_PLAIN_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'component-slider-examples-step-plain.component.css',
      code: STEP_PLAIN_CSS_CODE,
    },
  ];

  protected readonly stepTailwindCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'component-slider-examples-step-tailwind.component.ts',
      code: STEP_TAILWIND_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'component-slider-examples-step-tailwind.component.html',
      code: STEP_TAILWIND_HTML_CODE,
    },
  ];

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
