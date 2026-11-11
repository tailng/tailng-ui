# `@tailng-ui/ai` Planning Index

Status: Proposed for contract review

Protocol baseline: AG-UI 1.0

Primary scope: Provider-neutral Angular chat and agent-interaction components

## Tracking convention

- `[ ]` marks a trackable deliverable, acceptance criterion, release gate, or test case as open.
- `[x]` is used only after the item's stated completion condition is satisfied.

Architecture facts, decisions, explanatory rules, references, and document-index entries remain
ordinary bullets because they are not completion items.

## Decision summary

- Create a new `@tailng-ui/ai` package. Do not add chat to `@tailng-ui/flow`.
- Use AG-UI 1.0 as the preferred live agent-to-frontend protocol.
- Keep TailNG's public component model independent from AG-UI wire events.
- Publish the AG-UI integration as the optional `@tailng-ui/ai/ag-ui` secondary entry point.
- Normalize all protocol input into stable `TngAiThread`, `TngAiRun`, and `TngAiMessage` records.
- Model message content as ordered typed parts, not one content string.
- Keep networking, authentication, persistence, model SDKs, and tool execution outside TailNG.
- Load history through a cursor-paginated application API; use AG-UI for the active run.
- Bound JavaScript state and virtualize the transcript so long conversations do not grow the DOM indefinitely.
- Treat agent content, tool data, URLs, extensions, and generated UI as untrusted input.
- Follow strict test-driven development: catalog the behavior, add a failing executable test, then
  implement the minimum production behavior.

## Planned architecture

```text
Mastra or another agent runtime
              |
              | AG-UI 1.0 event stream
              v
     @tailng-ui/ai/ag-ui
       validation + reducer
              |
              | normalized TailNG updates
              v
      @tailng-ui/ai store
       thread / run / messages
              |
              | bounded visible range
              v
    TailNG chat components
```

Historical messages follow a separate path:

```text
Application history API
  cursor-paginated materialized messages
              |
              v
      @tailng-ui/ai store
```

## Plan documents

1. [Package architecture](./package-architecture.md)
   - Package boundaries, dependencies, entry points, naming, and proposed source layout.
2. [Canonical message model](./message-model.md)
   - Thread, run, message, part, status, error, metadata, and extension contracts.
3. [AG-UI 1.0 integration](./ag-ui-1.0-integration.md)
   - Conformance profile, event mapping, reducer rules, transport boundary, Mastra, and security.
4. [Chat components](./chat-components.md)
   - Compound component family, ownership, inputs, outputs, rendering, accessibility, and theming.
5. [History and performance](./history-and-performance.md)
   - Pagination, bounded state, virtualization, streaming batching, rich media, and cleanup.
6. [Delivery and verification](./delivery-and-verification.md)
   - TDD delivery phases, Red/Green gates, documentation work, compatibility gates, and release criteria.
7. [TDD test catalog](./tests/README.md)
   - Stable test-case IDs, fixtures, test levels, Red-step rules, and the complete behavioral suites.

## Implementation gate

The test catalog is part of the product contract. Production implementation must not start until:

1. The relevant catalog cases have been reviewed.
2. Shared fixtures for those cases exist.
3. The cases have executable tests at the required test level.
4. The new tests have been observed failing for the intended missing behavior.

Implementation then proceeds in small Red/Green/Refactor slices. A passing test added after the
production behavior does not satisfy this gate.

## Product boundary

TailNG owns:

- Rendering normalized agent conversations.
- Chat interaction semantics and accessible state announcements.
- Composer behavior and application-facing action requests.
- Transcript scrolling, anchoring, visible-range calculation, and bounded rendering.
- Protocol adapters that translate external events into TailNG-owned types.
- A safe renderer registry for structured and custom content.

The application owns:

- Agent selection and orchestration.
- HTTP, SSE, WebSocket, or other transport creation.
- Authentication, authorization, and tenant isolation.
- Conversation storage and retention.
- Tool execution and approval policy.
- Provider-specific message conversion before or behind the adapter boundary.
- File upload storage, virus scanning, signed URLs, and download authorization.
- Deciding which reasoning or activity information is safe to show.

## Explicit non-goals for the first release

- Calling OpenAI, Mastra, or another model/provider directly from a component.
- Owning a complete application conversation database.
- Rendering arbitrary HTML, scripts, or remote Angular components.
- Executing agent-requested tools in the browser by default.
- Exposing raw chain-of-thought.
- Supporting A2UI or MCP Apps in the first delivery phase.
- Coupling `@tailng-ui/ai` to `@tailng-ui/flow`.
- Shipping a general-purpose rich-text or Markdown engine inside the package.

## Definition of success

The initial release is successful when a consumer can:

- [ ] Render paginated user and assistant messages using stable TailNG types.
- [ ] Connect a Mastra agent through AG-UI without importing Mastra into the UI package.
- [ ] Stream text and tool activity without rebuilding the full transcript per chunk.
- [ ] Stop, retry, edit, submit, and approve through typed application-owned requests.
- [ ] Navigate the experience using keyboard and screen-reader software.
- [ ] Keep a long thread responsive while only a bounded range exists in the DOM.
- [ ] Replace TailNG's default content renderers without replacing transcript behavior.
- [ ] Handle malformed, unknown, or unsafe protocol content without executing it.

## Standards references

- [AG-UI 1.0 event model](https://github.com/ag-ui-protocol/ag-ui/blob/main/docs/spec/1.0/basic/index.mdx)
- [AG-UI 1.0 schema](https://github.com/ag-ui-protocol/ag-ui/blob/main/docs/spec/1.0/schema.json)
- [AG-UI Mastra client guide](https://github.com/ag-ui-protocol/ag-ui/blob/main/docs/quickstart/clients.mdx)
- [A2UI 1.0 specification](https://github.com/a2ui-project/a2ui/blob/main/specification/v1_0/docs/a2ui_protocol.md)
- [MCP Apps overview](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/)
- [Mastra AI SDK UI integration](https://mastra.ai/integrations/agentic-ui/ai-sdk-ui)
- [Mastra MCP and MCP Apps integration](https://mastra.ai/docs/connections/mcp)

