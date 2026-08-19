import type { RegistryItem } from '../registry.types';

const toastPrimitiveTsTemplate = `import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export type TngToastTone = 'danger' | 'neutral' | 'success' | 'warning';

export function resolveTngToastAriaLive(tone: TngToastTone): 'assertive' | 'polite' {
  return tone === 'danger' || tone === 'warning' ? 'assertive' : 'polite';
}

export function resolveTngToastDataState(open: boolean): 'closed' | 'open' {
  return open ? 'open' : 'closed';
}

export function resolveTngToastHidden(open: boolean): '' | null {
  return open ? null : '';
}

export function resolveTngToastRole(tone: TngToastTone): 'alert' | 'status' {
  return tone === 'danger' || tone === 'warning' ? 'alert' : 'status';
}

@Directive({
  selector: '[tngToastViewport]',
  exportAs: 'tngToastViewport',
})
export class TngToastViewportPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'toast-viewport' as const;
}

@Directive({
  selector: '[tngToastItem]',
  exportAs: 'tngToastItem',
})
export class TngToastItemPrimitive {
  public readonly open = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly tone = input<TngToastTone>('neutral');

  @HostBinding('attr.aria-atomic')
  protected readonly ariaAtomicAttr = 'true' as const;

  @HostBinding('attr.aria-live')
  protected get ariaLiveAttr(): 'assertive' | 'polite' {
    return resolveTngToastAriaLive(this.tone());
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'toast-item' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return resolveTngToastDataState(this.open());
  }

  @HostBinding('attr.data-tone')
  protected get dataToneAttr(): TngToastTone {
    return this.tone();
  }

  @HostBinding('attr.hidden')
  protected get hiddenAttr(): '' | null {
    return resolveTngToastHidden(this.open());
  }

  @HostBinding('attr.role')
  protected get roleAttr(): 'alert' | 'status' {
    return resolveTngToastRole(this.tone());
  }
}
`;

const toastComponentTsTemplate = `import { Component, input, output, signal } from '@angular/core';
import type { OnDestroy } from '@angular/core';
import type { TngToastTone } from './tng-toast-primitive';
import {
  TngToastItemPrimitive,
  TngToastViewportPrimitive,
} from './tng-toast-primitive';

export type TngToastMode = 'snackbar' | 'toast';
export type TngToastPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

export type TngToastOptions = Readonly<
  Partial<{
    duration: number;
    title: string | null;
    tone: TngToastTone;
  }>
>;

type TngToastKeyboardEvent = Readonly<Pick<KeyboardEvent, 'key'>> &
  Readonly<{ preventDefault: () => void }>;

type TngToastRecord = Readonly<{
  duration: number;
  id: string;
  message: string;
  title: string | null;
  tone: TngToastTone;
}>;

export function normalizeTngToastDuration(value: number, fallback: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return fallback;
  }

  return value;
}

export function normalizeTngToastMaxVisible(value: number): number {
  if (!Number.isFinite(value) || value < 1) {
    return 1;
  }

  return Math.floor(value);
}

export function resolveTngToastNextSlice<TValue>(
  values: readonly TValue[],
  maxVisible: number,
): readonly TValue[] {
  if (values.length <= maxVisible) {
    return values;
  }

  return values.slice(values.length - maxVisible);
}

export function shouldDismissTngToastForKey(key: string): boolean {
  return key === 'Escape';
}

@Component({
  selector: 'tng-toast',
  imports: [TngToastItemPrimitive, TngToastViewportPrimitive],
  templateUrl: './tng-toast.html',
  styleUrl: './tng-toast.css',
})
export class TngToast implements OnDestroy {
  private sequence = 0;
  private readonly timeoutByToastId = new Map<string, ReturnType<typeof setTimeout>>();

  public readonly duration = input<number>(4000);
  public readonly maxVisible = input<number>(4);
  public readonly mode = input<TngToastMode>('toast');
  public readonly position = input<TngToastPosition>('bottom-right');

  public readonly dismissed = output<string>();
  protected readonly toasts = signal<readonly TngToastRecord[]>([]);

  public dismiss(id: string): void {
    const currentToasts = this.toasts();
    const nextToasts = currentToasts.filter((toast) => toast.id !== id);
    if (nextToasts.length === currentToasts.length) {
      return;
    }

    this.clearDismissTimer(id);
    this.toasts.set(nextToasts);
    this.dismissed.emit(id);
  }

  public ngOnDestroy(): void {
    for (const timeoutId of this.timeoutByToastId.values()) {
      clearTimeout(timeoutId);
    }

    this.timeoutByToastId.clear();
  }

  public show(message: string, options: TngToastOptions = {}): string {
    this.sequence += 1;
    const id = \`tng-toast-\${this.sequence}\`;
    const fallbackDuration = this.duration();
    const resolvedDuration = normalizeTngToastDuration(
      options.duration ?? fallbackDuration,
      fallbackDuration,
    );
    const nextToast: TngToastRecord = {
      duration: resolvedDuration,
      id,
      message,
      title: options.title ?? null,
      tone: options.tone ?? 'neutral',
    };

    const previousToasts = this.toasts();
    const visibleLimit = normalizeTngToastMaxVisible(this.maxVisible());
    const nextToasts = resolveTngToastNextSlice([...previousToasts, nextToast], visibleLimit);
    const nextIds = new Set(nextToasts.map((toast) => toast.id));

    for (const previousToast of previousToasts) {
      if (!nextIds.has(previousToast.id)) {
        this.clearDismissTimer(previousToast.id);
      }
    }

    this.toasts.set(nextToasts);
    this.scheduleDismiss(nextToast);
    return id;
  }

  protected onToastKeydown(id: string, event: TngToastKeyboardEvent): void {
    if (!shouldDismissTngToastForKey(event.key)) {
      return;
    }

    event.preventDefault();
    this.dismiss(id);
  }

  private clearDismissTimer(id: string): void {
    const timeoutId = this.timeoutByToastId.get(id);
    if (timeoutId === undefined) {
      return;
    }

    clearTimeout(timeoutId);
    this.timeoutByToastId.delete(id);
  }

  private scheduleDismiss(toast: TngToastRecord): void {
    this.clearDismissTimer(toast.id);
    if (toast.duration === 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      this.timeoutByToastId.delete(toast.id);
      this.dismiss(toast.id);
    }, toast.duration);

    this.timeoutByToastId.set(toast.id, timeoutId);
  }
}
`;

