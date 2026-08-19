import type { RegistryItem } from '../registry.types';

const tooltipPrimitiveTsTemplate = `import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export type TngTooltipSide = 'bottom' | 'left' | 'right' | 'top';

let tooltipIdSequence = 0;

export function createTooltipId(): string {
  tooltipIdSequence += 1;
  return \`tng-tooltip-\${tooltipIdSequence}\`;
}

export function resolveTngTooltipAriaDescribedBy(
  open: boolean,
  tooltipId: string | null,
): string | null {
  if (!open) {
    return null;
  }

  return tooltipId === null || tooltipId.trim().length === 0 ? null : tooltipId;
}

export function resolveTngTooltipDataState(open: boolean): 'closed' | 'open' {
  return open ? 'open' : 'closed';
}

export function resolveTngTooltipHidden(open: boolean): '' | null {
  return open ? null : '';
}

@Directive({
  selector: '[tngTooltipTrigger]',
  exportAs: 'tngTooltipTrigger',
})
export class TngTooltipTrigger {
  public readonly describedBy = input<string | null>(null);
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    return resolveTngTooltipAriaDescribedBy(this.open(), this.describedBy());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tooltip-trigger' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return resolveTngTooltipDataState(this.open());
  }
}

@Directive({
  selector: '[tngTooltipContent]',
  exportAs: 'tngTooltipContent',
})
export class TngTooltipContent {
  public readonly id = input.required<string>();
  public readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly side = input<TngTooltipSide>('top');

  @HostBinding('attr.data-side')
  protected get dataSideAttr(): TngTooltipSide {
    return this.side();
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tooltip-content' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return resolveTngTooltipDataState(this.open());
  }

  @HostBinding('attr.hidden')
  protected get hiddenAttr(): '' | null {
    return resolveTngTooltipHidden(this.open());
  }

  @HostBinding('attr.id')
  protected get idAttr(): string {
    return this.id();
  }

  @HostBinding('attr.role')
  protected readonly roleAttr = 'tooltip' as const;
}
`;

const tooltipComponentTsTemplate = `import { booleanAttribute, Component, effect, input, output, signal } from '@angular/core';
import type { OnDestroy } from '@angular/core';
import {
  createTooltipId,
  type TngTooltipSide,
  TngTooltipContent,
  TngTooltipTrigger,
} from './tng-tooltip-primitive';

type TngTooltipKeyboardEvent = Readonly<Pick<KeyboardEvent, 'key'>> &
  Readonly<{ preventDefault: () => void }>;

export function normalizeTngTooltipDelay(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return value;
}

export function shouldCloseTngTooltipForKey(key: string): boolean {
  return key === 'Escape';
}

@Component({
  selector: 'tng-tooltip',
  imports: [TngTooltipTrigger, TngTooltipContent],
  templateUrl: './tng-tooltip.html',
  styleUrl: './tng-tooltip.css',
})
export class TngTooltip implements OnDestroy {
  private closeTimerId: ReturnType<typeof setTimeout> | null = null;
  private openTimerId: ReturnType<typeof setTimeout> | null = null;

  public readonly ariaLabel = input<string | null>(null);
  public readonly closeDelay = input<number>(60);
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly openDelay = input<number>(120);
  public readonly side = input<TngTooltipSide>('top');
  public readonly text = input<string>('More information');
  public readonly triggerLabel = input<string>('Info');

  public readonly openChange = output<boolean>();
  protected readonly open = signal(false);
  protected readonly tooltipId = createTooltipId();

  private readonly syncDisabledState = effect(() => {
    if (this.disabled() && this.open()) {
      this.setOpen(false);
    }
  });

  public ngOnDestroy(): void {
    this.syncDisabledState.destroy();
    this.clearCloseTimer();
    this.clearOpenTimer();
  }

  protected onCloseIntent(): void {
    if (this.disabled()) {
      return;
    }

    this.clearOpenTimer();
    const delay = normalizeTngTooltipDelay(this.closeDelay());
    if (delay === 0) {
      this.setOpen(false);
      return;
    }

    this.closeTimerId = setTimeout(() => {
      this.closeTimerId = null;
      this.setOpen(false);
    }, delay);
  }

  protected onOpenIntent(): void {
    if (this.disabled()) {
      return;
    }

    this.clearCloseTimer();
    const delay = normalizeTngTooltipDelay(this.openDelay());
    if (delay === 0) {
      this.setOpen(true);
      return;
    }

    this.openTimerId = setTimeout(() => {
      this.openTimerId = null;
      this.setOpen(true);
    }, delay);
  }

  protected onTriggerKeydown(event: TngTooltipKeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    if (!shouldCloseTngTooltipForKey(event.key)) {
      return;
    }

    event.preventDefault();
    this.clearCloseTimer();
    this.clearOpenTimer();
    this.setOpen(false);
  }

  private clearCloseTimer(): void {
    if (this.closeTimerId !== null) {
      clearTimeout(this.closeTimerId);
      this.closeTimerId = null;
    }
  }

  private clearOpenTimer(): void {
    if (this.openTimerId !== null) {
      clearTimeout(this.openTimerId);
      this.openTimerId = null;
    }
  }

  private setOpen(nextOpen: boolean): void {
    if (this.open() === nextOpen) {
      return;
    }

    this.open.set(nextOpen);
    this.openChange.emit(nextOpen);
  }
}
`;

