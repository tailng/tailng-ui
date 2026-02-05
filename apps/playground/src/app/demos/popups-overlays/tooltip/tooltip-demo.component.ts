import { Component } from '@angular/core';
import { TngTooltip } from '@tailng-ui/ui/overlay';

@Component({
  selector: 'playground-tooltip-demo',
  standalone: true,
  imports: [TngTooltip],
  templateUrl: './tooltip-demo.component.html',
})
export class TooltipDemoComponent {}
