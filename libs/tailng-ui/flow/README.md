# @tailng-ui/flow

An Angular workflow editor for AI agents and automation applications. It wraps Foblex Flow with a controlled TailNG API: the application owns graph state, selection, identity, and persistence, while the editor emits typed user requests.

## Install

```bash
pnpm add @tailng-ui/flow @tailng-ui/components @tailng-ui/icons \
  @foblex/flow @foblex/platform @foblex/mediator @foblex/2d @foblex/utils
```

Add the global flow styles once:

```css
@import '@tailng-ui/flow/styles.css';
```

## Controlled editor

```ts
import { Component, signal } from '@angular/core';
import {
  TngFlowEditorComponent,
  type TngFlowConnectionCreateRequest,
  type TngFlowConnectionValidator,
  type TngFlowConnectionsDeleteRequest,
  type TngFlowDefinition,
  type TngFlowNodesDeleteRequest,
  type TngFlowPresentation,
  type TngFlowSelection,
  type TngFlowValidation,
} from '@tailng-ui/flow';

const initialWorkflow: TngFlowDefinition = {
  id: 'agent-workflow',
  nodes: [
    {
      id: 'prompt',
      type: 'prompt',
      name: 'Prompt',
      position: { x: 80, y: 120 },
      ports: [
        {
          id: 'result',
          direction: 'output',
          kind: 'data',
          dataType: 'text',
          multiple: true,
        },
      ],
    },
    {
      id: 'model',
      type: 'model',
      name: 'Model',
      position: { x: 440, y: 120 },
      ports: [
        {
          id: 'prompt',
          direction: 'input',
          kind: 'data',
          dataType: 'text',
        },
      ],
    },
  ],
  connections: [],
};

const emptySelection = (): TngFlowSelection => ({
  nodeIds: new Set(),
  connectionIds: new Set(),
});

@Component({
  imports: [TngFlowEditorComponent],
  template: `
    <tng-flow-editor
      [definition]="workflow()"
      [selection]="selection()"
      [presentation]="presentation"
      [validation]="validation"
      (connectionCreateRequested)="createConnection($event)"
      (connectionsDeleteRequested)="deleteConnections($event)"
      (nodesDeleteRequested)="deleteNodes($event)"
      (selectionChange)="selection.set($event)"
    />
  `,
})
export class AgentWorkflowComponent {
  readonly workflow = signal(initialWorkflow);
  readonly selection = signal(emptySelection());
  readonly presentation: TngFlowPresentation = {
    nodes: { model: { status: 'running', progress: 60 } },
  };
  readonly validation: TngFlowValidation = { issues: [] };

  createConnection(request: TngFlowConnectionCreateRequest): void {
    this.workflow.update((workflow) => ({
      ...workflow,
      connections: [
        ...workflow.connections,
        { id: crypto.randomUUID(), ...request, type: 'bezier' },
      ],
    }));
  }

  deleteConnections(request: TngFlowConnectionsDeleteRequest): void {
    const ids = new Set(request.connectionIds);
    this.workflow.update((workflow) => ({
      ...workflow,
      connections: workflow.connections.filter((connection) => !ids.has(connection.id)),
    }));
  }

  deleteNodes(request: TngFlowNodesDeleteRequest): void {
    const ids = new Set(request.nodeIds);
    this.workflow.update((workflow) => ({
      ...workflow,
      nodes: workflow.nodes.filter((node) => !ids.has(node.id)),
      connections: workflow.connections.filter(
        (connection) => !ids.has(connection.source.nodeId) && !ids.has(connection.target.nodeId),
      ),
    }));
  }
}
```

The editor never mutates `definition` or creates node or connection IDs. Event handlers update the application signal or store and pass a new snapshot back.

## Port sides

Ports default to the horizontal layout: inputs on `left` and outputs on `right`. Set `side` on
individual ports when a workflow runs vertically or mixes layout directions:

```ts
ports: [
  { id: 'input', direction: 'input', kind: 'data', side: 'top' },
  { id: 'output', direction: 'output', kind: 'data', side: 'bottom' },
];
```

