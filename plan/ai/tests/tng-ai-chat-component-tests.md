# `tng-ai-chat` TDD Test Catalog

Status: Initial release scope implemented and verified; unchecked cases remain deferred

Component plan: [../tng-ai-chat-component.md](../tng-ai-chat-component.md)

## TDD execution rules

- [x] Give every new component test the stable ID shown in this catalog.
- [x] Add the selected release-scope tests before their production behavior.
- [x] Run the smallest relevant suite and observe the selected tests fail for the intended reason.
- [ ] Record false-green tests as defects and correct them before implementation continues.
- [x] Implement only enough behavior to satisfy the current Red test group.
- [x] Refactor only while the current and preceding groups remain green.
- [x] Use Angular DOM tests for component contracts and browser tests for real scrolling, focus,
      resizing, and performance behavior.
- [x] Keep fixtures deterministic; do not require a live model, Mastra server, or network connection.
- [x] Test public behavior rather than private field or method names.
- [ ] Keep security, accessibility, and cleanup cases in the release-blocking suite.

## Shared fixtures and harnesses

- [ ] `AIC-FIX-001` Create canonical user, assistant, tool, activity, source, file, extension, and
      unsupported message fixtures.
- [ ] `AIC-FIX-002` Create streaming fixture updates that preserve stable message and part IDs.
- [ ] `AIC-FIX-003` Create cursor-prepend history fixtures with variable message heights.
- [ ] `AIC-FIX-004` Create a 10,000-message long-thread fixture without constructing 10,000 Angular
      renderer components eagerly.
- [ ] `AIC-FIX-005` Create custom header test components for success, update, type change, and
      initialization failure.
- [ ] `AIC-FIX-006` Create custom part test components for success, action emission, update, throw,
      and destruction tracking.
- [ ] `AIC-FIX-007` Create a component harness for composer entry, message lookup, scroll controls,
      status lookup, and emitted-event inspection.
- [ ] `AIC-FIX-008` Create a browser geometry harness for scroll height, client height, dynamic row
      resizing, reduced motion, and focus tracking.
- [ ] `AIC-FIX-009` Create assistive-technology assertions for names, roles, descriptions, live
      regions, and keyboard order.
- [ ] `AIC-FIX-010` Create retained-instance and observer counters for lifecycle and memory tests.

## Public API and package tests

- [ ] `AIC-API-001` The primary entry point exports `TngAiChatComponent`.
- [ ] `AIC-API-002` The primary entry point exports renderer configuration and context types.
- [ ] `AIC-API-003` The primary entry point exports custom header and message-part context tokens.
- [ ] `AIC-API-004` The primary entry point exports the renderer provider helper.
- [x] `AIC-API-005` The component selector is `tng-ai-chat`.
- [ ] `AIC-API-006` The component public API does not expose AG-UI event types.
- [ ] `AIC-API-007` The component public API does not require Mastra packages.
- [ ] `AIC-API-008` The component is not exported from `@tailng-ui/primitives`.
- [ ] `AIC-API-009` The package build has no dependency cycle among AI, components, icons, and
      primitives.
- [ ] `AIC-API-010` Core-only AI imports remain tree-shakeable without retaining the chat component.
- [ ] `AIC-API-011` Package metadata declares all required Angular and TailNG peer dependencies.
- [ ] `AIC-API-012` The packed npm artifact contains the component styles, declarations, and public
      exports.

## Root shell and default presentation tests

- [x] `AIC-SHELL-001` The component renders an accessible labelled chat region.
- [x] `AIC-SHELL-002` The default header renders when no custom header is supplied.
- [x] `AIC-SHELL-003` The default header displays configured title, subtitle, assistant label, and
      protocol label.
- [x] `AIC-SHELL-004` Omitting optional header labels does not leave empty visual or accessible
      elements.
- [x] `AIC-SHELL-005` Ordered messages render as one accessible transcript list.
- [x] `AIC-SHELL-006` Empty messages render the documented empty state.
- [x] `AIC-SHELL-007` Busy, disabled, and readonly states expose stable data attributes.
- [ ] `AIC-SHELL-008` Readonly mode preserves transcript navigation while preventing mutation
      actions.
- [ ] `AIC-SHELL-009` Updating state inputs updates the existing component without resetting scroll
      or draft state unnecessarily.
- [x] `AIC-SHELL-010` Opaque message IDs cannot inject markup or invalid DOM selectors.

## Custom header component tests

