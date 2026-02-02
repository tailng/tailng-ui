import { Component } from '@angular/core';
import { TailngTagComponent, TailngBadgeComponent} from '@tociva/tailng-ui/buttons-indicators';

@Component({
  standalone: true,
  selector: 'docs-tag-overview',
  templateUrl: './tag-overview.component.html',
  imports: [TailngTagComponent, TailngBadgeComponent],
})
export class TagOverviewComponent {}
