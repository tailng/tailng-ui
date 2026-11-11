# `@tailng-ui/ai` TDD Test Catalog

Status: Required before production implementation

## TDD contract

No production behavior for `@tailng-ui/ai` may be implemented until its test case is present in this
catalog, has a stable ID, and has been translated into an executable test that fails for the intended
missing behavior.

Every implementation slice follows:

```text
Specify -> Red -> Green -> Refactor -> Verify
```

1. **Specify:** Select catalog case IDs and settle their fixtures and expected observable behavior.
2. **Red:** Add the executable tests. Confirm failure is caused by missing behavior, not a broken
   harness, missing import, or invalid fixture.
3. **Green:** Add the smallest production change that satisfies the selected cases.
4. **Refactor:** Improve design without changing the tests' behavioral meaning.
5. **Verify:** Run the affected suite, package suite, lint/type checks, and required browser gates.

A test that passes before the intended behavior exists is not a valid Red step. A test that observes
private fields, private methods, incidental DOM structure, timing accidents, or framework internals
must be rewritten against a public contract.

## Checkbox meaning

Every catalog case has a `Done` checkbox:

```text
[ ] specified but not complete
[x] executable test observed red, production behavior implemented, and required suite green
```

Do not mark a case complete merely because its test file exists. For browser, integration, package,
manual accessibility, or performance cases, the checkbox remains open until that required level has
passed. If a case is deferred or removed from scope, leave it open and record the decision instead of
marking it complete.

## Catalog documents

| Document | Case prefix | Scope |
| --- | --- | --- |
| [Core model and store](./core-model-and-store.md) | `AI-CORE`, `AI-STORE`, `AI-HIST` | JSON contracts, message model, reducers, normalized state, history, and eviction. |
| [AG-UI 1.0 adapter](./ag-ui-adapter.md) | `AI-AGUI` | All event families, lifecycle validation, conversion, transport, cancellation, and Mastra fixtures. |
| [Components and accessibility](./components-and-accessibility.md) | `AI-CMP`, `AI-A11Y` | Compound parts, message rendering, composer, actions, announcements, keyboard, and responsive behavior. |
| [Virtualization and performance](./virtualization-and-performance.md) | `AI-VIRT`, `AI-PERF` | Variable-height range calculation, anchoring, streaming, memory, media, and cleanup. |
| [Security, packaging, and integration](./security-packaging-integration.md) | `AI-SEC`, `AI-PKG`, `AI-INT` | Trust boundaries, package exports, consumer builds, transport failures, and end-to-end integration. |

## Case format

Each case defines:

- **Done:** `[ ]` until the complete Red/Green/required-suite rule is satisfied; then `[x]`.
- **ID:** Stable identifier used in test names, pull requests, and traceability reports.
- **Scenario:** Public behavior being specified.
- **Expected:** Observable outcome.
- **Level:** `type`, `unit`, `component`, `browser`, `integration`, `package`, or `performance`.

If setup is not obvious from the scenario, the executable test must name its fixture explicitly.
Test IDs are never reused for a different behavior. Superseded cases remain documented with their
replacement IDs.

## Test levels

### Type-contract tests

Use compile-time fixtures for readonly contracts, accepted unions, rejected non-JSON values, entry-
point exports, and absence of external types from the primary API.

### Unit tests

Use Vitest for pure conversion, reducers, stores, selectors, pagination decisions, validation,
limits, and range calculations. Prefer fake clocks and injected schedulers over real time.

### Angular component tests

Use Angular TestBed for public inputs, outputs, projection, accessible attributes, focus, keyboard,
and renderer selection. Query by role, label, slot, or public data attribute instead of generated
Angular internals.

### Real-browser tests

Use the repository's browser-test pattern for geometry, scrolling, resize observation, focus during
virtualization, mobile viewport behavior, reduced motion, forced colors, and memory-sensitive
lifecycle behavior. DOM emulators are not authoritative for these cases.

### Package tests

Build and pack the package, install it into minimal consumer fixtures, and verify primary and
secondary entry points with the supported Angular versions.

### Performance tests

Performance cases use explicit budgets and a controlled environment. They produce measurements and
fail only against agreed thresholds. Unit tests still verify bounded algorithms deterministically.

## Fixture inventory

Create shared immutable fixtures before implementing reducers:

```text
fixtures/
├── messages/
│   ├── plain-thread.json
│   ├── multipart-thread.json
│   ├── parallel-tools.json
│   ├── sources-and-files.json
│   ├── hidden-roles.json
│   └── unknown-extension.json
├── ag-ui/
│   ├── text-stream.ndjson
│   ├── chunk-stream.ndjson
│   ├── parallel-tool-stream.ndjson
│   ├── reasoning-stream.ndjson
│   ├── state-and-activity.ndjson
│   ├── subagent-stream.ndjson
│   ├── malformed-lifecycles.ndjson
│   └── messages-snapshot.json
├── history/
│   ├── page-newest.json
│   ├── page-older.json
│   ├── overlapping-page.json
│   └── edited-page.json
└── security/
    ├── dangerous-markdown.json
    ├── unsafe-urls.json
    ├── oversized-events.json
    └── prototype-patch.json
```

Fixtures are deeply frozen in reducer tests. Protocol fixtures preserve arrival order. Sensitive
examples use synthetic values and never real credentials or prompts.

## Naming and placement

Executable test names begin with their case ID:

```ts
it('AI-AGUI-TEXT-004 appends content to the open text part', () => {});
```

Suggested placement:

```text
libs/tailng-ui/ai/src/lib/**/__tests__/*.spec.ts
libs/tailng-ui/ai/src/ag-ui/**/__tests__/*.spec.ts
libs/tailng-ui/ai/src/browser/*.browser.spec.ts
libs/tailng-ui/ai/consumer-tests/**
```

Co-located tests are acceptable if the project convention prefers them. Case IDs remain mandatory.

## Red-step rules

- A compile error caused only by a nonexistent production file does not prove a behavioral Red
  state. Add the minimum exported shell needed to compile, then fail on behavior.
- Test scaffolding may introduce types, empty functions, or throwing stubs, but no production logic.
- Record the expected failure message or assertion during review.
- If a new test unexpectedly passes, determine whether behavior already exists, the assertion is too
  weak, or the case is redundant before implementation continues.
- Bug fixes begin with a new regression case that reproduces the failure.

## Coverage policy

Coverage is a diagnostic, not the definition of completeness. Minimum release gates:

- [ ] 100% branch coverage for pure protocol lifecycle reducers and security validators.
- [ ] 100% event-family coverage for the declared AG-UI conformance profile.
- [ ] Every public component input and output exercised by at least one behavioral test.
- [ ] Every documented keyboard interaction exercised in component or browser tests.
- [ ] Every security rule has a negative test.
- [ ] Every performance budget has a deterministic unit assertion or recorded browser measurement.

Generated code and type-only declarations may be excluded with an explicit reviewed reason.

## Flake policy

- No fixed sleeps in unit or component tests.
- Browser tests wait for observable conditions or animation-frame stabilization.
- Randomized cases use recorded seeds.
- A flaky test blocks the phase. It is fixed or quarantined with an owner and expiry; it is not
  silently retried until green.
- Timing budgets run in the controlled performance job, not ordinary developer machines.

## Traceability gate

Maintain a machine-readable or generated matrix before stable release:

```text
case ID -> executable test file -> public contract -> delivery phase -> status
```

No public requirement is complete unless every linked case is green at its required test level.

