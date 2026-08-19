import type { RegistryItem } from '../registry.types';

const buttonPrimitiveTsTemplate = `import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';

type ButtonHostElement = HTMLAnchorElement | HTMLButtonElement;
type NullableBooleanInput = boolean | null | string | undefined;
export type TngPressAriaHasPopup =
  | 'dialog'
  | 'false'
  | 'grid'
  | 'listbox'
  | 'menu'
  | 'tree'
  | 'true';
export type TngPressType = 'button' | 'reset' | 'submit';

const validAriaHasPopupValues: readonly TngPressAriaHasPopup[] = [
  'dialog',
  'false',
  'grid',
  'listbox',
  'menu',
  'tree',
  'true',
];

export function coerceTngPressNullableBoolean(value: NullableBooleanInput): boolean | null {
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

export function coerceTngPressAriaHasPopup(
  value: boolean | null | string | undefined,
): TngPressAriaHasPopup | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (value === true) {
    return 'true';
  }

  if (value === false) {
    return 'false';
  }

  const normalized = value.trim().toLowerCase();
  if (!isTngPressAriaHasPopup(normalized)) {
    return null;
  }

  return normalized;
}

function isActivationKey(key: string): boolean {
  return key === ' ' || key === 'Enter';
}

function isTngPressAriaHasPopup(value: string): value is TngPressAriaHasPopup {
  return validAriaHasPopupValues.includes(value as TngPressAriaHasPopup);
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
  selector: 'a[tngPress], button[tngPress]',
  exportAs: 'tngPress',
})
export class TngPressPrimitive {
  public readonly ariaControls = input<string | null>(null);
  public readonly ariaExpanded = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngPressNullableBoolean,
  });
  public readonly ariaHasPopup = input<
    TngPressAriaHasPopup | null,
    boolean | null | string | undefined
  >(null, {
    transform: coerceTngPressAriaHasPopup,
  });
  public readonly ariaPressed = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngPressNullableBoolean,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly type = input<TngPressType>('button');

  private readonly hostRef = inject<ElementRef<ButtonHostElement>>(ElementRef);

  @HostBinding('attr.aria-controls')
  protected get ariaControlsAttr(): string | null {
    return normalizeStringValue(this.ariaControls());
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabledAttr(): 'true' | null {
    if (this.isNativeButton()) {
      return null;
    }

    return this.disabled() ? 'true' : null;
  }

  @HostBinding('attr.aria-expanded')
  protected get ariaExpandedAttr(): 'false' | 'true' | null {
    return toAriaBoolean(this.ariaExpanded());
  }

  @HostBinding('attr.aria-haspopup')
  protected get ariaHasPopupAttr(): TngPressAriaHasPopup | null {
    return this.ariaHasPopup();
  }

  @HostBinding('attr.aria-pressed')
  protected get ariaPressedAttr(): 'false' | 'true' | null {
    return toAriaBoolean(this.ariaPressed());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    if (!this.isNativeButton()) {
      return null;
    }

    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.role')
  protected get roleAttr(): 'button' | null {
    return this.isAnchorWithoutHref() ? 'button' : null;
  }

  @HostBinding('attr.tabindex')
  protected get tabIndexAttr(): -1 | 0 | null {
    if (!this.isAnchorHost()) {
      return null;
    }

    if (this.disabled()) {
      return -1;
    }

    return this.hasHref() ? null : 0;
  }

  @HostBinding('attr.type')
  protected get typeAttr(): TngPressType | null {
    return this.isNativeButton() ? this.type() : null;
  }

  @HostListener('click', ['$event'])
  protected onHostClick(...args: readonly unknown[]): void {
    if (!this.disabled()) {
      return;
    }

    const [event] = args;
    if (!(event instanceof Event)) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  @HostListener('keydown', ['$event'])
  protected onHostKeyDown(...args: readonly unknown[]): void {
    if (!this.isAnchorWithoutHref()) {
      return;
    }

    const [event] = args;
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (!isActivationKey(event.key)) {
      return;
    }

    event.preventDefault();
    if (this.disabled()) {
      return;
    }

    this.hostElement.click();
  }

  private get hostElement(): ButtonHostElement {
    return this.hostRef.nativeElement;
  }

  private hasHref(): boolean {
    return this.hostElement.hasAttribute('href');
  }

  private isAnchorHost(): boolean {
    return this.hostElement.tagName === 'A';
  }

  private isAnchorWithoutHref(): boolean {
    if (!this.isAnchorHost()) {
      return false;
    }

    return !this.hasHref();
  }

  private isNativeButton(): boolean {
    return this.hostElement.tagName === 'BUTTON';
  }
}
`;

