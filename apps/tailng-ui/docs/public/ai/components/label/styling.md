---
id: "components/label/styling"
title: "Label styling"
description: "Label styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["label","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/label/tng-label.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/label/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/label/sections/styling/label-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/label/sections/styling/label-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/label/sections/styling/label-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/label/styling"
componentGroup: "form"
symbols: ["TngLabelComponent"]
selectors: ["tng-label"]
productId: "label"
section: "styling"
officialCatalog: true
generated: true
---

# Label styling

## Styling contract

The component-safe styling surface is the `<tng-label>` host plus the semantic tokens consumed by the internal label. Use wrapper classes for field layout and host-level custom properties for per-instance tone changes.

| Surface | Use from consumer CSS? | Purpose |
| --- | --- | --- |
| `tng-label` host | Yes | Per-instance token overrides and layout placement. |
| `--tng-semantic-foreground-primary` | Yes | Label text color. |
| `--tng-semantic-accent-danger` | Yes | Required marker color. |
| `.tng-label`, `.tng-label-required` | No, not from component-scoped CSS | Internal implementation detail. Use headless or ownable if you need direct selector ownership. |
