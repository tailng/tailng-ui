import { Component, ContentChild, Directive, HostBinding, inject, input } from '@angular/core';
import {
  TngAccordion as TngAccordionPrimitive,
  TngAccordionItem as TngAccordionItemPrimitive,
  TngAccordionPanel as TngAccordionPanelPrimitive,
  TngAccordionTrigger as TngAccordionTriggerPrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'tng-accordion',
  hostDirectives: [
    {
      directive: TngAccordionPrimitive,
      inputs: ['type', 'value', 'defaultValue', 'collapsible', 'disabled', 'loop', 'lazy', 'keepAlive'],
      outputs: ['valueChange', 'valuesChange', 'expandedChange', 'openStart', 'opened', 'closeStart', 'closed'],
    },
  ],
  templateUrl: './tng-accordion.component.html',
  styleUrl: './tng-accordion.component.css',
  exportAs: 'tngAccordionComponent',
})
export class TngAccordionComponent {
  public readonly ariaLabel = input<string>('Accordion');

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string {
    return this.ariaLabel();
  }
}

@Component({
  selector: 'tng-accordion-item',
  hostDirectives: [
    {
      directive: TngAccordionItemPrimitive,
      inputs: ['value', 'disabled'],
    },
  ],
  template: '<section class="tng-accordion__item"><ng-content /></section>',
  styles: `
    :host {
      display: block;
      border-top: 1px solid var(--tng-semantic-border-subtle);
    }

    :host(:first-child) {
      border-top: 0;
    }

    .tng-accordion__item {
      display: block;
    }
  `,
  exportAs: 'tngAccordionItemComponent',
})
export class TngAccordionItemComponent {}

@Directive({
  selector: '[tngAccordionIndicator]',
  exportAs: 'tngAccordionIndicator',
})
export class TngAccordionIndicator {
  private readonly item = inject(TngAccordionItemPrimitive, { optional: true });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'accordion-indicator' as const;

  @HostBinding('attr.aria-hidden')
  protected readonly ariaHidden = 'true' as const;

  @HostBinding('attr.data-state')
  protected get dataState(): 'open' | 'closed' {
    if (this.item === null) {
      return 'closed';
    }

    return this.item.getAccordion()?.isItemExpanded(this.item) ? 'open' : 'closed';
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): 'true' | 'false' {
    if (this.item === null) {
      return 'false';
    }

    return this.item.getAccordion()?.isItemDisabled(this.item) ? 'true' : 'false';
  }
}

@Component({
  selector: 'tng-accordion-trigger',
  hostDirectives: [TngAccordionTriggerPrimitive],
  template: `
    <span class="tng-accordion__trigger-content">
      <span class="tng-accordion__indicator-slot">
        <ng-content select="[tngAccordionIndicator]"></ng-content>
        @if (!hasCustomIndicator()) {
          <svg
            class="tng-accordion__indicator-default"
            data-slot="accordion-indicator"
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6.5 8 10.5 12 6.5"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.75"
            />
          </svg>
        }
      </span>
      <span class="tng-accordion__trigger-label"><ng-content></ng-content></span>
    </span>
  `,
  styles: `
    :host {
      align-items: center;
      background: var(--tng-semantic-background-surface);
      border: 0;
      color: var(--tng-semantic-foreground-primary);
      cursor: pointer;
      display: flex;
      font: inherit;
      gap: 0.5rem;
      justify-content: space-between;
      min-height: 2.75rem;
      padding: 0.8rem 1rem;
      transition:
        background-color 160ms ease,
        color 160ms ease;
      user-select: none;
      width: 100%;
    }

    :host([data-disabled='true']) {
      cursor: not-allowed;
      opacity: var(--tng-disabled-opacity, 0.55);
    }

    :host:hover:not([data-disabled='true']) {
      background: color-mix(
        in srgb,
        var(--tng-semantic-foreground-primary) 6%,
        var(--tng-semantic-background-surface)
      );
    }

    :host(:focus-visible):not([data-disabled='true']) {
      outline: none;
      background: color-mix(
        in srgb,
        var(--tng-semantic-accent-brand) 12%,
        var(--tng-semantic-background-surface)
      );
    }

    :host(:focus-visible):not([data-disabled='true']) .tng-accordion__indicator-slot {
      color: var(--tng-semantic-accent-brand);
    }

    .tng-accordion__trigger-content {
      align-items: center;
      display: inline-flex;
      flex: 1 1 auto;
      gap: 0.5rem;
      width: 100%;
    }

    .tng-accordion__trigger-label {
      flex: 1 1 auto;
      order: 1;
    }

    .tng-accordion__indicator-slot {
      align-items: center;
      color: var(--tng-semantic-foreground-secondary);
      display: inline-flex;
      flex: 0 0 auto;
      justify-content: center;
      min-height: 1rem;
      min-width: 1rem;
      order: 2;
      transition: color 160ms ease;
    }

    .tng-accordion__indicator-default {
      display: block;
      flex: 0 0 auto;
      height: 1rem;
      transition:
        color 180ms ease,
        transform 180ms ease;
      width: 1rem;
    }

    :host([data-state='open']) .tng-accordion__indicator-default {
      transform: rotate(180deg);
    }
  `,
  exportAs: 'tngAccordionTriggerComponent',
})
export class TngAccordionTriggerComponent {
  @ContentChild(TngAccordionIndicator, { descendants: true })
  protected customIndicator?: TngAccordionIndicator;

  protected hasCustomIndicator(): boolean {
    return this.customIndicator !== undefined;
  }
}

@Component({
  selector: 'tng-accordion-panel',
  hostDirectives: [TngAccordionPanelPrimitive],
  template: '<section class="tng-accordion__panel"><ng-content /></section>',
  styles: `
    :host {
      display: grid;
      grid-template-rows: 1fr;
      opacity: 1;
      transition:
        grid-template-rows 180ms ease,
        opacity 180ms ease;
    }

    :host([hidden]) {
      display: grid !important;
      grid-template-rows: 0fr;
      opacity: 0;
      pointer-events: none;
    }

    .tng-accordion__panel {
      background: var(--tng-semantic-background-base);
      border-top: 1px solid var(--tng-semantic-border-subtle);
      color: var(--tng-semantic-foreground-primary);
      display: block;
      min-height: 0;
      overflow: hidden;
      padding: 0.9rem 1rem;
      transform: translateY(0);
      transition:
        border-color 180ms ease,
        padding-block 180ms ease,
        transform 180ms ease;
    }

    :host([hidden]) .tng-accordion__panel {
      border-top-color: transparent;
      padding-block: 0;
      transform: translateY(-4px);
    }
  `,
  exportAs: 'tngAccordionPanelComponent',
})
export class TngAccordionPanelComponent {}
