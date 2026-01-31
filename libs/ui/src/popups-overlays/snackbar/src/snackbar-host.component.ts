import { Component, computed, effect, input, output, signal } from '@angular/core';
import { TngSnackbarItem, TngSnackbarIntent } from './snackbar.types';

export type TngSnackbarPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

@Component({
  selector: 'tng-snackbar-host',
  standalone: true,
  templateUrl: './snackbar-host.component.html',
})
export class TailngSnackbarHostComponent {
  /** Controlled items array */
  readonly items = input<TngSnackbarItem[]>([]);

  /** Placement on screen */
  readonly position = input<TngSnackbarPosition>('bottom-center');

  /** Max stack size (visual). Consumer should also enforce if desired. */
  readonly max = input<number>(3);

  /** Outputs */
  readonly dismiss = output<{ id: string; reason: 'timeout' | 'dismiss' | 'action' }>();

  /* =====================
   * Klass inputs
   * ===================== */
  readonly hostKlass = input<string>('fixed z-[1100] flex flex-col gap-2 p-4');
  readonly itemKlass = input<string>(
    'pointer-events-auto w-[min(28rem,calc(100vw-2rem))] rounded-md border border-border bg-bg shadow-lg'
  );
  readonly itemInnerKlass = input<string>('flex items-start gap-3 px-4 py-3');
  readonly messageKlass = input<string>('text-sm text-foreground');
  readonly actionKlass = input<string>('text-sm font-medium text-primary hover:underline');
  readonly dismissBtnKlass = input<string>('text-muted-foreground hover:text-foreground');

  /** Intent -> klass mapping */
  readonly intentKlass = input<(intent: TngSnackbarIntent) => string>((intent) => {
    switch (intent) {
      case 'success':
        return 'border-success/30';
      case 'info':
        return 'border-info/30';
      case 'warning':
        return 'border-warning/30';
      case 'error':
        return 'border-danger/30';
      case 'default':
      default:
        return '';
    }
  });

  /* =====================
   * Derived / internal
   * ===================== */
  readonly hostPositionKlass = computed(() => {
    const base = this.hostKlass();
    switch (this.position()) {
      case 'top-left':
        return `${base} top-0 left-0 items-start`;
      case 'top-center':
        return `${base} top-0 left-1/2 -translate-x-1/2 items-center`;
      case 'top-right':
        return `${base} top-0 right-0 items-end`;
      case 'bottom-left':
        return `${base} bottom-0 left-0 items-start`;
      case 'bottom-center':
        return `${base} bottom-0 left-1/2 -translate-x-1/2 items-center`;
      case 'bottom-right':
        return `${base} bottom-0 right-0 items-end`;
    }
  });

  /** Track which ids have active timers */
  private readonly timers = new Map<string, number>();

  constructor() {
    effect(() => {
      const incoming = (this.items() ?? []).slice(0, Math.max(1, this.max()));

      // Start timers for new items with duration
      for (const item of incoming) {
        const dur = item.durationMs ?? 0;
        if (dur > 0 && !this.timers.has(item.id)) {
          const t = window.setTimeout(() => {
            this.timers.delete(item.id);
            this.dismiss.emit({ id: item.id, reason: 'timeout' });
          }, dur);
          this.timers.set(item.id, t);
        }
      }

      // Clear timers for removed items
      const ids = new Set(incoming.map((x) => x.id));
      for (const [id, t] of Array.from(this.timers.entries())) {
        if (!ids.has(id)) {
          window.clearTimeout(t);
          this.timers.delete(id);
        }
      }
    });
  }

  itemClasses(item: TngSnackbarItem): string {
    const intent = item.intent ?? 'default';
    const intentCls = this.intentKlass()(intent);
    return `${this.itemKlass()} ${intentCls}`.trim();
  }

  onDismiss(id: string) {
    const t = this.timers.get(id);
    if (t != null) {
      window.clearTimeout(t);
      this.timers.delete(id);
    }
    this.dismiss.emit({ id, reason: 'dismiss' });
  }

  onAction(id: string) {
    const t = this.timers.get(id);
    if (t != null) {
      window.clearTimeout(t);
      this.timers.delete(id);
    }
    this.dismiss.emit({ id, reason: 'action' });
  }
}
