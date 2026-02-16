import { Component } from '@angular/core';
import { TngDivider } from '@tailng-ui/ui/layout';

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

  slotContainer = '';
  slotLine = 'border-border';
  slotLabel = 'text-xs text-fg/70';
  slotGap = 'my-4';
  slotThickness = 'border-t';
  slotVerticalHeight = 'h-6';

  get slot() {
    const s: Record<string, string> = {};
    if (this.slotContainer) s['container'] = this.slotContainer;
    if (this.slotLine) s['line'] = this.slotLine;
    if (this.slotLabel) s['label'] = this.slotLabel;
    if (this.slotGap) s['gap'] = this.slotGap;
    if (this.slotThickness) s['thickness'] = this.slotThickness;
    if (this.slotVerticalHeight) s['verticalHeight'] = this.slotVerticalHeight;
    return s;
  }

  /** For vertical: container needs h-full shrink-0 */
  get verticalSlot() {
    const c = this.slotContainer ? `h-full shrink-0 ${this.slotContainer}` : 'h-full shrink-0';
    return { ...this.slot, container: c };
  }

  preset(p: 'default' | 'subtle' | 'strong' | 'dashed') {
    switch (p) {
      case 'subtle':
        this.slotLine = 'border-border/40';
        this.slotLabel = 'text-fg/50';
        this.slotThickness = 'border-t';
        this.dashed = false;
        break;

      case 'strong':
        this.slotLine = 'border-text/60';
        this.slotLabel = 'text-fg font-medium';
        this.slotThickness = 'border-t-2';
        this.dashed = false;
        break;

      case 'dashed':
        this.slotLine = 'border-border';
        this.slotThickness = 'border-t';
        this.dashed = true;
        break;

      default:
        this.slotLine = 'border-border';
        this.slotLabel = 'text-xs text-fg/70';
        this.slotThickness = 'border-t';
        this.dashed = false;
    }
  }
}
