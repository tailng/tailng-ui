import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  TngMenu,
  TngMenuItem,
  TngMenuTemplate,
} from '@tociva/tailng-ui/navigation';
import { TngIcon } from '@tociva/tailng-icons/icon';
import { docsNav } from '../../data/nav';

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
  ],
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {
  private readonly router = inject(Router);
  mobileOpen = signal(false);

  /** True when we're on a /components route (show Menu button and allow mobile drawer). */
  isComponentsRoute = () =>
    this.router.url.startsWith('/components') || this.router.url === '/components';

  readonly nav = docsNav;
}
