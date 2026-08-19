import type { RegistryItem } from '../registry.types';

const labelPrimitiveTsTemplate = `import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

@Directive({
  selector: 'label[tngLabel]',
  exportAs: 'tngLabel',
})
export class TngLabelPrimitive {
  readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'label' as const;
}
`;

const labelComponentTsTemplate = `import { booleanAttribute, Component, input } from '@angular/core';
import { TngLabelPrimitive } from './tng-label-primitive';

export function resolveTngLabelForAttr(forId: string): string | null {
  const trimmedId = forId.trim();
  return trimmedId.length > 0 ? trimmedId : null;
}

@Component({
  selector: 'tng-label',
  imports: [TngLabelPrimitive],
  templateUrl: './tng-label.html',
  styleUrl: './tng-label.css',
})
export class TngLabel {
  readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly forId = input<string>('');
  readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  resolveForAttr(): string | null {
    return resolveTngLabelForAttr(this.forId());
  }
}
`;

const labelTemplateHtml = `<label tngLabel class="tng-label" [disabled]="disabled()" [attr.for]="resolveForAttr()">
  <span class="tng-label-text">
    <ng-content />
  </span>
  @if (required()) {
    <span class="tng-label-required" aria-hidden="true">*</span>
  }
</label>
`;

const labelTemplateCss = `:host {
  display: inline-flex;
}

.tng-label {
  align-items: center;
  color: #0f172a;
  display: inline-flex;
  font-size: 0.875rem;
  font-weight: 600;
  gap: 0.3rem;
}

.tng-label-required {
  color: #dc2626;
  font-weight: 700;
}
`;

const labelIndexTsTemplate = `export * from './tng-label';
export * from './tng-label-primitive';
`;

export const labelRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for label primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/label',
    importSymbols: ['TngLabel', 'TngLabelPrimitive'],
  },
  files: [
    {
      content: labelPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/label/tng-label-primitive.ts',
    },
    {
      content: labelComponentTsTemplate,
      path: 'src/app/tailng-ui/label/tng-label.ts',
    },
    {
      content: labelTemplateHtml,
      path: 'src/app/tailng-ui/label/tng-label.html',
    },
    {
      content: labelTemplateCss,
      path: 'src/app/tailng-ui/label/tng-label.css',
    },
    {
      content: labelIndexTsTemplate,
      path: 'src/app/tailng-ui/label/index.ts',
    },
  ],
  name: 'label',
} satisfies RegistryItem;
