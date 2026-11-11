---
id: components/ai-chat/overview
title: AI Chat foundation overview
description: Build protocol-neutral AI chat state with canonical messages, normalized storage, bounded history, and AG-UI 1.0 events.
category: components
status: stable
tags: ["ai", "chat", "ag-ui", "history"]
package: @tailng-ui/ai
sourcePaths: ["libs/tailng-ui/ai/src/index.ts", "libs/tailng-ui/ai/src/lib/core/message.types.ts", "apps/tailng-ui/docs/src/app/pages/components/ai/chat/sections/overview/ai-chat-overview-page.component.ts"]
humanDocsUrl: https://tailng.dev/components/ai/chat/overview
---

# AI Chat foundation overview

`@tailng-ui/ai` is a headless data and protocol foundation. It does not currently export a rendered Angular chat component or CSS.

Use the package to keep transport-specific events out of presentation code:

```ts
import { TngAiChatStore, TngAiHistoryController } from '@tailng-ui/ai';
import { TngAgUiReducer } from '@tailng-ui/ai/ag-ui';

const store = new TngAiChatStore();
const history = new TngAiHistoryController(store);
const reducer = new TngAgUiReducer(store);
```

The application remains responsible for transport, authentication, persistence, rendering, virtualization, and product policy. TailNG provides canonical thread, run, message, part, and action types; lifecycle-safe operations; normalized state; cursor-history coordination; and AG-UI event validation and reduction.

For long conversations, fetch older messages by opaque cursor, render a virtual window, batch streamed updates, and evict inactive pages according to application policy.

- [API reference](https://tailng.dev/ai/components/ai-chat/api.md)
- [Styling and rendering policy](https://tailng.dev/ai/components/ai-chat/styling.md)
- [Integration examples](https://tailng.dev/ai/components/ai-chat/examples.md)
