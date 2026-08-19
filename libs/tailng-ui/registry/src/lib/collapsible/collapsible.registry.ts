import type { RegistryItem } from '../registry.types';

const collapsiblePrimitiveTsTemplate = `import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export function resolveTngCollapsibleAriaExpanded(open: boolean): 'false' | 'true' {
  return open ? 'true' : 'false';
}

export function resolveTngCollapsibleDataState(open: boolean): 'closed' | 'open' {
  return open ? 'open' : 'closed';
}

@Directive({
  selector: '[tngCollapsible]',
  exportAs: 'tngCollapsible',
})
export class TngCollapsiblePrimitive {
  readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'collapsible' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return resolveTngCollapsibleDataState(this.open());
  }
}

@Directive({
  selector: 'button[tngCollapsibleTrigger]',
  exportAs: 'tngCollapsibleTrigger',
})
export class TngCollapsibleTriggerPrimitive {
  readonly contentId = input<string>('');
  readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-controls')
  protected get ariaControlsAttr(): string | null {
    const id = this.contentId().trim();
    return id.length > 0 ? id : null;
  }

  @HostBinding('attr.aria-expanded')
  protected get ariaExpandedAttr(): 'false' | 'true' {
    return resolveTngCollapsibleAriaExpanded(this.open());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'collapsible-trigger' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return resolveTngCollapsibleDataState(this.open());
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.type')
  protected readonly typeAttr = 'button' as const;
}

@Directive({
  selector: '[tngCollapsibleContent]',
  exportAs: 'tngCollapsibleContent',
})
export class TngCollapsibleContentPrimitive {
  readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'collapsible-content' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return resolveTngCollapsibleDataState(this.open());
  }

  @HostBinding('attr.hidden')
  protected get hiddenAttr(): '' | null {
    return this.open() ? null : '';
  }
}
`;

const collapsibleComponentTsTemplate = `import { booleanAttribute, Component, input, output } from '@angular/core';
import {
  TngCollapsiblePrimitive,
  TngCollapsibleContentPrimitive,
  TngCollapsibleTriggerPrimitive,
} from './tng-collapsible-primitive';

let nextCollapsibleContentId = 0;

export function createTngCollapsibleContentId(): string {
  nextCollapsibleContentId += 1;
  return \`tng-collapsible-content-\${nextCollapsibleContentId}\`;
}

export function toggleTngCollapsibleState(open: boolean, disabled: boolean): boolean {
  return disabled ? open : !open;
}

@Component({
  selector: 'tng-collapsible',
  imports: [
    TngCollapsiblePrimitive,
    TngCollapsibleTriggerPrimitive,
    TngCollapsibleContentPrimitive,
  ],
  templateUrl: './tng-collapsible.html',
  styleUrl: './tng-collapsible.css',
})
export class TngCollapsible {
  readonly contentId = input<string>(createTngCollapsibleContentId());
  readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly title = input<string>('Collapsible');

  readonly openChange = output<boolean>();

  onToggle(): void {
    const nextState = toggleTngCollapsibleState(this.open(), this.disabled());
    this.openChange.emit(nextState);
  }
}
`;

const collapsibleTemplateHtml = `<section tngCollapsible class="tng-collapsible" [open]="open()" [disabled]="disabled()">
  <button
    tngCollapsibleTrigger
    class="tng-collapsible-trigger"
    [open]="open()"
    [disabled]="disabled()"
    [contentId]="contentId()"
    (click)="onToggle()"
  >
    <span class="tng-collapsible-title">{{ title() }}</span>
    <span class="tng-collapsible-icon" aria-hidden="true">{{ open() ? '−' : '+' }}</span>
  </button>

  <div
    tngCollapsibleContent
    class="tng-collapsible-content"
    [id]="contentId()"
    [open]="open()"
  >
    <ng-content />
  </div>
</section>
`;

const collapsibleTemplateCss = `:host {
  display: block;
}

.tng-collapsible {
  border: 1px solid #cbd5e1;
  border-radius: 0.85rem;
  display: grid;
  overflow: hidden;
}

.tng-collapsible-trigger {
  align-items: center;
  background: #f8fafc;
  border: 0;
  color: #0f172a;
  cursor: pointer;
  display: flex;
  font: inherit;
  justify-content: space-between;
  min-height: 2.75rem;
  padding: 0.65rem 0.9rem;
  text-align: left;
  width: 100%;
}

.tng-collapsible-content {
  background: #e2e8f0;
  color: #0f172a;
  padding: 0.85rem 0.95rem;
}
`;

const collapsibleIndexTsTemplate = `export * from './tng-collapsible';
export * from './tng-collapsible-primitive';
`;

export const collapsibleRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for collapsible primitives and wrapper.',
  install: {
    importPath: './tailng-ui/collapsible',
    importSymbols: [
      'TngCollapsible',
      'TngCollapsiblePrimitive',
      'TngCollapsibleTriggerPrimitive',
      'TngCollapsibleContentPrimitive',
    ],
  },
  files: [
    {
      content: collapsiblePrimitiveTsTemplate,
      path: 'src/app/tailng-ui/collapsible/tng-collapsible-primitive.ts',
    },
    {
      content: collapsibleComponentTsTemplate,
      path: 'src/app/tailng-ui/collapsible/tng-collapsible.ts',
    },
    {
      content: collapsibleTemplateHtml,
      path: 'src/app/tailng-ui/collapsible/tng-collapsible.html',
    },
    {
      content: collapsibleTemplateCss,
      path: 'src/app/tailng-ui/collapsible/tng-collapsible.css',
    },
    {
      content: collapsibleIndexTsTemplate,
      path: 'src/app/tailng-ui/collapsible/index.ts',
    },
  ],
  name: 'collapsible',
} satisfies RegistryItem;