The supported sides are `top`, `right`, `bottom`, and `left`. Ports sharing a side are distributed
evenly along that border.

## Connection routing and execution state

Routing is persisted with the connection while status and motion stay in presentation state:

```ts
const editorOptions: TngFlowEditorOptions = {
  defaultConnection: RECOMMENDED_TNG_FLOW_CONNECTION_OPTIONS,
  connectionWaypointsEnabled: true,
  motionPreference: 'system',
};

const definition: TngFlowDefinition = {
  id: 'document-review',
  nodes,
  connections: [
    {
      id: 'validate-to-review',
      source: { nodeId: 'validate', portId: 'invalid' },
      target: { nodeId: 'review', portId: 'input' },
      label: 'Invalid',
      routing: {
        type: 'orthogonal-rounded',
        offset: 24,
        radius: 16,
        waypoints: [{ x: 520, y: 240 }],
      },
      sourceMarker: 'circle',
      targetMarker: 'arrow',
      labelOptions: { placement: 'center', offset: -8 },
    },
  ],
};

const presentation: TngFlowPresentation = {
  connections: {
    'validate-to-review': {
      status: 'active',
      motion: 'flow',
      motionSpeed: 'normal',
      motionDirection: 'forward',
      message: 'Sending the document for manual review',
    },
  },
};
```

```html
<tng-flow-editor
  [definition]="definition"
  [presentation]="presentation"
  [options]="editorOptions"
  (connectionWaypointsChange)="updateWaypoints($event)"
/>
```

Supported path types are `straight`, `bezier`, `orthogonal`, `orthogonal-rounded`, and `adaptive`.
Definitions without routing remain Bézier for compatibility. Waypoint changes are controlled
events: create a new definition snapshot with the returned points rather than mutating the supplied
connection.

## Palette and node creation

Use the headless `TngFlowPaletteItemDirective` on native buttons. A drag emits a controlled
`nodeCreateRequested` event at the dropped canvas position; activation can call
`requestNodeCreate()` to use the visible viewport center.

```html
<aside aria-label="Workflow node palette">
  @for (item of paletteItems; track item.id) {
  <button
    type="button"
    [tngFlowPaletteItem]="item"
    (tngFlowPaletteItemActivate)="
        editor.requestNodeCreate($event.item, undefined, $event.source)
      "
  >
    {{ item.name }}
  </button>
  }
</aside>

<tng-flow-editor
  #editor="tngFlowEditor"
  [definition]="workflow()"
  (nodeCreateRequested)="createNode($event)"
/>
```

```ts
readonly paletteItems: readonly TngFlowPaletteItem<NodeData>[] = [
  {
    id: 'model-catalog-item',
    type: 'model',
    name: 'Model',
    data: { model: 'reasoning' },
  },
];

createNode(request: TngFlowNodeCreateRequest<NodeData>): void {
  const node: TngFlowNode<NodeData> = {
    id: crypto.randomUUID(),
    type: request.item.type,
    name: request.item.name,
    data: request.item.data,
    position: request.position,
    ports: [],
  };
  this.workflow.update((workflow) => ({
    ...workflow,
    nodes: [...workflow.nodes, node],
  }));
}
```

Palette item ids identify catalog entries; the consumer still creates the workflow node id. The
directive supports disabled state plus optional preview and placeholder `TemplateRef` inputs.

## Modes

| Mode       | Select | Activate | Move | Connect | Delete | Pan/zoom |
| ---------- | -----: | -------: | ---: | ------: | -----: | -------: |
| `edit`     |    Yes |      Yes |  Yes |     Yes |    Yes |      Yes |
| `inspect`  |    Yes |      Yes |   No |      No |     No |      Yes |
| `readonly` |     No |       No |   No |      No |     No |      Yes |

Use `[mode]="'inspect'"` for an interactive execution view and `[mode]="'readonly'"` for a non-selectable viewer.

## Viewport navigation

The optional interactive minimap pans the canvas continuously to the mouse position anywhere in
the overview, including the space between nodes. Pointer dragging and keyboard navigation remain
available; set `minimapOptions.interactive` to `false` for a display-only overview.

