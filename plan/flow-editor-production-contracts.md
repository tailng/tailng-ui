# Flow Editor Production Contracts

Status: Accepted for Phase 0

Compatibility floor: `@tailng-ui/flow` 0.9.0
Scope: Contracts only; feature behavior lands in later phases.

## Purpose

This document freezes the ownership, compatibility, naming, mode, and event-ordering contracts for
the production Flow Editor enhancements. It deliberately does not prescribe a renderer-specific
implementation.

## Baseline audit

The published 0.9.0 package declarations were compared with the current development source. The
public editor inputs, outputs, methods, models, validation helpers, and exports match. All contracts
introduced by this phase are additive to that compatibility floor. The package version may advance
without changing this compatibility promise.

The package continues to expose TailNG types only. Foblex remains an implementation dependency and
must not appear in a new public signature.

## Non-negotiable ownership

The application owns:

- Workflow node and connection records.
- Node and connection IDs.
- Controlled selection and viewport snapshots.
- Persistence, history, clipboard serialization, and pasted-fragment validation.
- Context-menu content and domain actions.
- Applying every graph mutation requested by TailNG.

TailNG owns:

- Rendering and measuring the supplied snapshot.
- Interaction semantics, focus, announcements, and mode enforcement.
- Built-in and consumer-supplied connection validation orchestration.
- Translating user interactions into typed, operation-level requests.
- Optional viewport presentation after a controlled update is applied.

TailNG must never mutate a supplied definition, create workflow IDs, maintain an undo stack, or own
clipboard data.

## Capability matrix

| Capability                        | `edit` | `inspect` | `readonly` |
| --------------------------------- | -----: | --------: | ---------: |
| Layout authoring                  |    Yes |        No |         No |
| Node/connection navigation        |    Yes |       Yes |         No |
| Viewport navigation               |    Yes |       Yes |        Yes |
| Selection and activation          |    Yes |       Yes |         No |
| Move, connect, delete             |    Yes |        No |         No |
| Copy command                      |    Yes |       Yes |         No |
| Undo, redo, cut, paste, duplicate |    Yes |        No |         No |
| Context-menu request              |    Yes |       Yes |         No |

API calls follow the same matrix as controls and keyboard requests. An application can always apply
a new external snapshot directly; editor request methods do not bypass the active mode.

## Automatic layout

### Public boundary

`TngFlowLayoutEngine` receives an engine-neutral, readonly graph containing original TailNG records
and measured node bounds. It returns node positions only. A renderer-specific adapter translates
between this contract and its engine.

The first official adapter will be published separately as `@tailng-ui/flow-layout-dagre`. The core
Flow package does not gain a mandatory layout-engine dependency.

### Resolved defaults

| Option                     | Default         |
| -------------------------- | --------------- |
| `direction`                | `left-to-right` |
| `nodeSpacing`              | `48`            |
| `levelSpacing`             | `120`           |
| `componentSpacing`         | `64`            |
| `preserveLockedNodes`      | `true`          |
| `includeDisconnectedNodes` | `true`          |
| `viewport.fit`             | `false`         |
| `viewport.animated`        | `false`         |
| `viewport.padding`         | `48`            |

Calculation options and viewport effects remain separate. `animated`, fitting, and padding never
influence calculated coordinates.

### Operation contract

`requestAutoLayout(options, source)` will:

1. Reject requests outside edit mode or before usable rendered geometry exists.
2. Create a stable snapshot sorted by node and connection ID.
3. Ignore incomplete connections without throwing.
4. Invoke the configured engine once.
5. Preserve locked positions, pack disconnected components, resolve overlaps, snap when configured,
   and remove moves within the position tolerance.
6. Emit one `TngFlowNodesLayoutRequest` for the complete operation, including an empty `nodes` array
   when a valid request is already stable.
7. Wait for matching controlled positions before applying optional viewport effects.

Cycles must produce a deterministic result or a typed rejection; they must never crash the editor.

## Keyboard authoring

The default keyboard model remains navigation-first:

