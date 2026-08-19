import type { RegistryItem } from '../registry.types';

const popoverPrimitiveTsTemplate = `export type TngPopoverCloseReason =
  | 'escape'
  | 'outside-pointer'
  | 'programmatic'
  | 'trigger-toggle';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

let popoverIdSequence = 0;

export function createPopoverId(): string {
  popoverIdSequence += 1;
  return \`tng-popover-\${popoverIdSequence}\`;
}

export function readPopoverEventTarget(event: unknown): Node | null {
  if (!(event instanceof Event)) {
    return null;
  }

  return event.target instanceof Node ? event.target : null;
}

export function readPopoverKeyboardEvent(event: unknown): KeyboardEvent | null {
  return event instanceof KeyboardEvent ? event : null;
}

export function resolvePopoverGlobalDocument(): Document | null {
  if (typeof document === 'undefined') {
    return null;
  }

  return document;
}

export function resolvePopoverFocusableElements(container: unknown): readonly HTMLElement[] {
  if (!(container instanceof HTMLElement)) {
    return [];
  }

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
}
`;

const popoverComponentTsTemplate = `import {
  afterNextRender,
  booleanAttribute,
  Component,
  ElementRef,
  effect,
  inject,
  Injector,
  input,
  output,
  viewChild,
} from '@angular/core';
import type { OnDestroy } from '@angular/core';
import {
  createPopoverId,
  readPopoverEventTarget,
  readPopoverKeyboardEvent,
  resolvePopoverFocusableElements,
  resolvePopoverGlobalDocument,
  type TngPopoverCloseReason,
} from './tng-popover-primitive';

@Component({
  selector: 'tng-popover',
  templateUrl: './tng-popover.html',
  styleUrl: './tng-popover.css',
})
export class TngPopover implements OnDestroy {
  public readonly ariaLabel = input<string>('Popover');
  public readonly closeOnEscape = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnOutsidePointer = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly triggerLabel = input<string>('Toggle Popover');

  public readonly closed = output<TngPopoverCloseReason>();
  public readonly openChange = output<boolean>();

  protected readonly panelId: string;

  private readonly documentRef = resolvePopoverGlobalDocument();
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panelRef');
  private readonly instanceId = createPopoverId();
  private listenersAttached = false;

  private readonly documentKeydownListener = (event: unknown): void => {
    this.onDocumentKeydown(event);
  };
  private readonly documentPointerDownListener = (event: unknown): void => {
    this.onDocumentPointerDown(event);
  };
  private readonly openStateEffect = effect((): void => {
    if (this.open()) {
      this.attachListeners();
      this.focusInitialElement();
      return;
    }

    this.detachListeners();
  });

  public constructor() {
    this.panelId = \`\${this.instanceId}-panel\`;
  }

  public close(): void {
    this.requestClose('programmatic');
  }

  public ngOnDestroy(): void {
    this.openStateEffect.destroy();
    this.detachListeners();
  }

  public onPanelKeydown(event: unknown): void {
    const keyboardEvent = readPopoverKeyboardEvent(event);
    if (keyboardEvent?.key !== 'Escape') {
      return;
    }

    if (!this.closeOnEscape()) {
      return;
    }

    keyboardEvent.preventDefault();
    this.requestClose('escape');
  }

  public onTriggerClick(): void {
    if (this.open()) {
      this.requestClose('trigger-toggle');
      return;
    }

    this.openChange.emit(true);
  }

  private attachListeners(): void {
    if (this.listenersAttached || this.documentRef === null) {
      return;
    }

    this.listenersAttached = true;
    this.documentRef.addEventListener('keydown', this.documentKeydownListener);
    this.documentRef.addEventListener('pointerdown', this.documentPointerDownListener);
  }

  private detachListeners(): void {
    if (!this.listenersAttached || this.documentRef === null) {
      return;
    }

    this.listenersAttached = false;
    this.documentRef.removeEventListener('keydown', this.documentKeydownListener);
    this.documentRef.removeEventListener('pointerdown', this.documentPointerDownListener);
  }

  private focusInitialElement(): void {
    afterNextRender(
      (): void => {
        const panel = this.panelRef()?.nativeElement;
        if (panel === undefined) {
          return;
        }

        const firstFocusable = resolvePopoverFocusableElements(panel)[0];
        if (firstFocusable !== undefined) {
          firstFocusable.focus();
          return;
        }

        panel.focus();
      },
      { injector: this.injector },
    );
  }

  private onDocumentKeydown(event: unknown): void {
    const keyboardEvent = readPopoverKeyboardEvent(event);
    if (keyboardEvent?.key !== 'Escape') {
      return;
    }

    if (!this.closeOnEscape()) {
      return;
    }

    keyboardEvent.preventDefault();
    this.requestClose('escape');
  }

  private onDocumentPointerDown(event: unknown): void {
    if (!this.closeOnOutsidePointer()) {
      return;
    }

    const target = readPopoverEventTarget(event);
    if (target === null || this.hostRef.nativeElement.contains(target)) {
      return;
    }

    this.requestClose('outside-pointer');
  }

  private requestClose(reason: TngPopoverCloseReason): void {
    this.closed.emit(reason);
    this.openChange.emit(false);
  }
}
`;