Hover navigation is a transient preview: clicking commits the current viewport, while leaving the
minimap restores the viewport captured when the preview began. Controlled graph, presentation,
selection, node-view, and viewport updates do not cancel a preview while the pointer remains inside.

When viewport controls are shown, the lock button toggles mouse-wheel and trackpad scroll zoom.
Locking scroll zoom does not disable the zoom in, zoom out, fit, or reset controls.

The editor automatically refreshes connection geometry after its rendered flow area resizes. For
layout changes that do not resize the editor, such as an ancestor transform, consumers can request
the same non-viewport-mutating refresh through the exported component instance:

```html
<tng-flow-editor #editor="tngFlowEditor" [definition]="workflow()" />
<button type="button" (click)="editor.refreshLayout()">Refresh connections</button>
```

`refreshLayout()` redraws connection geometry immediately. It does not fit, center, change zoom or
pan, or emit `viewportChange`.

## Automatic layout

Automatic layout is engine-neutral and opt-in. The official Dagre adapter is exposed through a
secondary entry point and requires Dagre only when that adapter is used.

```bash
pnpm add @tailng-ui/flow @dagrejs/dagre
```

```ts
import { provideTngFlowLayoutEngine, type TngFlowNodesLayoutRequest } from '@tailng-ui/flow';
import { TNG_FLOW_DAGRE_LAYOUT_ENGINE } from '@tailng-ui/flow/layout-dagre';

bootstrapApplication(AppComponent, {
  providers: [provideTngFlowLayoutEngine(TNG_FLOW_DAGRE_LAYOUT_ENGINE)],
});

applyLayout(request: TngFlowNodesLayoutRequest): void {
  const positions = new Map(request.nodes.map((move) => [move.id, move.position]));
  this.workflow.update((workflow) => ({
    ...workflow,
    nodes: workflow.nodes.map((node) => {
      const position = positions.get(node.id);
      return position === undefined ? node : { ...node, position };
    }),
  }));
}
```

```html
<button type="button" (click)="editor.requestAutoLayout({ direction: 'left-to-right' })">
  Arrange workflow
</button>

<tng-flow-editor
  #editor="tngFlowEditor"
  [definition]="workflow()"
  (nodesLayoutRequested)="applyLayout($event)"
/>
```

The editor measures the rendered custom nodes, invokes the configured engine once, and emits one
complete controlled request. Locked nodes remain fixed by default. Optional viewport fitting is a
separate presentation effect and runs only after the application supplies the requested positions:

```ts
editor.requestAutoLayout({
  direction: 'top-to-bottom',
  viewport: { fit: true, animated: true, padding: 48 },
});
```

`requestAutoLayout()` resolves to `false` outside edit mode, before the editor is ready, when node
geometry is unusable, or if the graph changes while an asynchronous engine is calculating.

## Alignment, distribution, and smart guides

The standalone arrangement utilities accept measured, unscaled canvas bounds and return
position-only moves. They never mutate the bounds or graph nodes.

```ts
import { alignTngFlowNodes, distributeTngFlowNodes, type TngFlowNodeBounds } from '@tailng-ui/flow';

const bounds: readonly TngFlowNodeBounds[] = measureNodeBounds();
const aligned = alignTngFlowNodes(bounds, 'horizontal-center');
const distributed = distributeTngFlowNodes(bounds, 'horizontal', { gridSize: 16 });
```

Disabled bounds are ignored. Locked bounds are fixed anchors by default and are never returned as
moves; pass `{ lockedNodes: 'ignore' }` to exclude them from the calculation. Distribution uses
equal edge-to-edge gaps for mixed-size nodes. When `gridSize` is set, grid snapping is the final
step and therefore takes precedence over an exact alignment or gap.

The editor can measure the selected rendered nodes and emit one controlled arrangement request:

```html
<button type="button" (click)="editor.requestNodeAlignment('left', {}, 'controls')">
  Align left
</button>
<button type="button" (click)="editor.requestNodeDistribution('horizontal', {}, 'controls')">
  Distribute horizontally
</button>

<tng-flow-editor
  #editor="tngFlowEditor"
  [definition]="workflow()"
  [selection]="selection()"
  [smartGuides]="{
    enabled: true,
    alignmentThreshold: 10,
    spacingThreshold: 10,
    disableModifier: 'alt'
  }"
  (nodesArrangementRequested)="applyArrangement($event)"
/>
```