- [x] `AIC-HEADER-001` Supplying `headerComponent` replaces only the default header region.
- [x] `AIC-HEADER-002` The custom header receives the correct isolated header context.
- [x] `AIC-HEADER-003` Header context contains current labels, status, and busy state.
- [x] `AIC-HEADER-004` Updating ordinary header state updates context without recreating the custom
      component.
- [ ] `AIC-HEADER-005` Changing the custom header type destroys the previous component exactly once.
- [x] `AIC-HEADER-006` Removing the custom header restores the default header.
- [ ] `AIC-HEADER-007` Destroying the chat destroys the custom header and its injector.
- [ ] `AIC-HEADER-008` A custom-header initialization failure falls back to the default header and
      preserves the transcript.
- [ ] `AIC-HEADER-009` A custom header cannot replace or remove the transcript's accessible label.
- [ ] `AIC-HEADER-010` Header actions emit typed chat requests rather than native DOM events.
- [ ] `AIC-HEADER-011` Two chat instances using the same header type receive independent contexts.
- [ ] `AIC-HEADER-012` Agent-provided header text cannot be treated as a component type.

## Built-in message and part rendering tests

- [ ] `AIC-PART-001` Messages render in the supplied order and parts render in message order.
- [ ] `AIC-PART-002` Plain text renders as text and does not interpret embedded HTML.
- [ ] `AIC-PART-003` Streaming text updates the same part element rather than duplicating it.
- [ ] `AIC-PART-004` Markdown without a registered adapter falls back to readable plain text.
- [ ] `AIC-PART-005` Hidden reasoning is not rendered or announced.
- [ ] `AIC-PART-006` Reasoning-summary content renders only when visibility is `summary`.
- [ ] `AIC-PART-007` Encrypted reasoning values never appear in DOM text or attributes.
- [ ] `AIC-PART-008` Tool calls render input-streaming, awaiting-approval, running, complete, failed,
      and cancelled states.
- [ ] `AIC-PART-009` Tool results enforce the configured visible payload limit.
- [ ] `AIC-PART-010` Source links allow safe schemes and reject unsafe schemes.
- [ ] `AIC-PART-011` File presentation does not place Base64 payloads into retained component state.
- [ ] `AIC-PART-012` Activity parts expose their status accessibly.
- [ ] `AIC-PART-013` Unsupported parts render the configured fallback instead of disappearing.
- [ ] `AIC-PART-014` A malformed part cannot break rendering of valid sibling parts.
- [ ] `AIC-PART-015` Stable message and part IDs preserve component identity across immutable updates.

## Custom message-part component tests

- [x] `AIC-CUSTOM-001` An exact per-instance extension renderer creates the registered component.
- [x] `AIC-CUSTOM-002` An exact injected extension renderer creates the registered component when no
      instance renderer exists.
- [x] `AIC-CUSTOM-003` A per-instance renderer overrides an injected renderer for the same match.
- [ ] `AIC-CUSTOM-004` An injected renderer overrides a built-in renderer only according to the
      documented precedence policy.
- [x] `AIC-CUSTOM-005` Namespaced extension matching is exact and case policy is documented and
      enforced.
- [x] `AIC-CUSTOM-006` A renderer registered for one extension cannot receive a different extension.
- [x] `AIC-CUSTOM-007` The custom component receives its containing message and exact part.
- [ ] `AIC-CUSTOM-008` The custom context exposes current disabled, readonly, and streaming state.
- [x] `AIC-CUSTOM-009` A custom component action becomes one typed `partAction` output.
- [ ] `AIC-CUSTOM-010` A custom component cannot mutate the message store through its context.
- [x] `AIC-CUSTOM-011` Streaming updates refresh context without recreating an unchanged renderer.
- [ ] `AIC-CUSTOM-012` Changing the matching renderer destroys the previous component exactly once.
- [x] `AIC-CUSTOM-013` Removing a part destroys its custom component and injector.
- [ ] `AIC-CUSTOM-014` Moving a part outside the retained range releases its component according to
      retention policy.
- [ ] `AIC-CUSTOM-015` A throwing custom renderer displays an accessible fallback and leaves sibling
      messages operational.
- [ ] `AIC-CUSTOM-016` Missing custom renderers use the unsupported fallback.
- [ ] `AIC-CUSTOM-017` Duplicate same-precedence registrations follow the documented deterministic
      policy.
- [ ] `AIC-CUSTOM-018` Invalid or non-namespaced extension registration is rejected.
- [x] `AIC-CUSTOM-019` An agent-provided component/class/module name cannot instantiate code.
- [ ] `AIC-CUSTOM-020` Two identical custom parts receive separate context instances.
- [ ] `AIC-CUSTOM-021` Two chat instances do not leak local renderer registrations or actions.
- [ ] `AIC-CUSTOM-022` Custom interactive content remains reachable in logical keyboard order.

