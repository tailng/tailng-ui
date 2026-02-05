import { Component, computed } from '@angular/core';
import { TngButton } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-button-styling',
  templateUrl: './button-styling.component.html',
  imports: [TngButton, ExampleBlockComponent, TngExampleDemo],
})
export class ButtonStylingComponent {
  readonly klassHtml = computed(
    () => `<tng-button klass="bg-danger text-on-danger hover:bg-danger-hover">Custom danger</tng-button>`,
  );

  readonly spinnerHtml = computed(
    () => `<tng-button [loading]="true" spinnerKlass="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent">Loading</tng-button>`,
  );
}
