import { Component } from '@angular/core';
import { TngCard, TngCardFooter, TngCardHeader } from '@tailng-ui/ui/layout';
import { TngIcon } from '@tailng-ui/icons/icon';

@Component({
  selector: 'playground-card-demo',
  standalone: true,
  imports: [TngCard, TngCardHeader, TngCardFooter, TngIcon],
  templateUrl: './card-demo.component.html',
})
export class CardDemoComponent {
  // slot keys (interactive demo)
  slotContainer = 'transition-shadow hover:shadow-md';
  slotHeader = '';
  slotBody = '';
  slotFooter = '';

  get slot() {
    const s: Record<string, string> = {};
    if (this.slotContainer) s['container'] = this.slotContainer;
    if (this.slotHeader) s['header'] = this.slotHeader;
    if (this.slotBody) s['body'] = this.slotBody;
    if (this.slotFooter) s['footer'] = this.slotFooter;
    return s;
  }

  setPreset(p: 'default' | 'soft' | 'outlined' | 'interactive') {
    switch (p) {
      case 'default':
        this.slotContainer = '';
        this.slotHeader = '';
        this.slotBody = '';
        this.slotFooter = '';
        break;

      case 'soft':
        this.slotContainer = 'bg-alternate-background/40';
        break;

      case 'outlined':
        this.slotContainer = 'shadow-none';
        break;

      case 'interactive':
      default:
        this.slotContainer =
          'transition-shadow hover:shadow-md focus-within:shadow-md';
        break;
    }
  }
}