## Composer tests

- [x] `AIC-COMPOSER-001` The default composer has a visible or accessible label.
- [x] `AIC-COMPOSER-002` Empty and whitespace-only drafts cannot submit.
- [x] `AIC-COMPOSER-003` A valid draft emits one typed `messageSubmit` event.
- [x] `AIC-COMPOSER-004` The submit event does not expose a native DOM event.
- [x] `AIC-COMPOSER-005` Locally managed draft text clears after a valid submit request.
- [x] `AIC-COMPOSER-006` An invalid submit attempt does not clear the draft.
- [ ] `AIC-COMPOSER-007` Controlled draft mode emits `draftChange` and respects the value supplied by
      the application.
- [x] `AIC-COMPOSER-008` Enter submits under the default policy.
- [x] `AIC-COMPOSER-009` Shift+Enter inserts a newline under the default policy.
- [x] `AIC-COMPOSER-010` Enter during IME composition does not submit.
- [x] `AIC-COMPOSER-011` Disabled mode prevents typing, submission, and mutation actions.
- [x] `AIC-COMPOSER-012` Readonly mode prevents submission while preserving transcript access.
- [ ] `AIC-COMPOSER-013` Rapid repeated activation cannot emit duplicate submission synchronously.
- [ ] `AIC-COMPOSER-014` The composer respects configured character limits and exposes validation.
- [ ] `AIC-COMPOSER-015` Composer resizing does not hide the latest followed message.
- [ ] `AIC-COMPOSER-016` Mobile safe-area styling keeps the composer and last message reachable.

## Run-control and typed-event tests

- [x] `AIC-EVENT-001` Busy plus `canStop` renders an enabled stop action.
- [x] `AIC-EVENT-002` Activating stop emits exactly one `stopRequest`.
- [x] `AIC-EVENT-003` Retry renders only when `canRetry` is true.
- [x] `AIC-EVENT-004` Activating retry emits exactly one typed `retryRequest` with relevant context.
- [ ] `AIC-EVENT-005` Tool approval emits typed approve and reject requests.
- [ ] `AIC-EVENT-006` Feedback controls emit typed values without persisting them internally.
- [x] `AIC-EVENT-007` Loading earlier messages emits one request until the application updates loading
      state or the boundary resets.
- [ ] `AIC-EVENT-008` Disabled and readonly policies suppress prohibited outputs.
- [ ] `AIC-EVENT-009` One custom part action cannot be delivered to a different chat instance.
- [ ] `AIC-EVENT-010` Component destruction prevents late scheduled outputs.

## Auto-scroll and history tests

- [ ] `AIC-SCROLL-001` Initial messages position the transcript at the latest content.
- [ ] `AIC-SCROLL-002` A new message stays visible while follow mode is active.
- [ ] `AIC-SCROLL-003` Streaming growth stays visible while follow mode is active.
- [ ] `AIC-SCROLL-004` Dynamic custom-renderer growth stays visible while follow mode is active.
- [x] `AIC-SCROLL-005` Intentional upward scrolling pauses follow mode.
- [x] `AIC-SCROLL-006` Incoming content does not move the viewport after follow mode is paused.
- [x] `AIC-SCROLL-007` Unseen count increments once per unseen message, not once per streamed chunk.
- [x] `AIC-SCROLL-008` Jump-to-latest scrolls to the end, clears unseen state, and resumes following.
- [ ] `AIC-SCROLL-009` Submitting a new prompt resumes following according to the documented policy.
- [x] `AIC-SCROLL-010` Prepending earlier messages preserves the anchor message and pixel offset.
- [ ] `AIC-SCROLL-011` A failed history request preserves position and allows a documented retry path.
- [ ] `AIC-SCROLL-012` Image or disclosure height changes above the viewport preserve the reading
      anchor when not following.
- [ ] `AIC-SCROLL-013` Programmatic scroll events do not falsely disable follow mode.
- [ ] `AIC-SCROLL-014` Reduced-motion preference disables animated transcript scrolling.
- [x] `AIC-SCROLL-015` Scroll-state changes emit typed following, near-bottom, and unseen values.
- [ ] `AIC-SCROLL-016` Changing the custom header height does not corrupt transcript follow state.

## Long-chat, virtualization, and performance tests

