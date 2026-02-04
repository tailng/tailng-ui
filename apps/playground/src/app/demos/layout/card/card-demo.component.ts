import { Component } from '@angular/core';
import { TngCard, TngCardFooter, TngCardHeader } from '@tociva/tailng-ui/layout';
import { TngIcon } from '@tociva/tailng-icons/icon';

@Component({
  selector: 'playground-card-demo',
  standalone: true,
  imports: [TngCard, TngCardHeader, TngCardFooter, TngIcon],
  templateUrl: './card-demo.component.html',
})
export class CardDemoComponent {
  // klass hooks (interactive demo)
  rootKlass = 'transition-shadow hover:shadow-md';
  headerKlass = '';
  contentKlass = '';
  footerKlass = '';

  // back-compat / simple override
  klass = '';

  setPreset(p: 'default' | 'soft' | 'outlined' | 'interactive') {
    switch (p) {
      case 'default':
        this.rootKlass = '';
        this.klass = '';
        this.headerKlass = '';
        this.contentKlass = '';
        this.footerKlass = '';
        break;

      case 'soft':
        this.rootKlass = 'bg-alternate-background/40';
        this.klass = '';
        break;

      case 'outlined':
        this.rootKlass = '';
        this.klass = 'shadow-none';
        break;

      case 'interactive':
      default:
        this.rootKlass =
          'transition-shadow hover:shadow-md focus-within:shadow-md';
        this.klass = '';
        break;
    }
  }
}
