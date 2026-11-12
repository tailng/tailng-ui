# `tng-ai-chat` Component Plan

Status: Initial implementation complete; unchecked items remain deferred

Package: `@tailng-ui/ai`

Selector: `tng-ai-chat`

Test catalog: [tests/tng-ai-chat-component-tests.md](./tests/tng-ai-chat-component-tests.md)

## Objective

Provide a professional, accessible, controlled AI chat component so applications do not have to
reimplement the transcript, message dispatch, composer, scrolling, history anchoring, run controls,
and common message-part presentation.

The component must remain provider-neutral. AG-UI, Mastra, custom SSE, WebSocket, REST, and local
simulations connect through normalized TailNG messages and typed UI events.

## Product decisions

- [x] Export `TngAiChatComponent` from the primary `@tailng-ui/ai` entry point.
- [x] Keep the component out of `@tailng-ui/primitives` because it is an opinionated AI experience,
      not a headless interaction primitive.
- [x] Keep the component out of `@tailng-ui/components` because its public contracts depend on the
      TailNG AI message model.
- [x] Make `tng-ai-chat` the recommended default integration instead of requiring consumers to
      assemble a compound chat component family.
- [x] Keep network clients, authentication, persistence, agent orchestration, tool execution, and
      protocol transport outside the component.
- [x] Accept normalized `TngAiMessage` records rather than raw AG-UI events.
- [x] Preserve the `@tailng-ui/ai/ag-ui` adapter as an optional input-normalization layer.
- [x] Treat all message content, extension values, tool values, URLs, and renderer selection data as
      untrusted.
- [x] Provide useful default presentation without requiring custom renderers or a custom header.
- [x] Allow applications to replace the header and selected message-part renderers without replacing
      transcript, composer, scrolling, or accessibility behavior.

## Ownership boundary

### `TngAiChatComponent` owns

- [x] Render the normalized conversation as an accessible transcript.
- [x] Render built-in message-part types with safe defaults.
- [x] Dispatch registered application extensions to allowlisted Angular components.
- [x] Render the default professional header when no override is supplied.
- [x] Render and manage the composer draft by default.
- [x] Implement send, stop, retry, and load-earlier interaction surfaces.
- [x] Implement follow mode, pause-on-user-scroll, unseen-message state, and jump-to-latest behavior.
- [x] Preserve the reading position when earlier messages are prepended.
- [x] Reconcile dynamic message height changes caused by streaming, images, tools, and disclosures.
- [x] Keep the rendered DOM bounded for long conversations.
- [x] Expose accessible status announcements for meaningful state transitions.
- [x] Expose stable styling hooks, CSS custom properties, and data attributes.
- [x] Clean up observers, scheduled frames, temporary resources, and subscriptions on destruction.

### The application owns

- [x] Supply normalized messages and current run state.
- [x] Handle message submission and start the agent run.
- [ ] Handle stop, retry, history, approval, feedback, and custom part-action requests.
- [x] Connect AG-UI, Mastra, or another transport to the TailNG store or application state.
- [x] Validate authorization and business policy before executing tools or actions.
- [x] Register only trusted local Angular components as custom renderers.
- [ ] Sanitize or safely render optional Markdown through an application-selected adapter.
- [x] Store conversation history and provide cursor-paginated history loading.

## Proposed public component API

### State inputs

- [x] Add a required `messages` input containing ordered normalized `TngAiMessage` records.
- [x] Add a `busy` input for an active agent run.
- [x] Add a `disabled` input that prevents new interaction.
- [x] Add a `readonly` input that preserves reading and navigation while hiding or disabling mutation
      controls.
- [x] Add a `status` input for the current user-facing chat status.
- [x] Add a `canStop` input controlling the stop action.
- [x] Add a `canRetry` input controlling the retry action.
- [x] Add a `hasEarlierMessages` input controlling the history affordance.
- [x] Add a `loadingEarlierMessages` input for history progress state.
- [x] Add `title`, `subtitle`, `assistantLabel`, and optional `protocolLabel` inputs for the default
      header.
