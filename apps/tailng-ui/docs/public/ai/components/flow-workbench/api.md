---
id: "components/flow-workbench/api"
title: "Flow Workbench API"
description: "Flow Workbench API reference for Angular applications."
category: "components"
status: "stable"
tags: ["flow-workbench","flow","api"]
package: "@tailng-ui/flow"
importPath: "@tailng-ui/flow/execution"
sourcePaths: ["libs/tailng-ui/flow/src/execution/components/workbench/tng-flow-workbench.component.ts","libs/tailng-ui/flow/src/execution/components/inspector/tng-flow-execution-inspector.component.ts","libs/tailng-ui/flow/src/execution/components/payload/tng-flow-execution-payload.component.ts","libs/tailng-ui/flow/src/execution/templates/tng-flow-execution-templates.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-workbench/routes.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-workbench/sections/api/flow-workbench-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/flow/flow-workbench/sections/api/flow-workbench-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/flow/flow-workbench/api"
componentGroup: "flow"
symbols: ["TngFlowExecutionInspectorComponent","TngFlowExecutionInspectorTemplateDirective","TngFlowExecutionPayloadComponent","TngFlowExecutionPayloadTemplateDirective","TngFlowNodePropertiesDataTemplateDirective","TngFlowWorkbenchComponent","TngFlowWorkbenchDetailsTemplateDirective","TngFlowWorkbenchPaletteTemplateDirective"]
selectors: ["tng-flow-execution-inspector","ng-template[tngFlowExecutionInspector]","tng-flow-execution-payload","ng-template[tngFlowExecutionPayload]","ng-template[tngFlowNodePropertiesData]","tng-flow-workbench","ng-template[tngFlowWorkbenchDetails]","ng-template[tngFlowWorkbenchPalette]"]
productId: "flow-workbench"
section: "api"
officialCatalog: true
generated: true
---

# Flow Workbench API

Ready-made flow shell with create, edit, view, inspect, and live modes plus optional palette and details panels.

## Workbench inputs

Pass `definition` for every mode and `snapshot` when execution state is available. Use `mode`, `paletteItems`, `detailsKind`, `detailsPosition`, `selection`, and `viewport` to control the shell.

### Workbench outputs

The workbench forwards controlled graph events for nodes, connections, selection, viewport, and command requests. It also emits `paletteOpenChange`, `detailsOpenChange`, and execution activation events from graph or history interactions.

### Template hooks

Use `ng-template[tngFlowWorkbenchPalette]` to replace the left panel and `ng-template[tngFlowWorkbenchDetails]` to replace the details panel. Existing execution payload, execution inspector, node properties data, node, and connection templates continue to work inside the composed shell.

## Source-derived public Angular API

### `TngFlowExecutionInspectorComponent` — `tng-flow-execution-inspector`

- Inputs: `dateTimeFormatter`, `definition`, `inspectedNodeId`, `scope`, `selectedExecutionId`, `snapshot`
- Outputs: `executionActivated`, `selectedExecutionIdChange`

### `TngFlowExecutionPayloadComponent` — `tng-flow-execution-payload`

- Inputs: `copy`, `maxHeight`, `payload`, `title`

### `TngFlowWorkbenchComponent` — `tng-flow-workbench`

- Inputs: `ariaLabel`, `attachmentLayout`, `bottomDetailsSize`, `canRedo`, `canUndo`, `canvasMode`, `commandShortcuts`, `connectionAriaLabel`, `connectionOptions`, `connectionValidator`, `contextMenuEnabled`, `dateTimeFormatter`, `definition`, `detailsBreakpoint`, `detailsKind`, `detailsMinSize`, `detailsOpen`, `detailsPosition`, `detailsScope`, `fitOnDefinitionChange`, `fitOnInit`, `flowId`, `graphMinSize`, `gridSize`, `inspectedNodeId`, `keyboardOptions`, `minimapOptions`, `mode`, `options`, `paletteAriaLabel`, `paletteItems`, `paletteMinSize`, `paletteOpen`, `paletteWidth`, `rightDetailsSize`, `selectedExecutionId`, `selection`, `showBackground`, `showConnectionTools`, `showControls`, `showDetails`, `showDetailsToggle`, `showMinimap`, `showPalette`, `showPaletteToggle`, `showSelectionArea`, `smartGuides`, `snapshot`, `snapToGrid`, `state`, `stateMessage`, `viewport`
- Two-way models: `connectionCreationPathType`
- Outputs: `commandRequested`, `connectionCreateRequested`, `connectionReconnectRequested`, `connectionRejected`, `connectionRoutingChangeRequested`, `connectionsDeleteRequested`, `connectionWaypointsChange`, `contextMenuRequested`, `detailsOpenChange`, `executionActivated`, `inspectedNodeIdChange`, `nodeCreateRequested`, `nodePositionChange`, `nodesDeleteRequested`, `nodesMoved`, `paletteOpenChange`, `selectedExecutionIdChange`, `selectionChange`, `viewportChange`

### Structural surfaces

These APIs provide composition or projection surfaces without their own bindable signal API:

- `TngFlowExecutionInspectorTemplateDirective` — `ng-template[tngFlowExecutionInspector]`
- `TngFlowExecutionPayloadTemplateDirective` — `ng-template[tngFlowExecutionPayload]`
- `TngFlowNodePropertiesDataTemplateDirective` — `ng-template[tngFlowNodePropertiesData]`
- `TngFlowWorkbenchDetailsTemplateDirective` — `ng-template[tngFlowWorkbenchDetails]`
- `TngFlowWorkbenchPaletteTemplateDirective` — `ng-template[tngFlowWorkbenchPalette]`
