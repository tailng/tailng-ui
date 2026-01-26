import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponentShellComponent } from '../../../../shared/component-shell/component-shell.component';

@Component({
  standalone: true,
  selector: 'docs-virtual-scroll',
  templateUrl: './virtual-scroll-docs.component.html',
  imports: [
    RouterOutlet,
    ComponentShellComponent,
  ],
})
export class VirtualScrollDocsComponent {}
