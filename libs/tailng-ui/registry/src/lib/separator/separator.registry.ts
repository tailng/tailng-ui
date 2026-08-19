import type { RegistryItem } from '../registry.types';

const separatorPrimitiveTsTemplate = `import { booleanAttribute, Directive, HostBinding, input } from '@angular/core';

export type TngSeparatorOrientation = 'horizontal' | 'vertical';

function normalizeOrientation(value: TngSeparatorOrientation): TngSeparatorOrientation {
  return value === 'vertical' ? 'vertical' : 'horizontal';
}

@Directive({
  selector: '[tngSeparator]',
  exportAs: 'tngSeparator',
})
export class TngSeparatorPrimitive {
  public readonly decorative = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly orientation = input<TngSeparatorOrientation>('horizontal', {
    transform: normalizeOrientation,
  });

  @HostBinding('attr.aria-hidden')
  protected get ariaHiddenAttr(): 'true' | null {
    return this.decorative() ? 'true' : null;
  }

  @HostBinding('attr.aria-orientation')
  protected get ariaOrientationAttr(): TngSeparatorOrientation | null {
    if (this.decorative()) {
      return null;
    }

    return this.orientation();
  }

  @HostBinding('attr.data-orientation')
  protected get dataOrientationAttr(): TngSeparatorOrientation {
    return this.orientation();
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'separator' as const;

  @HostBinding('attr.role')
  protected get roleAttr(): 'separator' | null {
    return this.decorative() ? null : 'separator';
  }
}
`;

const separatorComponentTsTemplate = `import { booleanAttribute, Component, input } from '@angular/core';
import { TngSeparatorPrimitive } from './tng-separator-primitive';
import type { TngSeparatorOrientation } from './tng-separator-primitive';

@Component({
  selector: 'tng-separator',
  imports: [TngSeparatorPrimitive],
  templateUrl: './tng-separator.html',
  styleUrl: './tng-separator.css',
})
export class TngSeparator {
  public readonly decorative = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly orientation = input<TngSeparatorOrientation>('horizontal');
}
`;

const separatorTemplateHtml = `<div
  tngSeparator
  class="tng-separator"
  [decorative]="decorative()"
  [orientation]="orientation()"
></div>
`;

const separatorTemplateCss = `:host {
  display: block;
}

.tng-separator {
  background: var(--tng-semantic-border-strong, #64748b);
  display: block;
}

.tng-separator[data-orientation='horizontal'] {
  height: 1px;
  width: 100%;
}

.tng-separator[data-orientation='vertical'] {
  height: 100%;
  min-height: 1rem;
  width: 1px;
}
`;

const separatorIndexTsTemplate = `export * from './tng-separator';
export * from './tng-separator-primitive';
`;

export const separatorRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for separator primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/separator',
    importSymbols: ['TngSeparator', 'TngSeparatorPrimitive'],
  },
  files: [
    {
      content: separatorPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/separator/tng-separator-primitive.ts',
    },
    {
      content: separatorComponentTsTemplate,
      path: 'src/app/tailng-ui/separator/tng-separator.ts',
    },
    {
      content: separatorTemplateHtml,
      path: 'src/app/tailng-ui/separator/tng-separator.html',
    },
    {
      content: separatorTemplateCss,
      path: 'src/app/tailng-ui/separator/tng-separator.css',
    },
    {
      content: separatorIndexTsTemplate,
      path: 'src/app/tailng-ui/separator/index.ts',
    },
  ],
  name: 'separator',
} satisfies RegistryItem;
