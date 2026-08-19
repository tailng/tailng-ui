import type { RegistryItem } from '../registry.types';

const bottomsheetPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngBottomSheet]',
  exportAs: 'tngBottomSheet',
})
export class TngBottomSheetPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'bottom-sheet' as const;
}
`;

const bottomsheetComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngBottomSheetPrimitive } from './tng-bottom-sheet-primitive';

@Component({
  selector: 'tng-bottom-sheet',
  imports: [TngBottomSheetPrimitive],
  templateUrl: './tng-bottom-sheet.html',
  styleUrl: './tng-bottom-sheet.css',
})
export class TngBottomSheet {
  public readonly ariaLabel = input<string>('Bottom Sheet');
}
`;

const bottomsheetTemplateHtml = `<section tngBottomSheet class="tng-bottom-sheet" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const bottomsheetTemplateCss = `:host {
  display: block;
}

.tng-bottom-sheet {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const bottomsheetIndexTsTemplate = `export * from './tng-bottom-sheet';
export * from './tng-bottom-sheet-primitive';
`;

export const bottomsheetRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for bottom-sheet primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/bottom-sheet',
    importSymbols: ['TngBottomSheet', 'TngBottomSheetPrimitive'],
  },
  files: [
    {
      content: bottomsheetPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/bottom-sheet/tng-bottom-sheet-primitive.ts',
    },
    {
      content: bottomsheetComponentTsTemplate,
      path: 'src/app/tailng-ui/bottom-sheet/tng-bottom-sheet.ts',
    },
    {
      content: bottomsheetTemplateHtml,
      path: 'src/app/tailng-ui/bottom-sheet/tng-bottom-sheet.html',
    },
    {
      content: bottomsheetTemplateCss,
      path: 'src/app/tailng-ui/bottom-sheet/tng-bottom-sheet.css',
    },
    {
      content: bottomsheetIndexTsTemplate,
      path: 'src/app/tailng-ui/bottom-sheet/index.ts',
    },
  ],
  name: 'bottom-sheet',
} satisfies RegistryItem;
