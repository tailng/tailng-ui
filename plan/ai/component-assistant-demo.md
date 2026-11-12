# TailNG Component Assistant Demo Plan

Status: Implemented; automated verification complete, manual visual/accessibility review pending

Scope note: this document records the initial four-option delivery. The current twelve-option
catalog and its remaining verification work are tracked in
[Component assistant expanded catalog](./component-assistant-expanded-catalog.md).

Follow-ups:

- [Component assistant auto-scroll](./component-assistant-auto-scroll.md)
- [Component assistant expanded catalog](./component-assistant-expanded-catalog.md)

Surfaces:

- AI Chat examples page: full demonstration
- Documentation landing page: compact interactive demonstration

Delivery method: strict test-driven development

## Tracking convention

- `[ ]` marks an open decision, test, implementation item, acceptance criterion, or release gate.
- `[x]` is used only after the stated completion condition has verifiable evidence.
- Every implementation slice follows Specify, Red, Green, Refactor, Verify.
- Production behavior must not be added before its named test has been observed failing for the
  intended missing behavior.

## Goal

Replace the release-review demo with a deterministic TailNG component assistant. When a user sends
`hi`, the assistant replies with prompt options. Selecting an option submits its corresponding
prompt and renders a real, interactive TailNG component inside the assistant message.

The same reusable demo must appear in both locations without duplicating conversation behavior,
prompt definitions, validation, renderer selection, or component-preview data.

## Product decisions

- The demo remains local and deterministic; it does not require a backend, API key, model, or
  network request.
- The examples page uses a full variant with history, streaming, stop, retry, tool activity, and
  explanatory context.
- The landing page uses a compact variant with the same chat behavior and renderers, plus a link to
  the full AI Chat example.
- The landing-page section appears after the hero and before the existing component showcase.
- The landing page keeps its heading, description, and call to action outside the deferred block so
  useful content remains available to prerendering, search, and no-JavaScript readers.
- The interactive landing demo loads with `@defer` near the viewport and must not become part of the
  initial hero/LCP work.
- `hi`, `hello`, and `hey` show the option list after trimming and case normalization.
- Selecting an option inserts the option's full prompt as a user message; it is not treated as an
  invisible UI-only action.
- A recognized prompt streams an assistant response, shows a `render_component` tool lifecycle,
  and materializes a validated component preview after the tool succeeds.
- Stopping before tool completion retains partial text/tool state and does not render the component.
- Retrying replays the same selected prompt once and produces a new run with unique IDs.
- Unknown text receives a helpful deterministic response that explains how to type `hi` or choose a
  supported prompt.
- Typing a greeting again shows a fresh option list without duplicating or mutating earlier messages.

## First prompt catalog

The first version uses components already represented on the landing page so the assistant adds
minimal new product concepts and can reuse realistic fixtures.

| Done | ID                  | Option label          | Submitted prompt                     | Rendered TailNG content                                                           |
| ---- | ------------------- | --------------------- | ------------------------------------ | --------------------------------------------------------------------------------- |
| [x]  | AI-DEMO-CATALOG-001 | Choose a release date | `Create a release date picker.`      | Interactive datepicker with a deterministic initial date.                         |
| [x]  | AI-DEMO-CATALOG-002 | Show monthly installs | `Visualize monthly TailNG installs.` | Accessible bar chart with six months of static data.                              |
| [x]  | AI-DEMO-CATALOG-003 | Display a team table  | `Show a sortable team table.`        | Compact table with deterministic rows and sortable columns.                       |
| [x]  | AI-DEMO-CATALOG-004 | Create status labels  | `Create status tags for a release.`  | A group of TailNG tags/badges showing draft, beta, stable, and deprecated states. |

Catalog rules:

- [ ] Give every option a stable ID, visible label, exact prompt, preview ID, assistant introduction,
      and analytics-safe action name.
- [x] Keep prompt definitions in one immutable catalog shared by both surfaces.
- [x] Use the exact catalog prompt as the visible user message when an option is activated.
- [x] Keep preview fixture data static and synthetic; do not use current time, random values, user
      data, credentials, or network responses.
- [ ] Ensure every preview remains usable inside the transcript width on mobile and desktop.
- [x] Ensure each preview has an accessible name independent of surrounding assistant prose.

