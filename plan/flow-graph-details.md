# Implementation plan:

Status: Implemented as an experimental package entry point; stable-release documentation and
measurement gates remain

Target package: `@tailng-ui/flow/execution`

Related contract: `plan/flow-editor-production-contracts.md`

Implementation update: 2026-09-10

- Completed the secondary entry point, public execution types, pure helpers, payload renderer,
  inspector, composite viewer, core progress semantics, package export, unit tests, browser smoke
  coverage and direct package build verification.
- Left stable-release hardening open where it requires measured limits, consumer-adapter
  documentation, a packed-package consumer fixture, visual review and validation from a second
  consuming application.

## Resolved design direction

- Build the feature as an experimental secondary entry point for its first release.
- Export a composite viewer, a standalone execution graph, a standalone node properties editor,
  a standalone inspector and a standalone payload renderer.
- Use the existing TailNG split-pane components for the resizable desktop layout.
- Change layout according to the viewer's container width, not the browser viewport width.
- Use `TngCodeBlockComponent` in plain mode for the default JSON/text presentation. Shiki remains optional.
- Keep graph selection, the inspected node, the selected execution and the viewport as separate controlled concepts.
- Group execution history by activation and show retry attempts inside each activation.
- Keep run details and selected-node details as distinct views within the inspector.
- Use numeric inputs for split-pane constraints and CSS custom properties for host sizing and visual tokens.
- Warn once in development mode for malformed snapshot references; duplicate execution IDs use a first-record-wins rule.

## Phase 0 contract amendments

Before implementation, amend the production contract so that new public contracts are exported from
their owning public entry point rather than necessarily from the root `@tailng-ui/flow` entry point.
This permits `@tailng-ui/flow/execution` to remain isolated from the root API.

The 0.9.0 baseline in the production-contract document should also be described as the compatibility
floor. The current package version may advance without changing that compatibility promise.

## Summary

Add a reusable workflow execution viewer to TailNG that displays:

- A workflow/node graph in edit, inspect, or readonly mode.
- Live node and connection execution states.
- Controlled node selection.
- Selected-node execution details.
- Input, output and error payloads.
- Multiple activations and retry attempts.
- Optional run-level input/output/error.
- Responsive graph-only and graph-with-inspector layouts.

Recommended package location:

```text
@tailng-ui/flow/execution
```

This should be a secondary entry point rather than adding Taskmesh-specific execution semantics to the root `@tailng-ui/flow` API.

Public component names:

```text
TngFlowExecutionGraphComponent
TngFlowExecutionViewerComponent
TngFlowNodePropertiesComponent
TngFlowExecutionInspectorComponent
TngFlowExecutionPayloadComponent
```

## Motivation

Several applications need to show the same workflow execution experience:

- Taskmesh workflow run detail.
- Taskmesh workflow test execution.
- Taskmesh administration and support views.
- Trusted applications such as Daybook.
- Embedded workflow audit and monitoring screens.

Taskmesh already uses `TngFlowEditorComponent` in inspect mode and supplies live node status using `TngFlowPresentation`. However, the graph, selection management, execution inspector and payload presentation are currently composed at the application level.

A reusable TailNG component would:

- Keep the experience consistent across applications.
- Eliminate repeated graph/inspector/split-layout implementations.
- Preserve TailNG accessibility and theming.
- Allow applications to use their own APIs, authentication and live-update transport.
- Avoid coupling the component to Taskmesh workflow DTOs.

## Goals

The execution viewer should:

1. Render any valid `TngFlowDefinition`.
2. Render node and connection state through `TngFlowPresentation`.
3. Support immutable live snapshot updates.
4. Preserve viewport and selection during execution updates.
5. Show executions associated with the selected node.
6. Distinguish node activation from retry attempt.
7. Display available, pending, unavailable and redacted payload states.
8. Provide default JSON/text payload presentation.
9. Allow applications to replace the default inspector or payload renderer.
10. Work with TailNG themes, dark mode, forced colors and reduced motion.
11. Remain independent of any workflow engine or network protocol.

## Non-goals

The component must not:

- Fetch workflow or execution data.
- Open SSE, WebSocket or polling connections.
- Depend on Taskmesh API types.
- Contain OAuth, installation or authorization logic.
- Interpret CloudEvents or reconstruct execution state from events.
- Infer application-specific branch semantics.
- Decide whether payloads should be redacted.
- Synchronize selection with application routing.
- Mutate workflow definitions.
- Provide workflow editing capabilities.

The consuming application remains responsible for these concerns.

## Documentation navigation plan

The docs should present Flow as its own component category instead of placing workflow surfaces
under Layout. The left navigation should expose each reusable public component as a separate item:

1. Flow Editor
2. Flow Execution Viewer
3. Flow Execution Graph
4. Flow Node Properties

The viewer examples should keep both composition styles visible: a composite
`tng-flow-execution-viewer` example for teams that want the full run viewer, and a split
`tng-flow-execution-graph` plus `tng-flow-node-properties` example for teams that want to own the
page shell or inspector layout.

## Proposed component architecture

### 1. Execution graph

`tng-flow-execution-graph` is the reusable workflow graph diagram.

It contains:

- `TngFlowEditorComponent` in edit, inspect, or readonly mode.
- Execution snapshot to graph presentation mapping.
- Controlled selection, inspected-node reconciliation and viewport forwarding.
- Node activation events with the latest execution record for the activated node.
- Custom node and connection templates forwarded to the underlying graph.

It does not contain a property panel, execution history panel or split layout.

Example:

