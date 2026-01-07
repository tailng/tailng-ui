import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TailngBreadcrumbsComponent } from '@tailng/ui';

@Component({
  selector: 'playground-breadcrumbs-demo',
  standalone: true,
  imports: [TailngBreadcrumbsComponent, RouterModule],
  templateUrl: './breadcrumbs-demo.component.html',
})
export class BreadcrumbsDemoComponent {
  items = [
    { label: 'Home', route: '/' },
    { label: 'Navigation', route: '/navigation' },
    { label: 'Breadcrumbs' },
  ];
}

