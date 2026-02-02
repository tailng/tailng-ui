import { Component, inject } from '@angular/core';
import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
import { ShikiHighlighterService } from '../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../shared/tng-shiki.adapter';

@Component({
  standalone: true,
  selector: 'docs-installation',
  templateUrl: './installation.component.html',
  imports: [TngCodeBlock,],
})
export class InstallationComponent {

  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  
}
