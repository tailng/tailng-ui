import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'docs-component-shell',
  templateUrl: './component-shell.component.html',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
})
export class ComponentShellComponent {}
