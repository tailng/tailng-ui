import { Component } from '@angular/core';
import { TngEmptyState } from '@tociva/tailng-ui/data-table-structure';

@Component({
  selector: 'playground-empty-state-demo',
  standalone: true,
  imports: [TngEmptyState],
  templateUrl: './empty-state-demo.component.html',
})
export class EmptyStateDemoComponent {}

