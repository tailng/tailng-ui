---
id: "components/listbox/styling"
title: "ListBox styling"
description: "ListBox styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["listbox","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/listbox/tng-listbox.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/listbox/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/listbox/sections/styling/listbox-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/listbox/sections/styling/listbox-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/listbox/sections/styling/listbox-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/listbox/styling"
componentGroup: "form"
symbols: ["TngListboxComponent"]
selectors: ["tng-listbox"]
productId: "listbox"
section: "styling"
officialCatalog: true
generated: true
---

# ListBox styling

## Styling contract

Style the component wrapper through host-level semantic tokens. The internal option markup is owned by `<tng-listbox>`, so the supported customization surface is the host plus its CSS custom properties rather than private child selectors.

### CSS contract table

| Selector / token | Applied on | Purpose |
| --- | --- | --- |
| `tng-listbox` | Wrapper host | Width, margins, outer border radius, and host-level positioning. |
| `tng-listbox[data-orientation='horizontal']` | Wrapper host | Optional layout tweaks for horizontal listboxes. |
| `tng-listbox[data-disabled]` | Wrapper host | Global disabled affordance. |
| `--tng-semantic-background-surface` | Wrapper host | Option surfaces and outer listbox card background. |
| `--tng-semantic-background-base` | Wrapper host | Base fill used behind option cards. |
| `--tng-semantic-border-subtle` | Wrapper host | Border color for the wrapper and option rows. |
| `--tng-semantic-accent-brand` | Wrapper host | Active and selected state accent color. |
| `--tng-semantic-focus-ring` | Wrapper host | Focus ring color applied by the owned wrapper. |
| `--tng-semantic-foreground-primary` | Wrapper host | Primary option label color. |
| `--tng-semantic-foreground-secondary` | Wrapper host | Secondary description and helper text color. |

### Plain CSS host styling

#### listbox.contract.css

```css
.project-listbox-card {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
}

.project-listbox-card tng-listbox {
  width: 100%;
  max-width: none;
}
```

### Tailwind host styling

#### listbox.contract.html

```html
<div class="w-full max-w-none rounded-xl">
  <tng-listbox
    ariaLabel="Project queue"
    [options]="projectOptions"
    [value]="selectedProject()"
    (valueChange)="onSelectedProjectChange($event)"
  ></tng-listbox>
</div>
```