const popoverTemplateHtml = `<div class="tng-popover-root">
  <button
    type="button"
    class="tng-popover-trigger"
    aria-haspopup="dialog"
    [attr.aria-expanded]="open()"
    [attr.aria-controls]="open() ? panelId : null"
    (click)="onTriggerClick()"
  >
    {{ triggerLabel() }}
  </button>

  @if (open()) {
    <section
      #panelRef
      [id]="panelId"
      role="dialog"
      class="tng-popover-panel"
      [attr.aria-label]="ariaLabel()"
      tabindex="-1"
      (keydown)="onPanelKeydown($event)"
    >
      <ng-content />
    </section>
  }
</div>
`;

const popoverTemplateCss = `:host {
  display: inline-flex;
}

.tng-popover-root {
  display: inline-flex;
  position: relative;
}

.tng-popover-trigger {
  align-items: center;
  appearance: none;
  background: var(--tng-semantic-background-surface, #ffffff);
  border: 1px solid var(--tng-semantic-border-strong, #64748b);
  border-radius: 0.6rem;
  color: var(--tng-semantic-foreground-primary, #0f172a);
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 0.86rem;
  font-weight: 600;
  gap: 0.4rem;
  min-height: 2.35rem;
  padding: 0 0.85rem;
}

.tng-popover-trigger:focus-visible {
  box-shadow: 0 0 0 3px var(--tng-semantic-focus-ring, #60a5fa);
  outline: none;
}

.tng-popover-panel {
  background: var(--tng-semantic-background-surface, #ffffff);
  border: 1px solid var(--tng-semantic-border-strong, #64748b);
  border-radius: 0.75rem;
  box-shadow: 0 18px 28px rgb(15 23 42 / 18%);
  color: var(--tng-semantic-foreground-primary, #0f172a);
  display: grid;
  gap: 0.75rem;
  left: 0;
  margin-top: 0.45rem;
  min-width: 14rem;
  padding: 0.85rem;
  position: absolute;
  top: 100%;
  z-index: 60;
}

.tng-popover-panel:focus-visible {
  box-shadow: 0 0 0 3px var(--tng-semantic-focus-ring, #60a5fa);
  outline: none;
}
`;

const popoverIndexTsTemplate = `export * from './tng-popover';
export * from './tng-popover-primitive';
`;

export const popoverRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for popover wrappers and helpers.',
  install: {
    importPath: './tailng-ui/popover',
    importSymbols: ['TngPopover'],
  },
  files: [
    {
      content: popoverPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/popover/tng-popover-primitive.ts',
    },
    {
      content: popoverComponentTsTemplate,
      path: 'src/app/tailng-ui/popover/tng-popover.ts',
    },
    {
      content: popoverTemplateHtml,
      path: 'src/app/tailng-ui/popover/tng-popover.html',
    },
    {
      content: popoverTemplateCss,
      path: 'src/app/tailng-ui/popover/tng-popover.css',
    },
    {
      content: popoverIndexTsTemplate,
      path: 'src/app/tailng-ui/popover/index.ts',
    },
  ],
  name: 'popover',
} satisfies RegistryItem;
