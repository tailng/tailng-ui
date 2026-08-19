import type { RegistryItem } from '../registry.types';

const dropdownMenuPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngDropdownMenu]',
  exportAs: 'tngDropdownMenu',
})
export class TngDropdownMenuPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dropdown-menu' as const;
}
`;

const dropdownMenuComponentTsTemplate = `import {
  Component,
  ElementRef,
  HostListener,
  booleanAttribute,
  inject,
  input,
  signal,
} from '@angular/core';
import { TngDropdownMenuPrimitive } from './tng-dropdown-menu-primitive';

@Component({
  selector: 'tng-dropdown-menu',
  imports: [TngDropdownMenuPrimitive],
  templateUrl: './tng-dropdown-menu.html',
  styleUrl: './tng-dropdown-menu.css',
})
export class TngDropdownMenu {
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly label = input<string>('Actions');

  protected readonly open = signal(false);

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: Event): void {
    if (!this.open()) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!this.hostRef.nativeElement.contains(target)) {
      this.open.set(false);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      return;
    }

    this.open.set(false);
  }

  protected toggleOpen(): void {
    if (this.disabled()) {
      return;
    }

    this.open.set(!this.open());
  }
}
`;

const dropdownMenuTemplateHtml = `<div tngDropdownMenu class="tng-dropdown-menu" (keydown)="onKeydown($event)">
  <button
    type="button"
    class="tng-dropdown-menu__trigger"
    [disabled]="disabled()"
    [attr.aria-expanded]="open()"
    [attr.aria-haspopup]="'menu'"
    (click)="toggleOpen()"
  >
    {{ label() }}
  </button>

  @if (open()) {
    <ul role="menu" class="tng-dropdown-menu__panel">
      <ng-content />
    </ul>
  }
</div>
`;

const dropdownMenuTemplateCss = `:host {
  display: inline-block;
}

.tng-dropdown-menu {
  display: inline-grid;
  gap: 0.45rem;
  position: relative;
}

.tng-dropdown-menu__trigger {
  border: 1px solid #cbd5e1;
  border-radius: 0.6rem;
  cursor: pointer;
  min-height: 2.35rem;
  padding: 0 0.85rem;
}

.tng-dropdown-menu__panel {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  box-shadow: 0 16px 34px rgb(2 6 23 / 0.18);
  display: grid;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  min-width: 12rem;
  padding: 0.45rem;
  position: absolute;
  top: calc(100% + 0.25rem);
  z-index: 10;
}

.tng-dropdown-menu__panel :where([role='menuitem']) {
  border-radius: 0.45rem;
  cursor: pointer;
  min-height: 2rem;
  padding: 0.35rem 0.6rem;
}
`;

const dropdownMenuIndexTsTemplate = `export * from './tng-dropdown-menu';
export * from './tng-dropdown-menu-primitive';
`;

export const dropdownMenuRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for dropdown-menu primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/dropdown-menu',
    importSymbols: ['TngDropdownMenu', 'TngDropdownMenuPrimitive'],
  },
  files: [
    {
      content: dropdownMenuPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/dropdown-menu/tng-dropdown-menu-primitive.ts',
    },
    {
      content: dropdownMenuComponentTsTemplate,
      path: 'src/app/tailng-ui/dropdown-menu/tng-dropdown-menu.ts',
    },
    {
      content: dropdownMenuTemplateHtml,
      path: 'src/app/tailng-ui/dropdown-menu/tng-dropdown-menu.html',
    },
    {
      content: dropdownMenuTemplateCss,
      path: 'src/app/tailng-ui/dropdown-menu/tng-dropdown-menu.css',
    },
    {
      content: dropdownMenuIndexTsTemplate,
      path: 'src/app/tailng-ui/dropdown-menu/index.ts',
    },
  ],
  name: 'dropdown-menu',
} satisfies RegistryItem;
