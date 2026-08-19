import type { RegistryItem } from '../registry.types';

const buttontogglePrimitiveTsTemplate = `import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';

type TngButtonToggleAction = 'first' | 'last' | 'next' | 'prev';
type TngToggleButtonElement = HTMLButtonElement;

function getEnabledToggleButtons(host: HTMLElement): readonly TngToggleButtonElement[] {
  return Array.from(host.querySelectorAll<TngToggleButtonElement>('button[tngButtonToggle]')).filter(
    (element) => element.disabled !== true,
  );
}

function resolveTngButtonToggleAction(key: string): TngButtonToggleAction | null {
  switch (key) {
    case 'ArrowDown':
    case 'ArrowRight':
      return 'next';
    case 'ArrowLeft':
    case 'ArrowUp':
      return 'prev';
    case 'Home':
      return 'first';
    case 'End':
      return 'last';
    default:
      return null;
  }
}

function resolveNextToggleIndex(
  currentIndex: number,
  total: number,
  action: TngButtonToggleAction,
): number {
  switch (action) {
    case 'first':
      return 0;
    case 'last':
      return total - 1;
    case 'next':
      return currentIndex < 0 || currentIndex + 1 >= total ? 0 : currentIndex + 1;
    case 'prev':
      return currentIndex < 0 || currentIndex - 1 < 0 ? total - 1 : currentIndex - 1;
  }
}

function focusToggleButton(
  buttons: readonly TngToggleButtonElement[],
  currentIndex: number,
  action: TngButtonToggleAction,
): void {
  const nextIndex = resolveNextToggleIndex(currentIndex, buttons.length, action);
  buttons[nextIndex]?.focus();
}

export function resolveTngButtonToggleAriaPressed(pressed: boolean): 'false' | 'true' {
  return pressed ? 'true' : 'false';
}

export function resolveTngButtonToggleDataState(pressed: boolean): 'off' | 'on' {
  return pressed ? 'on' : 'off';
}

@Directive({
  selector: 'button[tngButtonToggle]',
  exportAs: 'tngButtonToggle',
})
export class TngButtonTogglePrimitive {
  readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly pressed = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-pressed')
  protected get ariaPressedAttr(): 'false' | 'true' {
    return resolveTngButtonToggleAriaPressed(this.pressed());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'button-toggle' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'off' | 'on' {
    return resolveTngButtonToggleDataState(this.pressed());
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.type')
  protected readonly typeAttr = 'button' as const;
}

@Directive({
  selector: '[tngButtonToggleGroup]',
  exportAs: 'tngButtonToggleGroup',
})
export class TngButtonToggleGroupPrimitive {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'button-toggle-group' as const;

  @HostBinding('attr.role')
  protected readonly roleAttr = 'group' as const;

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: Readonly<KeyboardEvent>): void {
    const action = resolveTngButtonToggleAction(event.key);
    if (action === null) {
      return;
    }

    const buttons = getEnabledToggleButtons(this.hostRef.nativeElement);
    if (buttons.length === 0) {
      return;
    }

    const currentIndex = buttons.findIndex((button) => button === document.activeElement);
    focusToggleButton(buttons, currentIndex, action);
    event.preventDefault();
  }
}
`;

const buttontoggleComponentTsTemplate = `import { booleanAttribute, Component, input, output } from '@angular/core';
import { TngButtonTogglePrimitive } from './tng-button-toggle-primitive';

export function toggleTngButtonToggleState(pressed: boolean): boolean {
  return !pressed;
}

@Component({
  selector: 'tng-button-toggle',
  imports: [TngButtonTogglePrimitive],
  templateUrl: './tng-button-toggle.html',
  styleUrl: './tng-button-toggle.css',
})
export class TngButtonToggle {
  readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly pressed = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  readonly pressedChange = output<boolean>();

  onToggle(): void {
    if (this.disabled()) {
      return;
    }

    this.pressedChange.emit(toggleTngButtonToggleState(this.pressed()));
  }
}
`;

const buttontoggleGroupTsTemplate = `import { Component, input } from '@angular/core';
import { TngButtonToggleGroupPrimitive } from './tng-button-toggle-primitive';

@Component({
  selector: 'tng-button-toggle-group',
  imports: [TngButtonToggleGroupPrimitive],
  templateUrl: './tng-button-toggle-group.html',
  styleUrl: './tng-button-toggle-group.css',
})
export class TngButtonToggleGroup {
  readonly ariaLabel = input<string>('Button Toggle Group');
}
`;

const buttontoggleTemplateHtml = `<button
  tngButtonToggle
  class="tng-button-toggle"
  [pressed]="pressed()"
  [disabled]="disabled()"
  [class.tng-button-toggle--pressed]="pressed()"
  (click)="onToggle()"
>
  <ng-content />
</button>
`;

const buttontoggleTemplateCss = `:host {
  display: inline-flex;
}

.tng-button-toggle {
  align-items: center;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 0.65rem;
  color: #0f172a;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 0.875rem;
  gap: 0.375rem;
  justify-content: center;
  min-height: 2.25rem;
  min-width: 2.75rem;
  padding: 0.35rem 0.75rem;
  transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease;
}

.tng-button-toggle:hover {
  background: #e2e8f0;
}

.tng-button-toggle--pressed {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.tng-button-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
`;

const buttontoggleGroupHtmlTemplate = `<section tngButtonToggleGroup class="tng-button-toggle-group" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const buttontoggleGroupCssTemplate = `:host {
  display: inline-flex;
}

.tng-button-toggle-group {
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 0.85rem;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  padding: 0.4rem;
}
`;

const buttontoggleIndexTsTemplate = `export * from './tng-button-toggle';
export * from './tng-button-toggle-group';
export * from './tng-button-toggle-primitive';
`;

export const buttontoggleRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for button-toggle primitives and wrappers.',
  install: {
    importPath: './tailng-ui/button-toggle',
    importSymbols: [
      'TngButtonToggle',
      'TngButtonToggleGroup',
      'TngButtonTogglePrimitive',
      'TngButtonToggleGroupPrimitive',
    ],
  },
  files: [
    {
      content: buttontogglePrimitiveTsTemplate,
      path: 'src/app/tailng-ui/button-toggle/tng-button-toggle-primitive.ts',
    },
    {
      content: buttontoggleComponentTsTemplate,
      path: 'src/app/tailng-ui/button-toggle/tng-button-toggle.ts',
    },
    {
      content: buttontoggleTemplateHtml,
      path: 'src/app/tailng-ui/button-toggle/tng-button-toggle.html',
    },
    {
      content: buttontoggleTemplateCss,
      path: 'src/app/tailng-ui/button-toggle/tng-button-toggle.css',
    },
    {
      content: buttontoggleGroupTsTemplate,
      path: 'src/app/tailng-ui/button-toggle/tng-button-toggle-group.ts',
    },
    {
      content: buttontoggleGroupHtmlTemplate,
      path: 'src/app/tailng-ui/button-toggle/tng-button-toggle-group.html',
    },
    {
      content: buttontoggleGroupCssTemplate,
      path: 'src/app/tailng-ui/button-toggle/tng-button-toggle-group.css',
    },
    {
      content: buttontoggleIndexTsTemplate,
      path: 'src/app/tailng-ui/button-toggle/index.ts',
    },
  ],
  name: 'button-toggle',
} satisfies RegistryItem;
