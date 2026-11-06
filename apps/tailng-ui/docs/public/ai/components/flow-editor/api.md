---
id: "components/flow-editor/api"
title: "Flow Editor API"
description: "Flow Editor API reference for Angular applications."
category: "components"
status: "stable"
tags: ["flow-editor","flow","api"]
package: "@tailng-ui/flow"
importPath: "@tailng-ui/flow"
sourcePaths: ["libs/tailng-ui/flow/src/lib/connection-template/tng-flow-connection-template.directive.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-connection-marker-diamond.directive.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-editor.component.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-foblex-bridge.directive.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-keyboard-config.ts","libs/tailng-ui/flow/src/lib/node/tng-flow-node.component.ts","libs/tailng-ui/flow/src/lib/node-template/tng-flow-node-template.directive.ts","libs/tailng-ui/flow/src/lib/node-palette/tng-flow-node-palette.component.ts","libs/tailng-ui/flow/src/lib/palette-item/tng-flow-palette-item.directive.ts","libs/tailng-ui/flow/src/lib/port/tng-flow-port.component.ts","libs/tailng-ui/flow/src/lib/validation-badge/tng-flow-validation-badge.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/routes.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/api/flow-editor-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/api/flow-editor-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/flow/flow-editor/api"
componentGroup: "flow"
symbols: ["TngFlowConnectionMarkerDiamondDirective","TngFlowConnectionTemplateDirective","TngFlowEditorComponent","TngFlowFoblexBridgeDirective","TngFlowNodeComponent","TngFlowNodePaletteComponent","TngFlowNodeTemplateDirective","TngFlowPaletteItemDirective","TngFlowPortComponent","TngFlowValidationBadgeComponent"]
selectors: ["f-connection-marker-circle[tngFlowConnectionMarkerDiamond]","ng-template[tngFlowConnection], ng-template[tngFlowConnectionLabel]","tng-flow-editor","[tngFlowFoblexBridge]","tng-flow-node","tng-flow-node-palette","ng-template[tngFlowNode]","[tngFlowPaletteItem]","tng-flow-port","tng-flow-validation-badge"]
productId: "flow-editor"
section: "api"
officialCatalog: true
generated: true
---

# Flow Editor API

Embeddable, controlled node editor for AI agents, automations, and executable workflows.

## Flow Editor API

Import the editor, template directives, graph types, event types, and validation helper from `@tailng-ui/flow`.

### Editor inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `definition` | `TngFlowDefinition<TData, TConnectionData>` | `null` | Controlled JSON workflow snapshot. Takes precedence over separate node and connection inputs. |
| `nodes` | `readonly TngFlowNode<TData>[]` | `null` | Controlled node records for the separate-input form. |
| `connections` | `readonly TngFlowConnection[]` | `[]` | Controlled connector-to-connector edges. |
| `presentation` | `TngFlowPresentation<TStatus>` | `` | Controlled runtime status and visual emphasis for nodes and connections. |
| `validation` | `TngFlowValidation` | `EMPTY_TNG_FLOW_VALIDATION` | Controlled application issues merged with TailNG structural issues. |
| `nodeViews` | `TngFlowNodeViews<TStatus>` | `` | Deprecated compatibility input. Use `presentation.nodes`. |
| `mode` | `'edit' \| 'inspect' \| 'readonly'` | `'edit'` | Controls selection and graph editing permissions while preserving pan and zoom. |
| `selection` | `TngFlowSelection` | empty sets | Controlled node and connection selection owned by the consuming application. |
| `viewport` | `TngFlowViewport \| null` | `null` | Optional externally supplied canvas position and scale. |
| `connectionValidator` | `TngFlowConnectionValidator \| null` | `null` | Runs after built-in connection validation for application-specific rules. |
| `options` | `TngFlowEditorOptions \| null` | `null` | Configures editor-level routing, marker and label defaults, global connection selection and reassignment gates, waypoint editing, and motion preference. Per-connection values take precedence. |
| `connectionOptions` | `TngFlowEditorConnectionOptions \| null` | `null` | Focused compatibility input for the same connection options. Values supplied here take precedence over matching fields in `options`. |
| `connectionCreationPathType` | `TngFlowConnectionPathType \| null` | `null` | Two-way model for the path used by the live connection preview and newly requested connections. Null resolves from the configured connection default, then Bézier. |
| `connectionAriaLabel` | `TngFlowConnectionAriaLabelFactory \| null` | `null` | Optional accessible-name factory receiving the connection, endpoint descriptions, and resolved presentation state. |
| `keyboardOptions` | `TngFlowKeyboardOptions \| null` | `null` | Overrides normal and coarse canvas movement steps and the keys that enter connection authoring. Defaults resolve from the active grid policy and `['c']`. |
| `smartGuides` | `TngFlowSmartGuidesOptions \| null` | `null` | Opts into magnetic alignment and spacing guides. Thresholds are screen pixels and `disableModifier` suppresses guides for the complete drag that starts with that modifier pressed. |
| `commandShortcuts` | `boolean \| readonly TngFlowEditorCommand[]` | `false` | Opts into all mode-allowed command shortcuts or an explicit allow-list. This affects keyboard interception only; direct `requestCommand()` calls still follow the active mode. |
| `contextMenuEnabled` | `boolean` | `false` | Replaces the native graph context menu with controlled `contextMenuRequested` events in edit and inspect modes. |
| `ariaLabel` | `string` | `'Workflow editor'` | Accessible name for the editor surface. |
| `flowId` | `string` | `'tng-flow-editor'` | Stable Foblex flow instance id. Set a unique value for multiple editors. |
| `fitOnInit` | `boolean` | `true` | Fits the first non-empty node collection into the viewport. |
| `showBackground`, `showControls`, `showSelectionArea` | `boolean` | `true` | Controls the built-in grid, viewport toolbar, and marquee selection surface. |
| `showConnectionTools` | `boolean` | `true` | Shows the edit-mode toolbar with five future-connection styles and disabled Undo/Redo placeholders. |
| `showMinimap` | `boolean` | `false` | Shows the themed workflow overview. When interactive, hovering temporarily previews a position and leaving restores the canvas; clicking commits the previewed position. |
| `minimapOptions` | `TngFlowMinimapOptions \| null` | `null` | Configures position, dimensions, minimum overview size, node render limit, interactivity, and accessible label. |
| `snapToGrid` | `boolean` | `false` | Snaps node movement to `gridSize`. Multi-node keyboard movement applies one shared snapped delta so relative geometry is preserved. |
| `gridSize` | `number` | `16` | Base horizontal and vertical grid cell size in pixels. Controls the snap interval and the base dotted-background spacing. |
| `backgroundGridMode` | `TngFlowBackgroundGridMode` | `'canvas'` | `'canvas'` displays every base-grid point. `'adaptive'` displays a fixed on-screen dot density while zooming in or out without changing the `gridSize` snap interval. |
| `zoomMinimum`, `zoomMaximum`, `zoomStep` | `number` | `0.35`, `2`, `0.15` | Viewport zoom limits and button/wheel increment. |

### Editor outputs

| Name | Payload | When it emits |
| --- | --- | --- |
| `nodesMoved` | `TngFlowNodesMovedEvent` | After one or more selected nodes finish moving. |
| `nodePositionChange` | `TngFlowNodePositionChange` | Once per moved node, with its previous and new positions. |
| `nodeCreateRequested` | `TngFlowNodeCreateRequest<TData>` | After a typed palette drop, keyboard activation, or API creation request. |
| `connectionCreateRequested` | `TngFlowConnectionCreateRequest` | After a connection candidate passes validation, including the resolved routing chosen for the new connection. |
| `connectionCreationPathTypeChange` | `TngFlowConnectionPathType \| null` | When the user chooses a future-connection style from the canvas toolbar. |
| `connectionReconnectRequested` | `TngFlowConnectionReconnectRequest` | After a reassigned endpoint produces a valid complete connection. |
| `connectionRoutingChangeRequested` | `TngFlowConnectionRoutingChangeRequest` | When the imperative API requests a controlled style change for selected connections. |
| `connectionWaypointsChange` | `TngFlowConnectionWaypointsChange` | Once after an enabled waypoint add, move, or remove interaction commits in edit mode. The application writes the returned points into a new definition snapshot. |
| `connectionsDeleteRequested` | `TngFlowConnectionsDeleteRequest` | When editable selected connections are requested for deletion. |
| `nodesDeleteRequested` | `TngFlowNodesDeleteRequest` | When unlocked selected nodes are requested for deletion. |
| `nodesArrangementRequested` | `TngFlowNodesArrangementRequest` | Once after a successful selected-node alignment or distribution request. Contains position-only moves and never mutates the controlled graph. |
| `selectionChange` | `TngFlowSelection` | When the user requests a different controlled selection. |
| `commandRequested` | `TngFlowEditorCommandRequest` | After an enabled shortcut or successful `requestCommand()` call. The application owns history, clipboard data, validation, ids, and mutation. |
| `contextMenuRequested` | `TngFlowContextMenuRequest` | After an enabled pointer or keyboard context request, with target, source, client and canvas coordinates, and the proposed controlled selection. |
| `connectionRejected` | `TngFlowConnectionRejectedEvent` | When a drop targets a known port but connection validation fails. |
| `nodeActivated` | `TngFlowNodeActivatedEvent` | On node double-click, Enter activation, or the public activation API. |
| `connectionActivated` | `TngFlowConnectionActivatedEvent` | On connection double-click, Enter activation, or the public activation API. |
| `validationIssueActivated` | `TngFlowValidationIssueActivatedEvent` | When a rendered issue marker is selected or activated through the API. |
| `viewportChange` | `TngFlowViewport` | When canvas position or scale changes. |
| `viewportChanged` (deprecated) | `TngFlowViewportChangedEvent` | Compatibility alias for `viewportChange`. |
| `ready` | `void` | After the flow completes its first full render. |

Foblex gesture callbacks may run outside Angular's zone. Flow Editor re-enters the zone before every public output is emitted.

### Graph models

| Type | Required fields | Optional behavior |
| --- | --- | --- |
| `TngFlowDefinition<TNodeData, TConnectionData>` | `id`, `nodes`, `connections` | Optional workflow name and typed node/connection data. |
| `TngFlowNode<TData>` | `id`, `type`, `name`, `position` | `data`, description, icon, disabled or locked state, and directed ports. |
| `TngFlowPort` | `id`, `direction`, `kind` | Name/label, data type, required state, disabled state, multiplicity, and explicit self-connection policy. Use `side` to place a port on the `top`, `right`, `bottom`, or `left` border. Inputs default to `left` and outputs to `right`. Port ids are scoped to their owning node. |
| `TngFlowConnection` | `id`, `source`, `target` | Source and target are `TngFlowEndpoint` values containing `nodeId` and `portId`. Connections also support `label`, `description`, typed data, disabled, reassignable, selectable, persisted `routing`, source and target markers, and label placement. The legacy renderer-named `type` property is deprecated. |
| `TngFlowPresentation<TStatus>` | none | Runtime status, progress, messages, highlights, dimming, and connection motion. |
| `TngFlowConnectionPresentation` | none | Status, message and emphasis plus flow or pulse motion, speed, and direction. This state is never persisted into the graph connection. |
| `TngFlowValidation` | `issues` | Generic errors, warnings, and information with a discriminated flow, node, port, or connection target. |
| `TngFlowPaletteItem<TData>` | `id`, `type`, `name` | Catalog metadata and optional node data. Its id is not a workflow node id. |
| `TngFlowNodeCreateRequest<TData>` | `item`, `position`, `source` | Controlled request using a top-left canvas position. |
| `TngFlowNodeBounds` | `id`, `position`, `size` | Measured unscaled canvas geometry accepted by the pure alignment and distribution utilities. Optional disabled and locked flags control participation. |

Built-in statuses include idle, queued, running, waiting, completed, failed, paused, retrying, skipped, cancelled, and awaiting-input. Supply a custom string union through the editor's `TStatus` generic when your runtime needs additional states.

`TngFlowPortComponent` is the reusable visual port shell used by the editor. Foblex connector directives remain private to `TngFlowEditorComponent`.

### Connection routing

Persist path geometry in `connection.routing`. A connection override wins over `options.defaultConnection`, which wins over TailNG's compatibility default. Existing definitions remain Bézier unless an application opts into another default.

| Path | Behavior |
| --- | --- |
| `straight` | Direct source-to-target line. |
| `bezier` | Smooth cubic curve and the backward-compatible default. |
| `orthogonal` | Horizontal and vertical segments with square corners. |
| `orthogonal-rounded` | Horizontal and vertical segments using the configured corner radius. |
| `adaptive` | A side-aware curve that adapts its control points to endpoint direction. |

`offset` and `radius` are non-negative canvas values. `waypoints` are canvas coordinates. Set `connectionWaypointsEnabled: true` to show editing handles on selected connections in edit mode; inspect and readonly modes only render the saved route.

### Connection motion

Set connection motion through `presentation.connections`. Motion changes only the SVG path presentation, so straight, Bézier, segmented, and adaptive connections retain their existing geometry. Multiple connections can animate at the same time.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `motion` | `'none' \| 'flow' \| 'pulse'` | `'none'` | `flow` shows a directional travelling dash. `pulse` emphasizes a waiting or retrying route without implying direction. |
| `motionSpeed` | `'slow' \| 'normal' \| 'fast'` | `'normal'` | Selects the duration token used by flowing motion. |
| `motionDirection` | `'forward' \| 'reverse'` | `'forward'` | Moves from source to target or in the reverse visual direction. |
| `animated` (deprecated) | `boolean` | `false` | Compatibility alias for `motion: 'flow'`. An explicit `motion` value takes precedence. |

`options.motionPreference` accepts `system`, `enabled`, or `disabled`. Reduced motion preserves a static emphasized path, so execution state remains visible without movement.

### Node template context

Add `<ng-template tngFlowNode="node-type">` as editor content. The template replaces only the node body; Flow Editor retains node geometry, drag handling, connectors, selection, and accessibility.

| Context value | Type | Description |
| --- | --- | --- |
| `$implicit` / `node` | `TngFlowNode<TData>` | Current domain node. |
| `view` | `TngFlowResolvedNodeView<TStatus>` | Resolved structural, controlled selection, presentation, and validation state. |
| `issues` | `readonly TngFlowValidationIssue[]` | Indexed validation issues targeting this node. |
| `mode` | `TngFlowEditorMode` | The current edit, inspect, or readonly mode. |
| `readonly` | `boolean` | Deprecated convenience value equivalent to `mode !== 'edit'`. |
| `selected` | `boolean` | Current transient selection state. |

### Connection labels and template context

A connection with `label` receives a default, visually truncated path label while retaining its complete accessible name. `description` supplies additional accessible and hover context. Add `<ng-template tngFlowConnectionLabel>` to replace only the default label content. The earlier `tngFlowConnection` spelling remains supported. Flow Editor retains the path, true-path midpoint shell, validation badge, selection, reassignment, and accessibility behavior.

| Context value | Type | Description |
| --- | --- | --- |
| `$implicit` / `connection` | `TngFlowConnection<TConnectionData>` | Current application-owned connection record. |
| `view` | `TngFlowResolvedConnectionView` | Resolved runtime, presentation, selection, and validation state. |
| `issues` | `readonly TngFlowValidationIssue[]` | Indexed validation issues targeting this connection. |
| `mode` | `TngFlowEditorMode` | The current edit, inspect, or readonly mode. |
| `selected` | `boolean` | Current controlled selection state. |

The first connection-template contract deliberately omits `midpoint`. Foblex positions the editor-owned shell at the configured start, center, or end position along the true path for adaptive, Bézier, orthogonal, and straight connections.

### Palette items

Apply `[tngFlowPaletteItem]` to a native button to make a typed catalog item draggable. Bind `(tngFlowPaletteItemActivate)` to `editor.requestNodeCreate(...)` for click and keyboard placement at the visible viewport center.

The directive and editor exchange a private payload. Foblex external-item data is not part of the TailNG public contract.

### Imperative methods

| Method | Description |
| --- | --- |
| `fitToScreen(animated = true)` | Fits all rendered nodes into the viewport. |
| `resetViewport(animated = true)` | Resets scale and centers the flow. |
| `centerNode(nodeId, animated = true)` | Centers a node by id and returns whether it exists. |
| `revealTarget(target, options?)` | Centers a validation target and optionally requests controlled selection. |
| `activateNode(nodeId)` / `activateConnection(connectionId)` | Emits a generic API activation event when allowed by the current mode. |
| `activateValidationIssue(issueId)` | Reveals and emits a known validation issue by stable id. |
| `zoomBy(delta)` | Changes scale while respecting zoom limits. |
| `zoomIn()` / `zoomOut()` | Changes scale by the configured zoom step. |
| `screenToCanvas(point)` | Converts client-screen coordinates into the current canvas coordinate system. |
| `requestNodeCreate(item, position?, source?)` | Emits a controlled creation request, using viewport center when position is omitted. |
| `requestCommand(command, source?, canvasPosition?)` | Emits a mode-allowed controlled command request and returns whether it was accepted. Paste and duplicate use the last pointer position or viewport centre when an explicit canvas position is omitted. |
| `requestNodeAlignment(alignment, options?, source?)` | Measures selected rendered nodes and emits one controlled alignment request in edit mode. Returns whether the request was accepted. |
| `requestNodeDistribution(axis, options?, source?)` | Measures selected rendered nodes and emits one controlled equal-gap distribution request in edit mode. Returns whether the request was accepted. |

Access these through `#editor="tngFlowEditor"` or `viewChild()`.

### Alignment, distribution, and smart guides

`alignTngFlowNodes(bounds, alignment, options?)` and `distributeTngFlowNodes(bounds, axis, options?)` are renderer-neutral pure utilities. They accept measured, unscaled bounds and return stable position-only moves without changing the input records. Disabled nodes are ignored; locked nodes are fixed anchors by default or can be excluded with `lockedNodes: 'ignore'`.

Distribution uses equal edge-to-edge gaps for mixed-size nodes. Grid snapping is applied last, so it deterministically wins when an exact guide or computed gap does not fall on the grid. Editor smart-guide thresholds are specified in CSS-screen pixels and converted for the current canvas scale, keeping the magnetic distance consistent at every zoom level.

Smart guides are disabled by default and render only in edit mode. A configured suppression modifier is sampled on the initiating pointer down for the entire drag. Locked nodes remain selectable TailNG anchors but are excluded from Foblex's movable selection.

### Commands and context menus

Command requests carry the current controlled selection and an optional canvas anchor. Copy is available in edit and inspect modes; undo, redo, cut, paste, and duplicate are edit-only. TailNG never reads or writes clipboard payloads and does not maintain history.

Context-menu targets distinguish canvas, node, connection, and port requests. Pointer requests expose browser `clientPosition` coordinates for overlay placement and transformed `canvasPosition` coordinates for graph actions. Keyboard requests use the active graph element's visual centre or the viewport centre.

For an unselected selectable node or connection, `selectionChange` emits first in the same interaction turn. `contextMenuRequested` then carries that proposed selection even before the application writes it back.

### Validation

Supply application issues through `validation`. Read `editor.resolvedValidation()` for application and structural issues together, or call `validateTngFlowDefinition(definition)` before persistence or execution.

## Source-derived public Angular API

### `TngFlowEditorComponent` — `tng-flow-editor`

- Inputs: `ariaLabel`, `attachmentLayout`, `backgroundGridMode`, `canRedo`, `canUndo`, `commandShortcuts`, `connectionAriaLabel`, `connectionAriaLabelFactory`, `connectionOptions`, `connections`, `connectionValidator`, `contextMenuEnabled`, `definition`, `fitOnDefinitionChange`, `fitOnInit`, `flowId`, `gridSize`, `keyboardOptions`, `layoutEngine`, `minimapOptions`, `mode`, `nodes`, `nodeViews`, `options`, `presentation`, `progressDisplayMode`, `selection`, `showBackground`, `showConnectionTools`, `showControls`, `showMinimap`, `showSelectionArea`, `smartGuides`, `snapToGrid`, `validation`, `viewport`, `zoomMaximum`, `zoomMinimum`, `zoomStep`
- Two-way models: `connectionCreationPathType`
- Outputs: `commandRequested`, `connectionActivated`, `connectionCreated`, `connectionCreateRequested`, `connectionReassigned`, `connectionReconnectRequested`, `connectionRejected`, `connectionRoutingChangeRequested`, `connectionsDeleteRequested`, `connectionWaypointsChange`, `contextMenuRequested`, `deleteRequested`, `nodeActivated`, `nodeCreateRequested`, `nodePositionChange`, `nodesArrangementRequested`, `nodesDeleteRequested`, `nodesLayoutRequested`, `nodesMoved`, `ready`, `selectionChange`, `selectionChanged`, `validationIssueActivated`, `viewportChange`, `viewportChanged`

### `TngFlowNodeComponent` — `tng-flow-node`

- Inputs: `description`, `disabled`, `icon`, `invalid`, `locked`, `message`, `name`, `progress`, `progressDisplayMode`, `progressSpecified`, `selected`, `status`, `statusMessage`, `validationIssues`, `validationSeverity`
- Required inputs: `name`
- Outputs: `issueActivated`

### `TngFlowNodePaletteComponent` — `tng-flow-node-palette`

- Inputs: `ariaLabel`, `disabled`, `emptyMessage`, `items`
- Outputs: `itemActivated`

### `TngFlowNodeTemplateDirective` — `ng-template[tngFlowNode]`

- Inputs: `nodeType`
- Required inputs: `nodeType`

### `TngFlowPaletteItemDirective` — `[tngFlowPaletteItem]`

- Inputs: `tngFlowPaletteItem`, `tngFlowPaletteItemDisabled`, `tngFlowPaletteItemPreviewMatchSize`
- Required inputs: `tngFlowPaletteItem`
- Two-way models: `tngFlowPaletteItemPlaceholder`, `tngFlowPaletteItemPreview`
- Outputs: `tngFlowPaletteItemActivate`

### `TngFlowPortComponent` — `tng-flow-port`

- Inputs: `direction`, `disabled`, `kind`, `label`, `required`, `side`, `validationIssues`, `validationSeverity`
- Required inputs: `direction`
- Outputs: `issueActivated`

### `TngFlowValidationBadgeComponent` — `tng-flow-validation-badge`

- Inputs: `issues`, `severity`
- Required inputs: `issues`
- Outputs: `issueActivated`

### Structural surfaces

These APIs provide composition or projection surfaces without their own bindable signal API:

- `TngFlowConnectionMarkerDiamondDirective` — `f-connection-marker-circle[tngFlowConnectionMarkerDiamond]`
- `TngFlowConnectionTemplateDirective` — `ng-template[tngFlowConnection], ng-template[tngFlowConnectionLabel]`
- `TngFlowFoblexBridgeDirective` — `[tngFlowFoblexBridge]`
