import { Component, computed } from '@angular/core';
import { TngDivider } from '@tociva/tailng-ui/layout';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-divider-styling',
  templateUrl: './divider-styling.component.html',
  imports: [TngDivider, ExampleBlockComponent, TngExampleDemo],
})
export class DividerStylingComponent {
  readonly lineLabelHtml = computed(
    () => `<tng-divider label="Themed" lineKlass="border-primary/40" labelKlass="text-primary text-xs font-medium" />`,
  );
}
