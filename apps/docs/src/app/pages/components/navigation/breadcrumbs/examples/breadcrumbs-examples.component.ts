import { Component, computed, signal } from '@angular/core';
import { TngBreadcrumbs, TngBreadcrumbItem } from '@tociva/tailng-ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-breadcrumbs-examples',
  templateUrl: './breadcrumbs-examples.component.html',
  imports: [TngBreadcrumbs, ExampleBlockComponent, TngExampleDemo],
})
export class BreadcrumbsExamplesComponent {
  readonly basicItems = signal<TngBreadcrumbItem[]>([
    { label: 'Projects', route: '/projects' },
    { label: 'Tailng UI' },
  ]);
  readonly homeItem = signal<TngBreadcrumbItem | null>({ label: 'Home', route: '/' });
  readonly withHomeItems = signal<TngBreadcrumbItem[]>([
    { label: 'Organizations', route: '/orgs' },
    { label: 'Acme Corp', route: '/orgs/1' },
    { label: 'Settings' },
  ]);

  readonly basicHtml = computed(
    () => `<tng-breadcrumbs [items]="items()"></tng-breadcrumbs>`,
  );
  readonly homeHtml = computed(
    () => `<tng-breadcrumbs [home]="{ label: 'Home', route: '/' }" [items]="items()"></tng-breadcrumbs>`,
  );
  readonly separatorHtml = computed(
    () => `<tng-breadcrumbs [items]="items()" separator="→"></tng-breadcrumbs>`,
  );
}
