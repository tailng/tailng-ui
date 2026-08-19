import type { RegistryItem } from '../registry.types';

const accordionPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngAccordion]',
  exportAs: 'tngAccordion',
})
export class TngAccordionPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'accordion' as const;
}
`;

const accordionComponentTsTemplate = `import { booleanAttribute, Component, effect, ElementRef, inject, input, signal } from '@angular/core';
import { createDisclosureController } from '@tailng-ui/cdk';
import { createTngIdFactory } from '@tailng-ui/cdk/core';
import { TngAccordionPrimitive } from './tng-accordion-primitive';

const accordionIdFactory = createTngIdFactory('tng-accordion-panel');
const accordionTriggerIdFactory = createTngIdFactory('tng-accordion-trigger');
const accordionTriggerSelector = '[data-tng-accordion-trigger]';

function getAccordionGroupRoot(host: HTMLElement): ParentNode {
  const explicitGroup = host.closest('[data-tng-accordion-group]');
  if (explicitGroup !== null) {
    return explicitGroup;
  }

  return host.parentElement ?? host.ownerDocument;
}

function getEnabledAccordionTriggers(groupRoot: ParentNode): readonly HTMLButtonElement[] {
  return Array.from(groupRoot.querySelectorAll<HTMLButtonElement>(accordionTriggerSelector)).filter(
    (trigger) => !trigger.disabled,
  );
}

function resolveAccordionTriggerTargetIndex(
  currentIndex: number,
  total: number,
  key: string,
): number | null {
  if (total <= 0 || currentIndex < 0 || currentIndex >= total) {
    return null;
  }

  if (key === 'ArrowDown') {
    return currentIndex + 1 >= total ? 0 : currentIndex + 1;
  }

  if (key === 'ArrowUp') {
    return currentIndex - 1 < 0 ? total - 1 : currentIndex - 1;
  }

  if (key === 'Home') {
    return 0;
  }

  if (key === 'End') {
    return total - 1;
  }

  return null;
}

@Component({
  selector: 'tng-accordion',
  imports: [TngAccordionPrimitive],
  templateUrl: './tng-accordion.html',
  styleUrl: './tng-accordion.css',
})
export class TngAccordion {
  public readonly defaultOpen = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly title = input<string>('Accordion');

  protected readonly open = signal(false);
  protected readonly panelId = accordionIdFactory();
  protected readonly triggerId = accordionTriggerIdFactory();

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly disclosure = createDisclosureController();

  public constructor() {
    effect(() => {
      this.disclosure.setDisabled(this.disabled());
      this.syncOpenState();
    });

    effect(() => {
      if (this.defaultOpen()) {
        this.disclosure.open();
      } else {
        this.disclosure.close();
      }
      this.syncOpenState();
    });
  }

  protected onToggle(): void {
    this.disclosure.toggle();
    this.syncOpenState();
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const currentTarget = event.currentTarget;
    if (!(currentTarget instanceof HTMLButtonElement)) {
      return;
    }

    const groupRoot = getAccordionGroupRoot(this.hostRef.nativeElement);
    const triggers = getEnabledAccordionTriggers(groupRoot);
    if (triggers.length <= 1) {
      return;
    }

    const currentIndex = triggers.findIndex((trigger) => trigger === currentTarget);
    const nextIndex = resolveAccordionTriggerTargetIndex(currentIndex, triggers.length, event.key);
    if (nextIndex === null || nextIndex === currentIndex) {
      return;
    }

    event.preventDefault();
    triggers[nextIndex]?.focus();
  }

  private syncOpenState(): void {
    this.open.set(this.disclosure.isOpen());
  }
}
`;

const accordionTemplateHtml = `<section tngAccordion class="tng-accordion" [attr.data-open]="open() ? '' : null">
  <button
    type="button"
    class="tng-accordion__trigger"
    data-tng-accordion-trigger
    [attr.id]="triggerId"
    [disabled]="disabled()"
    [attr.aria-controls]="panelId"
    [attr.aria-expanded]="open()"
    (click)="onToggle()"
    (keydown)="onTriggerKeydown($event)"
  >
    <span>{{ title() }}</span>
    <span aria-hidden="true" class="tng-accordion__chevron">{{ open() ? '−' : '+' }}</span>
  </button>

  <div
    [id]="panelId"
    class="tng-accordion__panel"
    role="region"
    [attr.aria-labelledby]="triggerId"
    [hidden]="!open()"
  >
    <ng-content />
  </div>
</section>
`;

const accordionTemplateCss = `:host {
  display: block;
}

.tng-accordion {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  overflow: hidden;
}

.tng-accordion__trigger {
  align-items: center;
  background: #f8fafc;
  border: 0;
  color: #0f172a;
  cursor: pointer;
  display: flex;
  font: inherit;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  width: 100%;
}

.tng-accordion__trigger:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.tng-accordion__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
}

.tng-accordion__panel {
  border-top: 1px solid #cbd5e1;
  padding: 0.9rem 1rem;
}
`;

const accordionIndexTsTemplate = `export * from './tng-accordion';
export * from './tng-accordion-primitive';
`;

export const accordionRegistryItem = {
  dependencies: ['@tailng-ui/cdk'],
  description: 'Shadcn-style source files for accordion primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/accordion',
    importSymbols: ['TngAccordion', 'TngAccordionPrimitive'],
  },
  files: [
    {
      content: accordionPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/accordion/tng-accordion-primitive.ts',
    },
    {
      content: accordionComponentTsTemplate,
      path: 'src/app/tailng-ui/accordion/tng-accordion.ts',
    },
    {
      content: accordionTemplateHtml,
      path: 'src/app/tailng-ui/accordion/tng-accordion.html',
    },
    {
      content: accordionTemplateCss,
      path: 'src/app/tailng-ui/accordion/tng-accordion.css',
    },
    {
      content: accordionIndexTsTemplate,
      path: 'src/app/tailng-ui/accordion/index.ts',
    },
  ],
  name: 'accordion',
} satisfies RegistryItem;
