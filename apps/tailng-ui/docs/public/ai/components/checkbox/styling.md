---
id: "components/checkbox/styling"
title: "Checkbox styling"
description: "Checkbox styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["checkbox","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/checkbox/tng-checkbox.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/checkbox/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/checkbox/sections/styling/checkbox-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/checkbox/sections/styling/checkbox-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/checkbox/sections/styling/checkbox-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/checkbox/styling"
componentGroup: "form"
symbols: ["TngCheckboxComponent"]
selectors: ["tng-checkbox"]
productId: "checkbox"
section: "styling"
officialCatalog: true
generated: true
---

# Checkbox styling

## Styling contract

The component-safe styling surface is the `<tng-checkbox>` host plus the semantic tokens that flow into the internal primitive. Use wrapper classes for layout and host-level custom properties for per-instance styling.

| Surface | Use from consumer CSS? | Purpose |
| --- | --- | --- |
| `tng-checkbox` host | Yes | Per-instance token overrides, layout tweaks, and wrapper spacing. |
| Wrapper classes around `tng-checkbox` | Yes | Card layout, section spacing, helper copy, and grouped presentation. |
| `.tng-checkbox-root`, `.tng-checkbox-control` | No, not from component-scoped CSS | Internal implementation details. Use headless or ownable when you need direct control. |
| `data-state`, `data-invalid`, `data-focus-visible` | No, not from component-scoped CSS | Primitive-level hooks for DOM-owned solutions. |

| Semantic token | Default role |
| --- | --- |
| `--tng-semantic-accent-brand` | Checked accent color for the checkbox control. |
| `--tng-semantic-accent-danger` | Invalid checkbox accent and validation emphasis. |
| `--tng-semantic-focus-ring` | Focus-visible ring color around the control. |
| `--tng-semantic-foreground-primary` | Primary label copy color. |
| `--tng-semantic-foreground-secondary` | Muted or readonly label tone. |

If a product design needs a fully custom checkbox box, animated indicator, or state-targeted selectors in component-scoped CSS, that is the point to switch to the headless or ownable layer instead of fighting the component wrapper.