```html
<tng-flow-execution-graph
  [definition]="definition()"
  [snapshot]="executionSnapshot()"
  [selection]="selection()"
  [inspectedNodeId]="inspectedNodeId()"
  [selectedExecutionId]="selectedExecutionId()"
  [viewport]="viewport()"
  [mode]="'inspect'"
  (selectionChange)="selection.set($event)"
  (inspectedNodeIdChange)="inspectedNodeId.set($event)"
  (selectedExecutionIdChange)="selectedExecutionId.set($event)"
  (viewportChange)="viewport.set($event)"
  (executionActivated)="onExecutionActivated($event)"
/>
```

### 2. Node properties

`tng-flow-node-properties` is the reusable node property view/edit component.

It contains:

- Basic node metadata: name, description, type, disabled and locked.
- Readonly port summaries for input and output ports.
- Default readonly JSON/text display for `node.data`.
- A projected `ng-template[tngFlowNodePropertiesData]` escape hatch for domain-specific data
  editing.
- Immutable `nodeChangeRequested` events; consuming applications remain responsible for applying
  updates to the workflow definition.

Example:

```html
<tng-flow-node-properties
  [definition]="definition()"
  [inspectedNodeId]="inspectedNodeId()"
  [readonly]="saving()"
  (nodeChangeRequested)="applyNodeChanges($event)"
/>
```

### 3. Execution viewer

`tng-flow-execution-viewer` is the composite component.

It contains:

- `TngFlowExecutionGraphComponent`.
- An optional execution inspector.
- An optional responsive split layout.
- Viewport controls.
- Empty/loading states only when explicitly supplied by the consumer.

Example:

```html
<tng-flow-execution-viewer
  [definition]="definition()"
  [snapshot]="executionSnapshot()"
  [selection]="selection()"
  [inspectedNodeId]="inspectedNodeId()"
  [selectedExecutionId]="selectedExecutionId()"
  [viewport]="viewport()"
  [mode]="'inspect'"
  [showInspector]="true"
  [inspectorOpen]="inspectorOpen()"
  [showControls]="true"
  [ariaLabel]="'Invoice approval execution'"
  (selectionChange)="selection.set($event)"
  (inspectedNodeIdChange)="inspectedNodeId.set($event)"
  (selectedExecutionIdChange)="selectedExecutionId.set($event)"
  (viewportChange)="viewport.set($event)"
  (nodeActivated)="onNodeActivated($event)"
  (executionActivated)="onExecutionActivated($event)"
  (inspectorOpenChange)="inspectorOpen.set($event)"
/>
```

### 4. Standalone inspector

`tng-flow-execution-inspector` should also be independently usable.

This allows applications to build their own page layout:

```html
<tng-flow-editor
  mode="inspect"
  [definition]="definition()"
  [presentation]="snapshot().presentation"
  [selection]="selection()"
  (selectionChange)="selection.set($event)"
/>

<tng-flow-execution-inspector
  [node]="selectedNode()"
  [nodePresentation]="selectedNodePresentation()"
  [executions]="selectedNodeExecutions()"
  [selectedExecutionId]="selectedExecutionId()"
  (selectedExecutionIdChange)="selectedExecutionId.set($event)"
/>
```

### 5. Payload renderer

A small reusable payload component should handle:

- JSON objects and arrays.
- Primitive JSON values.
- Plain text.
- Unavailable/pending/redacted states.
- Custom projected templates for files, rich media or domain-specific data.

It should not introduce a mandatory Shiki dependency into the core flow bundle.

The standalone components have explicit contracts:

```ts
// tng-flow-execution-inspector
node: TngFlowNode | null;
nodePresentation: TngFlowNodePresentation | null;
executions: readonly TngFlowNodeExecution[];
selectedExecutionId: string | null;
showNodePayloads: boolean;
dateTimeFormatter?: TngFlowExecutionDateTimeFormatter;
selectedExecutionIdChange: string | null;
executionActivated: TngFlowExecutionActivatedEvent;

// tng-flow-execution-payload
kind: 'input' | 'output' | 'error';
payload: TngFlowExecutionPayload;
expanded: boolean;
expandedChange: boolean;
```

The payload component formats lazily when expanded. It uses `TngCodeBlockComponent` with syntax
highlighting disabled, preserving its scrolling and copy behavior without requiring a highlighter.
The inspector must accept and forward the same payload template directives as the composite viewer.

## Proposed public data model

The viewer should consume a normalized, transport-independent snapshot.

