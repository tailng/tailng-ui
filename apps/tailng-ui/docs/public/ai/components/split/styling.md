---
id: "components/split/styling"
title: "Split Layout styling"
description: "Split Layout styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["split","layout","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/split/tng-split-layout.engine.ts","libs/tailng-ui/components/src/lib/layout/split/tng-split-layout.types.ts","libs/tailng-ui/components/src/lib/layout/split/tng-split.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/split/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/split/sections/styling/split-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/split/sections/styling/split-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/split/styling"
componentGroup: "layout"
symbols: ["TngSplitGroupComponent","TngSplitHandleComponent","TngSplitPaneDirective"]
selectors: ["tng-split-group","tng-split-handle","[tngSplitPane]"]
productId: "split"
section: "styling"
officialCatalog: true
generated: true
---

# Split Layout styling

## Split Layout styling

The default separator resolves through TailNG semantic tokens and includes dark-mode and forced-colors behavior.

### CSS custom properties

### State hooks

Panes expose `data-collapsed`, `data-resizing`, and `data-disabled`. Groups expose orientation, disabled, resizing, and `data-constrained` when the container is smaller than the combined minimums. Handles expose orientation, disabled, and resizing states.

Fully collapsed zero-size panes also receive `inert` and `aria-hidden="true"`. Use the pane state hook to swap full content for an icon rail at nonzero collapsed sizes.