const toastTemplateHtml = `<section
  tngToastViewport
  class="tng-toast-viewport"
  [attr.data-mode]="mode()"
  [attr.data-position]="position()"
>
  @for (toast of toasts(); track toast.id) {
    <article
      tngToastItem
      class="tng-toast-item"
      [tone]="toast.tone"
      tabindex="0"
      (keydown)="onToastKeydown(toast.id, $event)"
    >
      <div class="tng-toast-body">
        @if (toast.title !== null) {
          <p class="tng-toast-title">{{ toast.title }}</p>
        }
        <p class="tng-toast-message">{{ toast.message }}</p>
      </div>

      <button
        type="button"
        class="tng-toast-close"
        aria-label="Dismiss notification"
        (click)="dismiss(toast.id)"
      >
        &times;
      </button>
    </article>
  }
</section>
`;

const toastTemplateCss = `:host {
  display: contents;
}

.tng-toast-viewport {
  display: grid;
  gap: 0.65rem;
  max-width: min(32rem, calc(100vw - 2rem));
  pointer-events: none;
  position: fixed;
  z-index: 1200;
}

.tng-toast-viewport[data-position='top-left'] {
  left: 1rem;
  top: 1rem;
}

.tng-toast-viewport[data-position='top-right'] {
  right: 1rem;
  top: 1rem;
}

.tng-toast-viewport[data-position='bottom-left'] {
  bottom: 1rem;
  left: 1rem;
}

.tng-toast-viewport[data-position='bottom-right'] {
  bottom: 1rem;
  right: 1rem;
}

.tng-toast-item {
  align-items: flex-start;
  background: rgb(15 23 42 / 0.96);
  border: 1px solid rgb(148 163 184 / 0.55);
  border-radius: 0.85rem;
  box-shadow: 0 16px 30px rgb(2 6 23 / 0.35);
  color: #f8fafc;
  display: grid;
  gap: 0.6rem;
  grid-template-columns: 1fr auto;
  min-width: 14rem;
  padding: 0.75rem 0.85rem;
  pointer-events: auto;
}

.tng-toast-item[data-tone='success'] {
  border-color: rgb(52 211 153 / 0.6);
}

.tng-toast-item[data-tone='warning'] {
  border-color: rgb(251 191 36 / 0.6);
}

.tng-toast-item[data-tone='danger'] {
  border-color: rgb(248 113 113 / 0.75);
}

.tng-toast-item:focus-visible {
  outline: 2px solid #38bdf8;
  outline-offset: 2px;
}

.tng-toast-viewport[data-mode='snackbar'] .tng-toast-item {
  border-radius: 0.7rem;
  max-width: 36rem;
  min-width: min(22rem, calc(100vw - 2rem));
}

.tng-toast-body {
  display: grid;
  gap: 0.2rem;
}

.tng-toast-title {
  font-size: 0.83rem;
  font-weight: 700;
  line-height: 1.35;
  margin: 0;
}

.tng-toast-message {
  font-size: 0.79rem;
  line-height: 1.45;
  margin: 0;
  opacity: 0.95;
}

.tng-toast-close {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 0.45rem;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  font-size: 1.1rem;
  height: 1.45rem;
  justify-content: center;
  line-height: 1;
  opacity: 0.85;
  width: 1.45rem;
}

.tng-toast-close:hover {
  background: rgb(148 163 184 / 0.2);
  opacity: 1;
}

.tng-toast-close:focus-visible {
  outline: 2px solid #38bdf8;
  outline-offset: 2px;
}
`;

const toastIndexTsTemplate = `export * from './tng-toast';
export * from './tng-toast-primitive';
`;

export const toastRegistryItem = {
  dependencies: [],
  description:
    'Shadcn-style source files for toast primitive and styled wrapper (snackbar/sonner compatible).',
  install: {
    importPath: './tailng-ui/toast',
    importSymbols: ['TngToast', 'TngToastViewportPrimitive', 'TngToastItemPrimitive'],
  },
  files: [
    {
      content: toastPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/toast/tng-toast-primitive.ts',
    },
    {
      content: toastComponentTsTemplate,
      path: 'src/app/tailng-ui/toast/tng-toast.ts',
    },
    {
      content: toastTemplateHtml,
      path: 'src/app/tailng-ui/toast/tng-toast.html',
    },
    {
      content: toastTemplateCss,
      path: 'src/app/tailng-ui/toast/tng-toast.css',
    },
    {
      content: toastIndexTsTemplate,
      path: 'src/app/tailng-ui/toast/index.ts',
    },
  ],
  name: 'toast',
} satisfies RegistryItem;