## Conversation flow

```text
User submits "hi"
        |
        v
User message is stored
        |
        v
RUN_STARTED
TEXT_MESSAGE_START / CONTENT / END
        |
        v
Assistant message gains tailng.dev/prompt-options
        |
        v
User activates "Show monthly installs"
        |
        v
Exact catalog prompt is stored as a user message
        |
        v
RUN_STARTED
TEXT_MESSAGE_START / CONTENT
TOOL_CALL_START render_component
TOOL_CALL_ARGS { previewId: "monthly-installs" }
TOOL_CALL_END
TOOL_CALL_RESULT
        |
        v
Application validates and materializes
tailng.dev/component-preview
        |
        v
TEXT_MESSAGE_END
RUN_FINISHED
```

## Message-part contracts

Prompt choices use an application-owned extension part:

```ts
type PromptOptionsExtension = {
  readonly id: string;
  readonly type: 'extension';
  readonly name: 'tailng.dev/prompt-options';
  readonly value: {
    readonly version: 1;
    readonly options: readonly {
      readonly id: string;
      readonly label: string;
      readonly prompt: string;
    }[];
  };
};
```

Rendered components use another application-owned extension part:

```ts
type ComponentPreviewExtension = {
  readonly id: string;
  readonly type: 'extension';
  readonly name: 'tailng.dev/component-preview';
  readonly value: {
    readonly version: 1;
    readonly previewId: 'release-date' | 'monthly-installs' | 'team-table' | 'release-status';
  };
};
```

Contract rules:

- [x] Keep both extensions in the docs application; do not add TailNG-docs-specific names to the
      public `@tailng-ui/ai` package.
- [x] Do not use `TngAiUiPart`; that contract remains reserved for A2UI and MCP Apps payloads.
- [x] Validate extension name, version, structure, option count, text length, and preview ID before
      rendering.
- [x] Treat catalog IDs and extension values as untrusted even though the first demo is local.
- [x] Render an accessible unsupported-content fallback for invalid versions, malformed values, and
      unknown preview IDs.
- [x] Do not accept Angular selectors, component classes, import paths, templates, HTML, or arbitrary
      inputs from a message.
- [x] Keep the `render_component` tool name and its arguments inert until the application-owned
      allowlist accepts the preview ID.

## Safe renderer design

Use a fixed docs-owned allowlist. A protocol or message value may select only a stable preview ID;
it cannot instantiate an arbitrary component.

```text
tailng.dev/component-preview
          |
          v
validate version + previewId
          |
          v
docs preview allowlist
  release-date     -> release date preview
  monthly-installs -> bar chart preview
  team-table       -> team table preview
  release-status   -> tags/badges preview
          |
          v
statically imported TailNG component template
```

- [x] Register the two extension names through the TailNG part-registry boundary or an equivalent
      explicit docs-owned renderer map.
- [x] Resolve extension payloads to validated view models before Angular template rendering.
- [x] Prefer statically imported preview components or explicit template branches over arbitrary
      `NgComponentOutlet` construction.
- [x] Keep preview component state local to its message instance.
- [ ] Dispose preview state, observers, chart instances, and event listeners when its transcript row
      is destroyed.
- [x] Prevent keyboard events inside an interactive preview from accidentally submitting the chat
      composer.
- [x] Ensure preview output events affect only the preview unless a documented chat action explicitly
      converts them into a new message.

## AG-UI boundary

The demo continues to use AG-UI 1.0 events for run, text, and tool lifecycles. The component preview
extension is a TailNG application materialization, not a new AG-UI standard event.

- [x] Emit valid `RUN_STARTED`, text-message, tool-call, tool-result, and `RUN_FINISHED` sequences.
- [x] Use `render_component` as the deterministic tool name and a bounded JSON object containing
      only `previewId` as input.
- [x] Add the component-preview extension only after the matching tool call has completed
      successfully.
- [x] Correlate the extension with the current run, assistant message, and tool-call ID.
- [x] Do not infer executable behavior from AG-UI metadata or raw tool-result text.
- [x] Keep the prompt-options extension application-owned; no custom AG-UI event is required for the
      first version.
- [x] Preserve the current demo's stop, retry, partial-content, and tool-state visibility.

