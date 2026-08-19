import type { RegistryItem } from '../registry.types';

const checkboxPrimitiveTsTemplate = `import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export function resolveTngCheckboxAriaChecked(
  checked: boolean,
  indeterminate: boolean,
): 'false' | 'mixed' | 'true' {
  if (indeterminate) {
    return 'mixed';
  }

  return checked ? 'true' : 'false';
}

export function resolveTngCheckboxDataState(
  checked: boolean,
  indeterminate: boolean,
): 'checked' | 'mixed' | 'unchecked' {
  if (indeterminate) {
    return 'mixed';
  }

  return checked ? 'checked' : 'unchecked';
}

function normalizeStringValue(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

@Directive({
  selector: 'input[tngCheckbox]',
  exportAs: 'tngCheckbox',
})
export class TngCheckboxPrimitive {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly indeterminate = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly name = input<string | null>(null);
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly value = input<string | null>(null);

  @HostBinding('checked')
  protected get checkedProp(): boolean {
    return this.checked();
  }

  @HostBinding('indeterminate')
  protected get indeterminateProp(): boolean {
    return this.indeterminate();
  }

  @HostBinding('attr.aria-checked')
  protected get ariaCheckedAttr(): 'false' | 'mixed' | 'true' {
    return resolveTngCheckboxAriaChecked(this.checked(), this.indeterminate());
  }

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    return normalizeStringValue(this.ariaDescribedBy());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'checked' | 'mixed' | 'unchecked' {
    return resolveTngCheckboxDataState(this.checked(), this.indeterminate());
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.name')
  protected get nameAttr(): string | null {
    return normalizeStringValue(this.name());
  }

  @HostBinding('attr.required')
  protected get requiredAttr(): '' | null {
    return this.required() ? '' : null;
  }

  @HostBinding('attr.type')
  protected get typeAttr(): 'checkbox' {
    return 'checkbox';
  }

  @HostBinding('attr.value')
  protected get valueAttr(): string | null {
    return normalizeStringValue(this.value());
  }
}
`;

const checkboxComponentTsTemplate = `import { booleanAttribute, Component, input, output } from '@angular/core';
import { TngCheckboxPrimitive } from './tng-checkbox-primitive';

export type TngCheckboxChange = Readonly<{
  checked: boolean;
  indeterminate: boolean;
}>;

export function readTngCheckboxChange(event: Event): TngCheckboxChange | null {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return null;
  }

  return {
    checked: target.checked,
    indeterminate: target.indeterminate,
  };
}

@Component({
  selector: 'tng-checkbox',
  imports: [TngCheckboxPrimitive],
  templateUrl: './tng-checkbox.html',
  styleUrl: './tng-checkbox.css',
})
export class TngCheckbox {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly indeterminate = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly name = input<string | null>(null);
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly value = input<string>('on');

  public readonly checkedChange = output<boolean>();
  public readonly indeterminateChange = output<boolean>();

  public onChange(event: Event): void {
    const change = readTngCheckboxChange(event);
    if (change === null) {
      return;
    }

    this.checkedChange.emit(change.checked);
    this.indeterminateChange.emit(change.indeterminate);
  }
}
`;

const checkboxTemplateHtml = `<label class="tng-checkbox-root" [attr.data-disabled]="disabled() ? '' : null">
  <input
    tngCheckbox
    class="tng-checkbox-control"
    [checked]="checked()"
    [disabled]="disabled()"
    [indeterminate]="indeterminate()"
    [required]="required()"
    [name]="name()"
    [value]="value()"
    [ariaDescribedBy]="ariaDescribedBy()"
    (change)="onChange($event)"
  />
  <span class="tng-checkbox-label">
    <ng-content />
  </span>
</label>
`;

const checkboxTemplateCss = `:host {
  display: inline-flex;
}

.tng-checkbox-root {
  align-items: center;
  color: var(--tng-semantic-foreground-primary, #0f172a);
  cursor: pointer;
  display: inline-flex;
  gap: 0.55rem;
  user-select: none;
}

.tng-checkbox-root[data-disabled] {
  cursor: not-allowed;
  opacity: 0.65;
}

.tng-checkbox-control {
  accent-color: var(--tng-semantic-accent-brand, #2563eb);
  block-size: 1rem;
  inline-size: 1rem;
  margin: 0;
}

.tng-checkbox-control:focus-visible {
  box-shadow: 0 0 0 3px var(--tng-semantic-focus-ring, #60a5fa);
  outline: none;
}

.tng-checkbox-label {
  font-size: 0.925rem;
  line-height: 1.2;
}
`;

const checkboxIndexTsTemplate = `export * from './tng-checkbox';
export * from './tng-checkbox-primitive';
`;

export const checkboxRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for checkbox primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/checkbox',
    importSymbols: ['TngCheckbox', 'TngCheckboxPrimitive'],
  },
  files: [
    {
      content: checkboxPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/checkbox/tng-checkbox-primitive.ts',
    },
    {
      content: checkboxComponentTsTemplate,
      path: 'src/app/tailng-ui/checkbox/tng-checkbox.ts',
    },
    {
      content: checkboxTemplateHtml,
      path: 'src/app/tailng-ui/checkbox/tng-checkbox.html',
    },
    {
      content: checkboxTemplateCss,
      path: 'src/app/tailng-ui/checkbox/tng-checkbox.css',
    },
    {
      content: checkboxIndexTsTemplate,
      path: 'src/app/tailng-ui/checkbox/index.ts',
    },
  ],
  name: 'checkbox',
} satisfies RegistryItem;
