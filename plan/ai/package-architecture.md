# `@tailng-ui/ai` Package Architecture

Status: Proposed

## Package decision

Create a dedicated Angular package:

```text
@tailng-ui/ai
```

Chat must not be added to `@tailng-ui/flow`. Flow is a graph and workflow-editor package with
Foblex peer dependencies and canvas-specific behavior. Chat has different public contracts,
accessibility semantics, rendering requirements, and performance constraints.

Neither package depends on the other:

```text
                 @tailng-ui/cdk
                  /           \
                 v             v
 @tailng-ui/primitives     @tailng-ui/components
                 \             /
                  v           v
                  @tailng-ui/ai

                  @tailng-ui/flow
```

An application may compose AI and Flow. TailNG does not provide that coupling in the first release.

## Entry points

### Primary

```text
@tailng-ui/ai
```

Owns:

- TailNG AI JSON, thread, run, message, part, error, and action types.
- Headless chat state and interaction contracts.
- Styled chat components.
- Renderer registry and safe fallbacks.
- History source and message-store interfaces.

### AG-UI integration

```text
@tailng-ui/ai/ag-ui
```

Owns:

- AG-UI 1.0 validation at the adapter boundary.
- Conversion between materialized AG-UI messages and TailNG messages.
- Reduction of AG-UI events into normalized TailNG updates.
- An adapter contract for consuming an AG-UI event stream.
- Mastra-compatible examples without a runtime dependency on Mastra.

It must not own HTTP endpoints or create a Mastra agent.

### Deferred entry points

Do not create these until there is an implemented use case:

```text
@tailng-ui/ai/ai-sdk
@tailng-ui/ai/a2ui
@tailng-ui/ai/mcp-apps
```

The core message model reserves a safe `ui` or extension part so these integrations can be added
without changing the transcript model.

## Dependency policy

The primary package may depend on:

- `@angular/common`
- `@angular/core`
- `@tailng-ui/cdk`
- `@tailng-ui/components`
- `@tailng-ui/icons`
- `tslib`

It must not depend on:

- Mastra
- OpenAI or another model-provider SDK
- Foblex or `@tailng-ui/flow`
- CopilotKit
- A Markdown implementation
- A syntax-highlighting implementation
- A persistence database or browser-storage wrapper

`@tailng-ui/ai/ag-ui` may use `@ag-ui/core` as an optional peer dependency and development
dependency. AG-UI types must not leak from the primary entry point.

Suggested policy:

```json
{
  "peerDependencies": {
    "@ag-ui/core": "^1.0.0"
  },
  "peerDependenciesMeta": {
    "@ag-ui/core": {
      "optional": true
    }
  }
}
```

The exact minimum AG-UI patch version must be chosen during package scaffolding after testing the
Mastra adapter version used by the reference application.

## Proposed repository layout

```text
libs/tailng-ui/ai/
├── README.md
├── ng-package.json
├── package.json
├── project.json
├── tsconfig.json
├── tsconfig.lib.json
├── tsconfig.lib.prod.json
├── tsconfig.spec.json
├── vitest.config.ts
├── ag-ui/
│   └── ng-package.json
└── src/
    ├── index.ts
    ├── ag-ui/
    │   └── index.ts
    └── lib/
        ├── core/
        │   ├── json.types.ts
        │   ├── thread.types.ts
        │   ├── run.types.ts
        │   ├── message.types.ts
        │   ├── message-part.types.ts
        │   ├── action.types.ts
        │   └── error.types.ts
        ├── store/
        │   ├── chat-store.ts
        │   ├── chat-store.types.ts
        │   ├── chat-reducer.ts
        │   └── history-source.ts
        ├── renderers/
        │   ├── renderer-registry.ts
        │   ├── text-renderer/
        │   ├── tool-renderer/
        │   ├── file-renderer/
        │   ├── source-renderer/
        │   └── unsupported-renderer/
        ├── chat/
        │   ├── root/
        │   ├── header/
        │   ├── message-list/
        │   ├── message/
        │   ├── message-content/
        │   ├── message-actions/
        │   ├── composer/
        │   ├── attachment/
        │   ├── status/
        │   ├── empty/
        │   └── scroll-button/
        └── ag-ui/
            ├── ag-ui-adapter.ts
            ├── ag-ui-event-reducer.ts
            ├── ag-ui-message-converter.ts
            ├── ag-ui-validation.ts
            └── ag-ui.types.ts
```