## Reusable docs architecture

Recommended source ownership:

```text
apps/tailng-ui/docs/src/app/shared/demos/component-assistant/
├── component-assistant.component.ts
├── component-assistant.component.html
├── component-assistant.component.css
├── component-assistant.config.ts
├── component-assistant.catalog.ts
├── component-assistant.extensions.ts
├── component-assistant.engine.ts
├── component-assistant.fixtures.ts
├── previews/
│   ├── release-date-preview.component.ts
│   ├── monthly-installs-preview.component.ts
│   ├── team-table-preview.component.ts
│   └── release-status-preview.component.ts
└── __tests__/
```

The final file layout may follow repository conventions, but these responsibilities remain
separate:

- [x] Extract deterministic conversation orchestration from the current live demo into one reusable
      engine or facade.
- [x] Keep store, reducer, timers, prompt routing, run IDs, stop/retry, and teardown in the reusable
      demo component/engine.
- [x] Keep catalog data and extension validators pure so they can be unit tested without Angular.
- [x] Keep each component preview independently testable.
- [x] Expose a narrow display configuration such as `variant: 'full' | 'compact'` rather than two
      copies of the demo.
- [x] Keep a separate store, reducer, run sequence, and timers per mounted component instance; do
      not introduce singleton conversation state.
- [x] Make initial IDs and fixtures deterministic for SSR and hydration.
- [x] Ensure the shared demo imports `@tailng-ui/ai`, `@tailng-ui/ai/ag-ui`, components, and charts
      only from public package entry points.

## Full examples-page variant

- [x] Replace the “TailNG release assistant” identity with “TailNG component assistant.”
- [x] Replace release-review seed messages and history with component-assistant conversation fixtures.
- [x] Preserve the visible AG-UI badge and local/no-API-key disclosure.
- [x] Preserve history loading, streaming cursor, stop, retry, tool status, and status announcements.
- [x] Render prompt-option buttons and component previews as message parts within the transcript.
- [x] Keep tool-call details visible so developers can understand how the preview was requested.
- [x] Add explanatory copy describing the difference between AG-UI lifecycle events and the
      application-owned component renderer.
- [x] Add a code example for registering and validating an extension renderer.
- [x] Add a code example for mapping a successful `render_component` tool result to a canonical
      extension part.
- [x] Update AI-readable docs with the same safe-renderer boundary and example contracts.

## Landing-page variant

Placement:

```text
Hero
  -> Component assistant section
  -> Existing 40+ components showcase
  -> Packages and remaining landing content
```

- [x] Add a landing section with a concise heading such as “Ask TailNG to render it.”
- [x] Explain that the interaction is deterministic, local, and built from public TailNG APIs.
- [x] Render the shared assistant in `compact` mode; do not fork its behavior or fixtures.
- [x] Add a visible link to `/components/ai/chat/examples` for the full protocol and code walkthrough.
- [x] Keep the section heading, description, and link outside `@defer`.
- [x] Defer the interactive component on viewport and provide a dimensionally stable skeleton or
      placeholder.
- [x] Avoid loading chart/AI code as part of the initial hero render.
- [ ] Ensure the placeholder and loaded demo do not cause a material cumulative layout shift.
- [x] Confirm landing-page prerender succeeds and includes the static section content.
- [ ] Confirm the compact transcript and every preview fit at 320 CSS pixels without horizontal page
      overflow.
- [ ] Confirm landing navigation destroys the demo cleanly with no timers or chart observers left
      running.

## Interaction and accessibility contract

- [x] Render prompt options as native buttons or TailNG buttons in a labelled group.
- [x] Give every option a unique accessible name matching its visible label.
- [x] Support Tab/Shift+Tab navigation and Enter/Space activation.
- [ ] Keep focus on the activated option or move it according to one documented predictable policy;
      do not move focus merely because streaming begins.
- [x] Announce the number of available prompt options through the existing polite status region.
- [x] Announce preview availability by component name after successful rendering.
- [x] Do not repeatedly announce token-sized streaming deltas.
- [x] Preserve IME composition and Shift+Enter behavior in the composer.
- [x] Prevent Enter/Space interactions in datepicker, chart controls, table sorting, tags, and preview
      controls from triggering composer submission.
