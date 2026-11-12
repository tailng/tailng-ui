# `@tailng-ui/ai` Delivery and Verification Plan

Status: In progress; TDD required

## Delivery strategy

Deliver contracts and executable failing tests before production behavior. Each implementation
slice follows Specify, Red, Green, Refactor, Verify and must leave a buildable, tested boundary.
Later phases must not reinterpret already published types.

The complete case inventory is indexed in [the TDD test catalog](./tests/README.md). Case IDs must
appear in executable test names and in the implementation review that turns them green.

### Phase gate applied to every implementation phase

1. **Specify:** Approve the catalog IDs and fixtures for the slice.
2. **Red:** Add executable tests and confirm they fail for the intended missing behavior.
3. **Green:** Add only enough production code to satisfy the selected cases.
4. **Refactor:** Improve design while the selected and regression suites remain green.
5. **Verify:** Run type, unit, component, browser, integration, package, security, and performance
   suites required by those case IDs.

No phase may combine the Red and Green changes without recording that the tests were observed red.

## Phase 0: Contract and test-specification approval

Deliverables:

- [ ] Approve package and entry-point ownership.
- [ ] Approve the canonical message-parts model.
- [ ] Approve AG-UI required and complete conformance profiles.
- [ ] Approve history and virtualization ownership.
- [ ] Approve security defaults for hidden roles, reasoning, Markdown, URLs, and extensions.
- [ ] Decide whether generic virtual scroll lands in CDK during this project or initially remains
      internal with an extraction gate.
- [ ] Approve every test-catalog document and its case IDs.
- [ ] Approve fixture inventory, test levels, browser ownership, performance budgets, and security
      negative cases.
- [ ] Establish the traceability format from case ID to executable test and delivery phase.

Exit criteria:

- [ ] No unresolved decision changes the public message or action model.
- [ ] No AG-UI or Mastra type appears in the primary package API.
- [ ] Long-history behavior has explicit memory and DOM budgets.
- [ ] First-release scope and deferred features are documented.
- [ ] Every first-release requirement maps to one or more catalog case IDs.
- [ ] No production behavior is authorized without an approved Red test.

## Phase 1: Package scaffold and canonical model

Red gate:

- [x] Add compile-time contract tests and failing unit tests for `AI-CORE-*`, `AI-STORE-*`, and
      `AI-HIST-*` cases selected for this phase.
- [x] Add deeply frozen core/history fixtures.
- [x] Confirm failures are behavioral rather than unresolved imports or broken scaffolding.

Deliverables:

- [x] Create the `libs/tailng-ui/ai` Angular package.
- [x] Add primary and `ag-ui` secondary entry points.
- [x] Add Nx build, lint, unit-test, release, and package metadata.
- [x] Implement JSON, thread, run, message, part, error, usage, and action types.
- [x] Implement pure normalized-store helpers and selectors.
- [x] Implement safe unsupported-part behavior at the model/registry boundary.

Exit criteria:

- [x] Package builds without Mastra, CopilotKit, Foblex, or a provider SDK.
- [x] Public records are readonly and JSON serializable.
- [x] Reducers do not mutate deeply frozen input.
- [x] Export and package-consumer tests pass.
- [x] Every implemented core/store/history behavior has a green catalog ID.

## Phase 2: AG-UI required chat profile

Red gate:

- [ ] Add failing `AI-AGUI-BASE`, `RUN`, `TEXT`, `TOOL`, `STATE` snapshot, conversion, and transport
      cases for the required chat profile.
- [ ] Add official-schema-derived and malformed lifecycle fixtures before reducer logic.

Deliverables:

- [x] Add `@ag-ui/core` as an optional peer and development dependency for the secondary entry point.
- [x] Validate required-profile events.
- [x] Implement text, run, tool-call, result, and message-snapshot reduction.
- [ ] Implement materialized-message conversion in both required directions.
- [ ] Add structured adapter diagnostics and configurable input limits.
- [ ] Add an application-supplied transport interface with cancellation.