Files may be consolidated while contracts are small. Do not create one public class per conceptual
box merely to match this diagram.

## Angular naming

Recommended public names:

| Concept | Class | Selector |
| --- | --- | --- |
| Chat root | `TngChatComponent` | `tng-chat` |
| Header | `TngChatHeaderComponent` | `tng-chat-header` |
| Message list | `TngChatMessageListComponent` | `tng-chat-message-list` |
| Message | `TngChatMessageComponent` | `tng-chat-message` |
| Message content | `TngChatMessageContentComponent` | `tng-chat-message-content` |
| Message actions | `TngChatMessageActionsComponent` | `tng-chat-message-actions` |
| Composer | `TngChatComposerComponent` | `tng-chat-composer` |
| Attachment | `TngChatAttachmentComponent` | `tng-chat-attachment` |
| Status | `TngChatStatusComponent` | `tng-chat-status` |
| Empty state | `TngChatEmptyComponent` | `tng-chat-empty` |
| Latest button | `TngChatScrollButtonComponent` | `tng-chat-scroll-button` |

Use `TngAi*` for protocol and data types and `TngChat*` for rendered chat components.

## Ownership and control model

The root component may coordinate projected parts, but it must remain controlled with respect to:

- Messages
- Active run
- History pages
- Upload results
- Tool execution and approval
- Retry, edit, branch, and feedback outcomes

The component emits typed requests. It must not optimistically invent persisted message IDs unless
the application explicitly opts into a local ID factory.

Internal UI state may include:

- Draft text
- Composer height
- Current visible range
- Near-bottom state
- Focus and active-action state
- Temporary attachment selection before the application accepts it
- Accessible announcement text

## Public API rules

- All public input records are readonly.
- Public APIs use TailNG types, not AG-UI, Mastra, or provider-native types.
- IDs are opaque strings.
- Time values are Unix milliseconds, not `Date` instances.
- Serializable records contain JSON values only.
- No public type contains `File`, `Blob`, DOM nodes, Angular templates, or Observables as persisted
  message data.
- Template or renderer hooks are separate runtime configuration and are never serialized.
- Optional fields are omitted when absent. Adapter output must not emit placeholder `null` values.
- New part kinds are additive. Existing part semantics cannot be silently redefined.

## Theme integration

The package uses TailNG semantic tokens and introduces AI-specific component contracts only where
existing tokens cannot express the state. Proposed token groups:

```text
--tng-chat-*
--tng-chat-message-*
--tng-chat-composer-*
--tng-chat-tool-*
--tng-chat-source-*
```

AI-specific tokens must resolve to existing semantic foreground, surface, border, focus, positive,
warning, and negative tokens by default. User and assistant identity must not rely on color alone.

## Packaging verification

The executable specification is defined by the `AI-PKG-*` cases in
[Security, packaging, and integration tests](./tests/security-packaging-integration.md). The list
below is a release summary, not a replacement for those test cases.

- [ ] `@tailng-ui/ai` builds without installing Mastra, CopilotKit, or Foblex.
- [ ] `@tailng-ui/ai` does not import `@ag-ui/core`.
- [ ] `@tailng-ui/ai/ag-ui` resolves when `@ag-ui/core` is installed.
- [ ] The primary bundle does not contain AG-UI validation code.
- [ ] Every public symbol is reachable from exactly one intended entry point.
- [ ] Package exports work in Angular application builds and direct TypeScript consumers.
- [ ] Styles and side-effect declarations match the final styling strategy.

