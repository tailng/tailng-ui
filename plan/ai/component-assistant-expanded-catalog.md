# Component Assistant Expanded Catalog Plan

Status: Core catalog delivered and verified; advanced lazy-loading and accessibility matrix remain

Deferred follow-up: unchecked interaction-depth, responsive, cleanup, lazy-chunk, and manual
accessibility items are intentionally retained for the next hardening release.

Delivery method: strict test-driven development

Surfaces:

- AI Chat examples-page component assistant
- Deferred compact component assistant on the documentation landing page

Related plans:

- [Component assistant demo](./component-assistant-demo.md)
- [Component assistant auto-scroll](./component-assistant-auto-scroll.md)

## Tracking convention

- [x] Treat every unchecked item as required unless it is explicitly moved to a later release.
- [x] Change an item to `[x]` only after its stated evidence exists at the required test level.
- [x] Follow Specify, Red, Green, Refactor, Verify for every implementation slice.
- [x] Observe each named test failing for the intended missing behavior before adding production code.

## Goal

Expand the greeting response from four options to twelve useful TailNG demonstrations without
turning the chat message into an unstructured wall of buttons. Keep one immutable, allowlisted
catalog shared by the examples and landing surfaces, group the visible choices into four labelled
categories, and load each selected preview without materially increasing the initial landing work.

## Product decisions

- [x] Keep `hi`, `hello`, and `hey` as the discovery greetings.
- [x] Show twelve options in one assistant message, grouped into four labelled categories.
- [x] Use the category order Forms, Data, Navigation & layout, Feedback.
- [x] Preserve catalog order within each category.
- [x] Keep every option visible after the greeting; do not hide choices behind search or pagination
      in this release.
- [x] Keep option activation behavior unchanged: the exact catalog prompt becomes a visible user
      message and starts one deterministic tool-rendering run.
- [x] Keep the demo local, deterministic, synthetic, and free of network or model dependencies.
- [x] Keep the same option set and behavior on full and compact surfaces.
- [x] Keep categories as application-owned catalog metadata rather than adding a new AG-UI event.
- [x] Keep the current prompt-options extension at version `1` because its serialized shape remains
      `{ id, label, prompt }`; do not serialize category or component implementation details.
- [x] Continue treating all extension content as untrusted even though the local producer is
      deterministic.

## Proposed twelve-option catalog

### Forms

| Done | ID                  | Stable ID            | Visible label             | Exact submitted prompt                | Preview                            |
| ---- | ------------------- | -------------------- | ------------------------- | ------------------------------------- | ---------------------------------- |
| [x]  | AI-DEMO-CATALOG-001 | `release-date`       | Choose a release date     | `Create a release date picker.`       | Existing datepicker                |
| [x]  | AI-DEMO-CATALOG-005 | `project-date-range` | Plan a project date range | `Create a project date range picker.` | Date-range picker                  |
| [x]  | AI-DEMO-CATALOG-006 | `assignee-search`    | Find a teammate           | `Create an assignee autocomplete.`    | Autocomplete with synthetic people |
| [x]  | AI-DEMO-CATALOG-007 | `rollout-slider`     | Set rollout percentage    | `Create a rollout percentage slider.` | Slider with visible percentage     |

### Data

| Done | ID                  | Stable ID          | Visible label         | Exact submitted prompt               | Preview                            |
| ---- | ------------------- | ------------------ | --------------------- | ------------------------------------ | ---------------------------------- |
| [x]  | AI-DEMO-CATALOG-002 | `monthly-installs` | Show monthly installs | `Visualize monthly TailNG installs.` | Existing bar chart                 |
| [x]  | AI-DEMO-CATALOG-008 | `adoption-trend`   | Show adoption trend   | `Visualize weekly TailNG adoption.`  | Line chart with static weekly data |
| [x]  | AI-DEMO-CATALOG-003 | `team-table`       | Display a team table  | `Show a sortable team table.`        | Existing sortable table            |

### Navigation & layout

| Done | ID                  | Stable ID       | Visible label               | Exact submitted prompt                       | Preview                              |
| ---- | ------------------- | --------------- | --------------------------- | -------------------------------------------- | ------------------------------------ |
| [x]  | AI-DEMO-CATALOG-009 | `release-faq`   | Show release FAQ            | `Create an accordion for release questions.` | Accordion with three synthetic items |
| [x]  | AI-DEMO-CATALOG-010 | `release-tabs`  | Build release settings tabs | `Create tabs for release settings.`          | Three interactive tabs               |
| [x]  | AI-DEMO-CATALOG-011 | `release-steps` | Show release steps          | `Create a release workflow stepper.`         | Compact three-step workflow          |