- [ ] Maintain visible focus indicators in both light and dark themes.
- [x] Respect reduced motion for streaming cursor, loading placeholder, and preview animation.
- [ ] Verify zoom, large text, forced colors, and screen-reader reading order.

## TDD test catalog

### Greeting and prompt options

| Done | ID                | Scenario                                        | Expected                                                                       | Level          |
| ---- | ----------------- | ----------------------------------------------- | ------------------------------------------------------------------------------ | -------------- |
| [x]  | AI-DEMO-GREET-001 | Submit `hi`.                                    | User message is stored and one assistant options reply is produced.            | component      |
| [x]  | AI-DEMO-GREET-002 | Submit greeting with whitespace and mixed case. | Input normalizes and shows the same catalog options.                           | unit/component |
| [x]  | AI-DEMO-GREET-003 | Submit `hello` or `hey`.                        | Supported aliases produce the options reply.                                   | unit           |
| [x]  | AI-DEMO-GREET-004 | Submit an unsupported prompt.                   | Safe help response explains supported discovery without rendering a component. | component      |
| [ ]  | AI-DEMO-GREET-005 | Submit another greeting later.                  | A new options message is appended; earlier messages remain immutable.          | integration    |
| [x]  | AI-DEMO-GREET-006 | Inspect the options extension.                  | Version, IDs, labels, and prompts exactly match the immutable catalog.         | unit           |
| [ ]  | AI-DEMO-GREET-007 | Options become available.                       | Polite status announces the option count once.                                 | component/a11y |

### Option selection and run lifecycle

| Done | ID              | Scenario                     | Expected                                                                          | Level               |
| ---- | --------------- | ---------------------------- | --------------------------------------------------------------------------------- | ------------------- |
| [x]  | AI-DEMO-RUN-001 | Activate one option.         | Its exact catalog prompt appears as a user message.                               | component           |
| [ ]  | AI-DEMO-RUN-002 | Activate with keyboard.      | Same behavior occurs as pointer activation.                                       | component/browser   |
| [ ]  | AI-DEMO-RUN-003 | Activate twice rapidly.      | At most one run starts for that activation window.                                | component           |
| [x]  | AI-DEMO-RUN-004 | Run recognized prompt.       | AG-UI text and `render_component` tool lifecycle is valid and correlated.         | integration         |
| [x]  | AI-DEMO-RUN-005 | Tool completes.              | Validated component extension is appended once to the matching assistant message. | integration         |
| [x]  | AI-DEMO-RUN-006 | Stop before tool completion. | Partial response remains and no preview is rendered.                              | integration/browser |
| [x]  | AI-DEMO-RUN-007 | Retry stopped response.      | New run uses the same prompt and renders one preview on success.                  | integration         |
| [ ]  | AI-DEMO-RUN-008 | Select a second option.      | New preview and prior preview states remain isolated.                             | component           |

### Extension validation and security

| Done | ID              | Scenario                                         | Expected                                                          | Level                |
| ---- | --------------- | ------------------------------------------------ | ----------------------------------------------------------------- | -------------------- |
| [x]  | AI-DEMO-EXT-001 | Resolve valid prompt-options payload.            | Validated options view model is returned.                         | unit                 |
| [x]  | AI-DEMO-EXT-002 | Resolve valid component-preview payload.         | Allowlisted preview view model is returned.                       | unit                 |
| [x]  | AI-DEMO-EXT-003 | Supply unknown extension version.                | Unsupported fallback renders; no component loads.                 | unit/component       |
| [x]  | AI-DEMO-EXT-004 | Supply unknown preview ID.                       | Unsupported fallback renders; no dynamic lookup/import occurs.    | unit/component       |
| [x]  | AI-DEMO-EXT-005 | Supply selector, import path, template, or HTML. | Payload is rejected and remains inert.                            | unit/security        |
| [x]  | AI-DEMO-EXT-006 | Supply excessive options or oversized text.      | Validation rejects or bounds the payload before DOM creation.     | unit/security        |
| [ ]  | AI-DEMO-EXT-007 | Tool result claims a different preview ID.       | Correlation/allowlist policy prevents unintended rendering.       | integration/security |
| [ ]  | AI-DEMO-EXT-008 | Preview component throws.                        | Safe fallback replaces only that preview and chat remains usable. | component            |

