import { Component } from '@angular/core';
import { TngTooltip } from '@tociva/tailng-ui/popups-overlays';

@Component({
  selector: 'playground-tooltip-demo',
  standalone: true,
  imports: [TngTooltip],
  templateUrl: './tooltip-demo.component.html',
})
export class TooltipDemoComponent {}
