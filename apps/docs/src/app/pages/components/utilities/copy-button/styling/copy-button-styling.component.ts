import { Component, computed } from '@angular/core';
import { TngCopyButton } from '@tailng-ui/ui/utilities';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-copy-button-styling',
  templateUrl: './copy-button-styling.component.html',
  imports: [TngCopyButton, ExampleBlockComponent, TngExampleDemo],
})
export class CopyButtonStylingComponent {
  readonly snippet = computed(() => 'Text to copy');

  readonly themedHtml = computed(
    () => `
<tng-copy-button
  [text]="snippet()"
  variant="outline"
  rootKlass="rounded-lg border-2 border-primary/50"
  contentWrapKlass="inline-flex items-center gap-2 text-primary"
>
  <span>Copy</span>
  <span tngCopied>Copied</span>
</tng-copy-button>
`,
  );
}
