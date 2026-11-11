# Security, Packaging, and Integration Test Cases

Status: Test specification

## Content and renderer security

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-SEC-CONTENT-001 | Plain text contains `<script>` and event attributes. | Content renders literally; no script/event executes. | component/browser |
| [ ] | AI-SEC-CONTENT-002 | Markdown contains raw script HTML. | Configured sanitizer removes/escapes it. | integration/browser |
| [ ] | AI-SEC-CONTENT-003 | Markdown contains `javascript:` link. | Link is removed or disabled. | component/browser |
| [ ] | AI-SEC-CONTENT-004 | Source uses `data:` or other disallowed scheme. | Navigation is unavailable according to URL policy. | component |
| [ ] | AI-SEC-CONTENT-005 | Allowed HTTPS link is rendered. | Safe link attributes and external-navigation policy apply. | component |
| [ ] | AI-SEC-CONTENT-006 | Image URL points to disallowed scheme. | Image is not loaded. | component/browser |
| [ ] | AI-SEC-CONTENT-007 | Tool result contains HTML/script as text. | It remains inert text/data. | component/browser |
| [ ] | AI-SEC-CONTENT-008 | Data fallback contains secrets in deep/large object fixture. | Bounded policy avoids automatic full dump. | component |
| [ ] | AI-SEC-CONTENT-009 | Unknown extension contains component/template name. | No dynamic component loads without explicit registration. | component |
| [ ] | AI-SEC-CONTENT-010 | Registered renderer attempts to mutate readonly part. | Type contract rejects; frozen runtime fixture remains unchanged. | type/unit |
| [ ] | AI-SEC-CONTENT-011 | Renderer throws with sensitive payload. | Safe fallback appears and raw payload is not included in user-facing error. | component |
| [ ] | AI-SEC-CONTENT-012 | System/developer message arrives. | Hidden by default and absent from copy serialization. | component |
| [ ] | AI-SEC-CONTENT-013 | Raw reasoning arrives. | Hidden by default and absent from copy/announcements. | component |
| [ ] | AI-SEC-CONTENT-014 | Encrypted reasoning arrives. | Never rendered, copied, or announced. | component |
| [ ] | AI-SEC-CONTENT-015 | `RAW` event contains instructions for UI. | Instructions have no effect. | unit/component |

## Tool and action security

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-SEC-TOOL-001 | Tool-call event arrives. | No tool executes solely from rendering/reduction. | integration |
| [ ] | AI-SEC-TOOL-002 | Metadata claims tool is pre-approved. | Client approval policy does not trust the claim automatically. | unit/integration |
| [ ] | AI-SEC-TOOL-003 | Approval action targets another call ID. | Request is rejected or correlated only to intended active interrupt. | unit |
| [ ] | AI-SEC-TOOL-004 | Approval is activated twice rapidly. | At most one active decision request is emitted. | component |
| [ ] | AI-SEC-TOOL-005 | Tool arguments contain prototype keys. | Parsing/validation cannot pollute prototypes. | unit |
| [ ] | AI-SEC-TOOL-006 | Tool result includes credential-like synthetic fields. | Default diagnostics/log serializer redacts configured keys. | unit |
| [ ] | AI-SEC-TOOL-007 | Custom action tries to pass DOM/event object. | Public action contract/type rejects it. | type |
| [ ] | AI-SEC-TOOL-008 | Retry/edit request references stale thread. | Application-facing validation detects mismatch before local mutation. | unit |

## State, patch, and limits security

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-SEC-STATE-001 | JSON Patch targets `__proto__`. | Patch rejected and global prototype unchanged. | unit |
| [ ] | AI-SEC-STATE-002 | Patch targets `constructor.prototype`. | Patch rejected. | unit |
| [ ] | AI-SEC-STATE-003 | Patch operation count exceeds limit. | Entire patch or remaining operations reject atomically per contract. | unit |
| [ ] | AI-SEC-STATE-004 | Event nesting exceeds limit. | Validation stops without stack overflow. | unit |
| [ ] | AI-SEC-STATE-005 | Text/tool delta exceeds size limit. | Growth stops with diagnostic and bounded state. | unit |
| [ ] | AI-SEC-STATE-006 | Snapshot contains excessive message count. | Snapshot rejected/bounded before DOM/store explosion. | unit/integration |
| [ ] | AI-SEC-STATE-007 | Metadata attempts to override renderer/security config. | Configuration remains application-owned. | unit |
| [ ] | AI-SEC-STATE-008 | Unknown custom event is enormous. | Size validation runs before registry/preservation. | unit |

