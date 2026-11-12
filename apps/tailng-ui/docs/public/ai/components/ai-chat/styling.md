---
id: components/ai-chat/styling
title: AI Chat styling and rendering policy
description: Style a TailNG AI chat presentation safely while preserving accessibility and renderer boundaries.
category: components
status: stable
tags: ["ai", "chat", "styling", "accessibility", "security"]
package: @tailng-ui/ai
sourcePaths: ["libs/tailng-ui/ai/src/lib/chat/tng-ai-chat.component.css", "libs/tailng-ui/ai/src/lib/chat/tng-ai-chat.types.ts", "apps/tailng-ui/docs/src/app/pages/components/ai/chat/sections/styling/ai-chat-styling-page.component.html"]
humanDocsUrl: https://tailng.dev/components/ai/chat/styling
---

# AI Chat styling and rendering policy

`tng-ai-chat` ships a token-driven professional default surface. Customize supported CSS variables and stable `data-slot` regions, or replace the header and exact message parts with trusted local Angular components.

Rendering rules:

1. Sanitize Markdown output and allowlist link and media protocols.
2. Map known core parts explicitly.
3. Register only trusted namespaced extension components through `partRenderers` or `provideTngAiMessagePartRenderer`.
4. Treat unknown payloads as data and show a safe unsupported-content fallback.
5. Require explicit user interaction for tool approvals.

Accessibility rules:

- Keep the transcript as normal document content rather than a continuously updating live region.
- Announce concise run-state changes in a separate polite status region.
- Preserve composer focus after submit and focus identity during virtualization.
- Use named native buttons for stop, retry, feedback, and approval actions.
- Respect reduced motion, forced colors, zoom, large text, and right-to-left layouts.
