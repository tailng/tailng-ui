import { Component } from '@angular/core';
import { ComponentShellComponent } from '../../../../shared/component-shell/component-shell.component';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'docs-text-input',
  templateUrl: './text-input-docs.component.html',
  imports: [ComponentShellComponent, RouterOutlet],
})
export class TextInputDocsComponent {}