```ts
applyArrangement(request: TngFlowNodesArrangementRequest): void {
  const positions = new Map(request.nodes.map((move) => [move.id, move.position]));
  this.workflow.update((workflow) => ({
    ...workflow,
    nodes: workflow.nodes.map((node) => {
      const position = positions.get(node.id);
      return position === undefined ? node : { ...node, position };
    }),
  }));
}
```

Smart guides are opt-in and appear only in edit mode. Thresholds are CSS-screen pixels, so their
feel stays constant at every zoom level. The suppression modifier is sampled on the initiating
pointer down and remains deterministic for that drag. Magnetic alignment is considered before the
editor's final grid policy; locked nodes remain available as magnetic anchors but never enter the
movable Foblex selection.

## Connection validation

The editor validates direction, disabled state, self-connections, port kind, duplicates, and port multiplicity before calling the optional consumer validator.

```ts
readonly validateConnection: TngFlowConnectionValidator = (candidate) => {
  return candidate.sourcePort.dataType === candidate.targetPort.dataType
    ? { valid: true }
    : {
        valid: false,
        code: 'incompatible-data-type',
        reason: 'Port data types are incompatible.',
      };
};
```

Invalid port drops emit `connectionRejected`; dropping on empty canvas is treated as cancellation.

## Custom node content

Custom templates replace only the node body. TailNG retains geometry, connectors, controlled selection, and accessibility behavior.

```html
<tng-flow-editor [definition]="workflow()" [selection]="selection()">
  <ng-template tngFlowNode="tool" let-node let-view="view" let-issues="issues">
    <app-tool-node
      [tool]="node.data"
      [status]="view.status"
      [selected]="view.selected"
      [validationSeverity]="view.validationSeverity"
      [validationIssues]="issues"
    />
  </ng-template>
</tng-flow-editor>
```

## Connection labels and custom content

Set the optional `label` to render TailNG's default midpoint label. Long labels truncate visually
while the connection keeps the complete accessible name. `description` supplies additional
accessible and hover context without changing connection identity, endpoints, or runtime state.

```ts
const approvedRoute: TngFlowConnection = {
  id: 'review-to-publish',
  source: { nodeId: 'review', portId: 'approved' },
  target: { nodeId: 'publish', portId: 'input' },
  label: 'Approved review route',
  description: 'Continue after the document passes review.',
  type: 'adaptive-curve',
};
```

Import `TngFlowConnectionLabelTemplateDirective` when the application needs custom connection
label content (`TngFlowConnectionTemplateDirective` and `tngFlowConnection` remain supported):

```html
<tng-flow-editor [definition]="workflow()" [selection]="selection()">
  <ng-template
    tngFlowConnectionLabel
    let-connection
    let-view="view"
    let-issues="issues"
    let-mode="mode"
    let-selected="selected"
  >
    <app-route-label
      [connection]="connection"
      [status]="view.status"
      [validationIssues]="issues"
      [mode]="mode"
      [selected]="selected"
    />
  </ng-template>
</tng-flow-editor>
```

`$implicit` and `connection` contain the current `TngFlowConnection`; `view` contains resolved
runtime, presentation, selection, and validation state. The template replaces only the default
label content. TailNG retains the connection path, validation badge, selection, reassignment,
accessibility, and Foblex-managed midpoint shell. The first template contract intentionally does
not expose a `midpoint` value.

Validation and presentation are independent controlled projections. Validation uses stable issue
ids and discriminated flow, node, port, or connection targets. Presentation adds transient runtime
status, progress, emphasis, and connection motion without changing graph data or selection.

Connection motion communicates active execution without changing the connection geometry or the
persisted flow definition:

```ts
readonly presentation: TngFlowPresentation = {
  connections: {
    'validate-to-review': {
      status: 'active',
      motion: 'flow',
      motionSpeed: 'normal',
      motionDirection: 'forward',
    },
  },
};
```

