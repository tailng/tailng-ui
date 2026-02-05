import { Component, computed, signal } from '@angular/core';
import { TngBreadcrumbs, TngBreadcrumbItem } from '@tailng-ui/ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-breadcrumbs-styling',
  templateUrl: './breadcrumbs-styling.component.html',
  imports: [TngBreadcrumbs, ExampleBlockComponent, TngExampleDemo],
})
export class BreadcrumbsStylingComponent {
  readonly items = signal<TngBreadcrumbItem[]>([
    { label: 'Home', route: '/' },
    { label: 'Docs', route: '/docs' },
    { label: 'Breadcrumbs' },
  ]);
  readonly styledHtml = computed(
    () => `<tng-breadcrumbs [items]="items()" linkKlass="text-primary hover:underline" currentKlass="text-foreground font-semibold" separatorKlass="mx-2 text-slate-500"></tng-breadcrumbs>`,
  );
}