```ts
export type TngFlowExecutionPayloadState =
  | 'available'
  | 'pending'
  | 'not-recorded'
  | 'redacted'
  | 'unavailable';

export type TngFlowExecutionPhase =
  | 'idle'
  | 'pending'
  | 'active'
  | 'waiting'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'skipped';

export type TngFlowExecutionViewerState = 'ready' | 'loading' | 'empty' | 'error';

export type TngFlowExecutionDateTimeFormatter = (timestamp: string) => string | null;

export type TngFlowExecutionPayload<TValue = unknown> =
  | Readonly<{
      state: 'available';
      value: TValue;
      mediaType?: string;
      schema?: Readonly<Record<string, unknown>>;
      schemaRef?: string;
    }>
  | Readonly<{
      state: Exclude<TngFlowExecutionPayloadState, 'available'>;
      message?: string;
    }>;

export type TngFlowNodeExecution<
  TPayload = unknown,
  TStatus extends string = TngFlowNodeStatus,
  TData = unknown,
> = Readonly<{
  /** Stable identity of this persisted execution record. */
  id: string;

  /** Node in TngFlowDefinition associated with the execution. */
  nodeId: string;

  /**
   * Identity of one logical invocation.
   * Multiple activations may exist for loops or repeated paths.
   */
  activationId: string;

  /** Retry attempt within the activation. Starts at one. */
  attempt: number;

  /** Optional configured maximum. Only render "of N" when this is supplied. */
  maxAttempts?: number;

  /** Engine-neutral phase used for ordering, tone and default inspector behavior. */
  phase: TngFlowExecutionPhase;

  status: TStatus;
  statusMessage?: string | null;
  progress?: number | null;

  input?: TngFlowExecutionPayload<TPayload>;
  output?: TngFlowExecutionPayload<TPayload>;
  error?: TngFlowExecutionPayload;

  startedAt?: string | null;
  updatedAt?: string | null;
  finishedAt?: string | null;
  durationMs?: number | null;

  /** Optional monotonic consumer order used before timestamps when sorting records. */
  sequence?: number;

  /** Consumer-owned metadata that TailNG does not interpret. */
  data?: TData;
}>;

export type TngFlowExecutionSnapshot<
  TPayload = unknown,
  TStatus extends string = TngFlowNodeStatus,
  TExecutionData = unknown,
> = Readonly<{
  /** Stable workflow run/execution identity. */
  id: string;

  /** Definition to which this snapshot belongs. */
  definitionId: string;

  /** Optional stable revision useful for diagnostics and memoization. */
  revision?: string | number;

  /** Optional overall execution status. */
  status?: TStatus;
  phase?: TngFlowExecutionPhase;

  /**
   * Authoritative node and connection presentation.
   * TailNG must not infer routing or aggregate state from executions.
   */
  presentation: TngFlowPresentation<TStatus>;

  /**
   * Execution records used by the inspector.
   * More than one record may refer to the same node and activation.
   */
  executions: readonly TngFlowNodeExecution<TPayload, TStatus, TExecutionData>[];

  input?: TngFlowExecutionPayload<TPayload>;
  output?: TngFlowExecutionPayload<TPayload>;
  error?: TngFlowExecutionPayload;
}>;
```

All public records are readonly. `activationId` is required because retry grouping cannot be
reconstructed reliably from node ID and attempt number alone. A normal non-looping execution still
has one activation ID.

Payload omission has a precise meaning:

- An omitted `input`, `output` or `error` is not applicable and its section is not rendered.
- `not-recorded` means the payload was applicable but no value was captured.
- `pending` means the value may arrive in a later snapshot.
- `unavailable` means the value cannot currently be obtained.
- `redacted` means the value was deliberately withheld by the consumer.

The default renderer supports strings and JSON-compatible values. Other media types use a custom
payload template or the unavailable fallback. An available value that cannot be serialized must
render the deterministic serialization-error state rather than throwing.

Execution ordering is deterministic:

1. Active executions before non-active executions.
2. Records with a finite `sequence` before records without one, then higher values first.
3. Newer recency timestamp first, using the first valid value from `updatedAt`, `finishedAt` and
   `startedAt` in that fallback order.
4. Higher attempt number first.
5. Lexicographic execution ID as the final tie-breaker.

Unknown or invalid timestamps sort after valid timestamps. The default selection is the first
record in this order. If `maxAttempts` is absent, display `Attempt N`, never `Attempt N of M`.

Timestamp strings use RFC 3339. The default inspector formats them with `Intl.DateTimeFormat` in the
consumer's locale and local time zone, with a formatter input for applications that require a fixed
zone. A finite non-negative `durationMs` is authoritative; otherwise duration is derived only
when both start and finish timestamps are valid. The component does not run its own elapsed-time
timer. Consumers that want a live duration supply updated snapshots.

## Why presentation remains explicit

The component should not infer connection state from node state.

Inference becomes unreliable for:

- Switch nodes with arbitrary cases.
- Yes/no decisions.
- Tool success and error outputs.
- Failure-routing policies.
- Skipped branches.
- Parallel branches and joins.
- First-result semantics.
- Loops with multiple activations.
- Nodes that fail but route to a recovery handler.

The consumer knows which edges were traversed and should provide that through:

```ts
snapshot.presentation.connections;
```

Similarly, the consumer should provide the aggregate presentation state of a node. TailNG should not decide whether the latest, running, failed or highest-attempt execution represents the node.

## Component inputs

Suggested inputs:

```ts
definition: TngFlowDefinition | null;
snapshot: TngFlowExecutionSnapshot | null;
state: TngFlowExecutionViewerState;
stateMessage?: string | null;

selection: TngFlowSelection;
inspectedNodeId: string | null;
selectedExecutionId: string | null;
viewport: TngFlowViewport | null;
mode: TngFlowEditorMode;

validation?: TngFlowValidation;
dateTimeFormatter?: TngFlowExecutionDateTimeFormatter;

showInspector: boolean;
inspectorOpen: boolean;
showControls: boolean;
showMinimap: boolean;
showBackground: boolean;

ariaLabel: string;

inspectorPosition?: 'auto' | 'right' | 'bottom';
inspectorDefaultSize?: number;
inspectorMinSize?: number;
fitOnInit?: boolean;

showRunPayloads?: boolean;
showNodePayloads?: boolean;
```

Resolved defaults:

| Input               | Default   |
| ------------------- | --------- |
| `mode`              | `inspect` |
| `state`             | `ready`   |
| `showInspector`     | `true`    |
| `inspectorOpen`     | `true`    |
| `showControls`      | `true`    |
| `showMinimap`       | `false`   |
| `showBackground`    | `true`    |
| `inspectorPosition` | `auto`    |
| `fitOnInit`         | `true`    |
| `showRunPayloads`   | `false`   |
| `showNodePayloads`  | `true`    |

The layout API follows existing TailNG split-pane conventions. The composite viewer must also
forward the graph customizations needed by existing consumers: node templates, connection
templates, attachment layout, minimap options, connection presentation options and edit-mode
authoring options. It must expose facade methods for `refreshLayout`, `fitToScreen`,
`resetViewport` and `centerNode` without exposing Foblex types.

