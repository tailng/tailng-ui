---
id: components/ai-chat/styling
title: AI Chat styling and rendering policy
description: Style a TailNG AI chat presentation safely while preserving accessibility and renderer boundaries.
category: components
status: stable
tags: ["ai", "chat", "styling", "accessibility", "security"]
package: @tailng-ui/ai
sourcePaths: ["libs/tailng-ui/ai/src/lib/core/part-registry.ts", "apps/tailng-ui/docs/src/app/pages/components/ai/chat/sections/styling/ai-chat-styling-page.component.html"]
humanDocsUrl: https://tailng.dev/components/ai/chat/styling
---

# AI Chat styling and rendering policy

The foundation package renders no DOM and ships no CSS. Keep style choices in the application presentation layer and map canonical roles, statuses, and message-part types to semantic UI.

Rendering rules:

1. Sanitize Markdown output and allowlist link and media protocols.
2. Map known core parts explicitly.
3. Register only namespaced extension renderers with `TngAiPartRegistry`.
4. Treat unknown payloads as data and show a safe unsupported-content fallback.
5. Require explicit user interaction for tool approvals.

Accessibility rules:

- Keep the transcript as normal document content rather than a continuously updating live region.
- Announce concise run-state changes in a separate polite status region.
- Preserve composer focus after submit and focus identity during virtualization.
- Use named native buttons for stop, retry, feedback, and approval actions.
- Respect reduced motion, forced colors, zoom, large text, and right-to-left layouts.
