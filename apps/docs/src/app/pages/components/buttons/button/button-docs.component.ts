import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponentShellComponent } from '../../../../shared/component-shell/component-shell.component';

@Component({
  standalone: true,
  selector: 'docs-button',
  templateUrl: './button-docs.component.html',
  imports: [
    ComponentShellComponent,
    RouterOutlet,
  ],
})
export class ButtonDocsComponent {}