| Key                               | Behavior                                |
| --------------------------------- | --------------------------------------- |
| Arrow                             | Spatial graph navigation                |
| Control/Command + Arrow           | Topology navigation                     |
| Shift + Arrow                     | Extend selection                        |
| Space                             | Grab or drop the selected movable nodes |
| Arrow while grabbed               | Move by the normal step                 |
| Shift + Arrow while grabbed       | Move by the large step                  |
| C                                 | Begin connection authoring              |
| Enter or Space in connection mode | Choose or confirm a port                |
| Escape                            | Cancel the active operation             |
| Delete or Backspace               | Request controlled deletion             |

When `moveStep` is omitted, movement uses `gridSize` if snapping is enabled and one canvas unit
otherwise. `largeMoveStep` defaults to ten times the normal step. One shared delta is applied to a
multi-node selection so relative positions do not change.

Shortcuts never intercept events from inputs, textareas, selects, contenteditable elements, native
interactive controls, or controls projected by a custom node or connection template.

## Connection content

`label` and `description` are optional additive connection-model fields. A default label is rendered
only when `label` is present.

Custom connection templates receive `TngFlowConnectionTemplateContext`. They replace connection
content only; TailNG retains the path, midpoint placement, selection, reassignment, validation, and
accessibility semantics. A public midpoint coordinate is intentionally omitted until the renderer
can supply the true midpoint of every supported path type.

## Command requests

Command shortcut interception is opt-in. The planned `commandShortcuts` input defaults to `false`
and accepts either `true` or an explicit command allow-list.

`commandRequested` supplies the controlled selection and an optional canvas anchor. TailNG never
reads or writes clipboard payloads and never applies history. Paste and duplicate use the last known
pointer position when available and the visible viewport centre otherwise.

## Context-menu requests

Custom context-menu interception is opt-in and disabled by default. Coordinates are named
`clientPosition` and `canvasPosition`; `screenPosition` is not used because physical-screen
coordinates are unsuitable for browser overlay placement.

For an unselected selectable node or connection, TailNG emits `selectionChange` first, followed in
the same interaction turn by `contextMenuRequested`. The menu request contains the proposed
selection, even though the consumer has not yet written it back. A consumer that rejects the
selection should also decline the menu request.

Keyboard context menus use the active graph element's visual centre. The editor viewport centre is
the fallback when no graph element is active.

## Alignment and distribution

Pure arrangement utilities accept `TngFlowNodeBounds`; node positions alone cannot correctly align
or distribute differently sized custom nodes. Utilities return `TngFlowNodeMove[]` and never mutate
their inputs.

Locked nodes either act as fixed anchors or are ignored, according to the explicit option. Smart
guides are presentation helpers only. They may influence the emitted move but never write graph
state directly.

## Compatibility rules

- Existing 0.9 inputs, outputs, methods, selectors, and deprecated aliases remain available except
  for the former graph-level `readonly` boolean, which is intentionally removed in favor of the
  single `mode: 'edit' | 'inspect' | 'readonly'` contract.
- New shortcut and context-menu interception is disabled by default.
- New heavy integrations are optional packages, not core runtime dependencies.
- New public records are readonly and use TailNG model types exclusively.
- Reduced-motion preferences override requested animation.
- Every new input, output, request, result, template context, and provider contract is exported from
  its owning public entry point. Core editor contracts belong to `@tailng-ui/flow`; isolated
  execution-viewer contracts may belong to `@tailng-ui/flow/execution`.

## Verification gates

Unit tests cover type exports, mode decisions, event cardinality, event ordering, validation, and
frozen input snapshots. Real-browser tests cover measured geometry, focus, keyboard interaction,
zoom, connection content placement, and reduced motion.

No feature phase is complete until its controlled request can be applied by a consumer to create a
new snapshot while the original deeply frozen snapshot remains unchanged.

## Deferred RFCs

Group/container nodes, subflows, annotations, large-graph virtualization, and an editable code
editor require separate ownership and accessibility reviews. They are not part of this delivery
track.
