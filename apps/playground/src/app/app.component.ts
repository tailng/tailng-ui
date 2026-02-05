import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { categories } from './home/home.component';
import {
  TngMenu,
  TngMenuItem,
  TngMenuTemplate,
} from '@tailng-ui/ui/navigation';
import { TngSlideToggle } from '@tailng-ui/ui/form';
import { DemoThemeService, TngTheme } from './shared/demo-theme.service';

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
  readonly demoThemeService = inject(DemoThemeService);
  year = new Date().getFullYear();
  categories = categories;

  changeTheme(theme: TngTheme): void {
    this.demoThemeService.setTheme(theme);
  }

  onModeToggle(checked: boolean): void {
    this.demoThemeService.setMode(checked ? 'dark' : 'light');
  }
}
