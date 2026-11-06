---
id: "components/flow-execution-graph/overview"
title: "Flow Execution Graph component"
description: "Standalone workflow graph diagram for execution snapshots, node status, selection, and viewport control."
category: "components"
status: "stable"
tags: ["flow-execution-graph","flow","component"]
package: "@tailng-ui/flow"
importPath: "@tailng-ui/flow/execution"
sourcePaths: ["libs/tailng-ui/flow/src/execution/components/graph/tng-flow-execution-graph.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-execution-graph/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/flow/flow-execution-graph/overview"
componentGroup: "flow"
symbols: ["TngFlowExecutionGraphComponent"]
selectors: ["tng-flow-execution-graph"]
productId: "flow-execution-graph"
section: "overview"
officialCatalog: true
generated: true
---

# Flow Execution Graph component

Standalone workflow graph diagram for execution snapshots, node status, selection, and viewport control.

## Package and import

Import the standalone Angular API from `@tailng-ui/flow/execution`:

```ts
import { Component } from '@angular/core';
import { TngFlowExecutionGraphComponent } from '@tailng-ui/flow/execution';

@Component({
  standalone: true,
  imports: [TngFlowExecutionGraphComponent],
  template: `<tng-flow-execution-graph />`,
})
export class FlowExecutionGraphAgentExample {}
```

Load `@tailng-ui/flow/styles.css` once in the application styles in addition to the TailNG theme contract.

## Component family

- `TngFlowExecutionGraphComponent` — selector `tng-flow-execution-graph`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/flow/flow-execution-graph/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/flow-execution-graph/api.md)
- [Styling](https://tailng.dev/ai/components/flow-execution-graph/styling.md)
- [Examples](https://tailng.dev/ai/components/flow-execution-graph/examples.md)
