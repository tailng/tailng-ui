import { Injectable, effect, signal } from '@angular/core';

export type TailngTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<TailngTheme>('light');

  constructor() {
    effect(() => {
      const t = this.theme();

      const el = document.documentElement; // <html>
      el.classList.remove('theme-light', 'theme-dark');
      el.classList.add(`theme-${t}`);
    });
  }

  set(theme: TailngTheme) {
    this.theme.set(theme);
  }
}