---
id: components/ai-chat/examples
title: AI Chat integration examples
description: Integrate the normalized store, cursor history, and AG-UI streaming reducer in an AI application.
category: components
status: stable
tags: ["ai", "chat", "examples", "streaming", "pagination"]
package: @tailng-ui/ai
sourcePaths: ["libs/tailng-ui/ai/src/lib/store/chat-store.ts", "libs/tailng-ui/ai/src/lib/history/history-controller.ts", "libs/tailng-ui/ai/src/ag-ui/lib/reducer.ts", "apps/tailng-ui/docs/src/app/pages/components/ai/chat/sections/examples/ai-chat-examples-page.component.ts"]
humanDocsUrl: https://tailng.dev/components/ai/chat/examples
---

# AI Chat integration examples

The human [AI Chat examples page](https://tailng.dev/components/ai/chat/examples) includes a
deterministic working demo. It submits local prompts, streams official AG-UI lifecycle events into
the normalized store, renders a tool call and result, supports stop and retry, and prepends one
cursor-loaded history page without requiring a backend or API key.

Create one normalized store and reduce protocol events at the boundary:

```ts
import type { Event } from '@ag-ui/core';
import { TngAiChatStore } from '@tailng-ui/ai';
import { TngAgUiReducer } from '@tailng-ui/ai/ag-ui';

const store = new TngAiChatStore();
const reducer = new TngAgUiReducer(store, { profile: 'required-chat' });

export function receiveAgentEvent(event: Event): void {
  const result = reducer.reduce(event);
  if (!result.applied) console.warn(result.diagnostic);
}
```

For history, implement `TngAiHistorySource.loadBefore` with an opaque cursor and an `AbortSignal`, then pass it to `TngAiHistoryController`. Start with 40 messages, render only a virtualized viewport, and call `activateThread` when the active conversation changes so obsolete requests are aborted.

Schedule view updates at most once per animation frame during token streaming. Keep Markdown parsing, syntax highlighting, attachments, and persistence outside the synchronous reducer path.