`state` is presentation-only and does not imply that TailNG owns data loading. In `ready` state a
definition may be shown without a snapshot to represent a run that has not started. The other states
render consumer-overridable loading, empty or error content. State templates are separate from
payload templates.

Sizing should use host layout and CSS custom properties instead of fixed values such as `28rem` or selectors such as `:host-context(.graph-pane)`.

Suggested tokens:

```css
--tng-flow-execution-viewer-height
--tng-flow-execution-inspector-width
--tng-flow-execution-inspector-min-width
--tng-flow-execution-graph-min-height
```

## Component outputs

Suggested outputs:

```ts
selectionChange: TngFlowSelection;
inspectedNodeIdChange: string | null;
selectedExecutionIdChange: string | null;
viewportChange: TngFlowViewport;
nodesMoved: TngFlowNodesMovedEvent;
nodeCreateRequested: TngFlowNodeCreateRequest;
connectionCreateRequested: TngFlowConnectionCreateRequest;
connectionReconnectRequested: TngFlowConnectionReconnectRequest;
connectionWaypointsChange: TngFlowConnectionWaypointsChange;
nodesDeleteRequested: TngFlowNodesDeleteRequest;
connectionsDeleteRequested: TngFlowConnectionsDeleteRequest;
nodeActivated: TngFlowNodeActivatedEvent;
connectionActivated: TngFlowConnectionActivatedEvent;

executionActivated: TngFlowExecutionActivatedEvent;

type TngFlowExecutionActivatedEvent = Readonly<{
  nodeId: string;
  executionId: string;
  source: 'api' | 'keyboard' | 'pointer';
}>;

inspectorOpenChange: boolean;
```

Every event and template-context type is named and exported from `@tailng-ui/flow/execution`.

Selection, inspected node, selected execution, viewport and inspector-open state remain controlled.
The component emits a proposal and waits for the consumer to supply it again. Activation events are
not selection events.

When a proposed graph selection contains multiple nodes, the inspector target is resolved as follows:

1. Preserve `inspectedNodeId` when it remains selected.
2. Otherwise use the first selected node in definition order.
3. When no node is selected, propose `null`.

For one user interaction, `selectionChange` is emitted before `inspectedNodeIdChange`. In readonly
mode the graph emits neither event; an inspector may still be driven by an externally supplied
`inspectedNodeId`.

## Inspector behavior

### No node selected

Display a neutral empty state:

```text
Select a node

Select a node on the execution graph to inspect its input,
output, errors and attempts.
```

### Node selected without execution

Display:

```text
No execution recorded

This node has not executed yet.
```

The node definition should still be visible, including:

- Name
- Description
- Type
- Current presentation status

### Node with one execution

Display:

- Node name and description.
- Status.
- Activation identifier.
- Attempt number.
- Started and finished timestamps.
- Duration.
- Status message.
- Input.
- Output.
- Error.

### Node with multiple executions

The inspector must distinguish:

- Separate activations.
- Retries within an activation.

History uses a grouped selector or list: activation is the group, and attempts are children ordered
by attempt number. The initially selected record follows the deterministic execution ordering
defined by the public model. A timeline is deferred because it suggests reliable chronological data
that not every consumer can provide.

Example:

```text
Activation loop-item-12
Attempt 2 of 3
Running
```

### Default payload section

Provide sections for:

- Input
- Output
- Error

Default expanded section:

- `phase: 'failed'`: Error.
- `phase: 'succeeded'` with output: Output.
- `phase: 'active'`: Input.
- `phase: 'waiting'`: Input.
- Otherwise: all collapsed.

Payload sections should be keyboard-accessible and independently collapsible.

## Payload availability states

The inspector must not treat missing data as an empty object.

Required presentations:

| State          | Default message                                    |
| -------------- | -------------------------------------------------- |
| `available`    | Render the supplied value                          |
| `pending`      | Waiting for data                                   |
| `not-recorded` | No data was recorded                               |
| `redacted`     | This data is not available because it was redacted |
| `unavailable`  | This data is unavailable                           |

The optional consumer-supplied message should override the default.

This is important for external applications where intermediate execution data may not be authorized for display.

## Custom templates

Consumers need to customize payloads and node details without replacing the graph.

Suggested template APIs:

```html
<tng-flow-execution-viewer ...>
  <ng-template
    tngFlowExecutionPayload="output"
    let-payload
    let-execution="execution"
    let-node="node"
  >
    <app-domain-output [value]="payload.value" />
  </ng-template>
</tng-flow-execution-viewer>
```

Potential template slots:

```text
tngFlowExecutionNodeSummary
tngFlowExecutionPayload="input"
tngFlowExecutionPayload="output"
tngFlowExecutionPayload="error"
tngFlowExecutionInspector
tngFlowExecutionState="loading"
tngFlowExecutionState="empty"
tngFlowExecutionState="error"
```

Template context should include:

- Node definition.
- Node presentation from the authoritative snapshot.
- Selected execution.
- All executions for the node.
- Payload kind.
- Payload value and availability.
- Viewer mode.
- Viewer state and state message for state templates.

A consumer-provided complete inspector template should take precedence over individual payload templates.

## Live-update behavior

The component does not own the live connection. It receives new immutable snapshots.

When only `snapshot` changes, the component must:

- Update statuses and payloads.
- Preserve graph viewport.
- Preserve zoom level.
- Preserve node selection if the node still exists.
- Preserve inspector collapsed/expanded state.
- Preserve the selected execution when it still exists.
- Avoid refitting the graph.
- Avoid recreating graph nodes unnecessarily.
- Avoid restarting connection animations unnecessarily.

The editor instance and graph DOM nodes must remain mounted during a snapshot-only update. Immutable
input does not mean every nested record must be recreated: consumers should retain unchanged
definition and payload references where practical.