const triggerTargetTsTemplate = `import { InjectionToken } from '@angular/core';

export type TngTriggerTargetAttributes = Readonly<{
  ariaControls?: string | null;
  ariaExpanded?: boolean | null;
  ariaHasPopup?: string | null;
}>;

export interface TngTriggerTarget {
  getTngTriggerElement(): HTMLElement | null;
  setTngTriggerAttributes(attributes: TngTriggerTargetAttributes): void;
}

export const TNG_TRIGGER_TARGET = new InjectionToken<TngTriggerTarget>('TNG_TRIGGER_TARGET');
`;

const buttonComponentTsTemplate = `import {
  booleanAttribute,
  Component,
  ElementRef,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  coerceTngPressAriaHasPopup,
  coerceTngPressNullableBoolean,
  TngPressPrimitive,
} from './tng-press-primitive';
import type { TngPressAriaHasPopup, TngPressType } from './tng-press-primitive';
import {
  TNG_TRIGGER_TARGET,
  type TngTriggerTarget,
  type TngTriggerTargetAttributes,
} from '../tng-trigger-target';

type NullableBooleanInput = boolean | null | string | undefined;
export type TngButtonAppearance = 'ghost' | 'outline' | 'solid';
export type TngButtonSize = 'lg' | 'md' | 'sm';
export type TngButtonTone = 'danger' | 'neutral' | 'primary' | 'success';

@Component({
  selector: 'tng-button',
  imports: [TngPressPrimitive],
  providers: [{ provide: TNG_TRIGGER_TARGET, useExisting: forwardRef(() => TngButton) }],
  templateUrl: './tng-button.html',
  styleUrl: './tng-button.css',
})
export class TngButton implements TngTriggerTarget {
  public readonly appearance = input<TngButtonAppearance>('solid');
  public readonly ariaControls = input<string | null>(null);
  public readonly ariaExpanded = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngPressNullableBoolean,
  });
  public readonly ariaHasPopup = input<
    TngPressAriaHasPopup | null,
    boolean | null | string | undefined
  >(null, {
    transform: coerceTngPressAriaHasPopup,
  });
  public readonly ariaPressed = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngPressNullableBoolean,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly size = input<TngButtonSize>('md');
  public readonly tone = input<TngButtonTone>('primary');
  public readonly type = input<TngPressType>('button');

  protected readonly triggerAriaControls = signal<string | null>(null);
  protected readonly triggerAriaExpanded = signal<boolean | null>(null);
  protected readonly triggerAriaHasPopup = signal<TngPressAriaHasPopup | null>(null);
  protected readonly buttonRef = viewChild<ElementRef<HTMLButtonElement>>('buttonRef');

  public getTngTriggerElement(): HTMLButtonElement | null {
    return this.buttonRef()?.nativeElement ?? null;
  }

  public setTngTriggerAttributes(attributes: TngTriggerTargetAttributes): void {
    if ('ariaControls' in attributes) {
      this.triggerAriaControls.set(attributes.ariaControls ?? null);
    }

    if ('ariaExpanded' in attributes) {
      this.triggerAriaExpanded.set(attributes.ariaExpanded ?? null);
    }

    if ('ariaHasPopup' in attributes) {
      this.triggerAriaHasPopup.set(coerceTngPressAriaHasPopup(attributes.ariaHasPopup));
    }

  }
}
`;

