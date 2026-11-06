---
id: "components/flow-editor/overview"
title: "Flow Editor component"
description: "Embeddable, controlled node editor for AI agents, automations, and executable workflows."
category: "components"
status: "stable"
tags: ["flow-editor","flow","component"]
package: "@tailng-ui/flow"
importPath: "@tailng-ui/flow"
sourcePaths: ["libs/tailng-ui/flow/src/lib/connection-template/tng-flow-connection-template.directive.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-connection-marker-diamond.directive.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-editor.component.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-foblex-bridge.directive.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-keyboard-config.ts","libs/tailng-ui/flow/src/lib/node/tng-flow-node.component.ts","libs/tailng-ui/flow/src/lib/node-template/tng-flow-node-template.directive.ts","libs/tailng-ui/flow/src/lib/node-palette/tng-flow-node-palette.component.ts","libs/tailng-ui/flow/src/lib/palette-item/tng-flow-palette-item.directive.ts","libs/tailng-ui/flow/src/lib/port/tng-flow-port.component.ts","libs/tailng-ui/flow/src/lib/validation-badge/tng-flow-validation-badge.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/flow/flow-editor/overview"
componentGroup: "flow"
symbols: ["TngFlowConnectionMarkerDiamondDirective","TngFlowConnectionTemplateDirective","TngFlowEditorComponent","TngFlowFoblexBridgeDirective","TngFlowNodeComponent","TngFlowNodePaletteComponent","TngFlowNodeTemplateDirective","TngFlowPaletteItemDirective","TngFlowPortComponent","TngFlowValidationBadgeComponent"]
selectors: ["f-connection-marker-circle[tngFlowConnectionMarkerDiamond]","ng-template[tngFlowConnection], ng-template[tngFlowConnectionLabel]","tng-flow-editor","[tngFlowFoblexBridge]","tng-flow-node","tng-flow-node-palette","ng-template[tngFlowNode]","[tngFlowPaletteItem]","tng-flow-port","tng-flow-validation-badge"]
productId: "flow-editor"
section: "overview"
officialCatalog: true
generated: true
---

# Flow Editor component

Embeddable, controlled node editor for AI agents, automations, and executable workflows.

## Package and import

Import the standalone Angular API from `@tailng-ui/flow`:

```ts
import { Component } from '@angular/core';
import { TngFlowEditorComponent } from '@tailng-ui/flow';

@Component({
  standalone: true,
  imports: [TngFlowEditorComponent],
  template: `<tng-flow-editor />`,
})
export class FlowEditorAgentExample {}
```

Load `@tailng-ui/flow/styles.css` once in the application styles in addition to the TailNG theme contract.

## Component family

- `TngFlowConnectionMarkerDiamondDirective` — selector `f-connection-marker-circle[tngFlowConnectionMarkerDiamond]`
- `TngFlowConnectionTemplateDirective` — selector `ng-template[tngFlowConnection], ng-template[tngFlowConnectionLabel]`
- `TngFlowEditorComponent` — selector `tng-flow-editor`
- `TngFlowFoblexBridgeDirective` — selector `[tngFlowFoblexBridge]`
- `TngFlowNodeComponent` — selector `tng-flow-node`
- `TngFlowNodePaletteComponent` — selector `tng-flow-node-palette`
- `TngFlowNodeTemplateDirective` — selector `ng-template[tngFlowNode]`
- `TngFlowPaletteItemDirective` — selector `[tngFlowPaletteItem]`
- `TngFlowPortComponent` — selector `tng-flow-port`
- `TngFlowValidationBadgeComponent` — selector `tng-flow-validation-badge`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/flow/flow-editor/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/flow-editor/api.md)
- [Styling](https://tailng.dev/ai/components/flow-editor/styling.md)
- [Examples](https://tailng.dev/ai/components/flow-editor/examples.md)
