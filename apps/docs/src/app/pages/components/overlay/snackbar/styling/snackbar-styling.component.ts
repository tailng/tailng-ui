import { Component, computed, signal } from '@angular/core';
import { TngSnackbarHost, TngSnackbarItem, TngSnackbarIntent } from '@tociva/tailng-ui/overlay';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

const uid = () => Math.random().toString(36).slice(2, 9);

@Component({
  standalone: true,
  selector: 'docs-snackbar-styling',
  templateUrl: './snackbar-styling.component.html',
  imports: [TngSnackbarHost, ExampleBlockComponent, TngExampleDemo],
})
export class SnackbarStylingComponent {
  readonly themedItems = signal<TngSnackbarItem[]>([]);

  readonly customIntentKlass = (intent: TngSnackbarIntent): string => {
    switch (intent) {
      case 'success': return 'border-green-500/50';
      case 'info': return 'border-blue-500/50';
      case 'warning': return 'border-amber-500/50';
      case 'error': return 'border-red-500/50';
      default: return '';
    }
  };

  readonly themedHtml = computed(
    () => `
<tng-snackbar-host
  [items]="items()"
  position="bottom-center"
  itemKlass="... rounded-lg border-2 ..."
  [intentKlass]="customIntentKlass"
  (dismiss)="onDismiss($event)"
/>
`,
  );

  showThemed(): void {
    const item: TngSnackbarItem = {
      id: uid(),
      message: 'Themed snackbar (success)',
      intent: 'success',
      durationMs: 4000,
    };
    this.themedItems.set([item, ...this.themedItems()].slice(0, 2));
  }

  onThemedDismiss(ev: { id: string; reason: 'timeout' | 'dismiss' | 'action' }): void {
    this.themedItems.set(this.themedItems().filter((x) => x.id !== ev.id));
  }
}