When `snapshot.definitionId` does not equal `definition.id`, the viewer ignores the snapshot,
renders the definition with empty execution presentation and reports one development warning. It
must never project a stale snapshot onto the wrong graph.

Changing `definition.id` is a new graph. An uncontrolled viewport may perform the configured initial
fit after nodes render. A controlled viewport is never changed implicitly; the consumer may update
it or call `fitToScreen()`.

If the selected execution disappears, propose the first execution from the deterministic ordering.
If the inspected node disappears, propose `null`. If graph selection contains removed records, emit
the sanitized selection once, preserving IDs that are still valid. Do not repeatedly emit the same
normalization request when the consumer declines it.

Execution events must not be announced individually to screen readers. Meaningful status changes for the selected node may use a polite live region.

## Status behavior

Use `TngFlowNodeStatus` by default:

```text
idle
queued
running
retrying
waiting
awaiting-input
paused
completed
failed
skipped
cancelled
```

The generic status parameter should remain extensible:

```ts
TStatus extends string = TngFlowNodeStatus
```

The normalized `phase` drives generic UI behavior. `status` remains the consumer-visible engine
status and is humanized by default while preserving the original value in accessible text. Unknown
statuses receive a neutral tone and still work because ordering and progress do not depend on their
spelling.

Numeric progress is optional. When:

- `progress` is a number, show determinate progress.
- `progress` is `null` and phase is active, show indeterminate progress.
- No progress was supplied, do not invent a percentage.

The current core node resolver collapses omitted progress and `null` to the same value. Phase 0 must
solve this without widening or breaking the existing resolved-view property. Add a readonly
`progressSpecified` flag to `TngFlowResolvedNodeView` and an editor progress-display option with
`status-driven` and `explicit` modes. The existing editor default remains `status-driven`; the
execution viewer uses `explicit`. This preserves existing behavior while allowing omitted and
explicit-null progress to render differently.

## Responsive behavior

Desktop default:

```text
┌──────────────────────────────┬──────────────────┐
│                              │ Selected node    │
│       Execution graph        │                  │
│                              │ Input            │
│                              │ Output           │
│                              │ Error            │
└──────────────────────────────┴──────────────────┘
```

Narrow layout:

```text
┌──────────────────────────────┐
│       Execution graph        │
└──────────────────────────────┘
┌──────────────────────────────┐
│ Selected node inspector      │
└──────────────────────────────┘
```

Requirements:

- No horizontal page overflow.
- Inspector remains usable at 320px.
- Graph controls remain reachable.
- The inspector can be hidden when the embedding surface is small.
- Payload code blocks may scroll internally, but the entire viewer should not create nested two-axis scrolling.

`inspectorPosition="auto"` observes the component container. It uses a right-hand split above the
documented breakpoint and a vertical stack below it. Responsive orientation changes do not emit
`inspectorOpenChange`, because layout visibility and the consumer's controlled open state are
different concerns. Preserve the last user size independently for horizontal and vertical layouts.

The core editor currently has fixed default host height and minimum height. Phase 0 adds overridable
editor height/min-height CSS variables so the composite can fill its split pane without brittle
selector overrides. Resizing or changing split orientation must invoke the existing layout refresh
path without fitting or changing the viewport.

## Accessibility requirements

The component must:

- Preserve existing `TngFlowEditorComponent` keyboard navigation.
- Support keyboard node activation and selection.
- Give the graph an application-supplied accessible label.
- Associate the inspector with the selected node.
- Use visible text in addition to color for status.
- Use `aria-live="polite"` only for meaningful selected-node changes.
- Avoid announcing running duration every second.
- Expose progress using proper progress semantics.
- Preserve native focus indicators.
- Return focus predictably when the inspector is collapsed.
- Honour `prefers-reduced-motion`.
- Work in forced-color mode.
- Provide accessible names for inspector toggle and viewport controls.

The live region is empty on initial render. It announces only a change of `status`, `phase` or
`statusMessage` for the currently inspected node after the first snapshot. Progress ticks, duration
updates, payload changes and non-inspected nodes are not announced. If the inspector is collapsed
while focus is inside it, focus returns to the inspector toggle; otherwise focus is not moved.

## Theming requirements

The viewer must exclusively use TailNG semantic tokens.

It should support:

- Default TailNG theme.
- Light and dark modes.
- Brand theme overrides.
- Danger/warning/success status tones.
- High contrast and forced colors.

The component should not introduce application-specific colors or depend on Taskmesh CSS selectors.

## Performance requirements

Execution updates are expected to occur frequently.

The implementation should:

- Keep the workflow definition and execution presentation separate.
- Avoid re-running graph layout for status-only changes.
- Avoid remounting node templates for payload-only changes.
- Defer formatting large payloads until their section is opened.
- Avoid serializing the same payload repeatedly during change detection.
- Document the recommended graph and payload sizes.
- Remain functional when minimap rendering is simplified for large graphs.

## Error handling

The viewer should provide deterministic behavior for malformed snapshots:

- Execution references missing node: exclude from the inspector index and warn once in development.
- Presentation references missing node or connection: follow current `TngFlowPresentation` behavior.
- Snapshot `definitionId` mismatch: ignore the snapshot and warn once in development.
- Duplicate execution IDs: warn once in development and use the first record in array order.
- Selected node removed from the definition: propose `inspectedNodeIdChange(null)` and sanitize graph selection without discarding still-valid IDs.
- Selected execution removed: propose the first record in deterministic execution order.
- Invalid `attempt`, `maxAttempts`, `sequence`, `durationMs` or progress: ignore the invalid display value and warn once in development.
- Invalid timestamp: display a neutral unavailable value.
- Payload serialization failure: show “Payload cannot be displayed” without breaking the inspector.

