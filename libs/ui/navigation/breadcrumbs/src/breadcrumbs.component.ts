import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tng-breadcrumbs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumbs.component.html',
})
export class TailngBreadcrumbsComponent {
  items = input<Array<{ label: string; route?: string }>>([]);
  separator = input<string>('/');
}