`motion` defaults to `none`, `motionSpeed` to `normal`, and `motionDirection` to `forward`.
Slow, normal, and fast duration tokens can be overridden on an individual editor. When the user
prefers reduced motion, the animated dash becomes a static emphasized path.

Use `revealTarget(target, { select: true })` to navigate to a known validation target. Node and
connection double-clicks emit generic activation events in edit and inspect modes; the consuming
application decides whether to open an inspector or take another action.

The editor host has a default height of `36rem`; override the host height in the consuming component when needed.

## Nearest-border attachment layout

By default the editor uses `attachmentLayout="static-ports"`: declared `port.side` values and
port labels render as authored.

Set `attachmentLayout="nearest-border"` for flowchart-style edges:

- Connected endpoints are live-assigned to each node’s size-normalized exit border from the
  center-to-center ray (diagonal mixes such as source `right` + target `top` are allowed).
- Sockets on one border are equal-spaced with the existing `(i+1)/(n+1)` rule, and a border may
  host both incoming and outgoing endpoints.
- Port labels are hidden; connections render start and end arrow markers.
- Sides update while nodes move (provisional positions) without mutating `definition.ports[].side`.

Equal spacing of multiple edges on one border requires **one unique port per connection endpoint**.
Sharing a single `multiple: true` port stacks edges on one socket. Use
`materializeTngFlowEndpoint` / `materializeTngFlowConnectionEndpoints` and
`pruneUnusedTngFlowConnectionPorts` when creator ports should expand into unique endpoints.

```html
<tng-flow-editor
  attachmentLayout="nearest-border"
  [definition]="workflow()"
  [selection]="selection()"
  (connectionCreateRequested)="createConnection($event)"
/>
```

## Custom-points attachment layout

Set `attachmentLayout="custom-points"` for explicit point→point wiring on a fixed border grid:

- Each node gets **3 sockets per side** at 25% / 50% / 75% (12 out + 12 in synthetic ports).
- Port ids follow `custom-point-out-{side}-{index}` and `custom-point-in-{side}-{index}`
  (`index` 0..2). The editor synthesizes the grid for connect/render; persist chosen slots with
  `ensureTngFlowCustomPointPorts` on create/reconnect, and
  `pruneUnusedTngFlowCustomPointPorts` when edges are removed.
- Idle: unlabeled **output** custom-points appear only on the **selected** node (nothing selected →
  no start sockets). Connected custom-point endpoints stay visible.
- During connect: the source node’s outputs stay visible; **input** custom-points appear on all
  valid targets (ports that pass connectability validation). Other nodes’ custom-points hide.
- Sides stay fixed (no nearest-border reassignment). Port labels are hidden; connections render
  start and end arrow markers.

```html
<tng-flow-editor
  attachmentLayout="custom-points"
  [definition]="workflow()"
  [selection]="selection()"
  (connectionCreateRequested)="createConnection($event)"
/>
```

```ts
createConnection(request: TngFlowConnectionCreateRequest): void {
  const nodes = ensureTngFlowCustomPointPorts(this.definition().nodes, [
    request.source,
    request.target,
  ]);
  this.definition.set({
    ...this.definition(),
    nodes,
    connections: [...this.definition().connections, { id: crypto.randomUUID(), ...request }],
  });
}
```

## Keyboard interaction

- Arrow keys navigate spatially across nodes and connections; `Command/Ctrl + Arrow` follows graph
  topology, and `Shift + Arrow` extends the controlled selection.
- Space grabs the focused movable node selection. Arrow keys preview movement, `Shift + Arrow`
  applies the coarse step, Space or Enter drops it through `nodesMoved`, and Escape restores the
  original presentation without an event. Locked and disabled nodes are excluded.
- Keyboard movement uses one canvas unit by default, or `gridSize` when `snapToGrid` is enabled.
  A snapped multi-node move derives one delta from the anchor and applies it to every movable node,
  preserving the selection's relative geometry. Configure `keyboardOptions.moveStep` and
  `keyboardOptions.largeMoveStep` to override the normal and coarse steps.
