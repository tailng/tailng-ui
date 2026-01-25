import { Component } from '@angular/core';
import { TailngTreeComponent } from '@tociva/tailng-ui';

@Component({
  selector: 'playground-tree-demo',
  standalone: true,
  imports: [TailngTreeComponent],
  templateUrl: './tree-demo.component.html',
})
export class TreeDemoComponent {}

