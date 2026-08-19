import type { RegistryItem } from '../registry.types';

const togglePrimitiveTsTemplate = `import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export function resolveTngToggleAriaPressed(pressed: boolean): 'false' | 'true' {
  return pressed ? 'true' : 'false';
}

export function resolveTngToggleDataState(pressed: boolean): 'off' | 'on' {
  return pressed ? 'on' : 'off';
}

@Directive({
  selector: 'button[tngToggle]',
  exportAs: 'tngToggle',
})
export class TngTogglePrimitive {
  public readonly pressed = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-pressed')
  protected get ariaPressedAttr(): 'false' | 'true' {
    return resolveTngToggleAriaPressed(this.pressed());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'toggle' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'off' | 'on' {
    return resolveTngToggleDataState(this.pressed());
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.type')
  protected readonly typeAttr = 'button' as const;
}
`;

const toggleComponentTsTemplate = `import { booleanAttribute, Component, input, output } from '@angular/core';
import { TngTogglePrimitive } from './tng-toggle-primitive';

export function toggleTngToggleState(pressed: boolean): boolean {
  return !pressed;
}

export function resolveTngToggleAriaLabel(
  pressed: boolean,
  pressedLabel: string,
  unpressedLabel: string,
): string {
  return pressed ? pressedLabel : unpressedLabel;
}

@Component({
  selector: 'tng-toggle',
  imports: [TngTogglePrimitive],
  templateUrl: './tng-toggle.html',
  styleUrl: './tng-toggle.css',
})
export class TngToggle {
  public readonly pressed = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly pressedLabel = input<string>('Enabled');
  public readonly unpressedLabel = input<string>('Disabled');

  public readonly pressedChange = output<boolean>();

  public onToggle(): void {
    if (this.disabled()) {
      return;
    }

    this.pressedChange.emit(toggleTngToggleState(this.pressed()));
  }

  public getAriaLabel(): string {
    return resolveTngToggleAriaLabel(
      this.pressed(),
      this.pressedLabel(),
      this.unpressedLabel(),
    );
  }
}
`;

const toggleTemplateHtml = `<button
  tngToggle
  class="tng-toggle-control"
  [pressed]="pressed()"
  [disabled]="disabled()"
  [attr.aria-label]="getAriaLabel()"
  (click)="onToggle()"
>
  @if (pressed()) {
    <span class="tng-toggle-icon">
      <ng-content select="[onIcon]">on</ng-content>
    </span>
  } @else {
    <span class="tng-toggle-icon">
      <ng-content select="[offIcon]">off</ng-content>
    </span>
  }
</button>
`;

const toggleTemplateCss = `:host {
  display: inline-flex;
}

.tng-toggle-control {
  align-items: center;
  background: var(--tng-semantic-background-surface, #e2e8f0);
  border: 1px solid var(--tng-semantic-border-default, #94a3b8);
  border-radius: 0.75rem;
  color: var(--tng-semantic-text-primary, #0f172a);
  cursor: pointer;
  display: inline-flex;
  font-size: 0.875rem;
  font-weight: 600;
  height: 2.25rem;
  justify-content: center;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    color 150ms ease;
  width: 2.25rem;
}

.tng-toggle-control[data-state='on'] {
  background: var(--tng-semantic-accent-brand, #2563eb);
  border-color: var(--tng-semantic-accent-brand, #2563eb);
  color: var(--tng-semantic-text-on-accent, #f8fafc);
}

.tng-toggle-control[data-disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}

.tng-toggle-control:focus-visible {
  outline: 2px solid var(--tng-semantic-accent-brand, #2563eb);
  outline-offset: 2px;
}

.tng-toggle-icon {
  display: inline-flex;
  line-height: 1;
}
`;

const toggleIndexTsTemplate = `export * from './tng-toggle';
export * from './tng-toggle-primitive';
`;

export const toggleRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for icon toggle primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/toggle',
    importSymbols: ['TngToggle', 'TngTogglePrimitive'],
  },
  files: [
    {
      content: togglePrimitiveTsTemplate,
      path: 'src/app/tailng-ui/toggle/tng-toggle-primitive.ts',
    },
    {
      content: toggleComponentTsTemplate,
      path: 'src/app/tailng-ui/toggle/tng-toggle.ts',
    },
    {
      content: toggleTemplateHtml,
      path: 'src/app/tailng-ui/toggle/tng-toggle.html',
    },
    {
      content: toggleTemplateCss,
      path: 'src/app/tailng-ui/toggle/tng-toggle.css',
    },
    {
      content: toggleIndexTsTemplate,
      path: 'src/app/tailng-ui/toggle/index.ts',
    },
  ],
  name: 'toggle',
} satisfies RegistryItem;
