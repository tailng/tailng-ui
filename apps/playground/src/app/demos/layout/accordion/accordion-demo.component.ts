import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  TailngAccordionComponent,
  TailngExpansionIconCloseDirective,
  TailngExpansionIconOpenDirective,
  TailngExpansionPanelComponent,
} from '@tociva/tailng-ui';

@Component({
  selector: 'playground-accordion-demo',
  standalone: true,
  imports: [
    TailngAccordionComponent,
    TailngExpansionPanelComponent,
    TailngExpansionIconOpenDirective,
    TailngExpansionIconCloseDirective,
    JsonPipe,
  ],
  templateUrl: './accordion-demo.component.html',
})
export class AccordionDemoComponent {
  readonly openSingle = signal<number[]>([]);
  readonly openMulti = signal<number[]>([]);
  readonly openLocked = signal<number[]>([]);
}
