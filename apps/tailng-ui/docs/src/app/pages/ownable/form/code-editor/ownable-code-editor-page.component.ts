import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-code-editor-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-code-editor-page.component.html',
})
export class OwnableCodeEditorPageComponent {
  protected readonly usageCode = [
    '<tng-code-editor',
    '  language="python"',
    '  adapter="shiki"',
    '  ariaLabel="Python source"',
    '  [value]="source"',
    '  (valueChange)="source = $event"',
    '></tng-code-editor>',
  ].join('\n');
}
