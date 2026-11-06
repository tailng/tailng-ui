---
id: "components/codeblock/api"
title: "Codeblock API"
description: "Codeblock API reference for Angular applications."
category: "components"
status: "stable"
tags: ["codeblock","utility","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/code-block/highlighting.ts","libs/tailng-ui/components/src/lib/utility/code-block/tng-code-block.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/codeblock/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/codeblock/sections/api/codeblock-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/codeblock/sections/api/codeblock-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/codeblock/sections/api/codeblock-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/codeblock/api"
componentGroup: "utility"
symbols: ["TngCodeBlockComponent"]
selectors: ["tng-code-block"]
productId: "codeblock"
section: "api"
officialCatalog: true
generated: true
---

# Codeblock API

Code rendering, highlighting adapters, and line metadata.

## API reference

The wrapper owns rendering, copy feedback, and line treatment for you while still exposing the headless slot contract underneath.

### Wrapper component

#### Wrapper usage

```html
<tng-code-block
  title="review.ts"
  language="ts"
  [code]="snippet"
  [lineNumbers]="true"
  [highlightLines]="[3, [4, 4]]"
  [focusLines]="true"
  [wrap]="true"
  [copy]="true"
  caption="Focused review shell"
></tng-code-block>
```

### Rendering and copy inputs

| Input / output | Type | Notes |
| --- | --- | --- |
| `code` | `string` | Source content rendered inside the wrapper shell. |
| `title`, `caption`, `variant` | `string \| null`, `'default' \| 'compact' \| 'ghost'` | Header copy and overall wrapper presentation. |
| `language`, `adapter`, `theme` | `string \| null` | Language metadata and adapter selection for highlighted rendering. |
| `lineNumbers`, `startingLineNumber`, `showLineNumbers` | `boolean \| 'auto'`, `number`, `boolean \| undefined` | Line-number visibility and numbering offset. |
| `highlightLines`, `focusLines`, `wrap`, `maxHeight` | `Array<number \| [number, number]>`, `boolean`, `boolean`, `string \| number \| null` | Line emphasis, dimming, wrapping, and scrollable height control. |
| `highlight`, `highlightMode`, `sanitizeHtml` | `boolean`, `'auto' \| 'off' \| 'on'`, `boolean \| 'auto'` | Controls whether adapter output is used and how incoming HTML is treated. |
| `copy`, `copyText`, `copyLabel`, `copiedLabel`, `errorLabel` | `boolean \| 'auto'`, `string \| ((ctx) => string) \| null`, `string` | Clipboard action visibility, payload override, and button labels. |
| `copyAttempt`, `copySuccess`, `copyError`, `renderStateChange`, `tngCopied`, `tngCopyError` | Outputs | Clipboard lifecycle events plus render-state notifications. |

Migration: Replace `(copy)` listeners with `(copyAttempt)`. The `[copy]` input is unchanged.

### Primitive foundation

Under the hood the wrapper uses the headless codeblock directives for the root, header, body, gutter, and code regions. Reach for the headless page when you want to author that shell yourself.

#### Primitive foundation

```html
<section tngCodeBlock>
  <header tngCodeBlockHeader>...</header>
  <div tngCodeBlockBody>
    <ol tngCodeBlockGutter aria-hidden="true"></ol>
    <pre><code tngCodeBlockCode>...</code></pre>
  </div>
</section>
```

## Source-derived public Angular API

### `TngCodeBlockComponent` — `tng-code-block`

- Inputs: `adapter`, `caption`, `code`, `copiedLabel`, `copy`, `copyLabel`, `copyResetDuration`, `copySuccessDurationMs`, `copyText`, `errorLabel`, `focusLines`, `highlight`, `highlightDebounceMs`, `highlightLines`, `highlightMode`, `language`, `lineNumbers`, `maxHeight`, `sanitizeHtml`, `showHeader`, `showLanguageBadge`, `showLineNumbers`, `startingLineNumber`, `theme`, `title`, `variant`, `wrap`
- Outputs: `copyAttempt`, `copyError`, `copySuccess`, `renderStateChange`, `tngCopied`, `tngCopyError`