- [x] Add a `headerComponent` input accepting a trusted local Angular component type.
- [x] Add a `partRenderers` input for renderers scoped to one chat instance.
- [x] Add a `draft`/`draftChange` controlled option while retaining locally managed draft behavior by
      default.
- [ ] Add a configurable submit-key policy with `Enter` to submit and `Shift+Enter` for newline as the
      default.
- [x] Add configurable near-bottom threshold and rendered-window limits with safe defaults.
- [x] Avoid an input that accepts raw HTML.
- [x] Avoid an input that accepts a component name received from an agent response.

### Typed outputs

- [x] Emit `messageSubmit` with text rather than a DOM event.
- [x] Emit `stopRequest` without performing transport cancellation directly.
- [x] Emit `retryRequest` with enough message/run context for the application to retry safely.
- [x] Emit `loadEarlierRequest` once per eligible history boundary transition.
- [x] Emit `partAction` for actions raised by custom or built-in message-part components.
- [ ] Emit `toolApprovalRequest` for explicit approve/reject interactions.
- [ ] Emit `feedbackChange` for application-owned feedback persistence.
- [x] Emit `scrollStateChange` with following, near-bottom, and unseen-count information.
- [x] Ensure outputs never expose internal DOM elements or native browser events.

## Custom message-part component contract

### Renderer registration

- [x] Define a public `TngAiMessagePartRenderer` configuration type.
- [x] Match built-in parts by exact `type` and extension/data/activity parts by exact namespaced name.
- [x] Accept a trusted Angular component type in the renderer configuration.
- [x] Allow per-instance registration through the `partRenderers` input.
- [x] Provide a multi-provider helper such as `provideTngAiMessagePartRenderer` for application-wide or
      feature-scoped registration.
- [x] Define deterministic precedence: instance renderer, nearest injected renderer, built-in
      renderer, unsupported fallback.
- [ ] Reject ambiguous duplicate renderers at the same precedence or resolve them through a documented
      deterministic rule.
- [x] Keep renderer configuration outside serialized messages and protocol metadata.

### Renderer context

- [x] Define a readonly `TngAiMessagePartContext`.
- [x] Expose the containing message and current message part.
- [x] Expose disabled and readonly presentation state.
- [x] Expose a typed `emitAction` function rather than the chat store itself.
- [x] Provide the context through a public injection token such as
      `TNG_AI_MESSAGE_PART_CONTEXT`.
- [x] Create a new isolated context for every rendered part instance.
- [x] Update the context without recreating the custom component when only streaming part data
      changes and the renderer identity remains stable.
- [x] Destroy the custom component and its injector when its part leaves the rendered range.

### Safe renderer behavior

- [x] Never import, download, evaluate, or instantiate a component identified by agent-provided text.
- [x] Require application registration before an extension can render a custom component.
- [ ] Validate the part against the canonical TailNG type before renderer dispatch.
- [ ] Fall back safely when a renderer is absent, invalid, throws, or cannot initialize.
- [ ] Keep one failing custom renderer from breaking the remaining transcript.
- [x] Provide an accessible fallback description for unsupported content.

## Custom header component contract

- [x] Define a readonly `TngAiChatHeaderContext`.
- [x] Expose title, subtitle, assistant label, protocol label, busy state, and chat status.
- [ ] Expose only typed header actions supported by the root chat component.
- [x] Provide the context through a public injection token such as `TNG_AI_CHAT_HEADER_CONTEXT`.
- [x] Render the default TailNG header when `headerComponent` is absent.
- [x] Replace only the header region when `headerComponent` is present.
- [x] Preserve the transcript label and accessibility relationship when the custom header changes.
- [x] Update the existing header component context without recreating it for ordinary status changes.
- [x] Destroy the previous custom header component when its type changes or the chat is destroyed.
- [ ] Fall back to the default header if the custom component cannot initialize.
- [ ] Consider an inline header template directive only after the component-based API is stable.

## Built-in message-part presentation