- The configured `keyboardOptions.connectKeys` (default `['c']`) starts connection authoring from
  one selected node through Foblex's public connection session. When a node has multiple eligible
  outputs, arrows choose the source port first. Arrows then traverse only compatible target ports;
  Enter or Space chooses or confirms, and Escape cancels and restores source focus.
- Built-in and consumer connection validators are applied during target traversal and again before
  `connectionCreateRequested` emits. Connection authoring is controlled and never mutates the input
  graph directly. Locked and disabled nodes or ports cannot be sources or targets.
- `Delete` / `Backspace` requests deletion of editable selected elements.
- `Escape` clears selection or cancels the active keyboard operation.
- `Command/Ctrl + A` selects all in edit mode.
- `Enter` activates the focused or sole selected node/connection in edit and inspect modes.
- Shift, Command, or Ctrl while clicking toggles multi-selection.

Palette buttons use their native Enter and Space activation. The example above routes that
activation through the editor's controlled node-creation request.

The editor is one graph tab stop with an `aria-activedescendant` for node and connection navigation.
Port focus is entered programmatically while authoring a connection, with source, target, position,
compatibility, request, and cancellation status announced. Focus rings compensate for canvas zoom.
If a controlled graph update removes the active item or focused port, focus falls back to the editor.
Keyboard commands only act while the flow has focus and never intercept inputs, textareas, selects,
contenteditable regions, links, buttons, native controls, or focusable custom controls projected by
node templates.

Edit mode enables all authoring keys. Inspect mode keeps navigation, selection, and activation while
blocking movement, connection, and deletion. Readonly mode blocks graph interaction while leaving
viewport controls and the optional interactive minimap available.

## Commands and context menus

Command shortcuts and custom context-menu interception are opt-in. TailNG supplies the controlled
selection and placement anchor; the application owns history, clipboard serialization, pasted-data
validation, ids, menu content, and every graph mutation.

```html
<tng-flow-editor
  #editor="tngFlowEditor"
  [definition]="workflow()"
  [selection]="selection()"
  [commandShortcuts]="['copy', 'paste', 'duplicate']"
  [contextMenuEnabled]="true"
  (selectionChange)="selection.set($event)"
  (commandRequested)="handleCommand($event)"
  (contextMenuRequested)="openContextMenu($event)"
/>
```

```ts
handleCommand(request: TngFlowEditorCommandRequest): void {
  // Read or update application-owned history and clipboard state, then
  // produce a new controlled workflow snapshot when the command mutates data.
}

openContextMenu(request: TngFlowContextMenuRequest): void {
  this.menu.open({
    clientPosition: request.clientPosition,
    data: request,
  });
}

runContextCommand(
  editor: TngFlowEditorComponent,
  request: TngFlowContextMenuRequest,
  command: TngFlowEditorCommand,
): void {
  editor.requestCommand(command, 'context-menu', request.canvasPosition);
}
```

`commandShortcuts` accepts `false`, `true`, or an explicit command allow-list. The standard
Command/Ctrl shortcuts request undo, redo, cut, copy, paste, and duplicate; Ctrl+Y is also accepted
for redo. Copy is available in edit and inspect modes. The other commands are edit-only, and
`requestCommand()` follows the same mode rules even when called directly. Paste and duplicate use
the last pointer position in canvas coordinates, falling back to the visible viewport centre.

`contextMenuEnabled` defaults to false. Pointer requests identify canvas, node, connection, or port
targets and include both browser `clientPosition` and transformed `canvasPosition` coordinates.
Right-clicking an unselected selectable node or connection emits `selectionChange` first and then
`contextMenuRequested` with that proposed selection. Keyboard Context Menu and Shift+F10 requests
anchor to the active graph element, or the viewport centre when no graph element is active.

## Compatibility

The `inputs`/`outputs`, `nodeViews`, `readonly`, connection-presentation `animated`,
`connectionCreated`, `connectionReassigned`, `selectionChanged`, and combined `deleteRequested`
APIs remain available as deprecated aliases for one compatibility cycle. New code should use
`ports`, `presentation` with `motion`, `mode`, controlled `selection`, and the request outputs
documented above.