### Feedback

| Done | ID                  | Stable ID          | Visible label          | Exact submitted prompt              | Preview                         |
| ---- | ------------------- | ------------------ | ---------------------- | ----------------------------------- | ------------------------------- |
| [x]  | AI-DEMO-CATALOG-004 | `release-status`   | Create status labels   | `Create status tags for a release.` | Existing status tags            |
| [x]  | AI-DEMO-CATALOG-012 | `release-progress` | Track release progress | `Show release progress.`            | Progress bar with visible value |

## Catalog model

Extend the docs-owned catalog model without changing the serialized extension contract:

```ts
type ComponentAssistantCategoryId = 'forms' | 'data' | 'navigation-layout' | 'feedback';

type ComponentAssistantOption = Readonly<{
  id: string;
  categoryId: ComponentAssistantCategoryId;
  actionName: string;
  label: string;
  prompt: string;
  previewId: ComponentAssistantPreviewId;
  assistantIntroduction: string;
}>;
```

- [x] Define category IDs, accessible labels, and ordering in one immutable category catalog.
- [x] Add `categoryId` and an analytics-safe `actionName` to every option.
- [x] Keep option IDs and preview IDs stable and unique.
- [x] Keep prompt normalization collision-free across all twelve exact prompts.
- [x] Keep fixtures synthetic and deterministic; do not read current time, randomness, user data, or
      network state.
- [x] Add a pure grouping function that returns categories in declared order and options in catalog
      order without mutating either input.
- [x] Reject an empty category and reject options that reference an unknown category during static
      catalog validation.

## Message and protocol compatibility

The `tailng.dev/prompt-options` value remains:

```ts
type PromptOptionsExtensionValueV1 = Readonly<{
  version: 1;
  options: readonly Readonly<{
    id: string;
    label: string;
    prompt: string;
  }>[];
}>;
```

- [x] Continue serializing only `id`, `label`, and `prompt` for each option.
- [x] Derive category presentation only after strict option validation resolves the local catalog
      entries.
- [x] Update the exact catalog-length validation from four to twelve.
- [x] Keep the maximum accepted option count bounded at twelve for this demo.
- [x] Reject missing, duplicate, reordered, unknown, oversized, or extra-key option entries.
- [x] Keep `tailng.dev/component-preview` at version `1` and extend only its allowlisted preview-ID
      union.
- [x] Reject all unknown preview IDs, selectors, import paths, classes, templates, HTML, and arbitrary
      input objects.
- [x] Update old four-option fixtures atomically; this local deterministic demo does not persist old
      option messages across deployments.

## Greeting presentation

Render a labelled category group inside the existing prompt-options extension renderer:

```text
Choose a TailNG component

Forms
  [Choose a release date] [Plan a project date range]
  [Find a teammate] [Set rollout percentage]

Data
  [Show monthly installs] [Show adoption trend]
  [Display a team table]

Navigation & layout
  [Show release FAQ] [Build release settings tabs]
  [Show release steps]

Feedback
  [Create status labels] [Track release progress]
```

- [x] Keep the existing outer group name “TailNG component prompts.”
- [x] Give each category a visible heading associated with its option subgroup.
- [x] Use semantic headings plus labelled groups; do not represent categories with color alone.
- [x] Keep every option a native/TailNG button with its visible label as its accessible name.
- [x] Allow buttons to wrap without causing page-level horizontal overflow.
- [x] Preserve predictable DOM and keyboard order: category order, then option order.
- [x] Announce “12 component options available” once through the existing polite status region.
- [x] Keep automatic transcript following active when the taller categorized list renders.
- [ ] Keep “Jump to latest” behavior correct if the user is paused when another greeting produces the
      expanded list.

## New preview designs

### Project date range

- [x] Render the public TailNG date-range picker with deterministic start and end dates.
- [ ] Use a single-calendar or compact layout that fits the transcript at 320 CSS pixels.
- [x] Give the control and surrounding preview an independent accessible name.

### Assignee autocomplete

- [x] Use a static list of synthetic people with stable IDs, names, and teams.
- [ ] Support keyboard filtering, selection, Escape, and clearing without submitting the composer.
- [ ] Ensure its overlay is contained/positioned correctly from inside a scrollable transcript.

### Rollout slider

- [x] Initialize the slider to a deterministic value such as 60 percent.
- [x] Expose the current percentage as visible text and an accessible value.
- [x] Keep arrow-key interaction local to the slider.

### Adoption trend

