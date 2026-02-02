import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TngBreadcrumbs } from '@tociva/tailng-ui/navigation';

@Component({
  selector: 'playground-breadcrumbs-demo',
  standalone: true,
  imports: [TngBreadcrumbs, RouterModule],
  templateUrl: './breadcrumbs-demo.component.html',
})
export class BreadcrumbsDemoComponent {
  basic = [
    { label: 'Projects', route: '/projects' },
    { label: 'Tailng UI' },
  ];

  withHome = [
    { label: 'Organizations', route: '/orgs' },
    { label: 'Acme Corp', route: '/orgs/1' },
    { label: 'Settings' },
  ];

  disabled = [
    { label: 'Billing', route: '/billing' },
    { label: 'Invoices', disabled: true },
    { label: 'Invoice #1024' },
  ];

  external = [
    { label: 'Docs', href: 'https://angular.dev', target: '_blank' },
    { label: 'Components', href: 'https://tailwindcss.com', target: '_blank' },
    { label: 'Breadcrumbs' },
  ];

  explicitCurrent = [
    { label: 'Admin', route: '/admin' },
    { label: 'Users', route: '/admin/users', current: true },
    { label: 'User #42' },
  ];
}
