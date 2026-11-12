---
id: components/ai-chat/examples
title: AI Chat integration examples
description: Integrate the normalized store, AG-UI streaming, safe component renderers, and bounded cursor history in an AI application.
category: components
status: stable
tags: ["ai", "chat", "examples", "streaming", "pagination"]
package: @tailng-ui/ai
sourcePaths: ["libs/tailng-ui/ai/src/lib/store/chat-store.ts", "libs/tailng-ui/ai/src/lib/history/history-controller.ts", "libs/tailng-ui/ai/src/ag-ui/lib/reducer.ts", "apps/tailng-ui/docs/src/app/pages/components/ai/chat/sections/examples/live-chat-demo/ai-chat-live-demo.component.ts", "apps/tailng-ui/docs/src/app/pages/components/ai/chat/sections/examples/live-chat-demo/ai-chat-live-demo.component.html", "apps/tailng-ui/docs/src/app/pages/components/ai/chat/sections/examples/live-chat-demo/ai-chat-live-demo.component.css", "apps/tailng-ui/docs/src/app/shared/demos/component-assistant/component-assistant.extensions.ts", "apps/tailng-ui/docs/src/app/pages/components/ai/chat/sections/examples/ai-chat-examples-page.component.ts"]
humanDocsUrl: https://tailng.dev/components/ai/chat/examples
---

# AI Chat integration examples

The human [AI Chat examples page](https://tailng.dev/components/ai/chat/examples) includes a
deterministic component assistant. Enter `hi` and choose one of twelve prompts grouped under Forms,
Data, Navigation & layout, and Feedback. The demo streams official AG-UI lifecycle events into the
normalized store. A correlated `render_component` tool call then renders one of twelve allowlisted
TailNG previews, including date controls, autocomplete, slider, charts, table, accordion, tabs,
stepper, tags, and progress. The demo also supports stop, retry, and one cursor-loaded history page
without a backend or API key.

The transcript starts in follow mode and reconciles its scroll position after Angular renders each
streaming update. Scrolling more than 48 CSS pixels from the bottom pauses auto-follow and preserves
the reader's position. A bounded, message-based `Jump to latest` control resumes follow mode;
prepending history restores the prior viewport offset instead of moving to the newest message.

AG-UI carries the run, message, and tool lifecycle. Prompt options and component previews are
application-owned extension parts named `tailng.dev/prompt-options` and
`tailng.dev/component-preview`; they are not new AG-UI event types. Treat each extension as untrusted
input: require an exact supported version and shape, enforce text/count bounds, and map a validated
preview ID to a statically imported Angular component. Reject selectors, import paths, templates,
HTML, extra keys, and unknown IDs.

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
