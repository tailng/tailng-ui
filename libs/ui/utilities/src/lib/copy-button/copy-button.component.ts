import { Component, computed, input, signal } from '@angular/core';

type CopyButtonVariant = 'ghost' | 'outline' | 'solid';
type CopyButtonSize = 'sm' | 'md';

@Component({
  selector: 'tng-copy-button',
  standalone: true,
  templateUrl: './copy-button.component.html',
})
export class TngCopyButton {
  text = input.required<string>();

  variant = input<CopyButtonVariant>('ghost');
  size = input<CopyButtonSize>('sm');

  /** how long to show "copied" state */
  resetAfterMs = input<number>(1500);

  copied = signal(false);
  private resetTimer: number | null = null;

  async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.text());
      this.copied.set(true);

      if (this.resetTimer) window.clearTimeout(this.resetTimer);
      this.resetTimer = window.setTimeout(() => {
        this.copied.set(false);
        this.resetTimer = null;
      }, this.resetAfterMs());
    } catch {
      // clipboard may be blocked; ignore
    }
  }

  private base = 'inline-flex items-center gap-1.5 font-medium transition select-none';
  private sizes: Record<CopyButtonSize, string> = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };
  private variants: Record<CopyButtonVariant, string> = {
    ghost: 'text-slate-600 hover:bg-slate-100',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    solid: 'bg-primary text-white hover:opacity-90',
  };

  klass = computed(() => [this.base, this.sizes[this.size()], this.variants[this.variant()]].join(' '));
}
