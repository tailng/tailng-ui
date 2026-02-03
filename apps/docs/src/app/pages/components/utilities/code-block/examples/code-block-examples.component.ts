import { Component, computed, inject } from '@angular/core';
import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

@Component({
  standalone: true,
  selector: 'docs-code-block-examples',
  templateUrl: './code-block-examples.component.html',
  imports: [TngCodeBlock, ExampleBlockComponent, TngExampleDemo],
})
export class CodeBlockExamplesComponent {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);

  readonly tsSnippet = computed(
    () => `export class MyComponent {
  count = signal(0);
  increment() {
    this.count.update(c => c + 1);
  }
}`,
  );

  readonly shortSnippet = computed(() => `npm i @tociva/tailng-ui`);

  readonly basicHtml = computed(
    () => `
<tng-code-block [content]="tsSnippet()" [highlighter]="highlighter" language="typescript">
</tng-code-block>
`,
  );

  readonly basicTs = computed(
    () => `import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
// Inject ShikiHighlighterService and use TngShikiAdapter for highlighter.`,
  );

  readonly lineNumbersHtml = computed(
    () => `
<tng-code-block
  [content]="tsSnippet()"
  [showLineNumbers]="true"
  [wrap]="true"
  [highlighter]="highlighter"
  language="typescript"
>
</tng-code-block>
`,
  );

  readonly copySlotHtml = computed(
    () => `
<tng-code-block [content]="snippet()" copyVariant="outline">
  <button tngCopy>Copy</button>
  <span tngCopied>Copied!</span>
</tng-code-block>
`,
  );
}
