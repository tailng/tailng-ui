---
id: components/ai-chat/api
title: AI Chat API
description: Public chat component, custom renderer, core, store, history, validation, and AG-UI contracts for the TailNG AI package.
category: components
status: stable
tags: ["ai", "chat", "api", "ag-ui"]
package: @tailng-ui/ai
sourcePaths: ["libs/tailng-ui/ai/src/index.ts", "libs/tailng-ui/ai/src/lib/chat/tng-ai-chat.component.ts", "libs/tailng-ui/ai/src/lib/chat/tng-ai-chat.types.ts", "libs/tailng-ui/ai/src/ag-ui/index.ts", "libs/tailng-ui/ai/src/lib/store/chat-store.ts", "libs/tailng-ui/ai/src/lib/history/history-controller.ts"]
humanDocsUrl: https://tailng.dev/components/ai/chat/api
---

# AI Chat API

Import `TngAiChatComponent`, its customization contracts, canonical types, store, and history controller from `@tailng-ui/ai`. Import AG-UI validation and reduction from `@tailng-ui/ai/ag-ui`; that entry point requires the optional `@ag-ui/core` peer.

Chat component:

- `TngAiChatComponent` owns the standard transcript, composer, run controls, history requests, auto-scroll, and bounded rendered window.
- `headerComponent` replaces the default header with a trusted local Angular component using `TNG_AI_CHAT_HEADER_CONTEXT`.
- `partRenderers` and `provideTngAiMessagePartRenderer` map exact part types or namespaced extension names to trusted local components.
- Custom parts inject `TNG_AI_MESSAGE_PART_CONTEXT` and emit typed actions without receiving the store.

Core model:

- `TngAiThread`, `TngAiRun`, and `TngAiMessage` are the normalized entity envelopes.
- `TngAiMessagePart` is the discriminated union for text, reasoning, tools, files, sources, data, activity, UI payloads, extensions, and unsupported content.
- `TngAiActionRequest` describes UI intent without owning transport behavior.
- `TngAiPartRegistry<T>` resolves explicitly registered, namespaced extension renderers.

State and history:

- `TngAiChatStore` exposes `snapshot`, `upsertThread`, `upsertRun`, `upsertMessage`, `updateMessage`, `selectMessages`, `clearThread`, `diagnostics`, and `dispose`.
- `TngAiHistoryController` exposes `loadBefore`, `retry`, `state`, `activateThread`, `diagnostics`, and `dispose`.
- A `TngAiHistorySource` returns an oldest-to-newest `TngAiHistoryPage` with an opaque `previousCursor` and `hasMore` flag.

AG-UI:

- `validateTngAgUiEvent` validates JSON limits, the selected profile, and the official event schema.
- `TngAgUiReducer.reduce` applies one validated event to a `TngAiChatStore` or returns a structured diagnostic.
- The `required-chat` profile supports run, text, tool-call, tool-result, and message-snapshot events.
