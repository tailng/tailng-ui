---
id: "components/flow-workbench/overview"
title: "Flow Workbench component"
description: "Ready-made flow shell with create, edit, view, inspect, and live modes plus optional palette and details panels."
category: "components"
status: "stable"
tags: ["flow-workbench","flow","component"]
package: "@tailng-ui/flow"
importPath: "@tailng-ui/flow/execution"
sourcePaths: ["libs/tailng-ui/flow/src/execution/components/workbench/tng-flow-workbench.component.ts","libs/tailng-ui/flow/src/execution/components/inspector/tng-flow-execution-inspector.component.ts","libs/tailng-ui/flow/src/execution/components/payload/tng-flow-execution-payload.component.ts","libs/tailng-ui/flow/src/execution/templates/tng-flow-execution-templates.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-workbench/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/flow/flow-workbench/overview"
componentGroup: "flow"
symbols: ["TngFlowExecutionInspectorComponent","TngFlowExecutionInspectorTemplateDirective","TngFlowExecutionPayloadComponent","TngFlowExecutionPayloadTemplateDirective","TngFlowNodePropertiesDataTemplateDirective","TngFlowWorkbenchComponent","TngFlowWorkbenchDetailsTemplateDirective","TngFlowWorkbenchPaletteTemplateDirective"]
selectors: ["tng-flow-execution-inspector","ng-template[tngFlowExecutionInspector]","tng-flow-execution-payload","ng-template[tngFlowExecutionPayload]","ng-template[tngFlowNodePropertiesData]","tng-flow-workbench","ng-template[tngFlowWorkbenchDetails]","ng-template[tngFlowWorkbenchPalette]"]
productId: "flow-workbench"
section: "overview"
officialCatalog: true
generated: true
---

# Flow Workbench component

Ready-made flow shell with create, edit, view, inspect, and live modes plus optional palette and details panels.

## Package and import

Import the standalone Angular API from `@tailng-ui/flow/execution`:

```ts
import { Component } from '@angular/core';
import { TngFlowWorkbenchComponent } from '@tailng-ui/flow/execution';

@Component({
  standalone: true,
  imports: [TngFlowWorkbenchComponent],
  template: `<tng-flow-workbench />`,
})
export class FlowWorkbenchAgentExample {}
```

Load `@tailng-ui/flow/styles.css` once in the application styles in addition to the TailNG theme contract.

## Component family

- `TngFlowExecutionInspectorComponent` — selector `tng-flow-execution-inspector`
- `TngFlowExecutionInspectorTemplateDirective` — selector `ng-template[tngFlowExecutionInspector]`
- `TngFlowExecutionPayloadComponent` — selector `tng-flow-execution-payload`
- `TngFlowExecutionPayloadTemplateDirective` — selector `ng-template[tngFlowExecutionPayload]`
- `TngFlowNodePropertiesDataTemplateDirective` — selector `ng-template[tngFlowNodePropertiesData]`
- `TngFlowWorkbenchComponent` — selector `tng-flow-workbench`
- `TngFlowWorkbenchDetailsTemplateDirective` — selector `ng-template[tngFlowWorkbenchDetails]`
- `TngFlowWorkbenchPaletteTemplateDirective` — selector `ng-template[tngFlowWorkbenchPalette]`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/flow/flow-workbench/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/flow-workbench/api.md)
- [Styling](https://tailng.dev/ai/components/flow-workbench/styling.md)
- [Examples](https://tailng.dev/ai/components/flow-workbench/examples.md)
