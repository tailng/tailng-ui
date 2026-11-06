---
id: "components/flow-editor/styling"
title: "Flow Editor styling"
description: "Flow Editor styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["flow-editor","flow","styling"]
package: "@tailng-ui/flow"
importPath: "@tailng-ui/flow"
sourcePaths: ["libs/tailng-ui/flow/src/lib/connection-template/tng-flow-connection-template.directive.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-connection-marker-diamond.directive.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-editor.component.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-foblex-bridge.directive.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-keyboard-config.ts","libs/tailng-ui/flow/src/lib/node/tng-flow-node.component.ts","libs/tailng-ui/flow/src/lib/node-template/tng-flow-node-template.directive.ts","libs/tailng-ui/flow/src/lib/node-palette/tng-flow-node-palette.component.ts","libs/tailng-ui/flow/src/lib/palette-item/tng-flow-palette-item.directive.ts","libs/tailng-ui/flow/src/lib/port/tng-flow-port.component.ts","libs/tailng-ui/flow/src/lib/validation-badge/tng-flow-validation-badge.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/routes.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/styling/flow-editor-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/styling/flow-editor-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/flow/flow-editor/styling"
componentGroup: "flow"
symbols: ["TngFlowConnectionMarkerDiamondDirective","TngFlowConnectionTemplateDirective","TngFlowEditorComponent","TngFlowFoblexBridgeDirective","TngFlowNodeComponent","TngFlowNodePaletteComponent","TngFlowNodeTemplateDirective","TngFlowPaletteItemDirective","TngFlowPortComponent","TngFlowValidationBadgeComponent"]
selectors: ["f-connection-marker-circle[tngFlowConnectionMarkerDiamond]","ng-template[tngFlowConnection], ng-template[tngFlowConnectionLabel]","tng-flow-editor","[tngFlowFoblexBridge]","tng-flow-node","tng-flow-node-palette","ng-template[tngFlowNode]","[tngFlowPaletteItem]","tng-flow-port","tng-flow-validation-badge"]
productId: "flow-editor"
section: "styling"
officialCatalog: true
generated: true
---

# Flow Editor styling

## Flow Editor styling

The package supplies geometry and interaction styles, while CSS custom properties and custom templates let applications align the editor with their product theme.

### Required styles

Flow Editor requires the Foblex theme emitted by the package stylesheet. Import it globally; component-scoped imports do not reliably reach Foblex's generated SVG and overlay elements.

### Host sizing

The editor defaults to `36rem` high with a `24rem` minimum. Override the host height for full-screen builders, drawers, or compact embedded monitors. A nonzero height is mandatory for Foblex geometry.

### CSS custom properties

Defaults resolve through TailNG semantic tokens, so runtime preset and light/dark mode changes update the canvas, nodes, connections, and controls automatically. Override these properties only when an individual editor needs additional product-specific treatment.

| Property group | Properties |
| --- | --- |
| Canvas | `--tng-flow-background`, `--tng-flow-border-color`, `--tng-flow-border-radius`, `--tng-flow-grid-color`, `--tng-flow-grid-dot-radius` |
| Selection and validation | `--tng-flow-selection-color`, `--tng-flow-node-error-border`, `--tng-flow-node-warning-border`, `--tng-flow-node-info-border` |
| Smart guides | `--tng-flow-smart-guide-color`, `--tng-flow-smart-guide-spacing-fill`, `--tng-flow-smart-guide-spacing-border` |
| Ports | `--tng-flow-port-border`, `--tng-flow-port-background`, `--tng-flow-port-label-color`, `--tng-flow-port-error-color` |
| Connections and badges | `--tng-flow-connection-color`, `--tng-flow-connection-error-color`, `--tng-flow-connection-active-color`, `--tng-flow-connection-success-color`, `--tng-flow-connection-disabled-color`, `--tng-flow-connection-width`, `--tng-flow-connection-selected-width`, `--tng-flow-connection-hit-width`, `--tng-flow-connection-label-max-width`, `--tng-flow-connection-label-background`, `--tng-flow-connection-label-color`, `--tng-flow-connection-label-border`, `--tng-flow-validation-badge-size` |
| Connection motion | `--tng-flow-connection-flow-duration-slow`, `--tng-flow-connection-flow-duration-normal`, `--tng-flow-connection-flow-duration-fast`, `--tng-flow-connection-motion-reduced-width`, `--tng-flow-connection-dash-size`, `--tng-flow-connection-dash-gap` |
| Drag handle | `--tng-flow-handle-border`, `--tng-flow-handle-background`, `--tng-flow-handle-color` |
| Controls | `--tng-flow-controls-border`, `--tng-flow-controls-background` |
| Minimap | `--tng-flow-minimap-background`, `--tng-flow-minimap-border`, `--tng-flow-minimap-shadow`, `--tng-flow-minimap-node`, `--tng-flow-minimap-node-selected`, `--tng-flow-minimap-node-disabled`, `--tng-flow-minimap-node-error`, `--tng-flow-minimap-viewport-border`, `--tng-flow-minimap-viewport-background` |
| Status badge | `--tng-flow-status-bg`, `--tng-flow-status-fg` |

### Connection motion

Use the typed presentation API to activate connection motion. Duration custom properties can tune the three speeds without exposing Foblex class names as public TailNG styling hooks. Under `prefers-reduced-motion: reduce`, Flow Editor removes the animation and dash pattern while keeping the path visibly emphasized.

### Custom node content

Consumer templates are compiled in the application's context, so they can compose any TailNG or application component. Keep the editor-owned node host and ports intact by customizing only the projected body.
