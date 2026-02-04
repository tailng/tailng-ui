import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngCard, TngAccordion, TngExpansionPanel, TngCardHeader, TngCardFooter } from "@tociva/tailng-ui/layout";

@Component({
  standalone: true,
  selector: 'docs-components-home',
  templateUrl: './components-home.component.html',
  imports: [TngCard, TngAccordion, TngExpansionPanel,TngCardHeader,TngCardFooter,RouterLink],
})
export class ComponentsHomeComponent {}
