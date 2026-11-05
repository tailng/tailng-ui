---
id: components/dialog/overview
title: Dialog component
description: Control an accessible TailNG dialog with Angular signal state.
category: components
status: stable
tags: ["dialog", "overlay", "modal"]
package: @tailng-ui/components
sourcePaths: ["libs/tailng-ui/components/src/lib/overlay/dialog/tng-dialog.component.ts", "apps/tailng-ui/docs/src/app/pages/components/overlay/dialog/sections/overview/dialog-overview-page.component.ts"]
humanDocsUrl: https://tailng.dev/components/overlay/dialog/overview
---

# Dialog component

`TngDialogComponent` supplies the modal panel, backdrop, focus management, escape handling, scroll locking, and focus restoration.

```ts
import { Component, signal } from '@angular/core';
import { TngDialogComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngDialogComponent],
  template: `
    <button type="button" (click)="open.set(true)">Open review</button>

    <tng-dialog
      title="Review changes"
      description="Confirm before publishing the release."
      [open]="open()"
      (openChange)="open.set($event)"
    >
      <p>Review the pending changes.</p>
      <button type="button" (click)="open.set(false)">Cancel</button>
    </tng-dialog>
  `,
})
export class ReviewDialogExample {
  readonly open = signal(false);
}
```

Inputs:

- `open`: dialog visibility.
- `title`: accessible title; default `Dialog`.
- `description`: optional accessible description.
- `closeOnBackdrop`: default `true`.
- `closeOnEscape`: default `true`.

Outputs:

- `openChange`: synchronize external visibility state.
- `closed`: close reason: `backdrop`, `close-button`, `escape`, or `programmatic`.