- [x] `AIC-PERF-001` A 10,000-message input keeps rendered message elements within the agreed maximum.
- [ ] `AIC-PERF-002` Only the visible/retained range creates custom part components.
- [ ] `AIC-PERF-003` Scrolling through a long thread recycles or releases renderer instances according
      to policy.
- [ ] `AIC-PERF-004` Returning to a prior range renders the correct message and part content.
- [ ] `AIC-PERF-005` Streaming one visible part does not recreate unaffected message components.
- [ ] `AIC-PERF-006` Prepending a history page does not rebuild the complete transcript.
- [ ] `AIC-PERF-007` The latest-message follow path stays within the agreed frame/update budget.
- [ ] `AIC-PERF-008` The retained message/view state stays within the documented memory policy.
- [ ] `AIC-PERF-009` Removed object URLs are revoked exactly once.
- [ ] `AIC-PERF-010` Destroying the chat releases resize observers, intersection observers, animation
      frames, timers, renderer injectors, and subscriptions.
- [ ] `AIC-PERF-011` Repeated create/destroy cycles do not grow retained listener or observer counts.
- [ ] `AIC-PERF-012` A very tall custom part does not create an unbounded rendered-range expansion.

## Accessibility tests

- [ ] `AIC-A11Y-001` The chat region has an accessible name with default and custom headers.
- [ ] `AIC-A11Y-002` The transcript exposes list semantics and each message exposes grouping semantics.
- [ ] `AIC-A11Y-003` Each visible message has an accessible author and status where applicable.
- [ ] `AIC-A11Y-004` New streamed tokens do not move keyboard focus.
- [ ] `AIC-A11Y-005` Prepending history does not move keyboard focus.
- [ ] `AIC-A11Y-006` Meaningful run transitions use one polite status region.
- [ ] `AIC-A11Y-007` Streaming announcements are batched and do not announce each token.
- [ ] `AIC-A11Y-008` Stop, retry, send, history, and jump controls have accessible names.
- [ ] `AIC-A11Y-009` All default controls are operable by keyboard.
- [ ] `AIC-A11Y-010` Hover-revealed actions remain discoverable and reachable without hover.
- [ ] `AIC-A11Y-011` Focus indicators remain visible in light, dark, and high-contrast themes.
- [ ] `AIC-A11Y-012` Unsupported and failed custom parts expose useful accessible fallback text.
- [ ] `AIC-A11Y-013` Tool approval clearly communicates the tool, requested action, and current state.
- [ ] `AIC-A11Y-014` Automated accessibility checks report no release-blocking violations.

## Styling and responsive tests

- [ ] `AIC-STYLE-001` Default rendering uses TailNG semantic tokens rather than fixed application
      colors.
- [ ] `AIC-STYLE-002` Stable `data-slot` hooks exist for documented component regions.
- [ ] `AIC-STYLE-003` Documented state data attributes update with component state.
- [ ] `AIC-STYLE-004` Documented CSS custom properties change supported visual dimensions.
- [ ] `AIC-STYLE-005` Narrow layout keeps messages, custom parts, composer, and actions usable.
- [ ] `AIC-STYLE-006` Wide layout applies the documented readable-content width.
- [ ] `AIC-STYLE-007` Long unbroken text and JSON do not force horizontal page overflow.
- [ ] `AIC-STYLE-008` Default and custom headers remain aligned at narrow widths.
- [ ] `AIC-STYLE-009` Light, dark, and high-contrast themes preserve content and control contrast.
- [ ] `AIC-STYLE-010` Consumer CSS does not need internal class selectors for supported customization.

## Security and failure-isolation tests

- [x] `AIC-SEC-001` Plain text containing script or markup is rendered inertly.
- [ ] `AIC-SEC-002` Unsafe source and file URL schemes are rejected.
- [ ] `AIC-SEC-003` Agent payloads cannot choose a component by class name, selector, module path, or URL.
- [ ] `AIC-SEC-004` Unregistered extension names never instantiate Angular components.
- [ ] `AIC-SEC-005` Oversized tool and extension payloads use bounded fallback presentation.
- [ ] `AIC-SEC-006` Renderer failures do not expose stack traces or sensitive values to end users.
- [ ] `AIC-SEC-007` Custom renderer actions contain only the documented serializable action envelope.
- [ ] `AIC-SEC-008` Hidden and encrypted reasoning never reaches rendered or announced content.
- [ ] `AIC-SEC-009` A malicious opaque ID cannot escape attributes or corrupt renderer lookup.
- [ ] `AIC-SEC-010` A failed custom header or part cannot prevent stop or other recovery actions.

