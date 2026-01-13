import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'project-shell',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './project-shell.component.html',
})
export class ProjectShellComponent {}