### Component previews

| Done | ID                  | Scenario                                   | Expected                                                                | Level                   |
| ---- | ------------------- | ------------------------------------------ | ----------------------------------------------------------------------- | ----------------------- |
| [x]  | AI-DEMO-PREVIEW-001 | Render release-date preview.               | Datepicker is labelled, interactive, and initialized deterministically. | component/browser       |
| [x]  | AI-DEMO-PREVIEW-002 | Render monthly-installs preview.           | Bar chart has accessible context and expected static data.              | component/browser       |
| [x]  | AI-DEMO-PREVIEW-003 | Render team-table preview.                 | Table is labelled and sorting affects only its local rows.              | component/browser       |
| [x]  | AI-DEMO-PREVIEW-004 | Render release-status preview.             | Expected labels and semantic tones are present.                         | component               |
| [ ]  | AI-DEMO-PREVIEW-005 | Interact using Enter/Space inside preview. | Composer does not submit and no unintended chat run starts.             | browser                 |
| [ ]  | AI-DEMO-PREVIEW-006 | Destroy a rendered preview.                | Timers, observers, chart instances, and listeners are released.         | integration/performance |

### Surface reuse and landing performance

| Done | ID                  | Scenario                                                 | Expected                                                                     | Level               |
| ---- | ------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------- |
| [x]  | AI-DEMO-SURFACE-001 | Mount full examples variant.                             | Full controls, history, tool details, and all preview options are available. | component           |
| [x]  | AI-DEMO-SURFACE-002 | Mount compact landing variant.                           | Same engine/catalog/renderers work with compact presentation.                | component           |
| [x]  | AI-DEMO-SURFACE-003 | Compare both surfaces.                                   | No duplicated catalog, routing, reducer, or renderer implementation exists.  | static/review       |
| [x]  | AI-DEMO-SURFACE-004 | Prerender `/`.                                           | Static assistant heading, description, and full-example link are in output.  | integration         |
| [ ]  | AI-DEMO-SURFACE-005 | Load landing above assistant viewport.                   | Interactive assistant chunk is deferred and hero remains usable.             | browser/performance |
| [ ]  | AI-DEMO-SURFACE-006 | Scroll assistant into range.                             | Placeholder swaps without material layout shift.                             | browser/performance |
| [ ]  | AI-DEMO-SURFACE-007 | Test 320 px, tablet, and desktop widths.                 | Chat and previews have no page-level horizontal overflow.                    | browser             |
| [x]  | AI-DEMO-SURFACE-008 | Navigate away during streaming.                          | Work is cancelled and no detached updates/errors occur.                      | browser/integration |
| [ ]  | AI-DEMO-SURFACE-009 | Run dark/light, reduced-motion, and forced-color checks. | Content remains readable and interaction states remain visible.              | browser/a11y        |

## Delivery phases

### Phase 0: Approve contracts

- [x] Approve the four initial prompts and their exact visible wording.
- [x] Approve extension names, version `1` payloads, and the safe fallback contract.
- [x] Approve the full/compact differences and landing-page placement.
- [x] Approve the tool lifecycle and application-materialization boundary.
- [ ] Approve accessibility behavior, focus policy, and responsive budgets.

Exit gate:

- [ ] No unresolved decision changes prompt identity, payload shape, renderer trust, or surface reuse.

### Phase 1: Red tests for pure behavior

- [x] Add immutable catalog fixtures and failing `AI-DEMO-CATALOG-*` tests.
- [x] Add failing greeting/router tests for `AI-DEMO-GREET-*` pure behavior.
- [x] Add failing extension validation/security tests for `AI-DEMO-EXT-*`.
- [x] Record intended Red failures before adding catalog, router, or validators.

Exit gate:

- [x] Tests fail only because the approved catalog, routing, and validation behavior is absent.

### Phase 2: Conversation engine

- [x] Implement catalog lookup, greeting normalization, fallback response, and deterministic IDs.
- [x] Implement valid AG-UI text/tool sequences for recognized prompts.
- [x] Implement stop, retry, double-activation protection, and preview materialization.
- [x] Turn implemented `AI-DEMO-GREET-*` and `AI-DEMO-RUN-*` cases green.
- [x] Refactor without coupling the engine to either page layout.

