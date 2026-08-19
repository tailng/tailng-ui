import type { RegistryItem } from '../registry.types';

const radioPrimitiveTsTemplate = `import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

type NullableBooleanInput = '' | 'false' | 'true' | boolean | null | undefined;

export function normalizeTngRadioStringValue(
  value: string | null | undefined,
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function coerceTngRadioNullableBoolean(value: NullableBooleanInput): boolean | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (value === '' || value === true || value === 'true') {
    return true;
  }

  if (value === false || value === 'false') {
    return false;
  }

  return null;
}

export function resolveTngRadioInvalidState(
  invalid: boolean | null,
  ariaInvalid: boolean | null,
): boolean {
  if (invalid !== null) {
    return invalid;
  }

  if (ariaInvalid !== null) {
    return ariaInvalid;
  }

  return false;
}

@Directive({
  selector: 'input[tngRadio]',
  exportAs: 'tngRadio',
})
export class TngRadioPrimitive {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngRadioNullableBoolean,
  });
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngRadioNullableBoolean,
  });
  public readonly name = input<string | null>(null);
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly value = input<string | null>(null);

  @HostBinding('checked')
  protected get checkedProp(): boolean {
    return this.checked();
  }

  @HostBinding('attr.aria-checked')
  protected get ariaCheckedAttr(): 'false' | 'true' {
    return this.checked() ? 'true' : 'false';
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabledAttr(): 'true' | null {
    return this.disabled() ? 'true' : null;
  }

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    return normalizeTngRadioStringValue(this.ariaDescribedBy());
  }

  @HostBinding('attr.aria-invalid')
  protected get ariaInvalidAttr(): 'true' | null {
    return this.isInvalid() ? 'true' : null;
  }

  @HostBinding('attr.aria-readonly')
  protected get ariaReadonlyAttr(): 'true' | null {
    return this.readonly() ? 'true' : null;
  }

  @HostBinding('attr.data-checked')
  protected get dataCheckedAttr(): '' | null {
    return this.checked() ? '' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalidAttr(): '' | null {
    return this.isInvalid() ? '' : null;
  }

  @HostBinding('attr.data-readonly')
  protected get dataReadonlyAttr(): '' | null {
    return this.readonly() ? '' : null;
  }

  @HostBinding('attr.data-required')
  protected get dataRequiredAttr(): '' | null {
    return this.required() ? '' : null;
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'checked' | 'unchecked' {
    return this.checked() ? 'checked' : 'unchecked';
  }

  @HostBinding('attr.data-unchecked')
  protected get dataUncheckedAttr(): '' | null {
    return this.checked() ? null : '';
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.name')
  protected get nameAttr(): string | null {
    return normalizeTngRadioStringValue(this.name());
  }

  @HostBinding('attr.required')
  protected get requiredAttr(): '' | null {
    return this.required() ? '' : null;
  }

  @HostBinding('attr.type')
  protected get typeAttr(): 'radio' {
    return 'radio';
  }

  @HostBinding('attr.value')
  protected get valueAttr(): string | null {
    return normalizeTngRadioStringValue(this.value());
  }

  private isInvalid(): boolean {
    return resolveTngRadioInvalidState(this.invalid(), this.ariaInvalid());
  }
}
`;

const radioComponentTsTemplate = `import { booleanAttribute, Component, input, output } from '@angular/core';
import { TngRadioPrimitive } from './tng-radio-primitive';

export function readTngRadioChecked(event: Event): boolean | null {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return null;
  }

  return target.checked;
}

export function shouldEmitTngRadioCheckedChange(disabled: boolean, readonly: boolean): boolean {
  return !disabled && !readonly;
}

@Component({
  selector: 'tng-radio',
  imports: [TngRadioPrimitive],
  templateUrl: './tng-radio.html',
  styleUrl: './tng-radio.css',
})
export class TngRadio {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly name = input<string | null>(null);
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly value = input<string>('on');

  public readonly checkedChange = output<boolean>();

  public onChange(event: Event): void {
    const checked = readTngRadioChecked(event);
    if (checked === null) {
      return;
    }

    if (!shouldEmitTngRadioCheckedChange(this.disabled(), this.readonly())) {
      return;
    }

    this.checkedChange.emit(checked);
  }
}
`;

const radioTemplateHtml = `<label
  class="tng-radio-root"
  [attr.data-disabled]="disabled() ? '' : null"
  [attr.data-invalid]="invalid() ? '' : null"
  [attr.data-readonly]="readonly() ? '' : null"
>
  <input
    tngRadio
    class="tng-radio-control"
    [ariaInvalid]="ariaInvalid()"
    [checked]="checked()"
    [disabled]="disabled()"
    [invalid]="invalid()"
    [required]="required()"
    [readonly]="readonly()"
    [name]="name()"
    [value]="value()"
    [ariaDescribedBy]="ariaDescribedBy()"
    (change)="onChange($event)"
  />
  <span class="tng-radio-label">
    <ng-content />
  </span>
</label>
`;

const radioTemplateCss = `:host {
  display: inline-flex;
}

.tng-radio-root {
  align-items: center;
  color: var(--tng-semantic-foreground-primary, #0f172a);
  cursor: pointer;
  display: inline-flex;
  gap: 0.55rem;
  user-select: none;
}

.tng-radio-root[data-disabled] {
  cursor: not-allowed;
  opacity: 0.65;
}

.tng-radio-root[data-readonly] {
  cursor: default;
}

.tng-radio-control {
  accent-color: var(--tng-semantic-accent-brand, #2563eb);
  block-size: 1rem;
  inline-size: 1rem;
  margin: 0;
}

.tng-radio-root[data-invalid] .tng-radio-control {
  outline: 1px solid var(--tng-semantic-accent-danger, #ef4444);
  outline-offset: 1px;
}

.tng-radio-control:focus-visible {
  box-shadow: 0 0 0 3px var(--tng-semantic-focus-ring, #60a5fa);
  outline: none;
}

.tng-radio-label {
  font-size: 0.925rem;
  line-height: 1.2;
}
`;

const radioIndexTsTemplate = `export * from './tng-radio';
export * from './tng-radio-primitive';
`;

export const radioRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for radio primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/radio',
    importSymbols: ['TngRadio', 'TngRadioPrimitive'],
  },
  files: [
    {
      content: radioPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/radio/tng-radio-primitive.ts',
    },
    {
      content: radioComponentTsTemplate,
      path: 'src/app/tailng-ui/radio/tng-radio.ts',
    },
    {
      content: radioTemplateHtml,
      path: 'src/app/tailng-ui/radio/tng-radio.html',
    },
    {
      content: radioTemplateCss,
      path: 'src/app/tailng-ui/radio/tng-radio.css',
    },
    {
      content: radioIndexTsTemplate,
      path: 'src/app/tailng-ui/radio/index.ts',
    },
  ],
  name: 'radio',
} satisfies RegistryItem;
