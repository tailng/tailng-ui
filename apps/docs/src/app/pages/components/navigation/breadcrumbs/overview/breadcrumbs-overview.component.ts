import { Component, computed, signal } from '@angular/core';
import { TngBreadcrumbs, TngBreadcrumbItem } from '@tailng-ui/ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-breadcrumbs-overview',
  templateUrl: './breadcrumbs-overview.component.html',
  imports: [TngBreadcrumbs, ExampleBlockComponent, TngExampleDemo],
})
export class BreadcrumbsOverviewComponent {
  readonly items = signal<TngBreadcrumbItem[]>([
    { label: 'Projects', route: '/projects' },
    { label: 'Tailng UI' },
  ]);

  readonly basicHtml = computed(
    () => `
<tng-breadcrumbs [items]="items()"></tng-breadcrumbs>
`,
  );
  readonly basicTs = computed(
    () => `import { TngBreadcrumbs, TngBreadcrumbItem } from '@tailng-ui/ui/navigation';
items = signal<TngBreadcrumbItem[]>([
  { label: 'Projects', route: '/projects' },
  { label: 'Tailng UI' },
]);`,
  );
}
