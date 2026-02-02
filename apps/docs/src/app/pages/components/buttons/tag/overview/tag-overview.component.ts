import { Component } from '@angular/core';
import { TngTag, TngBadge} from '@tociva/tailng-ui/buttons-indicators';

@Component({
  standalone: true,
  selector: 'docs-tag-overview',
  templateUrl: './tag-overview.component.html',
  imports: [TngTag, TngBadge],
})
export class TagOverviewComponent {}