## Files, cache, and privacy

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-SEC-FILE-001 | File reference uses expired/unauthorized URL. | Failure fallback appears; no credentials are exposed. | integration/browser |
| [ ] | AI-SEC-FILE-002 | Filename contains HTML or control characters. | Display remains inert and accessible. | component |
| [ ] | AI-SEC-FILE-003 | Attachment fails client validation. | It is not included in submit request. | component |
| [ ] | AI-SEC-FILE-004 | Application rejects upload after client acceptance. | Server error state wins and recovery is available. | integration |
| [ ] | AI-SEC-FILE-005 | IndexedDB cache serialization is inspected. | No access token, signed secret, hidden prompt, Blob, or raw provider request is stored. | integration |
| [ ] | AI-SEC-FILE-006 | User/tenant changes. | Cache namespace changes and prior tenant data is inaccessible. | integration |
| [ ] | AI-SEC-FILE-007 | Sign-out purge policy runs. | Configured local transcript/draft caches are removed. | integration |
| [ ] | AI-SEC-FILE-008 | Diagnostic snapshot is requested. | Message/tool content is excluded or redacted by default. | unit |

## Primary package boundaries

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-PKG-CORE-001 | Build `@tailng-ui/ai` without Mastra/CopilotKit/Foblex. | Build succeeds. | package |
| [ ] | AI-PKG-CORE-002 | Inspect primary declarations. | No AG-UI, Mastra, provider, Foblex, DOM-event, or persistence-library type leaks. | package/type |
| [ ] | AI-PKG-CORE-003 | Inspect dependency graph. | Primary entry point does not import `@ag-ui/core`. | package |
| [ ] | AI-PKG-CORE-004 | Import every documented primary symbol. | Consumer typecheck succeeds. | package |
| [ ] | AI-PKG-CORE-005 | Import an internal non-public path. | Export map prevents unsupported deep import where configured. | package |
| [ ] | AI-PKG-CORE-006 | Tree-shake unused styled/renderer features. | Consumer build does not retain unrelated optional adapter code. | package |
| [ ] | AI-PKG-CORE-007 | Inspect side-effect metadata. | It matches actual stylesheet/runtime side effects. | package |
| [ ] | AI-PKG-CORE-008 | Pack and install primary package. | README/assets/types/runtime imports resolve. | package |

## AG-UI secondary entry point

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-PKG-AGUI-001 | Import `@tailng-ui/ai/ag-ui` with compatible `@ag-ui/core`. | Consumer build/typecheck succeeds. | package |
| [ ] | AI-PKG-AGUI-002 | Use primary package without installing optional AG-UI peer. | Primary consumer succeeds without peer error at runtime. | package |
| [ ] | AI-PKG-AGUI-003 | Import AG-UI entry point without peer. | Consumer receives clear package/peer failure rather than hidden runtime corruption. | package |
| [ ] | AI-PKG-AGUI-004 | Install unsupported AG-UI major. | Package manager/type compatibility signals unsupported range. | package |
| [ ] | AI-PKG-AGUI-005 | Inspect secondary declarations. | AG-UI types are confined to the secondary entry point. | package/type |
| [ ] | AI-PKG-AGUI-006 | Build adapter in production mode. | Validation/reducer code is included only when adapter is imported. | package |

