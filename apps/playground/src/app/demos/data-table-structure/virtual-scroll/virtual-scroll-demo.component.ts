import { Component } from '@angular/core';
import { TngVirtualScroll } from '@tociva/tailng-ui/data-table-structure';

@Component({
  selector: 'playground-virtual-scroll-demo',
  standalone: true,
  imports: [TngVirtualScroll],
  templateUrl: './virtual-scroll-demo.component.html',
})
export class VirtualScrollDemoComponent {}