- [x] Provide a safe plain-text renderer.
- [ ] Provide a Markdown adapter slot with plain-text fallback; do not bundle arbitrary HTML rendering.
- [x] Provide a reasoning-summary renderer that never exposes hidden or encrypted reasoning.
- [x] Provide tool-call state presentation.
- [x] Provide a restrained tool-result renderer with payload limits.
- [ ] Provide source/citation rendering with safe URL handling.
- [x] Provide file metadata presentation without storing Base64 payloads.
- [x] Provide activity-state rendering.
- [x] Provide an unsupported-part fallback.
- [x] Preserve the original ordered part sequence inside each message.
- [x] Track messages and parts by stable opaque IDs.

## Composer and run controls

- [ ] Use existing TailNG textarea, button, icon, tooltip, and related components where their contracts
      fit.
- [x] Disable submission for an empty or whitespace-only draft.
- [x] Prevent duplicate synchronous submission while a submission is being accepted.
- [x] Clear a locally managed draft only after emitting a valid submit request.
- [x] Do not submit during IME composition.
- [x] Preserve `Shift+Enter` newline behavior under the default key policy.
- [x] Show a stop action only while stopping is allowed.
- [x] Show retry only when the application declares retry available.
- [x] Keep controls accessible by name.
- [x] Keep attachment upload and persistence side effects outside the component.

## Scrolling, history, and long-chat behavior

- [x] Follow incoming content only while the user is at or near the bottom.
- [x] Pause following when the user intentionally scrolls upward.
- [x] Count unseen message IDs rather than streaming chunks.
- [x] Provide a jump-to-latest action with a meaningful unseen count.
- [x] Resume following after jump-to-latest, submit, or another documented intent signal.
- [x] Preserve the anchor message and pixel offset when older messages are prepended.
- [x] Observe visible message height changes and reconcile the transcript position.
- [x] Avoid smooth scrolling when reduced motion is requested.
- [x] Render only a bounded message range for long conversations.
- [ ] Preserve logical keyboard and screen-reader access across range changes.
- [x] Release custom renderer instances outside the retained range.
- [x] Avoid retaining removed messages, renderer contexts, observers, and subscriptions.

## Accessibility requirements

- [x] Give the chat a labelled conversation region.
- [x] Use list semantics or an equivalent accessible message grouping.
- [x] Expose an accessible author for every visible message.
- [x] Keep focus stable when new messages stream or history is prepended.
- [x] Use a dedicated polite status region for meaningful transitions.
- [ ] Batch streaming announcements rather than announcing every token.
- [x] Associate the composer with an accessible label.
- [x] Support complete keyboard operation without hover-only actions.
- [x] Preserve visible focus indicators and meet TailNG contrast expectations.
- [ ] Keep custom headers and part renderers responsible for their internal semantics while the root
      preserves the surrounding chat structure.

## Styling and customization

- [x] Use TailNG semantic tokens instead of fixed application colors.
- [x] Expose stable `data-slot` attributes for header, transcript, message, part, status, composer, and
      scroll controls.
- [x] Expose state data attributes for role, status, following, disabled, readonly,
      and busy states.
- [x] Provide CSS custom properties for common layout, avatar, bubble, transcript-height, and composer
      adjustments.
- [x] Support light, dark, high-contrast, narrow, and wide layouts.
- [x] Keep the default component visually professional without application CSS.
- [x] Avoid exposing internal class names as the primary customization contract.

## Package and dependency plan

- [x] Place component implementation under `libs/tailng-ui/ai/src/lib/chat/`.
- [x] Export the component, renderer contracts, contexts, tokens, and provider helpers from
      `@tailng-ui/ai`.
- [x] Keep AG-UI-specific types out of the component public API.
- [x] Add only necessary Angular peer dependencies.
- [x] Verify no dependency cycle is introduced between `ai`, `components`, `icons`, and `primitives`.
- [x] Preserve tree-shaking for consumers that use only the core AI model or AG-UI adapter.
- [x] Keep package side effects disabled.
- [x] Update package API documentation and generated LLM documentation.

## TDD delivery phases

### Phase 0 — contract approval

- [x] Review and approve this component plan.
- [x] Review and approve the complete TDD catalog before production implementation.
- [x] Resolve final public names for inputs, outputs, context tokens, and provider helpers.
- [x] Record the initial renderer precedence policy.
- [ ] Confirm whether the first release includes attachment presentation or defers it.

### Phase 1 — public shell and default header

