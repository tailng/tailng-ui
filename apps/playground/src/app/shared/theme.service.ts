import { Injectable, effect, signal } from '@angular/core';

export type TailngTheme = 'default' | 'slate' | 'indigo' | 'emerald' | 'rose';
export type TailngMode = 'light' | 'dark' | 'night';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<TailngTheme>('default');
  readonly mode = signal<TailngMode>('light');

  constructor() {
    effect(() => {
      const html = document.documentElement;

      // --- Theme (brand) ---
      html.classList.remove('theme-default');
      html.classList.add(`theme-${this.theme()}`);

      // --- Mode (appearance) ---
      html.classList.remove('mode-light', 'mode-dark', 'mode-night');
      html.classList.add(`mode-${this.mode()}`);
    });
  }

  setTheme(theme: TailngTheme) {
    this.theme.set(theme);
  }

  setMode(mode: TailngMode) {
    this.mode.set(mode);
  }

  toggleDark() {
    this.mode.set(this.mode() === 'dark' ? 'light' : 'dark');
  }
}