import { Component } from '@angular/core';
import { TailngIconComponent } from '@tociva/tailng-icons';
import { TailngBadgeComponent, TailngTextInputComponent, TailngTagComponent } from '@tociva/tailng-ui';

@Component({
  standalone: true,
  selector: 'docs-text-input-overview',
  templateUrl: './text-input-overview.component.html',
  imports: [
    TailngIconComponent,
    TailngTextInputComponent,
    TailngTagComponent
],
})
export class TextInputOverviewComponent {}