Exit criteria:

- [ ] Official 1.0 fixtures for supported events reduce correctly.
- [x] Text and tool streaming preserve stable IDs.
- [x] Invalid tool arguments remain inspectable without throwing.
- [x] Snapshots reconcile without duplicating messages.
- [x] Malformed and oversized events fail safely.
- [x] Required-profile event coverage is 100% for the selected catalog IDs.

## Phase 3: Headless chat and composer

Red gate:

- [ ] Add failing `AI-CMP-ROOT`, `LIST`, `MSG`, `COMP`, `ATT`, `ACT`, and applicable `AI-A11Y` cases.
- [ ] Use the smallest component shells necessary for tests to compile; shells contain no behavior.

Deliverables:

- [ ] Implement chat root context and typed action channel.
- [ ] Implement message list, message semantics, content dispatch, status, and empty state.
- [ ] Implement composer draft, keyboard, IME, send/stop, and attachment-selection behavior.
- [ ] Implement plain-text, tool, file, source, activity, and unsupported renderers.
- [ ] Implement accessible status announcements.
- [ ] Reuse existing TailNG primitives where contracts match.

Exit criteria:

- [ ] A consumer can build a complete unstyled chat using controlled messages.
- [ ] No component creates a network request or runs a tool.
- [ ] Keyboard, screen-reader, high-contrast, and reduced-motion checks pass.
- [ ] Unknown content never executes or disappears silently.
- [ ] Every public input/output and documented keyboard behavior maps to a green case ID.

## Phase 4: Long-history viewport

Red gate:

- [ ] Add deterministic failing `AI-VIRT-RANGE`, `AI-VIRT-ANCHOR`, and `AI-PERF-*` unit tests with an
      injected scheduler and measurements.
- [ ] Add failing real-browser anchor, focus, DOM-budget, and cleanup tests before viewport behavior.

Deliverables:

- [ ] Implement cursor history-source integration.
- [ ] Implement normalized page tracking, deduplication, cancellation, and eviction.
- [ ] Implement variable-height visible-range calculation and measurement.
- [ ] Implement follow mode, jump-to-latest, unseen count, and history prefetch.
- [ ] Implement anchor preservation for prepend and dynamic height changes.
- [ ] Add real-browser performance and memory tests.

Exit criteria:

- [ ] 10,000-message test does not mount an unbounded DOM.
- [ ] Prepending and resizing preserve the visual anchor.
- [ ] Stream updates do not re-render unrelated messages.
- [ ] Repeated load/evict and thread-switch cycles stabilize memory.
- [ ] Performance reports cover every `AI-PERF-BUDGET` case.

## Phase 5: Styled components and theme contract

Red gate:

- [ ] Add failing responsive, theme, forced-colors, zoom, touch-target, RTL, and mobile-keyboard cases.
- [ ] Capture only semantic/behavioral expectations; avoid pixel snapshots of incidental styling.

Deliverables:

- [ ] Implement minimum-style compound components.
- [ ] Add semantic AI/chat theme tokens with preset defaults.
- [ ] Support full-width and bubble presentation examples.
- [ ] Add responsive mobile, RTL, long-code, long-link, and large-text layouts.
- [ ] Add plain CSS and Tailwind playground examples.

Exit criteria:

- [ ] Styled components require no application-specific CSS for a usable baseline.
- [ ] Both presentation styles use the same behavioral primitives.
- [ ] Theme presets meet contrast and visible-focus requirements.
- [ ] Mobile keyboard and safe areas do not obscure the latest message or composer.
- [ ] Representative styled states pass automated and manual accessibility catalog cases.

## Phase 6: Complete AG-UI 1.0 profile

Red gate:

- [ ] Add failing step, reasoning, state/delta, activity, subagent, custom, and raw `AI-AGUI` cases.
- [ ] Add prototype-pollution, patch-limit, hidden-reasoning, and unknown-extension negative fixtures.