Exit gate:

- [ ] Every supported conversation path is deterministic, correlated, cancellable, and independently
      testable.

### Phase 3: Safe extension renderers and previews

- [x] Implement validated prompt-options renderer.
- [x] Implement validated component-preview renderer and explicit preview allowlist.
- [x] Implement the four preview components using public TailNG APIs.
- [x] Implement unsupported/error fallback and lifecycle cleanup.
- [x] Turn implemented `AI-DEMO-EXT-*` and `AI-DEMO-PREVIEW-*` cases green.

Exit gate:

- [x] No message can select an arbitrary Angular component or provide executable markup/template
      content.
- [ ] All four previews are interactive, accessible, isolated, and disposable.

### Phase 4: Full examples page

- [x] Replace the release assistant with the shared full component-assistant variant.
- [x] Update page copy, code samples, tests, and AI-readable documentation.
- [x] Preserve streaming, history, stop, retry, tool details, and status behavior.
- [x] Verify the examples route through build and Chrome prerender.

Exit gate:

- [x] The full example clearly teaches AG-UI lifecycle versus application-owned UI rendering.

### Phase 5: Landing page

- [x] Add the static assistant section after the hero.
- [x] Add deferred compact assistant with stable placeholder dimensions.
- [x] Add the link to the full AI Chat examples page.
- [x] Turn implemented `AI-DEMO-SURFACE-*` cases green.
- [ ] Measure landing LCP, CLS, loaded JavaScript, and interaction readiness before and after.
- [ ] Adjust deferral or preview loading if the agreed performance budget regresses.

Exit gate:

- [ ] Landing-page discovery improves without materially regressing its initial load or prerender.

### Phase 6: Final verification

- [x] Run AI unit/integration tests, docs tests, typecheck, focused lint, route checks, and docs build.
- [ ] Run landing and examples real-browser tests at supported viewports.
- [ ] Run keyboard and screen-reader smoke tests.
- [ ] Verify no console errors, hydration mismatch, timer leak, observer leak, or chart cleanup warning.
- [ ] Verify all documentation and screenshots match the implemented interaction.
- [ ] Mark only fully evidenced catalog cases `[x]`.

Exit gate:

- [ ] All non-deferred `AI-DEMO-*` cases are green.
- [x] Both surfaces use the same engine, catalog, validators, and renderers.
- [ ] The demo is ready for the public docs landing page.

## Performance budgets

- [x] The interactive assistant is absent from the initial landing route work until its defer trigger.
- [x] The static assistant section introduces no render-blocking network dependency.
- [ ] The deferred placeholder prevents a material layout shift when the demo loads.
- [x] Streaming batches visual updates so token-sized deltas do not repeatedly rebuild all messages.
- [x] At most one preview is created per successful selected run.
- [ ] Destroyed previews leave no active timeout, observer, chart instance, subscription, or global
      listener.
- [ ] Landing measurements and thresholds are recorded before implementation so “no material
      regression” has an objective baseline.

## Definition of done

- [x] Typing a supported greeting produces four accessible prompt options.
- [x] Each option submits its exact prompt and renders the correct real TailNG component.
- [x] The tool lifecycle is visible, valid, stoppable, retryable, and correctly correlated.
- [x] Unknown or malicious extension content never instantiates arbitrary UI.
- [x] The examples page demonstrates the complete behavior and explains the architecture.
- [x] The landing page provides the compact interaction after the hero using deferred loading.
- [x] Both surfaces share implementation rather than copying the current live demo.
- [ ] Mobile, keyboard, screen-reader, theme, reduced-motion, prerender, hydration, and cleanup checks
      pass.
- [ ] All non-deferred `AI-DEMO-*` tests are green and traceable to implementation reviews.

## Planned files

- [x] Shared component-assistant engine, component, catalog, validators, fixtures, previews, and tests.
- [x] AI Chat examples page wrapper, copy, code samples, and route tests.
- [ ] Landing page component/template styles and performance/browser tests.
- [x] AI-readable examples/overview documentation generated through the existing docs pipeline.
- [x] TDD catalog/index references and traceability updates.