Warnings are diagnostic only, are deduplicated per snapshot identity and revision, and never change
production rendering beyond the deterministic fallback behavior above.

## Packaging

Recommended exports:

```ts
import {
  TngFlowExecutionViewerComponent,
  TngFlowExecutionInspectorComponent,
  TngFlowExecutionPayloadComponent,
  TngFlowExecutionSnapshot,
  TngFlowNodeExecution,
  TngFlowExecutionPayload,
  TngFlowExecutionPhase,
  TngFlowExecutionActivatedEvent,
  TngFlowExecutionViewerState,
  TngFlowExecutionDateTimeFormatter,
} from '@tailng-ui/flow/execution';
```

Reasons for a secondary entry point:

- Keeps the core editor focused.
- Avoids adding inspector/split-view code to graph-only applications.
- Allows payload rendering dependencies to evolve independently.
- Provides clearer API ownership.
- Reduces risk to existing `@tailng-ui/flow` consumers.

Packaging work includes:

- Add `libs/tailng-ui/flow/src/execution/index.ts` as the only public execution barrel.
- Add `./execution` to the package export map, targeting the emitted JavaScript and declarations.
- Keep execution exports out of `libs/tailng-ui/flow/src/index.ts`.
- Extend the custom Flow build verification to assert that every export target exists.
- Add a packed-package consumer smoke test for both `@tailng-ui/flow` and
  `@tailng-ui/flow/execution`.
- Verify that importing the root entry point does not pull execution viewer code into a production
  bundle.

The entry point may depend on:

```text
@tailng-ui/flow
@tailng-ui/components
@tailng-ui/icons
```

It should not require:

```text
Taskmesh packages
Shiki
RxJS data services
Router packages
HTTP clients
CloudEvents libraries
```

## Proposed source layout

```text
libs/tailng-ui/flow/src/execution/
  index.ts
  lib/model/tng-flow-execution-index.ts
  lib/model/tng-flow-execution-order.ts
  lib/model/tng-flow-execution-selection.ts
  lib/model/tng-flow-execution-format.ts
  lib/types/tng-flow-execution.types.ts
  lib/payload/tng-flow-execution-payload.component.{ts,html,css}
  lib/payload/tng-flow-execution-payload-template.directive.ts
  lib/inspector/tng-flow-execution-inspector.component.{ts,html,css}
  lib/inspector/tng-flow-execution-inspector-template.directive.ts
  lib/viewer/tng-flow-execution-viewer.component.{ts,html,css}
  lib/viewer/tng-flow-execution-state-template.directive.ts
```

Pure model helpers must not depend on Angular or Foblex. Execution implementation files consume
core Flow APIs through the public `@tailng-ui/flow` boundary. The root Flow barrel must not import
the execution barrel.

Required core edits are limited to:

- Add `progressSpecified` to resolved node views without changing the existing `progress` type.
- Add an opt-in explicit progress-display mode; preserve the existing status-driven default.
- Make node progress rendering distinguish omitted, indeterminate and determinate values in explicit mode.
- Add CSS variables for editor host height and minimum height.
- Keep all existing defaults when those new variables and progress values are not supplied.

All component and helper tests are colocated with their implementation. Real-browser viewer tests
use the existing Flow browser-test configuration; the packed-package smoke fixture belongs under
`tools/build` so it verifies the published artifact rather than workspace path aliases.

## Testing requirements

Tests use deeply frozen definitions, snapshots, selections and payloads wherever mutation is not the
subject of the test. Each controlled-output test verifies event cardinality, ordering and that the
proposed value is not treated as accepted until it is supplied back.

### Contract and unit test cases

| ID       | Given                                                                | When                                                  | Then                                                                                            |
| -------- | -------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `EX-U01` | Public execution record types                                        | A compile-only fixture attempts to mutate every field | Compilation fails at each mutation and readonly arrays cannot be modified                       |
| `EX-U02` | Executions from several nodes                                        | The node execution index is built                     | Each node receives only its records and missing-node records are excluded                       |
| `EX-U03` | Active and terminal records with mixed sequence and timestamps       | Records are sorted                                    | Phase, sequence, timestamp, attempt and ID precedence exactly follows the documented comparator |
| `EX-U04` | Equal or invalid ordering fields                                     | Records are sorted repeatedly                         | The order is stable and ends with lexicographic ID order                                        |
| `EX-U05` | Two activation IDs with several attempts                             | History groups are built                              | Activations remain separate and attempts are not mislabeled as activations                      |
| `EX-U06` | `maxAttempts` is absent or present                                   | Attempt labels are formatted                          | Labels are respectively `Attempt N` and `Attempt N of M`                                        |
| `EX-U07` | A multi-node selection and an existing inspected node                | The inspector target is resolved                      | The current target is preserved if selected; otherwise definition order is used                 |
| `EX-U08` | A selected execution remains in a new snapshot                       | Snapshot selection is reconciled                      | The same execution ID remains selected                                                          |
| `EX-U09` | A selected execution is removed                                      | Snapshot selection is reconciled                      | The first deterministically ordered remaining record is proposed                                |
| `EX-U10` | Omitted and explicit payload states                                  | Sections are resolved                                 | Omitted sections are hidden and each explicit state gets its specified message                  |
| `EX-U11` | JSON objects, arrays, primitives and text                            | Payloads are formatted                                | Output is deterministic, escaped and tagged with the correct media type                         |
| `EX-U12` | Circular data, `BigInt`, throwing getters or unsupported binary data | Default serialization runs                            | It returns the serialization-error or unsupported fallback without throwing                     |
| `EX-U13` | Valid, missing and invalid timestamps plus `durationMs`              | Time details are formatted                            | Invalid values show unavailable; supplied valid duration is authoritative                       |
| `EX-U14` | Duplicate execution IDs                                              | The snapshot index is built                           | The first record wins and only one development warning is issued per revision                   |
| `EX-U15` | Custom status strings with normalized phases                         | Tone, ordering and default section are resolved       | Behavior follows phase while the custom status remains visible                                  |
| `EX-U16` | Snapshot and definition IDs differ                                   | Snapshot normalization runs                           | Snapshot presentation and executions are ignored and one development warning is issued          |
| `EX-U17` | Core status-driven and explicit progress modes                       | Progress is omitted, null or numeric                  | The legacy default is unchanged and explicit mode distinguishes all three states                |

