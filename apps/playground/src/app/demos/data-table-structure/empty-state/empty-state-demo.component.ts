import { Component } from '@angular/core';
import { TailngEmptyStateComponent } from '@tociva/tailng-ui';

@Component({
  selector: 'playground-empty-state-demo',
  standalone: true,
  imports: [TailngEmptyStateComponent],
  templateUrl: './empty-state-demo.component.html',
})
export class EmptyStateDemoComponent {}

