---
id: "components/flow-workbench/styling"
title: "Flow Workbench styling"
description: "Flow Workbench styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["flow-workbench","flow","styling"]
package: "@tailng-ui/flow"
importPath: "@tailng-ui/flow/execution"
sourcePaths: ["libs/tailng-ui/flow/src/execution/components/workbench/tng-flow-workbench.component.ts","libs/tailng-ui/flow/src/execution/components/inspector/tng-flow-execution-inspector.component.ts","libs/tailng-ui/flow/src/execution/components/payload/tng-flow-execution-payload.component.ts","libs/tailng-ui/flow/src/execution/templates/tng-flow-execution-templates.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-workbench/routes.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-workbench/sections/styling/flow-workbench-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/flow/flow-workbench/sections/styling/flow-workbench-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/flow/flow-workbench/styling"
componentGroup: "flow"
symbols: ["TngFlowExecutionInspectorComponent","TngFlowExecutionInspectorTemplateDirective","TngFlowExecutionPayloadComponent","TngFlowExecutionPayloadTemplateDirective","TngFlowNodePropertiesDataTemplateDirective","TngFlowWorkbenchComponent","TngFlowWorkbenchDetailsTemplateDirective","TngFlowWorkbenchPaletteTemplateDirective"]
selectors: ["tng-flow-execution-inspector","ng-template[tngFlowExecutionInspector]","tng-flow-execution-payload","ng-template[tngFlowExecutionPayload]","ng-template[tngFlowNodePropertiesData]","tng-flow-workbench","ng-template[tngFlowWorkbenchDetails]","ng-template[tngFlowWorkbenchPalette]"]
productId: "flow-workbench"
section: "styling"
officialCatalog: true
generated: true
---

# Flow Workbench styling

## Required styles

Import `@tailng-ui/flow/styles.css` once so the underlying graph, ports, connections, drag previews, palette items, and execution presentation render correctly.

### Layout sizing

Set the host height with `--tng-flow-workbench-height` or regular CSS. The palette, graph, and details panels use fixed minimum sizes so controls and canvas interactions do not collapse in narrow containers.

### Panels

The palette uses `--tng-flow-workbench-palette-width`; details sizing is controlled by `rightDetailsSize`, `bottomDetailsSize`, and `detailsPosition`. In auto mode, details move below the graph when the container is narrow.