## Angular and consumer compatibility

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-PKG-NG-001 | Build minimal standalone Angular consumer on minimum supported version. | Build and runtime smoke test pass. | package/integration |
| [ ] | AI-PKG-NG-002 | Build consumer on maximum declared supported version. | Build and runtime smoke test pass. | package/integration |
| [ ] | AI-PKG-NG-003 | Use components in SSR build. | Build succeeds and browser-only APIs are guarded. | package |
| [ ] | AI-PKG-NG-004 | Hydrate SSR transcript. | No duplicate messages, IDs, or hydration mismatch for supported state. | browser/integration |
| [ ] | AI-PKG-NG-005 | Use zoneless Angular configuration. | Signals/updates and event outputs work according to support policy. | integration |
| [ ] | AI-PKG-NG-006 | Use strict templates and TypeScript. | Public templates and event types compile without casts. | package/type |
| [ ] | AI-PKG-NG-007 | Load TailNG theme contract. | Styled components resolve tokens without missing required variables. | browser |
| [ ] | AI-PKG-NG-008 | Omit optional Markdown/highlighter. | Package still builds and safe fallback renders. | package/component |

## Application and transport failures

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-INT-FAIL-001 | Network fails before run begins. | Accessible retryable error appears; draft remains. | integration/browser |
| [ ] | AI-INT-FAIL-002 | Network disconnects mid-stream. | Partial response remains with failed/interrupted state. | integration/browser |
| [ ] | AI-INT-FAIL-003 | Retry after mid-stream failure. | New run/message context is emitted without duplicating partial content. | integration |
| [ ] | AI-INT-FAIL-004 | Server returns unauthorized. | Authentication-safe error appears; no sensitive response is rendered. | integration |
| [ ] | AI-INT-FAIL-005 | Server returns forbidden. | No retry loop; application authorization action may be offered. | integration |
| [ ] | AI-INT-FAIL-006 | Server rate limits with retry guidance. | Retryable state and application-provided retry timing render accessibly. | integration |
| [ ] | AI-INT-FAIL-007 | Request times out. | Abort occurs, partial content is retained, and retry remains possible. | integration |
| [ ] | AI-INT-FAIL-008 | History endpoint fails while active run succeeds. | Transcript/run continue; history retry remains local to boundary. | integration |
| [ ] | AI-INT-FAIL-009 | Upload fails while text is valid. | Attachment failure does not silently submit missing file. | integration |
| [ ] | AI-INT-FAIL-010 | Tool execution fails. | Matching tool result/error renders; agent text/run handling continues per protocol. | integration |
| [ ] | AI-INT-FAIL-011 | Browser goes offline. | Current state remains readable and network actions follow application policy. | browser/integration |
| [ ] | AI-INT-FAIL-012 | Browser returns online. | No automatic duplicate run/history request occurs. | browser/integration |

## End-to-end reference flows

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-INT-E2E-001 | Send text to reference Mastra agent and receive stream. | User message, run lifecycle, assistant stream, completion, and focus behavior all pass. | integration/browser |
| [ ] | AI-INT-E2E-002 | Stop response then send another message. | Partial response remains; second run is clean and correctly correlated. | integration/browser |
| [ ] | AI-INT-E2E-003 | Trigger tool with approval. | Approval, resume, tool result, and final assistant text form one coherent flow. | integration/browser |
| [ ] | AI-INT-E2E-004 | Reject tool approval. | Rejection is correlated and UI remains usable for another turn. | integration/browser |
| [ ] | AI-INT-E2E-005 | Reload persisted thread. | Cursor history and current thread identity restore without invoking an unintended agent run. | integration/browser |
| [ ] | AI-INT-E2E-006 | Load a long persisted thread. | Initial page is bounded, older pages load on demand, and DOM remains virtualized. | integration/browser |
| [ ] | AI-INT-E2E-007 | Switch threads during active stream. | Ownership policy is honored; no cross-thread content or event leakage occurs. | integration/browser |
| [ ] | AI-INT-E2E-008 | Edit and resend prior user message. | Typed request creates application-defined new branch/run without mutating historical record. | integration/browser |
| [ ] | AI-INT-E2E-009 | Copy and rate completed response. | Copy feedback and controlled rating state work by keyboard. | integration/browser |
| [ ] | AI-INT-E2E-010 | Navigate full flow with keyboard and screen reader. | Send, stream status, stop/retry, sources, tools, and history are operable and understandable. | browser/manual |

