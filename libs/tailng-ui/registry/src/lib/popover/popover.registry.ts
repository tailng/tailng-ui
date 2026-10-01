import type { RegistryItem } from '../registry.types';

const popoverPrimitiveTsTemplate = `export type TngPopoverCloseReason =
  | 'escape'
  | 'focus-outside'
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
  Directive,
  ElementRef,
  effect,
  HostListener,
  inject,
  Injector,
  input,
  model,
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
  exportAs: 'tngPopover',
})
export class TngPopover implements OnDestroy {
  public readonly ariaLabel = input<string>('Popover');
  public readonly closeOnEscape = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnFocusOutside = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly closeOnOutsidePointer = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly open = model(false);

  public readonly closed = output<TngPopoverCloseReason>();

  public readonly panelId: string;

  private readonly documentRef = resolvePopoverGlobalDocument();
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panelRef');
  private readonly instanceId = createPopoverId();
  private triggerElement: HTMLElement | null = null;
  private listenersAttached = false;

  private readonly documentKeydownListener = (event: unknown): void => {
    this.onDocumentKeydown(event);
  };
  private readonly documentFocusInListener = (event: unknown): void => {
    this.onDocumentFocusIn(event);
  };
  private readonly documentPointerDownListener = (event: unknown): void => {
    this.onDocumentPointerDown(event);
  };
  private readonly openStateEffect = effect((): void => {
    if (this.open()) {
      this.attachListeners();
      this.positionPanel();
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

  public toggle(): void {
    if (this.open()) {
      this.requestClose('trigger-toggle');
      return;
    }

    this.open.set(true);
  }

  public registerTrigger(trigger: HTMLElement): void {
    this.triggerElement = trigger;
  }

  public unregisterTrigger(trigger: HTMLElement): void {
    if (this.triggerElement === trigger) {
      this.triggerElement = null;
    }
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

  private attachListeners(): void {
    if (this.listenersAttached || this.documentRef === null) {
      return;
    }

    this.listenersAttached = true;
    this.documentRef.addEventListener('keydown', this.documentKeydownListener);
    this.documentRef.addEventListener('focusin', this.documentFocusInListener);
    this.documentRef.addEventListener('pointerdown', this.documentPointerDownListener);
  }

  private detachListeners(): void {
    if (!this.listenersAttached || this.documentRef === null) {
      return;
    }

    this.listenersAttached = false;
    this.documentRef.removeEventListener('keydown', this.documentKeydownListener);
    this.documentRef.removeEventListener('focusin', this.documentFocusInListener);
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

  private positionPanel(): void {
    afterNextRender(
      (): void => {
        const panel = this.panelRef()?.nativeElement;
        const trigger = this.triggerElement;
        const windowRef = panel?.ownerDocument.defaultView;
        if (panel === undefined || trigger === null || windowRef === null || windowRef === undefined) {
          return;
        }

        const anchor = trigger.getBoundingClientRect();
        const overlay = panel.getBoundingClientRect();
        const padding = 8;
        const preferredTop = anchor.bottom + padding;
        const top =
          preferredTop + overlay.height <= windowRef.innerHeight - padding
            ? preferredTop
            : Math.max(padding, anchor.top - overlay.height - padding);
        const left = Math.min(
          Math.max(padding, anchor.left),
          Math.max(padding, windowRef.innerWidth - overlay.width - padding),
        );
        panel.style.left = String(left) + 'px';
        panel.style.top = String(top) + 'px';
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
    if (
      target === null ||
      this.hostRef.nativeElement.contains(target) ||
      this.triggerElement?.contains(target)
    ) {
      return;
    }

    this.requestClose('outside-pointer');
  }

  private onDocumentFocusIn(event: unknown): void {
    if (!this.closeOnFocusOutside()) {
      return;
    }

    const target = readPopoverEventTarget(event);
    if (
      target === null ||
      this.hostRef.nativeElement.contains(target) ||
      this.triggerElement?.contains(target)
    ) {
      return;
    }

    this.requestClose('focus-outside');
  }

  private requestClose(reason: TngPopoverCloseReason): void {
    this.closed.emit(reason);
    this.open.set(false);
    this.triggerElement?.focus();
  }
}

@Directive({
  selector: '[tngPopoverTriggerFor]',
  exportAs: 'tngPopoverTriggerFor',
})
export class TngPopoverTriggerFor {
  public readonly tngPopoverTriggerFor = input.required<TngPopover>();

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public constructor() {
    effect((onCleanup): void => {
      const popover = this.tngPopoverTriggerFor();
      const trigger = this.hostRef.nativeElement;
      popover.registerTrigger(trigger);
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-controls', popover.panelId);
      trigger.setAttribute('aria-expanded', String(popover.open()));

      onCleanup((): void => {
        popover.unregisterTrigger(trigger);
        trigger.removeAttribute('aria-haspopup');
        trigger.removeAttribute('aria-controls');
        trigger.removeAttribute('aria-expanded');
      });
    });
  }

  @HostListener('click')
  protected onClick(): void {
    this.tngPopoverTriggerFor().toggle();
  }
}
`;

const popoverTemplateHtml = `<div class="tng-popover-root">
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
  display: block;
}

.tng-popover-panel {
  background: var(--tng-semantic-background-surface, #ffffff);
  border: 1px solid var(--tng-semantic-border-strong, #64748b);
  border-radius: 0.75rem;
  box-shadow: 0 18px 28px rgb(15 23 42 / 18%);
  color: var(--tng-semantic-foreground-primary, #0f172a);
  display: grid;
  gap: 0.75rem;
  min-width: 14rem;
  padding: 0.85rem;
  position: fixed;
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
    importSymbols: ['TngPopover', 'TngPopoverTriggerFor'],
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
