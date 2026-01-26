import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponentShellComponent } from '../../../../shared/component-shell/component-shell.component';

@Component({
  standalone: true,
  selector: 'docs-expansion-panel',
  templateUrl: './expansion-panel-docs.component.html',
  imports: [
    RouterOutlet,
    ComponentShellComponent,
  ],
})
export class ExpansionPanelDocsComponent {}
