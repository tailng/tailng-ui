import type { RegistryItem } from '../registry.types';

const tagPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngTag]',
  exportAs: 'tngTag',
})
export class TngTagPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tag' as const;
}
`;

const tagComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngTagPrimitive } from './tng-tag-primitive';

type TngTagAppearance = 'outline' | 'soft' | 'solid';
type TngTagShape = 'pill' | 'rounded';
type TngTagTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';

@Component({
  selector: 'tng-tag',
  imports: [TngTagPrimitive],
  templateUrl: './tng-tag.html',
  styleUrl: './tng-tag.css',
})
export class TngTag {
  public readonly appearance = input<TngTagAppearance>('soft');
  public readonly shape = input<TngTagShape>('pill');
  public readonly tone = input<TngTagTone>('neutral');
}
`;

const tagTemplateHtml = `<span
  tngTag
  class="tng-tag"
  [attr.data-appearance]="appearance()"
  [attr.data-shape]="shape()"
  [attr.data-tone]="tone()"
>
  <ng-content />
</span>
`;

const tagTemplateCss = `:host {
  display: inline-flex;
}

.tng-tag {
  align-items: center;
  border: 1px solid transparent;
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 600;
  gap: 0.25rem;
  line-height: 1;
  min-height: 1.5rem;
  padding: 0 0.5rem;
}

.tng-tag[data-shape='pill'] {
  border-radius: 9999px;
}

.tng-tag[data-shape='rounded'] {
  border-radius: 0.5rem;
}

.tng-tag[data-appearance='solid'][data-tone='neutral'] {
  background: #1e293b;
  color: #e2e8f0;
}

.tng-tag[data-appearance='soft'][data-tone='neutral'] {
  background: #dbeafe;
  color: #1e293b;
}

.tng-tag[data-appearance='outline'][data-tone='neutral'] {
  border-color: #64748b;
  color: #334155;
}

.tng-tag[data-appearance='solid'][data-tone='success'] {
  background: #16a34a;
  color: #f0fdf4;
}

.tng-tag[data-appearance='soft'][data-tone='success'] {
  background: #dcfce7;
  color: #166534;
}

.tng-tag[data-appearance='outline'][data-tone='success'] {
  border-color: #16a34a;
  color: #166534;
}

.tng-tag[data-appearance='solid'][data-tone='warning'] {
  background: #d97706;
  color: #fffbeb;
}

.tng-tag[data-appearance='soft'][data-tone='warning'] {
  background: #fef3c7;
  color: #92400e;
}

.tng-tag[data-appearance='outline'][data-tone='warning'] {
  border-color: #d97706;
  color: #92400e;
}

.tng-tag[data-appearance='solid'][data-tone='danger'] {
  background: #dc2626;
  color: #fef2f2;
}

.tng-tag[data-appearance='soft'][data-tone='danger'] {
  background: #fee2e2;
  color: #991b1b;
}

.tng-tag[data-appearance='outline'][data-tone='danger'] {
  border-color: #dc2626;
  color: #991b1b;
}

.tng-tag[data-appearance='solid'][data-tone='info'] {
  background: #2563eb;
  color: #eff6ff;
}

.tng-tag[data-appearance='soft'][data-tone='info'] {
  background: #dbeafe;
  color: #1e3a8a;
}

.tng-tag[data-appearance='outline'][data-tone='info'] {
  border-color: #2563eb;
  color: #1e3a8a;
}
`;

const tagIndexTsTemplate = `export * from './tng-tag';
export * from './tng-tag-primitive';
`;

export const tagRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for tag primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/tag',
    importSymbols: ['TngTag', 'TngTagPrimitive'],
  },
  files: [
    {
      content: tagPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/tag/tng-tag-primitive.ts',
    },
    {
      content: tagComponentTsTemplate,
      path: 'src/app/tailng-ui/tag/tng-tag.ts',
    },
    {
      content: tagTemplateHtml,
      path: 'src/app/tailng-ui/tag/tng-tag.html',
    },
    {
      content: tagTemplateCss,
      path: 'src/app/tailng-ui/tag/tng-tag.css',
    },
    {
      content: tagIndexTsTemplate,
      path: 'src/app/tailng-ui/tag/index.ts',
    },
  ],
  name: 'tag',
} satisfies RegistryItem;
