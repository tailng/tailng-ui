import { Component, computed } from '@angular/core';
import { TngCodeBlock } from '@tailng-ui/ui/utilities';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-code-block-overview',
  templateUrl: './code-block-overview.component.html',
  imports: [TngCodeBlock, ExampleBlockComponent, TngExampleDemo],
})
export class CodeBlockOverviewComponent {
  readonly snippet = computed(
    () => `const greeting = 'Hello, tailng';
console.log(greeting);`,
  );

  readonly basicHtml = computed(
    () => `
<tng-code-block [content]="snippet()" language="typescript">
</tng-code-block>
`,
  );

  readonly basicTs = computed(
    () => `import { TngCodeBlock } from '@tailng-ui/ui/utilities';

snippet = computed(() => \`const x = 1;\`);`,
  );
}