const tooltipTemplateHtml = `<span class="tng-tooltip-root" [attr.data-disabled]="disabled() ? '' : null">
  <button
    tngTooltipTrigger
    class="tng-tooltip-trigger"
    type="button"
    [attr.aria-label]="ariaLabel()"
    [describedBy]="tooltipId"
    [disabled]="disabled()"
    [open]="open()"
    (blur)="onCloseIntent()"
    (focus)="onOpenIntent()"
    (keydown)="onTriggerKeydown($event)"
    (mouseleave)="onCloseIntent()"
    (mouseenter)="onOpenIntent()"
  >
    <ng-content select="[trigger]">{{ triggerLabel() }}</ng-content>
  </button>

  <span
    tngTooltipContent
    class="tng-tooltip-content"
    [id]="tooltipId"
    [open]="open()"
    [side]="side()"
  >
    <ng-content>{{ text() }}</ng-content>
  </span>
</span>
`;

const tooltipTemplateCss = `:host {
  display: inline-flex;
}

.tng-tooltip-root {
  display: inline-flex;
  position: relative;
}

.tng-tooltip-trigger {
  align-items: center;
  background: var(--tng-semantic-background-surface, #e2e8f0);
  border: 1px solid var(--tng-semantic-border-default, #94a3b8);
  border-radius: 0.5rem;
  color: var(--tng-semantic-text-primary, #0f172a);
  cursor: pointer;
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 600;
  justify-content: center;
  min-height: 2rem;
  min-width: 2rem;
  padding: 0.25rem 0.55rem;
}

.tng-tooltip-trigger:focus-visible {
  outline: 2px solid var(--tng-semantic-accent-brand, #2563eb);
  outline-offset: 2px;
}

.tng-tooltip-trigger[data-state='open'] {
  border-color: var(--tng-semantic-accent-brand, #2563eb);
}

.tng-tooltip-content {
  background: rgb(15 23 42 / 0.95);
  border: 1px solid rgb(148 163 184 / 0.35);
  border-radius: 0.5rem;
  color: #f8fafc;
  font-size: 0.75rem;
  left: 50%;
  max-width: 18rem;
  padding: 0.45rem 0.6rem;
  pointer-events: none;
  position: absolute;
  transform: translateX(-50%);
  white-space: nowrap;
  z-index: var(--tng-tooltip-z-overlay, var(--tng-tooltip-overlay-z-index, var(--tng-z-overlay, 20)));
}

.tng-tooltip-content[data-side='top'] {
  bottom: calc(100% + 0.5rem);
}

.tng-tooltip-content[data-side='bottom'] {
  top: calc(100% + 0.5rem);
}

.tng-tooltip-content[data-side='left'] {
  left: auto;
  right: calc(100% + 0.5rem);
  top: 50%;
  transform: translateY(-50%);
}

.tng-tooltip-content[data-side='right'] {
  left: calc(100% + 0.5rem);
  top: 50%;
  transform: translateY(-50%);
}

.tng-tooltip-content[data-state='closed'] {
  opacity: 0;
}
`;

const tooltipIndexTsTemplate = `export * from './tng-tooltip';
export * from './tng-tooltip-primitive';
`;

export const tooltipRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for tooltip primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/tooltip',
    importSymbols: ['TngTooltip', 'TngTooltipTrigger', 'TngTooltipContent'],
  },
  files: [
    {
      content: tooltipPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/tooltip/tng-tooltip-primitive.ts',
    },
    {
      content: tooltipComponentTsTemplate,
      path: 'src/app/tailng-ui/tooltip/tng-tooltip.ts',
    },
    {
      content: tooltipTemplateHtml,
      path: 'src/app/tailng-ui/tooltip/tng-tooltip.html',
    },
    {
      content: tooltipTemplateCss,
      path: 'src/app/tailng-ui/tooltip/tng-tooltip.css',
    },
    {
      content: tooltipIndexTsTemplate,
      path: 'src/app/tailng-ui/tooltip/index.ts',
    },
  ],
  name: 'tooltip',
} satisfies RegistryItem;
