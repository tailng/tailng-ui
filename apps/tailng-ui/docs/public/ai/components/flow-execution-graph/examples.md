---
id: "components/flow-execution-graph/examples"
title: "Flow Execution Graph examples"
description: "Flow Execution Graph examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["flow-execution-graph","flow","examples"]
package: "@tailng-ui/flow"
importPath: "@tailng-ui/flow/execution"
sourcePaths: ["libs/tailng-ui/flow/src/execution/components/graph/tng-flow-execution-graph.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-execution-graph/routes.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-execution-graph/sections/examples/flow-execution-graph-example-code.data.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-execution-graph/sections/examples/flow-execution-graph-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/flow/flow-execution-graph/sections/examples/flow-execution-graph-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/flow/flow-execution-graph/sections/examples/flow-execution-graph-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/flow/flow-execution-graph/examples"
componentGroup: "flow"
symbols: ["TngFlowExecutionGraphComponent"]
selectors: ["tng-flow-execution-graph"]
productId: "flow-execution-graph"
section: "examples"
officialCatalog: true
generated: true
---

# Flow Execution Graph examples

## Examples

Standalone execution graphs for every planned run state, with copy-ready Plain CSS and Tailwind CSS variants.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngFlowExecutionGraphComponent } from '@tailng-ui/flow/execution';

@Component({
  standalone: true,
  imports: [TngFlowExecutionGraphComponent],
  template: `<tng-flow-execution-graph />`,
})
export class FlowExecutionGraphExample {}
```
