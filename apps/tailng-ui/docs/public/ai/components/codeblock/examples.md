---
id: "components/codeblock/examples"
title: "Codeblock examples"
description: "Codeblock examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["codeblock","utility","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/code-block/highlighting.ts","libs/tailng-ui/components/src/lib/utility/code-block/tng-code-block.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/codeblock/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/codeblock/sections/examples/codeblock-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/codeblock/sections/examples/codeblock-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/codeblock/sections/examples/codeblock-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/codeblock/examples"
componentGroup: "utility"
symbols: ["TngCodeBlockComponent"]
selectors: ["tng-code-block"]
productId: "codeblock"
section: "examples"
officialCatalog: true
generated: true
---

# Codeblock examples

## Examples

Use the wrapper for compact snippets or richer review surfaces with focused lines, captions, and copy actions.

### codeblock-examples-compact-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-codeblock-examples-compact-plain-css',
  standalone: true,
  imports: [TngCodeBlockComponent],
  templateUrl: './codeblock-examples-compact-plain-css.component.html',
  styleUrl: './codeblock-examples-compact-plain-css.component.css',
})
export class CodeblockExamplesCompactPlainCssComponent {
  protected readonly snippet = "export const status = 'ready';\n";
}
```

### codeblock-examples-compact-plain-css.component.html

```html
<div class="codeblock-example-shell codeblock-example-shell--plain">
  <tng-code-block
    title="status.ts"
    variant="compact"
    language="ts"
    [code]="snippet"
    [copy]="true"
  ></tng-code-block>
</div>
```

### codeblock-examples-compact-plain-css.component.css

```css
.codeblock-example-shell--plain {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.8rem;
  padding: 0.9rem 1rem;
}
```

### codeblock-examples-compact-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-codeblock-examples-compact-tailwind',
  standalone: true,
  imports: [TngCodeBlockComponent],
  templateUrl: './codeblock-examples-compact-tailwind.component.html',
  styleUrl: './codeblock-examples-compact-tailwind.component.css',
})
export class CodeblockExamplesCompactTailwindComponent {
  protected readonly snippet = "export const status = 'ready';\n";
}
```

### codeblock-examples-compact-tailwind.component.html

```html
<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <tng-code-block
    title="status.ts"
    variant="ghost"
    language="ts"
    [code]="snippet"
    [copy]="true"
  ></tng-code-block>
</div>
```

### codeblock-examples-compact-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### codeblock-examples-review-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-codeblock-examples-review-plain-css',
  standalone: true,
  imports: [TngCodeBlockComponent],
  templateUrl: './codeblock-examples-review-plain-css.component.html',
  styleUrl: './codeblock-examples-review-plain-css.component.css',
})
export class CodeblockExamplesReviewPlainCssComponent {
  protected readonly snippet = [
    'const draft = await loadDraft();',
    '',
    "if (draft.status !== 'approved') {",
    "  return 'needs-review';",
    '}',
    '',
    'return draft.summary;',
    '',
  ].join('\n');
}
```

### codeblock-examples-review-plain-css.component.html

```html
<div class="codeblock-example-shell codeblock-example-shell--plain">
  <tng-code-block
    title="review.ts"
    language="ts"
    [code]="snippet"
    [lineNumbers]="true"
    [highlightLines]="[3, [4, 4]]"
    [focusLines]="true"
    [wrap]="true"
    maxHeight="14rem"
    [copy]="true"
    caption="Focused review shell"
  ></tng-code-block>
</div>
```

### codeblock-examples-review-plain-css.component.css

```css
.codeblock-example-shell--plain {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.8rem;
  padding: 0.9rem 1rem;
}
```

### codeblock-examples-review-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-codeblock-examples-review-tailwind',
  standalone: true,
  imports: [TngCodeBlockComponent],
  templateUrl: './codeblock-examples-review-tailwind.component.html',
  styleUrl: './codeblock-examples-review-tailwind.component.css',
})
export class CodeblockExamplesReviewTailwindComponent {
  protected readonly snippet = [
    'const draft = await loadDraft();',
    '',
    "if (draft.status !== 'approved') {",
    "  return 'needs-review';",
    '}',
    '',
    'return draft.summary;',
    '',
  ].join('\n');
}
```

### codeblock-examples-review-tailwind.component.html

```html
<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <tng-code-block
    title="review.ts"
    variant="ghost"
    language="ts"
    [code]="snippet"
    [lineNumbers]="true"
    [highlightLines]="[3, [4, 4]]"
    [focusLines]="true"
    [wrap]="true"
    maxHeight="14rem"
    [copy]="true"
    caption="Focused review shell"
  ></tng-code-block>
</div>
```

### codeblock-examples-review-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
