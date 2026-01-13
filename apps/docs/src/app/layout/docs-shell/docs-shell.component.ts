import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { docsNav } from '../../data/nav';

@Component({
  standalone: true,
  selector: 'docs-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './docs-shell.component.html',
})
export class DocsShellComponent {
  mobileOpen = signal(false);
  nav = computed(() => docsNav);
}
