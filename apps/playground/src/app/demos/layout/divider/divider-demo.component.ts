import { Component } from '@angular/core';
import { TngDivider } from '@tociva/tailng-ui/layout';

@Component({
  selector: 'playground-divider-demo',
  standalone: true,
  imports: [TngDivider],
  templateUrl: './divider-demo.component.html',
})
export class DividerDemoComponent {
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  label = 'OR';
  align: 'start' | 'center' | 'end' = 'center';
  dashed = false;

  // klass hooks
  rootKlass = '';
  lineKlass = 'border-border';
  labelKlass = 'text-xs text-fg/70';
  gapKlass = 'my-4';
  thicknessKlass = 'border-t';

  preset(p: 'default' | 'subtle' | 'strong' | 'dashed') {
    switch (p) {
      case 'subtle':
        this.lineKlass = 'border-border/40';
        this.labelKlass = 'text-fg/50';
        this.thicknessKlass = 'border-t';
        this.dashed = false;
        break;

      case 'strong':
        this.lineKlass = 'border-text/60';
        this.labelKlass = 'text-fg font-medium';
        this.thicknessKlass = 'border-t-2';
        this.dashed = false;
        break;

      case 'dashed':
        this.lineKlass = 'border-border';
        this.thicknessKlass = 'border-t';
        this.dashed = true;
        break;

      default:
        this.lineKlass = 'border-border';
        this.labelKlass = 'text-xs text-fg/70';
        this.thicknessKlass = 'border-t';
        this.dashed = false;
    }
  }
}