Deliverables:

- [ ] Add step, state, activity, reasoning, subagent, raw, and custom event handling.
- [ ] Add safe JSON Patch application with limits.
- [ ] Add reasoning visibility policy and attributed-subagent presentation hooks.
- [ ] Add namespaced custom-event registry.
- [ ] Add complete-profile conformance fixtures.

Exit criteria:

- [ ] Every AG-UI 1.0 event family is handled or explicitly ignored according to the spec.
- [ ] State/activity deltas apply immutably and reject unsafe patches.
- [ ] Reasoning and raw events remain non-visible by default.
- [ ] Custom events require registered validation and renderers.
- [ ] Complete-profile event-family coverage is 100%.

## Phase 7: Mastra reference integration

Red gate:

- [ ] Add failing `AI-AGUI-MASTRA`, `AI-AGUI-TRANS`, and relevant `AI-INT-E2E` cases against a pinned
      reference stack before application wiring.
- [ ] Record expected incompatibilities as explicit skipped cases with owner and removal condition.

Deliverables:

- [ ] Add a reference Mastra agent using `@ag-ui/mastra` outside the published TailNG package.
- [ ] Demonstrate persistent `threadId`, streaming text, tools, stop, retry, and history loading.
- [ ] Document server-history and client-history integration modes.
- [ ] Test the supported package-version matrix.
- [ ] Document known Mastra/model limitations for frontend tool round trips.

Exit criteria:

- [ ] Reference integration has no Mastra dependency in `@tailng-ui/ai`.
- [ ] Agent stream passes required-profile integration tests.
- [ ] Authentication and tenant state remain server-owned.
- [ ] Long history is cursor loaded and is not resent unboundedly by default.
- [ ] Every supported Mastra flow has a green end-to-end case.

## Phase 8: Documentation, registry, and release

Red gate:

- [ ] Add failing packed-consumer, export-map, dependency-boundary, SSR, and supported-Angular-version
      cases from `AI-PKG-*` before release configuration.
- [ ] Generate the requirement-to-test traceability report and fail release verification for missing IDs.

Deliverables:

- [ ] Add human documentation: overview, API, styling, examples, accessibility, performance, and AG-UI.
- [x] Add AI-readable documentation following the existing docs catalog structure.
- [ ] Complete the dedicated [CI/CD integration plan](./ci-cd-integration.md), including its
      `AI-CICD-*` tests, OIDC prerequisites, preview release, and recovery gates.
- [ ] Add copy-own registry artifacts only after public APIs stabilize.
- [ ] Add CLI support if AI components meet registry ownership requirements.
- [ ] Publish migration and compatibility notes.

Exit criteria:

- [ ] Every public input, output, type, token, slot, and data attribute is documented.
- [ ] Examples cover controlled state and failure/recovery, not only a successful demo.
- [ ] Package and secondary entry-point installation is verified from packed artifacts.
- [ ] Release notes state the implemented AG-UI conformance profile.
- [ ] Every non-deferred catalog case is green or has an approved release-blocking disposition.

## Test matrix

### Pure model and reducer tests

- [ ] JSON serializability and round trips.
- [ ] Immutable update behavior.
- [ ] Message and part ID stability.
- [ ] Duplicate and conflicting ID diagnostics.
- [ ] Text and tool lifecycle state machines.
- [ ] Snapshot reconciliation.
- [ ] Unknown metadata and extensions.
- [ ] Error and finish-reason mapping.
- [ ] Cache pinning and eviction decisions.

### Protocol conformance tests

- [ ] Every supported event shape.
- [ ] Empty, fragmented, malformed, duplicated, and out-of-order lifecycle sequences.
- [ ] Parallel tool calls and interleaved text.
- [ ] Missing timestamps and misleading timestamps.
- [ ] Payload depth and size limits.
- [ ] State and activity patch safety.
- [ ] Reasoning visibility.
- [ ] Custom and raw event isolation.

