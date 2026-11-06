---
id: "components/flow-node-properties/styling"
title: "Flow Node Properties styling"
description: "Flow Node Properties styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["flow-node-properties","flow","styling"]
package: "@tailng-ui/flow"
importPath: "@tailng-ui/flow/execution"
sourcePaths: ["libs/tailng-ui/flow/src/execution/components/node-properties/tng-flow-node-properties.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-node-properties/routes.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-node-properties/sections/styling/flow-node-properties-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/flow/flow-node-properties/sections/styling/flow-node-properties-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/flow/flow-node-properties/styling"
componentGroup: "flow"
symbols: ["TngFlowNodePropertiesComponent"]
selectors: ["tng-flow-node-properties"]
productId: "flow-node-properties"
section: "styling"
officialCatalog: true
generated: true
---

# Flow Node Properties styling

## Node Properties styling

The panel owns its internal inspector rhythm, form spacing, port list, and empty state. Applications should style the host for layout and set CSS custom properties for product color, border, focus, and density decisions.

### Panel layout

Use `tng-flow-node-properties` as a block-level sidebar, drawer body, split-pane details panel, or bottom inspector. The host should own width, height, and external borders; the component fills that box and scrolls its inner content when fields, data, or ports exceed the available space.

### Theme tokens

The built-in fields resolve through the same execution inspector tokens used by Flow Workbench, so the panel can sit beside the graph without a second visual system. Override these properties on the host when a specific inspector needs different surface, text, border, focus, or density treatment.

| Token | Controls |
| --- | --- |
| `--tng-flow-execution-surface` | Panel background and input background. |
| `--tng-flow-execution-muted-background` | Readonly data preview background. |
| `--tng-flow-execution-color` | Primary text, field values, and node title. |
| `--tng-flow-execution-muted-color` | Eyebrow text, field labels, section headings, port metadata, and empty states. |
| `--tng-flow-execution-border-color` | Inputs, type badge, data preview, and port rows. |
| `--tng-flow-execution-focus-color` | Keyboard focus outline for editable inputs. |
| `--tng-flow-execution-inspector-padding` | Inner panel padding. |

### Data template styling

Projected `ng-template[tngFlowNodePropertiesData]` content is rendered inside the panel's Data section. Keep template styles scoped to your application classes, preserve the provided `readonly` state, and call the template request functions instead of mutating node data directly.

### Readonly state

Use `readonly` for historical runs, locked workflows, and permission-limited users. The host receives `data-readonly`, text inputs become read-only, toggles become disabled, and change requests are suppressed. Keep the same layout in both modes so switching between edit and review states does not move the user's focus.

### Accessibility baseline

Built-in fields keep visible labels, native form controls, keyboard focus outlines, and forced-colors border fallbacks. Custom data templates should follow the same pattern: use semantic labels, avoid color-only state, and keep controls reachable in the panel's scroll area.
