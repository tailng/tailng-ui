---
id: "components/flow-execution-graph/api"
title: "Flow Execution Graph API"
description: "Flow Execution Graph API reference for Angular applications."
category: "components"
status: "stable"
tags: ["flow-execution-graph","flow","api"]
package: "@tailng-ui/flow"
importPath: "@tailng-ui/flow/execution"
sourcePaths: ["libs/tailng-ui/flow/src/execution/components/graph/tng-flow-execution-graph.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-execution-graph/routes.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-execution-graph/sections/api/flow-execution-graph-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/flow/flow-execution-graph/sections/api/flow-execution-graph-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/flow/flow-execution-graph/api"
componentGroup: "flow"
symbols: ["TngFlowExecutionGraphComponent"]
selectors: ["tng-flow-execution-graph"]
productId: "flow-execution-graph"
section: "api"
officialCatalog: true
generated: true
---

# Flow Execution Graph API

Standalone workflow graph diagram for execution snapshots, node status, selection, and viewport control.

## Flow Execution Graph API

Import `TngFlowExecutionGraphComponent` from `@tailng-ui/flow/execution`. The graph is a controlled execution-aware facade over Flow Editor: pass a workflow definition and run snapshot, then persist emitted selection, viewport, and edit requests in application state.

### Graph inputs

`definition` supplies the workflow topology and `snapshot` supplies runtime execution state. Selection, inspection, selected execution, and viewport are controlled inputs so dashboards can synchronize the graph with inspectors, history panels, and URL state.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `definition` | `TngFlowDefinition<TNodeData, TConnectionData> \| null` | `null` | Workflow nodes, connections, ports, labels, positions, and routing metadata. |
| `snapshot` | `TngFlowRunExecutionSnapshot<TPayload> \| null` | `null` | Run, node, and connection executions used to derive graph status presentation. |
| `selection` | `TngFlowSelection` | `EMPTY_TNG_FLOW_SELECTION` | Controlled node and connection selection. |
| `inspectedNodeId` | `string \| null` | `null` | Node id used by details panels and execution selection resolution. |
| `selectedExecutionId` | `string \| null` | `null` | Selected execution for the inspected node. |
| `viewport` | `TngFlowViewport \| null` | `null` | Optional externally supplied canvas position and scale. |
| `mode` | `'edit' \| 'inspect' \| 'readonly'` | `'inspect'` | Controls graph editing, selection, and activation behavior. |
| `flowId` | `string` | `'tng-flow-execution-graph'` | Stable underlying flow instance id. Use a unique value for multiple graphs. |
| `ariaLabel` | `string` | `'Workflow execution graph'` | Accessible name for the graph surface. |

### Editor options

Execution Graph forwards editor configuration to the underlying Flow Editor. Use these inputs for authoring mode, minimap, command shortcuts, connection routing, keyboard movement, and smart guides without dropping down to the editor component directly.

| Group | Inputs | Purpose |
| --- | --- | --- |
| Surface toggles | `showControls`, `showConnectionTools`, `showBackground`, `showMinimap`, `showSelectionArea`, `fitOnInit`, `fitOnDefinitionChange` | Shows or hides built-in canvas features and controls initial viewport fitting. |
| Connection behavior | `attachmentLayout`, `connectionValidator`, `options`, `connectionOptions`, `connectionCreationPathType`, `connectionAriaLabel` | Configures port strategy, validation, routing defaults, live preview path type, and accessible connection names. |
| Keyboard and commands | `keyboardOptions`, `commandShortcuts`, `canUndo`, `canRedo` | Configures keyboard movement, shortcut interception, and command toolbar state. |
| Layout assistance | `smartGuides`, `snapToGrid`, `gridSize`, `minimapOptions` | Controls alignment guides, snapped movement, grid scale, and minimap behavior. |
| Context menu | `contextMenuEnabled` | Replaces the native graph context menu with controlled context-menu events. |

### Graph outputs

Outputs are proposals or synchronized state changes. The graph does not mutate `definition`, `selection`, or `viewport` internally.

| Group | Outputs | Use |
| --- | --- | --- |
| Controlled state | `selectionChange`, `inspectedNodeIdChange`, `selectedExecutionIdChange`, `viewportChange` | Persist graph state and synchronize external inspectors or history views. |
| Execution activation | `executionActivated` | Emits the activated node and selected execution with source `'graph'`. |
| Node editing | `nodesMoved`, `nodePositionChange`, `nodeCreateRequested`, `nodesDeleteRequested` | Apply node position, creation, and deletion requests to a new definition snapshot. |
| Connection editing | `connectionCreateRequested`, `connectionReconnectRequested`, `connectionRoutingChangeRequested`, `connectionWaypointsChange`, `connectionsDeleteRequested`, `connectionRejected` | Create, reconnect, restyle, adjust, delete, or report rejected connections. |
| Commands and menus | `commandRequested`, `contextMenuRequested` | Integrate graph shortcuts, toolbar actions, and custom context menus. |

### Controlled authoring

In edit mode, apply movement, creation, reconnect, routing, waypoint, and deletion events to a new controlled definition. For `attachmentLayout="custom-points"`, persist generated endpoint ports with `ensureTngFlowCustomPointPorts()` and clean unused endpoints after deletion with `pruneUnusedTngFlowCustomPointPorts()`.

### Template hooks

Execution Graph projects `ng-template[tngFlowNode]`, `ng-template[tngFlowConnection]`, and `ng-template[tngFlowConnectionLabel]` into the underlying editor. The template context is the same as Flow Editor, with execution presentation already merged into the provided view state.

### Imperative helpers

Export the component as `tngFlowExecutionGraph` or query it with `ViewChild` when parent tools need to drive viewport or routing behavior from outside the graph.

| Method | Signature | Description |
| --- | --- | --- |
| `refreshLayout` | `() => void` | Recomputes editor geometry after external layout changes. |
| `fitToScreen` | `(animated?: boolean, padding?: number) => void` | Fits graph content into the visible viewport. |
| `resetViewport` | `(animated?: boolean) => void` | Restores the default viewport. |
| `centerNode` | `(nodeId: string, animated?: boolean) => boolean` | Centers a node and reports whether the node was found. |
| `requestNodeCreate` | `(item: TngFlowPaletteItem<TNodeData>, position?: TngFlowPoint) => void | Starts the same controlled node-create flow used by palette interactions. |
| `requestConnectionRoutingChange` | `(type: TngFlowConnectionPathType) => boolean` | Requests a routing style update for selected existing connections. |

## Source-derived public Angular API

### `TngFlowExecutionGraphComponent` — `tng-flow-execution-graph`

- Inputs: `ariaLabel`, `attachmentLayout`, `canRedo`, `canUndo`, `commandShortcuts`, `connectionAriaLabel`, `connectionOptions`, `connectionValidator`, `contextMenuEnabled`, `definition`, `fitOnDefinitionChange`, `fitOnInit`, `flowId`, `gridSize`, `inspectedNodeId`, `keyboardOptions`, `minimapOptions`, `mode`, `options`, `selectedExecutionId`, `selection`, `showBackground`, `showConnectionTools`, `showControls`, `showMinimap`, `showSelectionArea`, `smartGuides`, `snapshot`, `snapToGrid`, `viewport`
- Two-way models: `connectionCreationPathType`
- Outputs: `commandRequested`, `connectionCreateRequested`, `connectionReconnectRequested`, `connectionRejected`, `connectionRoutingChangeRequested`, `connectionsDeleteRequested`, `connectionWaypointsChange`, `contextMenuRequested`, `executionActivated`, `inspectedNodeIdChange`, `nodeCreateRequested`, `nodePositionChange`, `nodesDeleteRequested`, `nodesMoved`, `selectedExecutionIdChange`, `selectionChange`, `viewportChange`
