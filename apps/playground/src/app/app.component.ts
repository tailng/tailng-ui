import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { categories } from './home/home.component';
import {
  TngMenu,
  TngMenuItem,
  TngMenuTemplate,
} from '@tociva/tailng-ui/navigation';
import { TngTheme, ThemeService } from './shared/theme.service';
import { TngSlideToggle } from '@tociva/tailng-ui/form-controls';

@Component({
  selector: 'playground-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TngMenu,
    TngMenuItem,
    TngMenuTemplate,
    TngSlideToggle,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly themeService = inject(ThemeService);
  year = new Date().getFullYear();
  categories = categories;

  changeTheme(theme: TngTheme): void {
    this.themeService.setTheme(theme);
  }

  onModeToggle(checked: boolean): void {
    this.themeService.setMode(checked ? 'dark' : 'light');
  }
}
