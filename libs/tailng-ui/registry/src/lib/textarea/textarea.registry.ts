import type { RegistryItem } from '../registry.types';

const textareaPrimitiveTsTemplate = `import {
  Directive,
  HostBinding,
  booleanAttribute,
  input,
  numberAttribute,
} from '@angular/core';

type NullableBooleanInput = boolean | null | string | undefined;

export function coerceTngTextareaNullableBoolean(
  value: NullableBooleanInput,
): boolean | null {
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

export function normalizeTngTextareaRows(value: number): number {
  if (!Number.isFinite(value)) {
    return 3;
  }

  return Math.max(1, Math.trunc(value));
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
  selector: 'textarea[tngTextarea]',
  exportAs: 'tngTextarea',
})
export class TngTextareaPrimitive {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngTextareaNullableBoolean,
  });
  public readonly ariaRequired = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngTextareaNullableBoolean,
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
  public readonly rows = input<number, number | string>(3, {
    transform: (value: number | string): number =>
      normalizeTngTextareaRows(numberAttribute(value)),
  });

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

  @HostBinding('attr.rows')
  protected get rowsAttr(): number {
    return this.rows();
  }
}
`;

const textareaComponentTsTemplate = `import { booleanAttribute, Component, input, output } from '@angular/core';
import {
  coerceTngTextareaNullableBoolean,
  normalizeTngTextareaRows,
  TngTextareaPrimitive,
} from './tng-textarea-primitive';

type NullableBooleanInput = boolean | null | string | undefined;

export function readTngTextareaEventValue(event: Event): string | null {
  const target = event.target;
  if (!(target instanceof HTMLTextAreaElement)) {
    return null;
  }

  return target.value;
}

@Component({
  selector: 'tng-textarea',
  imports: [TngTextareaPrimitive],
  templateUrl: './tng-textarea.html',
  styleUrl: './tng-textarea.css',
})
export class TngTextarea {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngTextareaNullableBoolean,
  });
  public readonly ariaRequired = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngTextareaNullableBoolean,
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
  public readonly rows = input<number, number | string>(3, {
    transform: (value: number | string): number =>
      normalizeTngTextareaRows(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = input<string | null>(null);

  public readonly valueChange = output<string>();

  public onInput(event: Event): void {
    const value = readTngTextareaEventValue(event);
    if (value === null) {
      return;
    }

    this.valueChange.emit(value);
  }
}
`;

const textareaTemplateHtml = `<textarea
  tngTextarea
  class="tng-textarea"
  [rows]="rows()"
  [disabled]="disabled()"
  [readonly]="readonly()"
  [required]="required()"
  [ariaDescribedBy]="ariaDescribedBy()"
  [ariaInvalid]="ariaInvalid()"
  [ariaRequired]="ariaRequired()"
  [attr.placeholder]="placeholder()"
  [value]="value() ?? ''"
  (input)="onInput($event)"
></textarea>
`;

const textareaTemplateCss = `:host {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  min-height: 0;
}

.tng-textarea {
  appearance: none;
  background: var(--tng-semantic-background-surface, #ffffff);
  border: 1px solid var(--tng-semantic-border-strong, #64748b);
  border-radius: 0.75rem;
  color: var(--tng-semantic-foreground-primary, #0f172a);
  flex: 1 1 auto;
  font: inherit;
  line-height: 1.35;
  min-height: 0;
  padding: 0.7rem 0.85rem;
  resize: vertical;
  width: 100%;
}

.tng-textarea::placeholder {
  color: var(--tng-semantic-foreground-muted, #64748b);
}

.tng-textarea:focus-visible {
  box-shadow: 0 0 0 3px var(--tng-semantic-focus-ring, #60a5fa);
  outline: none;
}

.tng-textarea[data-invalid] {
  border-color: var(--tng-semantic-accent-danger, #dc2626);
}

.tng-textarea:disabled,
.tng-textarea[data-disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
`;

const textareaIndexTsTemplate = `export * from './tng-textarea';
export * from './tng-textarea-primitive';
`;

export const textareaRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for textarea primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/textarea',
    importSymbols: ['TngTextarea', 'TngTextareaPrimitive'],
  },
  files: [
    {
      content: textareaPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/textarea/tng-textarea-primitive.ts',
    },
    {
      content: textareaComponentTsTemplate,
      path: 'src/app/tailng-ui/textarea/tng-textarea.ts',
    },
    {
      content: textareaTemplateHtml,
      path: 'src/app/tailng-ui/textarea/tng-textarea.html',
    },
    {
      content: textareaTemplateCss,
      path: 'src/app/tailng-ui/textarea/tng-textarea.css',
    },
    {
      content: textareaIndexTsTemplate,
      path: 'src/app/tailng-ui/textarea/index.ts',
    },
  ],
  name: 'textarea',
} satisfies RegistryItem;
