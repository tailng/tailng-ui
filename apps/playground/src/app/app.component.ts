import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { categories } from './home/home.component';
import { TailngMenuComponent, TailngMenuItemDirective } from '@tociva/tailng-ui';
import { ThemeService } from './shared/theme.service';

@Component({
  selector: 'playground-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TailngMenuComponent, 
    TailngMenuItemDirective],
  templateUrl: './app.component.html',
})
export class AppComponent {

  private readonly themeService = inject(ThemeService);
  year = new Date().getFullYear();
  categories = categories;

  changeTheme(theme: 'light' | 'dark'): void {
    console.log('changeTheme', theme);
    this.themeService.set(theme);
  }
}