## Documentation and example tests

- [ ] `AIC-DOCS-001` The overview identifies `tng-ai-chat` as the recommended standard integration.
- [ ] `AIC-DOCS-002` API documentation lists every public input, output, type, token, and provider helper.
- [ ] `AIC-DOCS-003` The default example runs without custom header or custom part components.
- [ ] `AIC-DOCS-004` The custom-header example uses its own TS, HTML, and CSS files.
- [ ] `AIC-DOCS-005` The custom-message-part example uses its own TS, HTML, and CSS files.
- [ ] `AIC-DOCS-006` Every example displays TS, HTML, and CSS tabs using the standard docs panel.
- [ ] `AIC-DOCS-007` Generated source tabs match the actual example source files byte-for-byte.
- [ ] `AIC-DOCS-008` The AG-UI example normalizes events outside `tng-ai-chat`.
- [ ] `AIC-DOCS-009` The custom renderer example validates an exact namespaced extension before rendering.
- [ ] `AIC-DOCS-010` Styling documentation uses stable data slots, tokens, and CSS properties only.
- [ ] `AIC-DOCS-011` Accessibility documentation covers custom component responsibilities.
- [ ] `AIC-DOCS-012` Generated AI/LLM documentation includes the new component and customization APIs.
- [ ] `AIC-DOCS-013` Documentation examples compile in the agent-knowledge example test.
- [ ] `AIC-DOCS-014` The component-assistant example retains its twelve component choices after migration.

## Browser acceptance tests

- [x] `AIC-BROWSER-001` Real Chromium layout follows streaming text at the bottom.
- [x] `AIC-BROWSER-002` Real Chromium layout pauses follow mode after upward user scrolling.
- [x] `AIC-BROWSER-003` Real Chromium layout restores follow mode through jump-to-latest.
- [x] `AIC-BROWSER-004` Real Chromium preserves position when history is prepended.
- [ ] `AIC-BROWSER-005` Real Chromium reconciles dynamic custom-part height changes.
- [ ] `AIC-BROWSER-006` Real Chromium keeps the focused composer or message action focused during
      streaming.
- [ ] `AIC-BROWSER-007` Real Chromium supports keyboard-only send, stop, retry, history, and custom
      part actions.
- [ ] `AIC-BROWSER-008` Real Chromium keeps the bounded rendered range while traversing a long thread.
- [ ] `AIC-BROWSER-009` Real Chromium updates a custom header and custom part without unnecessary
      recreation.
- [ ] `AIC-BROWSER-010` Real Chromium remains usable at representative phone, tablet, and desktop
      widths.

## Release gates

- [x] `AIC-GATE-001` Every test required for the selected release scope was observed Red before its
      implementation.
- [x] `AIC-GATE-002` All selected unit, DOM, and browser tests pass without retries.
- [ ] `AIC-GATE-003` AI package lint, typecheck, build, and public API extraction pass.
- [ ] `AIC-GATE-004` Documentation lint, typecheck, tests, source-drift checks, agent-knowledge checks,
      and production build pass.
- [ ] `AIC-GATE-005` No critical or high-severity accessibility issue remains open.
- [ ] `AIC-GATE-006` No arbitrary component execution or unsafe content path remains open.
- [ ] `AIC-GATE-007` Long-chat DOM, update-time, and retained-instance budgets pass.
- [ ] `AIC-GATE-008` Package contents and peer dependencies pass install-smoke verification.
- [ ] `AIC-GATE-009` Default, custom-header, and custom-message-part documentation examples work in a
      production build.
- [x] `AIC-GATE-010` All completed cases are changed from `[ ]` to `[x]` only after their evidence is
      recorded.

## Verification evidence

- [x] `pnpm run test:ai`: 8 files and 171 tests passed.
- [x] `pnpm run test:ai:browser`: 1 Chromium file and 3 tests passed.
- [x] `pnpm run test:docs`: 27 files and 112 tests passed in the final verification run.
- [x] `pnpm run docs:examples:check`: generated example sources are current.
- [x] `pnpm run docs:agent:check`: 291 agent-knowledge documents are valid and current.
- [x] `pnpm exec eslint` passed for the new root component and internal part outlet.
- [x] `pnpm exec tsc -p libs/tailng-ui/ai/tsconfig.lib.json --noEmit` passed.
- [x] `NX_DAEMON=false NX_ISOLATE_PLUGINS=false pnpm nx build ai` passed for both package entry points.
- [x] `pnpm run build:docs` passed; only existing bundle/style budget and CommonJS warnings remain.
