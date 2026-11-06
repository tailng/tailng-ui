---
id: "components/command-palette/api"
title: "Command Palette API"
description: "Command Palette API reference for Angular applications."
category: "components"
status: "stable"
tags: ["command-palette","utility","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/command-palette/tng-command-palette.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/command-palette/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/command-palette/sections/api/command-palette-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/command-palette/sections/api/command-palette-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/command-palette/sections/api/command-palette-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/command-palette/api"
componentGroup: "utility"
symbols: ["TngCommandPaletteComponent"]
selectors: ["tng-command-palette"]
productId: "command-palette"
section: "api"
officialCatalog: true
generated: true
---

# Command Palette API

Modal search palette with query output, templated results, keyboard selection, and empty/loading states.

## API reference

`<tng-command-palette>` is a controlled wrapper: bind open, query, and options from the parent, then react to query and selection outputs.

### Component inputs

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | Controls whether the dialog-backed popup is visible. |
| `query` | `string` | `''` | Displayed in the search input. |
| `options` | `readonly O[]` | `[]` | Rows rendered in the result list. |
| `loading` | `boolean` | `false` | Shows loading content and takes precedence over the empty state. |
| `placeholder` | `string` | `'Search...'` | Placeholder forwarded to the input. |
| `ariaLabel` | `string` | `'Command search'` | Labels the dialog and input. |
| `emptyText` | `string` | `'No results found'` | Default empty state text. |
| `loadingText` | `string` | `'Loading...'` | Default loading state text. |
| `footerText` | `string` | `'↑ ↓ Navigate · Enter Select · Esc Close'` | Default footer hint text. |
| `closeOnSelect` | `boolean` | `true` | Closes after pointer or keyboard selection. |
| `showClearButton` | `boolean` | `true` | Shows the default suffix clear button when query is non-empty. |

### Option mapping

| Input | Type | Purpose |
| --- | --- | --- |
| `getOptionValue` | `(option: O) => V` | Value emitted and used for active/selected matching. |
| `getOptionLabel` | `(option: O) => string` | Default row label and selection payload label. |
| `getOptionDescription` | `(option: O) => string \| null \| undefined` | Optional default row description. |
| `isOptionDisabled` | `(option: O) => boolean` | Marks a row disabled and blocks selection. |
| `trackBy` | `(index: number, option: O) => unknown` | Controls Angular row tracking. |

### Outputs and templates

| Name | Type | Notes |
| --- | --- | --- |
| `openChange` | `boolean` | Emitted for Escape, backdrop close, and close-on-select. |
| `queryChange` | `string` | Emitted on typing and default clear button click. |
| `optionSelect` | ` option: O; value: V; label: string ` | Emitted for pointer click and Enter on the active option. |
| `#tngCommandPaletteInputPrefixTpl` | `TemplateRef` | Replaces the default search prefix. |
| `#tngCommandPaletteInputSuffixTpl` | `TemplateRef` | Replaces the default clear suffix. |
| `#tngCommandPaletteOptionTpl` | `TemplateRef` | Receives option, value, label, description, active, selected, and disabled context. |
| `#tngCommandPaletteEmptyTpl` | `TemplateRef` | Replaces the empty state. |
| `#tngCommandPaletteLoadingTpl` | `TemplateRef` | Replaces the loading state. |
| `#tngCommandPaletteFooterTpl` | `TemplateRef` | Replaces the keyboard-help footer. |

## Source-derived public Angular API

### `TngCommandPaletteComponent` — `tng-command-palette`

- Inputs: `ariaLabel`, `closeOnSelect`, `emptyText`, `footerText`, `getOptionDescription`, `getOptionLabel`, `getOptionValue`, `isOptionDisabled`, `loading`, `loadingText`, `open`, `options`, `placeholder`, `query`, `showClearButton`, `trackBy`
- Outputs: `openChange`, `optionSelect`, `queryChange`
