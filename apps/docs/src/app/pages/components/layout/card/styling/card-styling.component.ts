import { Component, computed } from '@angular/core';
import { TngCard, TngCardFooter, TngCardHeader } from '@tailng-ui/ui/layout';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-card-styling',
  templateUrl: './card-styling.component.html',
  imports: [TngCard, TngCardHeader, TngCardFooter, TngTag, ExampleBlockComponent, TngExampleDemo],
})
export class CardStylingComponent {
  readonly containerSlotHtml = computed(
    () => `
<tng-card [slot]="{ container: 'border-2 border-primary shadow-lg' }">
  <div tngCardHeader>Header</div>
  <p class="text-sm">Content</p>
</tng-card>
`,
  );

  readonly headerSlotHtml = computed(
    () => `
<tng-card [slot]="{ header: 'bg-primary/10 font-bold' }">
  <div tngCardHeader>Styled header</div>
  <p class="text-sm">Content</p>
</tng-card>
`,
  );

  readonly bodySlotHtml = computed(
    () => `
<tng-card [slot]="{ body: 'space-y-3 bg-alternate-background/30 p-6' }">
  <div tngCardHeader>Header</div>
  <p class="text-sm">Body with custom padding and background.</p>
</tng-card>
`,
  );

  readonly footerSlotHtml = computed(
    () => `
<tng-card [slot]="{ footer: 'bg-primary/5 text-xs text-muted' }">
  <div tngCardHeader>Header</div>
  <p class="text-sm">Content</p>
  <div tngCardFooter>Styled footer</div>
</tng-card>
`,
  );

  readonly combinedSlotHtml = computed(
    () => `
<tng-card [slot]="{
  container: 'border-2 border-primary/50 max-w-sm',
  header: 'bg-primary/10 font-semibold',
  body: 'p-6 space-y-2',
  footer: 'border-t-2 border-primary/30 pt-4'
}">
  <div tngCardHeader>Card title</div>
  <p class="text-sm">Body content.</p>
  <div tngCardFooter>Footer</div>
</tng-card>
`,
  );
}