### Angular component test cases

| ID       | Given                                                          | When                                                   | Then                                                                                        |
| -------- | -------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `EX-C01` | A valid definition and matching snapshot                       | The viewer renders                                     | Graph presentation and the selected-node inspector use the supplied records                 |
| `EX-C02` | Controlled graph selection                                     | The user selects a node without consumer write-back    | One proposal is emitted and the supplied controlled selection is restored                   |
| `EX-C03` | Selection changes the inspector target                         | One graph interaction occurs                           | `selectionChange` fires once before `inspectedNodeIdChange`                                 |
| `EX-C04` | A multi-node selection                                         | The consumer changes only `inspectedNodeId`            | Graph selection remains unchanged while inspector content changes                           |
| `EX-C05` | A selected execution                                           | The user chooses another attempt without write-back    | One `selectedExecutionIdChange` is emitted and controlled content remains selected          |
| `EX-C06` | A selected node with no executions                             | The inspector renders                                  | Node metadata and `No execution recorded` are visible                                       |
| `EX-C07` | No inspected node                                              | The inspector renders                                  | The neutral `Select a node` state is visible                                                |
| `EX-C08` | `mode="readonly"`                                              | Pointer and keyboard graph interactions occur          | No selection or activation output fires; externally controlled inspector data still renders |
| `EX-C09` | `showInspector=false`                                          | The viewer renders                                     | Only the graph is present and no hidden inspector controls remain focusable                 |
| `EX-C10` | Run payloads and node payloads are enabled                     | The user switches inspector scope                      | Run and node records appear in distinct labeled views                                       |
| `EX-C11` | Individual payload templates and a complete inspector template | Content is rendered                                    | The complete inspector template wins; otherwise only the matching payload slot wins         |
| `EX-C12` | `loading`, `empty` and `error` states with projected templates | State changes                                          | Correct state content renders without network or router services                            |
| `EX-C13` | A large closed payload section                                 | Change detection runs repeatedly                       | The formatter is not called until expansion and is memoized for the same payload reference  |
| `EX-C14` | Omitted, null and numeric progress                             | The execution renders                                  | Respectively no progress bar, indeterminate progress and determinate progress are exposed   |
| `EX-C15` | Frozen definition and snapshot inputs                          | Selection, expansion and snapshot reconciliation occur | No input object or nested collection is mutated                                             |
| `EX-C16` | A custom node and connection template                          | The composite viewer renders                           | Template contexts and execution presentation match direct editor composition                |

### Real-browser, accessibility and performance test cases

| ID       | Given                                                        | When                                                        | Then                                                                                                                    |
| -------- | ------------------------------------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `EX-B01` | A panned and zoomed graph                                    | Only the snapshot changes                                   | Position and scale remain exactly equal and no fit is requested                                                         |
| `EX-B02` | Rendered graph nodes and connections                         | Payload-only and presentation-only snapshots arrive         | Existing DOM elements retain identity and connection motion does not restart                                            |
| `EX-B03` | A horizontal split layout                                    | The inspector is resized or collapsed                       | Connection geometry refreshes without pan, zoom or fit changes                                                          |
| `EX-B04` | An embedding surface 320px wide                              | The viewer and large payload render                         | There is no page-level horizontal overflow; payload content scrolls internally                                          |
| `EX-B05` | `inspectorPosition="auto"`                                   | Container width crosses the breakpoint                      | Layout changes right-to-bottom using container size and preserves both orientation sizes                                |
| `EX-B06` | Keyboard focus on the graph                                  | The user navigates, selects and activates a node            | Existing editor keyboard behavior remains intact and the inspector association is announced                             |
| `EX-B07` | Focus inside an open inspector                               | The inspector is collapsed                                  | Focus returns to the named inspector toggle; collapsing elsewhere does not steal focus                                  |
| `EX-B08` | An initially rendered selected node                          | Snapshots change status, duration, progress and payloads    | The live region announces only later meaningful status/phase/message changes                                            |
| `EX-B09` | Reduced-motion preference                                    | Active connection presentation and viewport commands render | Connection and viewport animations are suppressed                                                                       |
| `EX-B10` | Forced-colors mode                                           | Graph, status, selection, payloads and controls render      | State remains distinguishable and focus indicators remain visible                                                       |
| `EX-B11` | A minimap near and over its documented render limit          | Snapshots update                                            | The viewer remains operable and uses the documented simplified behavior                                                 |
| `EX-B12` | Repeated immutable updates with unchanged payload references | Updates are profiled                                        | Layout and serialization call counts stay constant; measured baselines are recorded without flaky wall-clock assertions |

### Packaging test cases

| ID       | Given                                         | When                                                                | Then                                                                         |
| -------- | --------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `EX-P01` | A built and packed Flow package               | A clean Angular fixture imports the root and execution entry points | Both compile and run with public declarations intact                         |
| `EX-P02` | The package export map                        | Every declared target is resolved                                   | JavaScript, declarations and styles exist at each target                     |
| `EX-P03` | A fixture importing only `@tailng-ui/flow`    | Its production bundle is inspected                                  | Execution inspector and payload code are absent                              |
| `EX-P04` | A fixture importing the execution entry point | Dependency metadata and bundle imports are inspected                | No Taskmesh, networking, router, CloudEvents or Shiki dependency is required |

