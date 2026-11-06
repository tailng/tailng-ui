---
id: "components/flow-execution-graph/styling"
title: "Flow Execution Graph styling"
description: "Flow Execution Graph styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["flow-execution-graph","flow","styling"]
package: "@tailng-ui/flow"
importPath: "@tailng-ui/flow/execution"
sourcePaths: ["libs/tailng-ui/flow/src/execution/components/graph/tng-flow-execution-graph.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-execution-graph/routes.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-execution-graph/sections/styling/flow-execution-graph-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/flow/flow-execution-graph/sections/styling/flow-execution-graph-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/flow/flow-execution-graph/styling"
componentGroup: "flow"
symbols: ["TngFlowExecutionGraphComponent"]
selectors: ["tng-flow-execution-graph"]
productId: "flow-execution-graph"
section: "styling"
officialCatalog: true
generated: true
---

# Flow Execution Graph styling

## Graph layout

Give the host an explicit height when embedding the standalone graph. The graph fills its container, so dashboard cards, split panes, and modals should own the outer sizing.

### Theme tokens

The execution graph inherits the Flow Editor surface tokens for canvas color, minimap, controls, nodes, ports, selection, and connection styling. Execution state adds status classes for running, succeeded, failed, skipped, and pending graph elements.

### Template styling

Custom node and connection templates are projected into the underlying flow editor. Keep those templates self-contained so they can be reused in both editor and execution graph contexts.
