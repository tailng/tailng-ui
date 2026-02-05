import { Component, computed } from '@angular/core';
import { TngCopyButton } from '@tailng-ui/ui/utilities';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-copy-button-overview',
  templateUrl: './copy-button-overview.component.html',
  imports: [TngCopyButton, ExampleBlockComponent, TngExampleDemo],
})
export class CopyButtonOverviewComponent {
  readonly snippet = computed(() => 'Text to copy');

  readonly basicHtml = computed(
    () => `
<tng-copy-button [text]="snippet()">
  <span>Copy</span>
  <span tngCopied>Copied</span>
</tng-copy-button>
`,
  );
  readonly basicTs = computed(
    () => `import { TngCopyButton } from '@tailng-ui/ui/utilities';

snippet = computed(() => 'Text to copy');`,
  );
}
