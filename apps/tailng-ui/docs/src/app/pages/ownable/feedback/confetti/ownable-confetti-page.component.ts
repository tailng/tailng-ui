import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-confetti-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-confetti-page.component.html',
})
export class OwnableConfettiPageComponent {
  protected readonly usageCode = [
    '<tng-confetti',
    '  [active]="celebrating"',
    '  origin="center"',
    '  [pieces]="140"',
    '  (completed)="celebrating = false"',
    '></tng-confetti>',
    '',
    '<button type="button" (click)="celebrating = true">Celebrate</button>',
    '',
  ].join('\n');
}
