import { Component, computed } from '@angular/core';
import { TngCopyButton } from '@tailng-ui/ui/utilities';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-copy-button-examples',
  templateUrl: './copy-button-examples.component.html',
  imports: [TngCopyButton, ExampleBlockComponent, TngExampleDemo],
})
export class CopyButtonExamplesComponent {
  readonly snippet = computed(() => 'Text to copy');

  readonly variantsHtml = computed(
    () => `
<tng-copy-button [text]="snippet()">Copy (ghost)</tng-copy-button>
<tng-copy-button [text]="snippet()" variant="outline">Copy (outline)</tng-copy-button>
<tng-copy-button [text]="snippet()" variant="solid">Copy (solid)</tng-copy-button>
`,
  );
  readonly sizeHtml = computed(
    () => `
<tng-copy-button [text]="snippet()" size="sm">Small</tng-copy-button>
<tng-copy-button [text]="snippet()" size="md">Medium</tng-copy-button>
`,
  );
  readonly copiedHtml = computed(
    () => `
<tng-copy-button [text]="snippet()">
  <span>Copy to clipboard</span>
  <span tngCopied>Copied!</span>
</tng-copy-button>
`,
  );
  readonly klassHtml = computed(
    () => `
<tng-copy-button [text]="snippet()"
  rootKlass="rounded-lg border-2 border-primary/50"
  contentWrapKlass="gap-2 text-primary">
  <span>Copy</span>
  <span tngCopied>Copied</span>
</tng-copy-button>
`,
  );
}
