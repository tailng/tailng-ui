import { Component, computed } from '@angular/core';
import { TngCodeBlock } from '@tailng-ui/ui/utilities';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-code-block-styling',
  templateUrl: './code-block-styling.component.html',
  imports: [TngCodeBlock, ExampleBlockComponent, TngExampleDemo],
})
export class CodeBlockStylingComponent {
  readonly snippet = computed(() => `function hello() {
  return 'world';
}`);

  readonly rootPreHtml = computed(
    () => `
<tng-code-block
  [content]="snippet()"
  rootKlass="rounded-xl border-2 border-primary bg-bg"
  preKlass="text-sm p-4"
>
</tng-code-block>
`,
  );

  readonly gutterHtml = computed(
    () => `
<tng-code-block
  [content]="snippet()"
  [showLineNumbers]="true"
  gutterKlass="!text-primary/70"
>
</tng-code-block>
`,
  );
}
