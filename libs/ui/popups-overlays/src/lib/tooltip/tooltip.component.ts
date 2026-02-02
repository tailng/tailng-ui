import {
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  TemplateRef,
  ViewChild,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { TngConnectedOverlay } from '../connected-overlay/connected-overlay.component';
import { TngOverlayPanel } from '../overlay-panel/overlay-panel.component';

export type TngTooltipPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
export type TngTooltipCloseReason = 'escape' | 'blur' | 'programmatic';

@Component({
  selector: 'tng-tooltip',
  standalone: true,
  imports: [NgTemplateOutlet, TngConnectedOverlay, TngOverlayPanel],
  templateUrl: './tooltip.component.html',
})
export class TngTooltip {
  @ViewChild('triggerEl', { static: true })
  triggerEl!: ElementRef<HTMLElement>;

  /**
   * Option B: projected template support
   * Usage:
   * <tng-tooltip>
   *   <ng-template #tooltipContent>...</ng-template>
   *   <button>...</button>
   * </tng-tooltip>
   */
  @ContentChild('tooltipContent', { read: TemplateRef })
  projectedTpl?: TemplateRef<unknown>;

  /** Option A: explicit input template (kept for flexibility) */
  readonly contentTpl = input<TemplateRef<unknown> | null>(null);

  /** Simple text tooltip */
  readonly text = input<string>('');

  /** Behavior */
  readonly placement = input<TngTooltipPlacement>('top-start');
  readonly offset = input<number>(8);
  readonly showDelay = input<number>(250);
  readonly hideDelay = input<number>(100);
  readonly disabled = input<boolean>(false);

  /** Klass */
  readonly panelKlass = input<string>('px-3 py-2 text-xs text-foreground');
  readonly surfaceKlass = input<string>('rounded-md border border-border bg-bg shadow-md');

  /** Events */
  readonly opened = output<void>();
  readonly closed = output<TngTooltipCloseReason>();

  readonly open = signal(false);

  private showTimer: number | null = null;
  private hideTimer: number | null = null;

  /** Resolved template (Option A overrides Option B) */
  readonly tpl = computed(() => this.contentTpl() ?? this.projectedTpl ?? null);

  readonly hasContent = computed(() => !!this.tpl() || !!this.text());

  private clearTimers() {
    if (this.showTimer != null) {
      window.clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    if (this.hideTimer != null) {
      window.clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  private requestOpen() {
    if (this.disabled()) return;
    if (!this.hasContent()) return;

    this.clearTimers();
    const delay = Math.max(0, this.showDelay());

    this.showTimer = window.setTimeout(() => {
      this.open.set(true);
      this.opened.emit();
    }, delay);
  }

  private requestClose(reason: TngTooltipCloseReason) {
    this.clearTimers();
    const delay = Math.max(0, this.hideDelay());

    this.hideTimer = window.setTimeout(() => {
      if (!this.open()) return;
      this.open.set(false);
      this.closed.emit(reason);
    }, delay);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.requestOpen();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.requestClose('programmatic');
  }

  @HostListener('focusin')
  onFocusIn() {
    this.requestOpen();
  }

  @HostListener('focusout')
  onFocusOut() {
    this.requestClose('blur');
  }

  @HostListener('document:keydown', ['$event'])
  onDocKeydown(ev: KeyboardEvent) {
    if (!this.open()) return;

    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.requestClose('escape');
    }
  }
}
