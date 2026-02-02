import { Component, signal } from '@angular/core';
import {
  TngSnackbarHost,
  TngSnackbarItem,
} from '@tociva/tailng-ui/popups-overlays';

const uid = () => Math.random().toString(36).slice(2, 9);

@Component({
  selector: 'playground-snackbar-demo',
  standalone: true,
  imports: [TngSnackbarHost],
  templateUrl: './snackbar-demo.component.html',
})
export class SnackbarDemoComponent {
  readonly items = signal<TngSnackbarItem[]>([]);
  readonly lastEvent = signal<string>('—');

  readonly position = signal<
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  >('bottom-center');

  push(intent: TngSnackbarItem['intent']) {
    const id = uid();
    const message =
      intent === 'success'
        ? 'Saved successfully'
        : intent === 'info'
        ? 'New update available'
        : intent === 'warning'
        ? 'Please check required fields'
        : intent === 'error'
        ? 'Failed to save. Try again.'
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

  clear() {
    this.items.set([]);
    this.lastEvent.set('cleared');
  }

  onDismiss(ev: { id: string; reason: 'timeout' | 'dismiss' | 'action' }) {
    this.lastEvent.set(`${ev.reason} (${ev.id})`);
    this.items.set(this.items().filter((x) => x.id !== ev.id));
  }
}