- [x] Render the public TailNG line chart with static weekly values.
- [x] Provide accessible chart context and a deterministic data summary.
- [x] Use a compact fixed height and preserve transcript auto-follow when chart height settles.

### Release FAQ

- [x] Render three deterministic accordion items.
- [ ] Support pointer and keyboard expansion with correct trigger/panel relationships.
- [ ] Verify expanding an item grows the transcript correctly while following and preserves the
      reader's position while auto-follow is paused.

### Release settings tabs

- [x] Render three tabs with concise deterministic panels.
- [ ] Support arrow-key navigation and activation according to the TailNG tabs contract.
- [x] Keep tab state local to that preview instance.

### Release steps

- [x] Render a compact three-step workflow using the public TailNG stepper.
- [x] Use deterministic completed/current/upcoming states.
- [x] Prevent stepper keyboard interaction from reaching the chat composer.

### Release progress

- [x] Render a progress bar with a deterministic percentage and visible text alternative.
- [x] Expose the value through the component's accessible range semantics.
- [x] Avoid animation that conflicts with reduced-motion preferences.

## Renderer and loading architecture

- [x] Extend `ComponentAssistantPreviewId` with the eight approved IDs.
- [x] Keep explicit compile-time branches or an equally explicit allowlist; do not introduce arbitrary
      `NgComponentOutlet` lookup.
- [x] Split preview implementations into focused files before the wrapper becomes difficult to
      review.
- [x] Keep each preview standalone and import TailNG APIs only from public package entry points.
- [ ] Put each preview dependency behind an Angular `@defer` boundary or equivalent safe lazy split
      so selecting one preview does not eagerly instantiate or download all eleven alternatives.
- [ ] Provide a stable, labelled preview-loading placeholder that does not move focus.
- [x] Preserve per-message preview state and destroy it with the transcript row.
- [ ] Ensure a preview failure replaces only that preview with the existing safe fallback.
- [x] Keep both docs surfaces on the same catalog, validators, grouping helper, and preview wrapper.

## TDD test catalog

### Catalog and grouping

| Done | ID                 | Scenario                                 | Expected                                                                 | Level |
| ---- | ------------------ | ---------------------------------------- | ------------------------------------------------------------------------ | ----- |
| [x]  | AI-DEMO-EXPAND-001 | Read the expanded catalog.               | Exactly twelve frozen options and four frozen categories exist.          | unit  |
| [x]  | AI-DEMO-EXPAND-002 | Validate IDs, prompts, and action names. | Every value is nonempty, bounded, unique, and collision-free.            | unit  |
| [x]  | AI-DEMO-EXPAND-003 | Group the catalog.                       | Four groups and their options match the approved order without mutation. | unit  |
| [x]  | AI-DEMO-EXPAND-004 | Route every exact prompt.                | Every prompt selects its matching preview; no fallback is used.          | unit  |
| [x]  | AI-DEMO-EXPAND-005 | Route greetings and unsupported text.    | Greeting and safe fallback behavior remain unchanged.                    | unit  |
| [x]  | AI-DEMO-EXPAND-006 | Attempt category/prompt collisions.      | Static catalog validation reports the invalid catalog deterministically. | unit  |

### Extension and security

| Done | ID                 | Scenario                                               | Expected                                                                    | Level         |
| ---- | ------------------ | ------------------------------------------------------ | --------------------------------------------------------------------------- | ------------- |
| [x]  | AI-DEMO-EXPAND-007 | Create the prompt-options extension.                   | Wire value stays version 1 and contains twelve `{id,label,prompt}` entries. | unit          |
| [x]  | AI-DEMO-EXPAND-008 | Resolve the canonical twelve-option payload.           | Four grouped local view models are returned in approved order.              | unit          |
| [x]  | AI-DEMO-EXPAND-009 | Resolve old, missing, duplicate, or reordered options. | Payload is rejected without partial rendering.                              | unit/security |
| [x]  | AI-DEMO-EXPAND-010 | Resolve extra category or implementation keys.         | Payload is rejected because the wire shape remains strict.                  | unit/security |
| [x]  | AI-DEMO-EXPAND-011 | Resolve each new preview ID.                           | Only the eight new allowlisted IDs return preview view models.              | unit          |
| [x]  | AI-DEMO-EXPAND-012 | Supply arbitrary component instructions.               | Selector/import/template/HTML values remain inert and unsupported.          | unit/security |

### Greeting UI and interaction

