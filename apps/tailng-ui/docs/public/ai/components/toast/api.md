---
id: "components/toast/api"
title: "Toast API"
description: "Toast API reference for Angular applications."
category: "components"
status: "stable"
tags: ["toast","feedback","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/toast/tng-toast.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/toast/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/toast/sections/api/toast-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/feedback/toast/sections/api/toast-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/toast/sections/api/toast-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/toast/api"
componentGroup: "feedback"
symbols: ["TngToastComponent"]
selectors: ["tng-toast"]
productId: "toast"
section: "api"
officialCatalog: true
generated: true
---

# Toast API

Stacked notification toasts with auto-dismiss timing, dismiss actions, and tone semantics.

## API reference

`<tng-toast>` is a wrapper component around the toast primitives that adds queue trimming, dismissal timers, action handling, and focus-aware Escape dismissal.

### `<tng-toast>` wrapper

The wrapper renders a fixed-position viewport and a minimum toast shell. It is designed for the common case where you want imperative `show()` calls instead of owning the queue in your template.

#### Wrapper usage

```html
<tng-toast
  #toast
  position="bottom-right"
  (dismissedWithReason)="onToastDismiss($event)"
></tng-toast>

<tng-button
  tone="success"
  (click)="toast.show('Saved checklist updates.', { title: 'Saved', tone: 'success' })"
>
  Show success toast
</tng-button>
```

| Wrapper input / output | Type | Default | Notes |
| --- | --- | --- | --- |
| `[duration]` | `number` | `4000` | Fallback auto-dismiss duration in milliseconds for `show()` calls. |
| `[maxVisible]` | `number` | `4` | Keeps only the latest N toasts visible in the viewport. |
| `[mode]` | `'toast' \| 'snackbar'` | `'toast'` | Reflects `data-mode` on the viewport so CSS can switch layout emphasis. |
| `[position]` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Chooses the fixed corner used by the default shell. |
| `(dismissed)` | `EventEmitter<string>` | — | Emits the toast id after any dismissal. |
| `(dismissedWithReason)` | `{ id: string; reason: 'manual' \| 'timeout' \| 'escape' }` | — | Emits the id plus the dismissal reason for analytics or retry flows. |

### Runtime methods

Toast is usually used through a template reference and the imperative `show()` / `dismiss()` API.

#### Imperative runtime API

```ts
toast.show('Build failed during publish.', {
  action: {
    dismissOnSelect: false,
    label: 'Retry',
    onSelect: (id) => retryBuild(id),
  },
  duration: 0,
  title: 'Action required',
  tone: 'warning',
});

toast.dismiss(toastId, 'manual');
```

| Method / option | Type | Default | Notes |
| --- | --- | --- | --- |
| `show(message, options)` | `(message: string, options?: TngToastOptions) => string` | — | Adds a toast to the queue and returns the generated toast id. |
| `dismiss(id, reason?)` | `(id: string, reason?: 'manual' \| 'timeout' \| 'escape') => void` | `'manual'` | Removes a visible toast and emits the matching dismissal outputs. |
| `options.title` | `string \| null` | `null` | Optional heading rendered above the message. |
| `options.tone` | `'neutral' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Sets the toast semantics and visual tone hooks. |
| `options.duration` | `number` | `component duration()` | Use `0` to keep the toast open until manual dismissal. |
| `options.action` | `{ label: string; dismissOnSelect?: boolean; onSelect?: (id: string) => void }` | `null` | Renders a wrapper-owned action button and optionally keeps the toast open after selection. |

### Primitive foundation

The wrapper uses `tngToastViewport` and `tngToastItem` internally, so the public slot and tone/state hooks still show up on the rendered DOM. If you need full control over the toast markup, timers, or placement rules, use the headless toast page instead of styling through wrapper internals.

## Source-derived public Angular API

### `TngToastComponent` — `tng-toast`

- Inputs: `duration`, `maxVisible`, `mode`, `position`
- Outputs: `dismissed`, `dismissedWithReason`
