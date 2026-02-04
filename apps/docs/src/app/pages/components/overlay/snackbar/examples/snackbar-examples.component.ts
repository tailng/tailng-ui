import { Component, computed, signal } from '@angular/core';
import { TngSnackbarHost, TngSnackbarItem } from '@tociva/tailng-ui/overlay';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

const uid = () => Math.random().toString(36).slice(2, 9);

type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

@Component({
  standalone: true,
  selector: 'docs-snackbar-examples',
  templateUrl: './snackbar-examples.component.html',
  imports: [TngSnackbarHost, ExampleBlockComponent, TngExampleDemo],
})
export class SnackbarExamplesComponent {
  readonly items = signal<TngSnackbarItem[]>([]);
  readonly position = signal<Position>('bottom-center');

  readonly intentsHtml = computed(
    () => `
<button (click)="push('success')">Success</button>
<button (click)="push('info')">Info</button>
...
<tng-snackbar-host [items]="items()" position="bottom-center" (dismiss)="onDismiss($event)" />
`,
  );
  readonly intentsTs = computed(
    () => `push(intent: TngSnackbarIntent) {
  const item: TngSnackbarItem = { id: uid(), message: '...', intent, durationMs: 4000 };
  this.items.set([item, ...this.items()].slice(0, 3));
}`,
  );
  readonly actionHtml = computed(
    () => `const item: TngSnackbarItem = { id, message: 'Item removed', actionLabel: 'Undo', durationMs: 5000 };`,
  );
  readonly positionHtml = computed(
    () => `<tng-snackbar-host [items]="items()" [position]="position()" (dismiss)="onDismiss($event)" />`,
  );

  push(intent: TngSnackbarItem['intent']): void {
    const id = uid();
    const message =
      intent === 'success' ? 'Saved successfully'
      : intent === 'info' ? 'New update available'
      : intent === 'warning' ? 'Please check required fields'
      : intent === 'error' ? 'Failed to save. Try again.'
      : 'Hello from Tailng';
    const item: TngSnackbarItem = {
      id,
      message,
      intent: intent ?? 'default',
      actionLabel: intent === 'error' ? 'Retry' : 'Undo',
      durationMs: 4000,
    };
    this.items.set([item, ...this.items()].slice(0, 3));
  }

  pushWithAction(): void {
    const item: TngSnackbarItem = {
      id: uid(),
      message: 'Item removed',
      actionLabel: 'Undo',
      durationMs: 5000,
    };
    this.items.set([item, ...this.items()].slice(0, 3));
  }

  onDismiss(ev: { id: string; reason: 'timeout' | 'dismiss' | 'action' }): void {
    this.items.set(this.items().filter((x) => x.id !== ev.id));
  }
}
