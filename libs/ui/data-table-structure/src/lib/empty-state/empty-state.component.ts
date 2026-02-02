import { Component, input } from '@angular/core';

@Component({
  selector: 'tng-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
})
export class TngEmptyState {
  title = input<string>('No data available');
  message = input<string>('');
  icon = input<string>('');
}
