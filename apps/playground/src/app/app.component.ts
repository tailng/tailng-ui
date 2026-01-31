import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { categories } from './home/home.component';
import { TailngMenuComponent, TailngMenuItemDirective, TailngMenuTemplateDirective } from '@tociva/tailng-ui';
import { TailngMode, TailngTheme, ThemeService } from './shared/theme.service';

const THEME_LIST: { id: TailngTheme; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'slate', label: 'Slate' },
  { id: 'indigo', label: 'Indigo' },
  { id: 'emerald', label: 'Emerald' },
  { id: 'rose', label: 'Rose' },
];

const MODE_LIST: { id: TailngMode; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

@Component({
  selector: 'playground-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TailngMenuComponent,
    TailngMenuItemDirective,
    TailngMenuTemplateDirective,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);
  year = new Date().getFullYear();
  categories = categories;
  readonly themes = THEME_LIST;
  readonly modes = MODE_LIST;

  changeTheme(theme: TailngTheme): void {
    this.themeService.setTheme(theme);
  }

  changeMode(mode: TailngMode): void {
    this.themeService.setMode(mode);
  }
}
