import { Component, computed, signal } from '@angular/core';
import { TngSnackbarHost, TngSnackbarItem } from '@tociva/tailng-ui/overlay';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

const uid = () => Math.random().toString(36).slice(2, 9);

@Component({
  standalone: true,
  selector: 'docs-snackbar-overview',
  templateUrl: './snackbar-overview.component.html',
  imports: [TngSnackbarHost, ExampleBlockComponent, TngExampleDemo],
})
export class SnackbarOverviewComponent {
  readonly items = signal<TngSnackbarItem[]>([]);

  readonly basicHtml = computed(
    () => `
<button (click)="showSnackbar()">Show snackbar</button>
<tng-snackbar-host
  [items]="items()"
  position="bottom-center"
  (dismiss)="onDismiss($event)"
/>
`,
  );
  readonly basicTs = computed(
    () => `import { signal } from '@angular/core';
import { TngSnackbarHost, TngSnackbarItem } from '@tociva/tailng-ui/overlay';

items = signal<TngSnackbarItem[]>([]);
showSnackbar() {
  this.items.set([{ id: crypto.randomUUID(), message: 'Hello from Tailng', durationMs: 4000 }, ...this.items()]);
}
onDismiss(ev: { id: string; reason: 'timeout' | 'dismiss' | 'action' }) {
  this.items.set(this.items().filter((x) => x.id !== ev.id));
}`,
  );

  showSnackbar(): void {
    this.items.set([
      { id: uid(), message: 'Hello from Tailng', durationMs: 4000 },
      ...this.items(),
    ].slice(0, 3));
  }

  onDismiss(ev: { id: string; reason: 'timeout' | 'dismiss' | 'action' }): void {
    this.items.set(this.items().filter((x) => x.id !== ev.id));
  }
}
