import { Component } from '@angular/core';
import { TngEmptyState } from '@tailng-ui/ui/table';

@Component({
  selector: 'playground-empty-state-demo',
  standalone: true,
  imports: [TngEmptyState],
  templateUrl: './empty-state-demo.component.html',
})
export class EmptyStateDemoComponent {}