- [x] Add the Phase 1 tests and observe them fail for the intended missing behavior.
- [x] Add the minimal root component and controlled state API.
- [x] Add the default professional header.
- [x] Add custom header component creation and context.
- [x] Make Phase 1 tests pass without implementing later phases prematurely.
- [x] Refactor while keeping all Phase 1 tests green.

### Phase 2 — transcript and renderer registry

- [x] Add the Phase 2 tests and observe them fail for the intended missing behavior.
- [x] Add message and ordered-part rendering.
- [x] Add built-in renderers and unsupported fallback.
- [x] Add per-instance and injected custom renderer registration.
- [x] Add isolated renderer contexts and typed action emission.
- [x] Make the selected Phase 2 tests pass and refactor without weakening security checks.

### Phase 3 — composer and application events

- [x] Add the Phase 3 tests and observe them fail for the intended missing behavior.
- [x] Add locally managed and controlled draft behavior.
- [ ] Add submit, stop, retry, approval, feedback, and part-action requests.
- [x] Add keyboard, IME, disabled, and readonly behavior.
- [x] Make the selected Phase 3 tests pass and refactor the interaction state model.

### Phase 4 — scrolling and history

- [x] Add the Phase 4 DOM and browser tests and observe them fail for the intended missing behavior.
- [x] Add initial scroll positioning and follow mode.
- [x] Add pause, unseen count, and jump-to-latest behavior.
- [x] Add history anchoring and dynamic-height reconciliation.
- [x] Make the selected Phase 4 tests pass in Chromium using real layout measurements.

### Phase 5 — bounded rendering and lifecycle

- [x] Add the Phase 5 bounded-DOM test and observe it fail.
- [x] Add the bounded rendered range and retention policy.
- [x] Add renderer disposal and resource cleanup.
- [ ] Meet the agreed DOM-node, update-time, and retained-instance budgets.
- [ ] Make Phase 5 tests pass without regressing accessibility or scrolling.

### Phase 6 — documentation and demo migration

- [x] Add documentation contract tests and observe the missing source panel fail.
- [x] Add overview, API, styling, customization, and accessibility documentation.
- [ ] Add a minimal controlled example using only default UI.
- [ ] Add a custom-header example.
- [x] Add a custom extension-part component to the working example.
- [x] Refactor the current AI chat component assistant demo to use `tng-ai-chat`.
- [x] Keep the deterministic demo engine, catalog, and preview routing application-owned.
- [x] Display exact TS, HTML, and CSS source tabs for the migrated documentation example.
- [ ] Keep the landing-page implementation independently optimized and documented.

### Phase 7 — release verification

- [x] Run the complete `@tailng-ui/ai` unit and browser suites.
- [x] Run docs tests, generated-source drift checks, agent-documentation checks, lint, typecheck, and
      production builds.
- [x] Verify public package compilation and exports.
- [ ] Verify npm package contents and peer dependency declarations.
- [ ] Verify keyboard and screen-reader acceptance scenarios.
- [x] Verify the selected long-chat rendered-DOM budget.
- [x] Record pre-existing build warnings separately from component regressions.
- [ ] Mark the component ready for the next `@tailng-ui/ai` prerelease only after every release gate
      passes.

## Definition of done

- [x] A standard consumer can render a professional chat without writing transcript or composer
      markup.
- [x] A consumer can replace the header with one trusted Angular component.
- [x] A consumer can map a validated namespaced message part to one trusted Angular component.
- [x] The agent cannot select or execute arbitrary Angular components.
- [x] Default message parts remain usable without custom renderers.
- [ ] Send, stop, retry, history, approval, feedback, and custom actions use typed events.
- [x] Auto-scroll, user pause, jump-to-latest, history anchoring, and dynamic heights work in a real
      browser.
- [x] A very long conversation keeps a bounded rendered DOM and releases unused renderer instances.
- [ ] The complete experience is keyboard accessible and provides meaningful screen-reader status.
- [x] The component remains independent from AG-UI transport and Mastra runtime packages.
- [ ] Documentation includes default, custom-header, and custom-message-part examples with exact
      source tabs.
- [ ] All cataloged tests pass after their intended Red/Green implementation slices.
