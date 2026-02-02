import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  TngAccordion,
  TngExpansionIconClose,
  TngExpansionIconOpen,
  TngExpansionPanel,
} from '@tociva/tailng-ui/layout';

@Component({
  selector: 'playground-accordion-demo',
  standalone: true,
  imports: [
    TngAccordion,
    TngExpansionPanel,
    TngExpansionIconOpen,
    TngExpansionIconClose,
    JsonPipe,
  ],
  templateUrl: './accordion-demo.component.html',
})
export class AccordionDemoComponent {
  readonly openSingle = signal<number[]>([]);
  readonly openMulti = signal<number[]>([]);
  readonly openLocked = signal<number[]>([]);
}
