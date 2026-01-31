import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { categories } from './home/home.component';
import {
  TailngMenuComponent,
  TailngMenuItemDirective,
  TailngMenuTemplateDirective,
  TailngSlideToggleComponent,
} from '@tociva/tailng-ui';
import { TailngTheme, ThemeService } from './shared/theme.service';

const THEME_LIST: { id: TailngTheme; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'slate', label: 'Slate' },
  { id: 'indigo', label: 'Indigo' },
  { id: 'emerald', label: 'Emerald' },
  { id: 'rose', label: 'Rose' },
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
    TailngSlideToggleComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);
  year = new Date().getFullYear();
  categories = categories;
  readonly themes = THEME_LIST;
  readonly isDarkMode = computed(() => this.themeService.mode() === 'dark');
  readonly modeLabel = computed(() => (this.isDarkMode() ? 'Light' : 'Dark'));

  changeTheme(theme: TailngTheme): void {
    this.themeService.setTheme(theme);
  }

  onModeToggle(checked: boolean): void {
    this.themeService.setMode(checked ? 'dark' : 'light');
  }
}
