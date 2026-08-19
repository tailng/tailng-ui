import type { RegistryItem } from '../registry.types';

const emptyPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngEmpty]',
  exportAs: 'tngEmpty',
})
export class TngEmptyPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'empty' as const;
}

@Directive({
  selector: '[tngEmptyIcon]',
  exportAs: 'tngEmptyIcon',
})
export class TngEmptyIconPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'empty-icon' as const;
}

@Directive({
  selector: '[tngEmptyTitle]',
  exportAs: 'tngEmptyTitle',
})
export class TngEmptyTitlePrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'empty-title' as const;
}

@Directive({
  selector: '[tngEmptyDescription]',
  exportAs: 'tngEmptyDescription',
})
export class TngEmptyDescriptionPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'empty-description' as const;
}

@Directive({
  selector: '[tngEmptyActions]',
  exportAs: 'tngEmptyActions',
})
export class TngEmptyActionsPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'empty-actions' as const;
}
`;

const emptyComponentTsTemplate = `import { Component, input } from '@angular/core';
import {
  TngEmptyActionsPrimitive,
  TngEmptyDescriptionPrimitive,
  TngEmptyIconPrimitive,
  TngEmptyPrimitive,
  TngEmptyTitlePrimitive,
} from './tng-empty-primitive';

type TngEmptyAlign = 'center' | 'start';

@Component({
  selector: 'tng-empty',
  imports: [TngEmptyPrimitive],
  templateUrl: './tng-empty.html',
  styleUrl: './tng-empty.css',
})
export class TngEmpty {
  public readonly align = input<TngEmptyAlign>('center');
}

@Component({
  selector: 'tng-empty-icon',
  imports: [TngEmptyIconPrimitive],
  templateUrl: './tng-empty-icon.html',
  styleUrl: './tng-empty.css',
})
export class TngEmptyIcon {}

@Component({
  selector: 'tng-empty-title',
  imports: [TngEmptyTitlePrimitive],
  templateUrl: './tng-empty-title.html',
  styleUrl: './tng-empty.css',
})
export class TngEmptyTitle {}

@Component({
  selector: 'tng-empty-description',
  imports: [TngEmptyDescriptionPrimitive],
  templateUrl: './tng-empty-description.html',
  styleUrl: './tng-empty.css',
})
export class TngEmptyDescription {}

@Component({
  selector: 'tng-empty-actions',
  imports: [TngEmptyActionsPrimitive],
  templateUrl: './tng-empty-actions.html',
  styleUrl: './tng-empty.css',
})
export class TngEmptyActions {}
`;

const emptyTemplateHtml = `<section tngEmpty class="tng-empty" [attr.data-align]="align()">
  <ng-content />
</section>
`;

const emptyIconTemplateHtml = `<div tngEmptyIcon class="tng-empty-icon">
  <ng-content />
</div>
`;

const emptyTitleTemplateHtml = `<h3 tngEmptyTitle class="tng-empty-title">
  <ng-content />
</h3>
`;

const emptyDescriptionTemplateHtml = `<p tngEmptyDescription class="tng-empty-description">
  <ng-content />
</p>
`;

const emptyActionsTemplateHtml = `<div tngEmptyActions class="tng-empty-actions">
  <ng-content />
</div>
`;

const emptyTemplateCss = `:host {
  display: block;
}

.tng-empty {
  align-items: center;
  border: 1px dashed var(--tng-semantic-border-strong, #64748b);
  border-radius: 1rem;
  color: var(--tng-semantic-foreground-primary, #0f172a);
  display: grid;
  gap: 0.75rem;
  justify-items: center;
  padding: 1.5rem;
  text-align: center;
}

.tng-empty[data-align='start'] {
  justify-items: start;
  text-align: left;
}

.tng-empty-icon {
  color: var(--tng-semantic-foreground-muted, #64748b);
  display: inline-flex;
  font-size: 2rem;
  line-height: 1;
}

.tng-empty-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0;
}

.tng-empty-description {
  color: var(--tng-semantic-foreground-muted, #64748b);
  font-size: 0.9rem;
  margin: 0;
  max-width: 30rem;
}

.tng-empty-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}
`;

const emptyIndexTsTemplate = `export * from './tng-empty';
export * from './tng-empty-primitive';
`;

export const emptyRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for empty-state primitives and styled wrappers.',
  install: {
    importPath: './tailng-ui/empty',
    importSymbols: [
      'TngEmpty',
      'TngEmptyIcon',
      'TngEmptyTitle',
      'TngEmptyDescription',
      'TngEmptyActions',
      'TngEmptyPrimitive',
      'TngEmptyIconPrimitive',
      'TngEmptyTitlePrimitive',
      'TngEmptyDescriptionPrimitive',
      'TngEmptyActionsPrimitive',
    ],
  },
  files: [
    {
      content: emptyPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/empty/tng-empty-primitive.ts',
    },
    {
      content: emptyComponentTsTemplate,
      path: 'src/app/tailng-ui/empty/tng-empty.ts',
    },
    {
      content: emptyTemplateHtml,
      path: 'src/app/tailng-ui/empty/tng-empty.html',
    },
    {
      content: emptyIconTemplateHtml,
      path: 'src/app/tailng-ui/empty/tng-empty-icon.html',
    },
    {
      content: emptyTitleTemplateHtml,
      path: 'src/app/tailng-ui/empty/tng-empty-title.html',
    },
    {
      content: emptyDescriptionTemplateHtml,
      path: 'src/app/tailng-ui/empty/tng-empty-description.html',
    },
    {
      content: emptyActionsTemplateHtml,
      path: 'src/app/tailng-ui/empty/tng-empty-actions.html',
    },
    {
      content: emptyTemplateCss,
      path: 'src/app/tailng-ui/empty/tng-empty.css',
    },
    {
      content: emptyIndexTsTemplate,
      path: 'src/app/tailng-ui/empty/index.ts',
    },
  ],
  name: 'empty',
} satisfies RegistryItem;