### Visual examples

Provide stories/examples for:

- [x] Queued workflow.
- [x] Running node.
- [x] Retrying node.
- [x] Waiting for human input.
- [x] Successful workflow.
- [x] Failed node with error.
- [x] Skipped branch.
- [x] Parallel execution.
- [x] Loop with multiple activations.
- [x] Redacted payloads.
- [x] Large JSON payload.
- [x] Dark mode.
- [x] Narrow embedding surface.
- [x] Controlled node movement and custom-point connection creation, reconnection, and deletion.

## Acceptance criteria

The feature is complete when:

1. [x] A consumer can render a workflow execution from a `TngFlowDefinition` and a matching
       normalized execution snapshot.
2. [x] A mismatched snapshot can never project execution data onto another definition.
3. [x] Snapshot updates change status and payload content without resetting viewport, remounting
       graph records or restarting unchanged motion.
4. [x] Graph selection, inspected node and selected execution follow their controlled contracts and
       event ordering.
5. [x] Multiple activations and retry attempts are grouped and ordered deterministically.
6. [x] Input/output/error distinguish omitted, pending, not-recorded, unavailable and redacted
       states.
7. [x] Custom statuses work through normalized phases and progress preserves omitted versus
       indeterminate state.
8. [x] The consumer can replace individual payload rendering or the complete inspector.
9. [x] Graph-only and graph-with-inspector configurations support edit, inspect, and readonly mode
       through one documented public input.
10. [x] The viewer is responsive down to a 320px-wide embedding surface based on container size.
11. [x] Status, selection, payload state and progress are accessible without relying on color.
12. [x] Reduced-motion and forced-color environments are supported by inherited core behavior and
        forced-color CSS coverage.
13. [x] The secondary entry point introduces no Taskmesh, networking, router, CloudEvents or Shiki
        dependency.
14. [ ] Documentation includes immutable-signal live updates, controlled-state examples and adapter
        guidance.
15. [x] Existing `TngFlowEditorComponent` behavior and root-only bundle usage remain
        backward-compatible.
16. [ ] All applicable `EX-*` cases pass, including packed-package and real-browser verification.
        Current status: unit and real-browser tests pass; direct build and export-map checks pass; a
        packed-package consumer fixture is still required.

## Suggested delivery phases

### Phase 0: Contract and core prerequisites

- [x] Approve the readonly execution model, normalized phase, ordering and payload semantics.
- [x] Approve controlled state, defaults, event types and event ordering.
- [x] Amend the production contract for owning-entry-point exports and clarify its compatibility
      floor.
- [x] Add the backward-compatible `progressSpecified` and explicit progress-display core contracts.
- [x] Add overridable core editor height and minimum-height CSS variables.
- [x] Reserve the `./execution` package export and add compile-time public API tests.

Exit gate: complete for implementation. Core Flow regression tests pass with frozen inputs;
execution exports compile through the package build.

### Phase 1: Foundation and standalone inspector

- [x] Public execution types.
- [x] Pure indexing, grouping, ordering, validation and formatting helpers.
- [x] Standalone execution inspector.
- [x] Payload availability model.
- [x] Lazy default JSON/text renderer using the plain TailNG code block.
- [x] Run/node inspector scopes.
- [x] Stories and examples.
- [x] Tests.

Exit gate: complete except stories/examples. Pure helper and standalone component unit tests pass.

### Phase 2: Composite viewer

- [x] Graph and inspector composition.
- [x] Forwarded graph templates and non-editing presentation options.
- [x] Container-responsive split layout.
- [x] Controlled graph selection, inspector target, execution selection and viewport.
- [x] Inspector collapse behavior.
- [x] Stable viewport during execution updates.

Exit gate: implementation complete with targeted component and browser coverage. Full named
`EX-C*` and `EX-B01` through `EX-B07` fixture parity is still tracked under the stable-release gate.

### Phase 3: Extensibility and hardening

- [x] Custom payload templates.
- [x] Complete inspector override.
- [x] Multiple activation UX.
- [ ] Large-payload optimization.
- [x] Accessibility and real-browser smoke coverage.
- [ ] Full visual regression coverage.
- [ ] Packed-package consumer-fixture coverage.
- [x] Root-bundle isolation export check.
- [ ] Measured and documented graph, minimap and payload guidance.
- [ ] Public documentation.

Exit gate: not complete. Keep the entry point experimental until all `EX-B*` and `EX-P*` cases
pass, visual examples are reviewed in light, dark, forced-color and narrow layouts, and the entry
point can be exercised by a second consumer.

## Ownership boundary

TailNG team owns:

- Generic execution viewer.
- Inspector and payload presentation.
- Controlled component behavior.
- Accessibility, theming and responsive layout.
- Public TailNG types and documentation.

Taskmesh/application teams own:

- Workflow-definition adapters.
- Runtime status mapping.
- Branch and connection-state projection.
- API calls.
- Authentication and authorization.
- SSE, polling, webhooks or WebSocket transport.
- Payload redaction.
- CloudEvents processing.
- URL synchronization.
- Taskmesh-specific actions such as cancel, retry or open human task.

## Measurements required before stable release

These values are intentionally not frozen until browser examples are profiled:

1. The default container breakpoint between right-hand and bottom inspector layouts.
2. Recommended node and connection counts with and without the minimap.
3. Default payload character, depth and expansion limits.
4. Whether payload truncation should allow copying the full value or only the rendered value.
5. The update-frequency guidance for consumers receiving high-volume live snapshots.

Changing these measured defaults while the entry point is experimental does not change the data,
ownership or event-ordering contracts above.