| Done | ID                 | Scenario                                   | Expected                                                                | Level             |
| ---- | ------------------ | ------------------------------------------ | ----------------------------------------------------------------------- | ----------------- |
| [x]  | AI-DEMO-EXPAND-013 | Submit `hi`.                               | One categorized reply exposes twelve buttons under four headings.       | component/browser |
| [x]  | AI-DEMO-EXPAND-014 | Inspect semantics and DOM order.           | Group labels, button names, and keyboard order match the catalog.       | component/a11y    |
| [x]  | AI-DEMO-EXPAND-015 | Activate every option.                     | Exact prompt is inserted and exactly one matching tool run starts.      | component         |
| [ ]  | AI-DEMO-EXPAND-016 | Activate an option twice rapidly.          | At most one run starts for the activation window.                       | component         |
| [ ]  | AI-DEMO-EXPAND-017 | Submit a second greeting later.            | A fresh categorized list appears and the earlier one remains immutable. | integration       |
| [x]  | AI-DEMO-EXPAND-018 | Render the expanded list while following.  | Its end remains visible after the post-render scroll reconciliation.    | browser           |
| [ ]  | AI-DEMO-EXPAND-019 | Render another list while paused above it. | Reading position stays fixed and unseen/latest state remains correct.   | browser           |

### Preview behavior

| Done | ID                 | Scenario                             | Expected                                                               | Level                   |
| ---- | ------------------ | ------------------------------------ | ---------------------------------------------------------------------- | ----------------------- |
| [ ]  | AI-DEMO-EXPAND-020 | Render project-date-range.           | Labelled deterministic range picker is interactive.                    | component/browser       |
| [ ]  | AI-DEMO-EXPAND-021 | Render assignee-search.              | Keyboard filtering and selection remain local to the preview.          | component/browser       |
| [x]  | AI-DEMO-EXPAND-022 | Render rollout-slider.               | Value starts deterministically and updates visibly/accessibly.         | component/browser       |
| [ ]  | AI-DEMO-EXPAND-023 | Render adoption-trend.               | Line chart exposes static weekly context and fits the transcript.      | component/browser       |
| [ ]  | AI-DEMO-EXPAND-024 | Render release-faq.                  | Accordion semantics and expansion work without composer submission.    | component/browser       |
| [ ]  | AI-DEMO-EXPAND-025 | Render release-tabs.                 | Tabs keyboard behavior and local panel state are correct.              | component/browser       |
| [ ]  | AI-DEMO-EXPAND-026 | Render release-steps.                | Step states and interactions are isolated and accessible.              | component/browser       |
| [ ]  | AI-DEMO-EXPAND-027 | Render release-progress.             | Progress semantics, text, and deterministic value are correct.         | component/browser       |
| [x]  | AI-DEMO-EXPAND-028 | Mount two previews of the same type. | Changing one preview does not affect the other.                        | component               |
| [ ]  | AI-DEMO-EXPAND-029 | Destroy each new preview.            | No timer, overlay, observer, chart, subscription, or listener remains. | integration/performance |

### Surfaces, responsiveness, and loading

| Done | ID                 | Scenario                                                        | Expected                                                              | Level               |
| ---- | ------------------ | --------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------- |
| [x]  | AI-DEMO-EXPAND-030 | Mount full and compact assistants.                              | Both use the same twelve-option catalog and grouped renderer.         | component           |
| [ ]  | AI-DEMO-EXPAND-031 | Test list and previews at 320 px.                               | No page-level horizontal overflow; all controls remain reachable.     | browser             |
| [ ]  | AI-DEMO-EXPAND-032 | Test tablet and desktop widths.                                 | Category layout uses space without changing semantic order.           | browser             |
| [ ]  | AI-DEMO-EXPAND-033 | Load the landing route before its defer trigger.                | New preview dependencies are absent from initial assistant/hero work. | browser/performance |
| [ ]  | AI-DEMO-EXPAND-034 | Select one preview after deferred mount.                        | Only required lazy preview chunks load and the placeholder is stable. | browser/performance |
| [x]  | AI-DEMO-EXPAND-035 | Compare production bundles before and after.                    | Initial landing budget does not regress; deferred growth is recorded. | build/performance   |
| [ ]  | AI-DEMO-EXPAND-036 | Run light, dark, forced-color, zoom, and reduced-motion checks. | Options and previews remain usable.                                   | browser/a11y        |

## Delivery phases

### Phase 0: Approve catalog and compatibility

- [x] Approve the eight additions, exact labels, prompts, IDs, categories, and fixture concepts.
- [x] Approve twelve visible options as the compact-surface limit for this release.
- [x] Approve local category metadata with no prompt-options version bump.
- [ ] Approve preview lazy loading and the build/performance acceptance gates.

Exit gate:

- [ ] No unresolved decision changes catalog identity, wire compatibility, category order, or loading
      architecture.