const buttonTemplateHtml = `<button
  #buttonRef
  tngPress
  class="tng-button"
  [type]="type()"
  [disabled]="disabled()"
  [ariaControls]="triggerAriaControls() ?? ariaControls()"
  [ariaExpanded]="triggerAriaExpanded() ?? ariaExpanded()"
  [ariaHasPopup]="triggerAriaHasPopup() ?? ariaHasPopup()"
  [ariaPressed]="ariaPressed()"
  [attr.data-appearance]="appearance()"
  [attr.data-size]="size()"
  [attr.data-tone]="tone()"
>
  <ng-content />
</button>
`;

const buttonTemplateCss = `:host {
  display: inline-flex;
}

.tng-button {
  align-items: center;
  appearance: none;
  border: 1px solid transparent;
  border-radius: 0.6rem;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  gap: 0.5rem;
  justify-content: center;
  line-height: 1;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease, opacity 120ms ease;
}

.tng-button[data-size='sm'] {
  min-height: 2rem;
  padding: 0 0.75rem;
}

.tng-button[data-size='md'] {
  min-height: 2.5rem;
  padding: 0 1rem;
}

.tng-button[data-size='lg'] {
  min-height: 3rem;
  padding: 0 1.25rem;
}

.tng-button[data-appearance='solid'][data-tone='primary'] {
  background: var(--tng-semantic-accent-brand, #2563eb);
  color: var(--tng-semantic-foreground-inverse, #f8fafc);
}

.tng-button[data-appearance='solid'][data-tone='danger'] {
  background: var(--tng-semantic-accent-danger, #dc2626);
  color: var(--tng-semantic-foreground-inverse, #f8fafc);
}

.tng-button[data-appearance='solid'][data-tone='success'] {
  background: var(--tng-semantic-accent-success, #16a34a);
  color: var(--tng-semantic-foreground-inverse, #f8fafc);
}

.tng-button[data-appearance='solid'][data-tone='neutral'] {
  background: var(--tng-semantic-background-surface, #e2e8f0);
  color: var(--tng-semantic-foreground-primary, #0f172a);
}

.tng-button[data-appearance='outline'] {
  background: transparent;
  border-color: var(--tng-semantic-border-strong, #64748b);
  color: var(--tng-semantic-foreground-primary, #0f172a);
}

.tng-button[data-appearance='ghost'] {
  background: transparent;
  color: var(--tng-semantic-foreground-primary, #0f172a);
}

.tng-button:focus-visible {
  box-shadow: 0 0 0 3px var(--tng-semantic-focus-ring, #60a5fa);
  outline: none;
}

.tng-button:disabled,
.tng-button[data-disabled] {
  cursor: not-allowed;
  opacity: 0.55;
}
`;

const buttonIndexTsTemplate = `export * from './tng-button';
export * from './tng-press-primitive';
`;

export const buttonRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for button primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/button',
    importSymbols: ['TngButton', 'TngPressPrimitive'],
  },
  files: [
    {
      content: triggerTargetTsTemplate,
      path: 'src/app/tailng-ui/tng-trigger-target.ts',
    },
    {
      content: buttonPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/button/tng-press-primitive.ts',
    },
    {
      content: buttonComponentTsTemplate,
      path: 'src/app/tailng-ui/button/tng-button.ts',
    },
    {
      content: buttonTemplateHtml,
      path: 'src/app/tailng-ui/button/tng-button.html',
    },
    {
      content: buttonTemplateCss,
      path: 'src/app/tailng-ui/button/tng-button.css',
    },
    {
      content: buttonIndexTsTemplate,
      path: 'src/app/tailng-ui/button/index.ts',
    },
  ],
  name: 'button',
} satisfies RegistryItem;
