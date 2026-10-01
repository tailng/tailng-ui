import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-popover-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-popover-page.component.html',
})
export class OwnablePopoverPageComponent {
  protected readonly usageCode = [
    '<tng-popover #popover="tngPopover">',
    '  <p>Popover body content.</p>',
    '  <button type="button">Apply</button>',
    '</tng-popover>',
    '<button type="button" [tngPopoverTriggerFor]="popover">Project actions</button>',
    '',
  ].join('\n');
}
