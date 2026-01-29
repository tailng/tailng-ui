import { Component, computed, inject } from '@angular/core';
import { TailngBadgeComponent, TailngCodeBlockComponent, TailngColComponent, TailngTableComponent, TailngTagComponent } from '@tociva/tailng-ui';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

@Component({
  standalone: true,
  selector: 'docs-text-input-api',
  templateUrl: './api.component.html',
  imports: [
    TailngBadgeComponent,
    TailngCodeBlockComponent,
    TailngTagComponent,
  
  ],
})
export class TextInputApiComponent {
private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  
   readonly inputKlassExample = computed(() => `import { TailngTextInputComponent } from '@tociva/tailng-ui';`);
}
