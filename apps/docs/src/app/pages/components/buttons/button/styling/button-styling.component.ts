import { Component, computed } from '@angular/core';
import { TngButton, TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-button-styling',
  templateUrl: './button-styling.component.html',
  imports: [TngButton, TngTag, ExampleBlockComponent, TngExampleDemo],
})
export class ButtonStylingComponent {
  readonly buttonSlotHtml = computed(
    () => `<tng-button [slot]="{ button: 'bg-danger text-on-danger hover:bg-danger-hover' }">
  Custom danger
</tng-button>`,
  );

  readonly spinnerSlotHtml = computed(
    () => `<tng-button [loading]="true"
  [slot]="{ spinner: 'h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent' }">
  Loading
</tng-button>`,
  );

  readonly combinedSlotHtml = computed(
    () => `<tng-button [loading]="true"
  [slot]="{
    button: 'bg-primary text-on-primary hover:bg-primary-hover rounded-full px-6',
    spinner: 'h-4 w-4 border-2 border-on-primary/30 border-t-on-primary'
  }">
  Saving…
</tng-button>`,
  );
}
