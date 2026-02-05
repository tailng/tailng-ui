import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TngIcon } from '@tailng-ui/icons/icon';
import { TngSlideToggle, TngSlideToggleOffSlot, TngSlideToggleOnSlot } from '@tailng-ui/ui/form';
import {
  TngMenu,
  TngMenuItem,
  TngMenuTemplate,
} from '@tailng-ui/ui/navigation';
import { docsNav } from '../../data/nav';
import { DocsThemeService, TngTheme } from '../../shared/docs-theme.service';
import { TngLogoComponent } from '../../shared/tng-logo/tng-logo.component';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TngMenu,
    TngMenuItem,
    TngMenuTemplate,
    TngIcon,
    TngSlideToggle,
    TngSlideToggleOnSlot, TngSlideToggleOffSlot,
    TngLogoComponent
  ],
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {
  readonly docsThemeService = inject(DocsThemeService)
  mobileOpen = signal(false);

  readonly nav = docsNav;
  changeTheme(theme: TngTheme): void {
    this.docsThemeService.setTheme(theme);
  }
  
  onModeToggle(checked: boolean): void {
    this.docsThemeService.setMode(checked ? 'dark' : 'light');
  }
}
