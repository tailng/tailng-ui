import type { RegistryItem } from '../registry.types';

const inputPrimitiveTsTemplate = `import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

type NullableBooleanInput = boolean | null | string | undefined;
export type TngInputType =
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'url';

export function coerceTngInputNullableBoolean(value: NullableBooleanInput): boolean | null {
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

function normalizeStringValue(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toAriaBoolean(value: boolean | null): 'false' | 'true' | null {
  if (value === null) {
    return null;
  }

  return value ? 'true' : 'false';
}

@Directive({
  selector: 'input[tngInput]',
  exportAs: 'tngInput',
})
export class TngInputPrimitive {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });
  public readonly ariaRequired = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly type = input<TngInputType>('text');

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    return normalizeStringValue(this.ariaDescribedBy());
  }

  @HostBinding('attr.aria-invalid')
  protected get ariaInvalidAttr(): 'false' | 'true' | null {
    return toAriaBoolean(this.ariaInvalid());
  }

  @HostBinding('attr.aria-required')
  protected get ariaRequiredAttr(): 'false' | 'true' | null {
    if (this.required()) {
      return 'true';
    }

    return toAriaBoolean(this.ariaRequired());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalidAttr(): '' | null {
    return this.ariaInvalid() === true ? '' : null;
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.readonly')
  protected get readonlyAttr(): '' | null {
    return this.readonly() ? '' : null;
  }

  @HostBinding('attr.required')
  protected get requiredAttr(): '' | null {
    return this.required() ? '' : null;
  }

  @HostBinding('attr.type')
  protected get typeAttr(): TngInputType {
    return this.type();
  }
}
`;

const inputComponentTsTemplate = `import { booleanAttribute, Component, input, output } from '@angular/core';
import {
  coerceTngInputNullableBoolean,
  TngInputPrimitive,
} from './tng-input-primitive';
import type { TngInputType } from './tng-input-primitive';

type NullableBooleanInput = boolean | null | string | undefined;

export function readTngInputEventValue(event: Event): string | null {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return null;
  }

  return target.value;
}

@Component({
  selector: 'tng-input',
  imports: [TngInputPrimitive],
  templateUrl: './tng-input.html',
  styleUrl: './tng-input.css',
})
export class TngInput {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });
  public readonly ariaRequired = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly placeholder = input<string | null>(null);
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly type = input<TngInputType>('text');
  public readonly value = input<string | null>(null);

  public readonly valueChange = output<string>();

  public onInput(event: Event): void {
    const value = readTngInputEventValue(event);
    if (value === null) {
      return;
    }

    this.valueChange.emit(value);
  }
}
`;

const inputTemplateHtml = `<input
  tngInput
  class="tng-input"
  [type]="type()"
  [disabled]="disabled()"
  [readonly]="readonly()"
  [required]="required()"
  [ariaDescribedBy]="ariaDescribedBy()"
  [ariaInvalid]="ariaInvalid()"
  [ariaRequired]="ariaRequired()"
  [attr.placeholder]="placeholder()"
  [value]="value() ?? ''"
  (input)="onInput($event)"
/>
`;

const inputTemplateCss = `:host {
  display: inline-flex;
  width: min(22rem, 100%);
}

.tng-input {
  appearance: none;
  background: var(--tng-semantic-background-surface, #ffffff);
  border: 1px solid var(--tng-semantic-border-strong, #64748b);
  border-radius: 0.6rem;
  color: var(--tng-semantic-foreground-primary, #0f172a);
  font: inherit;
  min-height: 2.5rem;
  padding: 0 0.85rem;
  width: 100%;
}

.tng-input::placeholder {
  color: var(--tng-semantic-foreground-muted, #64748b);
}

.tng-input:focus-visible {
  box-shadow: 0 0 0 3px var(--tng-semantic-focus-ring, #60a5fa);
  outline: none;
}

.tng-input[data-invalid] {
  border-color: var(--tng-semantic-accent-danger, #dc2626);
}

.tng-input:disabled,
.tng-input[data-disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
`;

const inputIndexTsTemplate = `export * from './tng-input';
export * from './tng-input-primitive';
`;

export const inputRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for input primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/input',
    importSymbols: ['TngInput', 'TngInputPrimitive'],
  },
  files: [
    {
      content: inputPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/input/tng-input-primitive.ts',
    },
    {
      content: inputComponentTsTemplate,
      path: 'src/app/tailng-ui/input/tng-input.ts',
    },
    {
      content: inputTemplateHtml,
      path: 'src/app/tailng-ui/input/tng-input.html',
    },
    {
      content: inputTemplateCss,
      path: 'src/app/tailng-ui/input/tng-input.css',
    },
    {
      content: inputIndexTsTemplate,
      path: 'src/app/tailng-ui/input/index.ts',
    },
  ],
  name: 'input',
} satisfies RegistryItem;
