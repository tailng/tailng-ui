---
id: components/ai-chat/overview
title: AI Chat foundation overview
description: Render a professional protocol-neutral AI chat with canonical messages, custom Angular parts, bounded history, and AG-UI 1.0 events.
category: components
status: stable
tags: ["ai", "chat", "ag-ui", "history"]
package: @tailng-ui/ai
sourcePaths: ["libs/tailng-ui/ai/src/index.ts", "libs/tailng-ui/ai/src/lib/chat/tng-ai-chat.component.ts", "libs/tailng-ui/ai/src/lib/chat/tng-ai-chat.types.ts", "libs/tailng-ui/ai/src/lib/core/message.types.ts", "apps/tailng-ui/docs/src/app/pages/components/ai/chat/sections/overview/ai-chat-overview-page.component.ts"]
humanDocsUrl: https://tailng.dev/components/ai/chat/overview
---

# AI Chat foundation overview

`@tailng-ui/ai` exports `TngAiChatComponent`, a controlled professional chat surface with a default header, transcript, composer, run controls, history requests, auto-scroll, and bounded DOM rendering.

Use the package to keep transport-specific events out of presentation code:

```ts
import { TngAiChatComponent, TngAiChatStore, TngAiHistoryController } from '@tailng-ui/ai';
import { TngAgUiReducer } from '@tailng-ui/ai/ag-ui';

const store = new TngAiChatStore();
const history = new TngAiHistoryController(store);
const reducer = new TngAgUiReducer(store);
```

The application remains responsible for transport, authentication, persistence, agent execution, tool policy, and business-specific custom parts. TailNG provides the presentation layer, bounded rendered window, canonical model, normalized state, cursor-history coordination, and AG-UI validation and reduction.

For long conversations, fetch older messages by opaque cursor and evict inactive pages according to application policy. `tng-ai-chat` bounds the number of messages it renders and preserves scroll position when older history is prepended.

- [API reference](https://tailng.dev/ai/components/ai-chat/api.md)
- [Styling and rendering policy](https://tailng.dev/ai/components/ai-chat/styling.md)
- [Integration examples](https://tailng.dev/ai/components/ai-chat/examples.md)