### Angular component tests

- [ ] Projection and compound-part registration.
- [ ] Controlled input updates.
- [ ] Stable component identity during streaming.
- [ ] Composer keyboard and IME behavior.
- [ ] Attachment selection and application-owned upload state.
- [ ] Action request payloads and cardinality.
- [ ] Renderer registration and safe fallback.
- [ ] Accessible labels, roles, descriptions, and status messages.

### Real-browser tests

- [ ] Variable-height measurement.
- [ ] Prepend anchoring.
- [ ] Follow-mode transitions.
- [ ] Image and code-block resize.
- [ ] Focus retention across virtualization.
- [ ] Mobile viewport and virtual keyboard.
- [ ] Pointer, keyboard, and touch action access.
- [ ] Reduced motion, forced colors, zoom, large text, and RTL.
- [ ] Heap stability during repeated stream, pagination, and thread switching.

### Integration tests

- [ ] AG-UI transport cancellation.
- [ ] Reconnect/snapshot reconciliation according to transport policy.
- [ ] Mastra agent streaming.
- [ ] Mastra tool call/result mapping.
- [ ] Server-history and client-history modes.
- [ ] Expired authentication and authorization failure presentation.
- [ ] Rate limit, network loss, partial response, and retry.

## Security verification

- [ ] Markdown HTML is sanitized by the configured renderer.
- [ ] Dangerous link and media schemes are rejected.
- [ ] Tool arguments and results never execute automatically.
- [ ] System/developer messages are hidden by default.
- [ ] Raw and encrypted reasoning is never displayed.
- [ ] Extension names require registration and validation.
- [ ] JSON Patch cannot modify prototypes or escape its target.
- [ ] Logs redact message content, tool input, credentials, and provider payloads by default.
- [ ] File previews use authorized URLs and application-owned validation.
- [ ] Message and snapshot size limits are tested.

## Documentation pages

Recommended human documentation structure:

```text
AI
├── Overview
├── Installation
├── Message model
├── Chat
│   ├── Overview
│   ├── API
│   ├── Styling
│   ├── Accessibility
│   ├── Performance
│   └── Examples
├── AG-UI
│   ├── Overview
│   ├── Transport adapter
│   ├── Mastra
│   └── Troubleshooting
└── Renderers
    ├── Markdown
    ├── Tools and activities
    ├── Files and sources
    └── Extensions
```

Minimum examples:

- [x] Controlled local transcript without a backend.
- [x] Streaming AG-UI text.
- [ ] Tool call with approval and result.
- [x] Cursor-loaded long conversation.
- [ ] Stop, partial response, retry, and network failure.
- [ ] Custom renderer with safe validation.
- [ ] Full-width and bubble styling.
- [ ] Accessible keyboard-only interaction.

## Release gates

The package is not ready for a stable release until:

- [ ] Package boundaries and canonical model are approved.
- [ ] Required AG-UI profile passes conformance fixtures.
- [ ] Public components remain transport- and provider-neutral.
- [ ] Long-thread rendering and memory are bounded.
- [ ] Accessibility is verified in a real browser and with screen-reader smoke tests.
- [ ] Security defaults are documented and tested.
- [ ] Packed-package consumer builds pass for the supported Angular versions.
- [ ] Reference Mastra integration passes without entering the primary dependency graph.
- [ ] The documentation identifies all deferred protocol and renderer features.

## Deferred RFCs

The following require separate RFCs after the first release:

- [ ] A2UI native component-catalog rendering.
- [ ] MCP Apps sandbox host integration.
- [ ] Vercel AI SDK UI adapter.
- [ ] Voice and realtime audio conversation.
- [ ] Conversation branching UX.
- [ ] Multi-agent topology visualization.
- [ ] AI-to-Flow workflow mutation adapters.
- [ ] Offline-first transcript synchronization.
- [ ] Cross-tab active-run coordination.
