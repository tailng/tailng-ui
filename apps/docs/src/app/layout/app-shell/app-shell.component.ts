import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  TngMenu,
  TngMenuItem,
  TngMenuTemplate,
} from '@tailng-ui/ui/navigation';
import { TngIcon } from '@tailng-ui/icons/icon';
import { docsNav } from '../../data/nav';
import { DocsThemeService, TngTheme } from '../../shared/docs-theme.service';
import { TngSlideToggle, TngSlideToggleOffSlot, TngSlideToggleOnSlot } from '@tailng-ui/ui/form';

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
    TngSlideToggleOnSlot, TngSlideToggleOffSlot
  ],
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {
  private readonly router = inject(Router);
  readonly docsThemeService = inject(DocsThemeService)
  mobileOpen = signal(false);

  /** True when we're on a /components route (show Menu button and allow mobile drawer). */
  isComponentsRoute = () =>
    this.router.url.startsWith('/components') || this.router.url === '/components';

  readonly nav = docsNav;
  changeTheme(theme: TngTheme): void {
      this.docsThemeService.setTheme(theme);
    }
  
    onModeToggle(checked: boolean): void {
      this.docsThemeService.setMode(checked ? 'dark' : 'light');
    }
}