### Phase 1: Red catalog and protocol tests

- [x] Add failing `AI-DEMO-EXPAND-001..012` pure tests.
- [x] Record the expected failures before changing catalog or validators.
- [x] Add the category model, expanded IDs, immutable catalog entries, grouping helper, and static
      validation.
- [x] Update extension creation and resolution without changing the version-1 wire shape.
- [x] Turn `AI-DEMO-EXPAND-001..012` green and refactor duplicated catalog logic.

Exit gate:

- [x] Twelve options are deterministic, uniquely routable, strictly validated, and safely grouped.

### Phase 2: Red greeting UI tests

- [ ] Add failing `AI-DEMO-EXPAND-013..019` component and browser tests.
- [x] Implement category headings/subgroups and responsive wrapping.
- [x] Update status text from four to twelve options.
- [ ] Verify exact prompt submission, double-activation protection, repeated greetings, and scroll
      behavior.
- [ ] Turn `AI-DEMO-EXPAND-013..019` green.

Exit gate:

- [ ] The expanded greeting remains scannable, accessible, keyboard ordered, and scroll-safe.

### Phase 3: Red preview tests and implementation

- [ ] Add failing `AI-DEMO-EXPAND-020..029` tests before importing new preview components.
- [x] Split the existing and new previews into focused files.
- [x] Implement the eight new previews with public TailNG APIs and deterministic fixtures.
- [ ] Add explicit renderer branches and safe per-preview fallback handling.
- [ ] Verify interaction isolation, composer-event containment, auto-scroll, and cleanup.
- [ ] Turn `AI-DEMO-EXPAND-020..029` green.

Exit gate:

- [ ] Every new option renders the intended interactive component without expanding the trust
      boundary.

### Phase 4: Surface and performance verification

- [ ] Add failing `AI-DEMO-EXPAND-030..036` surface/browser/performance tests.
- [ ] Add per-preview lazy boundaries and stable loading placeholders.
- [ ] Verify full and compact variants at 320 px, tablet, desktop, 200%, and 400% zoom.
- [ ] Measure production initial and deferred chunks before/after and record the comparison.
- [ ] Run keyboard, forced-color, light/dark, and reduced-motion checks.
- [ ] Turn `AI-DEMO-EXPAND-030..036` green.

Exit gate:

- [ ] More discoverable components do not materially regress landing performance, responsive layout,
      accessibility, or cleanup.

### Phase 5: Documentation and release verification

- [x] Update examples-page copy from four options to twelve categorized options.
- [x] Update AI-readable docs, generated artifacts, and safe-renderer examples.
- [x] Update tests or snapshots that enumerate the preview-ID union.
- [x] Run focused catalog, extension, component, and Chromium suites.
- [x] Run full docs tests, docs typecheck, focused lint, agent-doc build/check/test, route checks,
      prerender checks, and the production docs build.
- [x] Confirm no new component-style or initial-bundle budget warning is introduced.
- [x] Mark only fully evidenced items `[x]`.

Exit gate:

- [ ] Both docs surfaces accurately teach and demonstrate the expanded safe component catalog.

## Definition of done

- [x] A greeting renders exactly twelve options under four accessible category headings.
- [x] Every option submits its approved exact prompt and renders its matching allowlisted preview.
- [x] The extension wire contract remains version 1 and rejects noncanonical or executable content.
- [ ] All new previews use public TailNG APIs, deterministic data, isolated state, and clean teardown.
- [ ] The expanded list and every preview work at 320 px and supported larger viewports.
- [x] Automatic follow, paused reading position, and “Jump to latest” remain correct.
- [ ] Keyboard, screen-reader semantics, forced colors, themes, zoom, and reduced motion pass.
- [ ] Landing initial work does not materially regress; preview chunk growth is lazy and recorded.
- [x] Human and AI-readable documentation match the implementation.
- [ ] Every `AI-DEMO-EXPAND-*` case is green at its required level.

## Planned files

- [x] `component-assistant.catalog.ts` for categories, twelve options, grouping, and routing.
- [x] `component-assistant.extensions.ts` for strict twelve-option validation and grouped view models.
- [x] The example-owned `ai-chat-live-demo.component.html`/CSS and landing-owned component for category semantics and responsive wrapping.
- [ ] Focused preview files plus an explicit lazy preview wrapper/allowlist.
- [ ] Pure, component, Chromium, accessibility, cleanup, and performance tests.
- [x] Examples-page and landing-page documentation/copy updates.
- [x] AI-readable docs and generated artifacts.
- [x] Plan and test indexes plus verification evidence.
