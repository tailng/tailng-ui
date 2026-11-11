# AG-UI 1.0 Adapter Test Cases

Status: Test specification

Normative comparison source: AG-UI 1.0 JSON Schema and behavioral specification.

## Envelope, identifiers, and validation

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [x] | AI-AGUI-BASE-001 | Validate minimal event with required discriminator. | Correct event variant is returned. | unit |
| [x] | AI-AGUI-BASE-002 | Event omits required `type`. | `invalid-event` diagnostic; store unchanged. | unit |
| [x] | AI-AGUI-BASE-003 | Event contains unknown type under strict profile. | `unsupported-event` diagnostic; no rendering. | unit |
| [x] | AI-AGUI-BASE-004 | Event contains optional timestamp. | Timestamp is preserved as informational metadata. | unit |
| [x] | AI-AGUI-BASE-005 | Later-arriving event has older timestamp. | Arrival order remains authoritative. | unit |
| [x] | AI-AGUI-BASE-006 | Event contains `rawEvent`. | Raw value may be retained for bounded diagnostics but never affects reduction. | unit |
| [x] | AI-AGUI-BASE-007 | Event contains unknown metadata keys. | Keys survive allowed merge behavior. | unit |
| [x] | AI-AGUI-BASE-008 | Event attempts application behavior through metadata. | Security/renderer policy ignores the instruction. | unit |
| [x] | AI-AGUI-BASE-009 | Optional field is absent. | Conversion leaves it absent. | unit |
| [x] | AI-AGUI-BASE-010 | Optional field is explicitly null where schema forbids it. | Validation fails; no tolerant permanent shape is introduced. | unit |
| [x] | AI-AGUI-BASE-011 | Opaque identifiers contain Unicode and delimiters. | Values are preserved exactly. | unit |
| [x] | AI-AGUI-BASE-012 | Event exceeds configured size. | `limit-exceeded` emitted before reduction. | unit |
| [x] | AI-AGUI-BASE-013 | Metadata exceeds nesting/entry limit. | Event is rejected safely. | unit |
| [x] | AI-AGUI-BASE-014 | Valid stream is deep-frozen. | Adapter reduces without mutation. | unit |

## Run and step lifecycle

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [x] | AI-AGUI-RUN-001 | Reduce `RUN_STARTED`. | Matching TailNG run becomes running with stable IDs. | unit |
| [x] | AI-AGUI-RUN-002 | Start contains parent run. | Parent ID is preserved. | unit |
| [x] | AI-AGUI-RUN-003 | Duplicate identical start. | Idempotent or documented duplicate diagnostic; no duplicate run. | unit |
| [x] | AI-AGUI-RUN-004 | Conflicting duplicate start. | Invalid-lifecycle diagnostic; first valid state remains. | unit |
| [x] | AI-AGUI-RUN-005 | Reduce `RUN_FINISHED`. | Run becomes complete and result/usage metadata maps safely. | unit |
| [x] | AI-AGUI-RUN-006 | Finish before start. | Diagnostic emitted; reducer follows documented recovery policy. | unit |
| [x] | AI-AGUI-RUN-007 | Reduce `RUN_ERROR`. | Run becomes failed with safe canonical error. | unit |
| [x] | AI-AGUI-RUN-008 | Error arrives after partial text. | Partial message remains and run fails. | unit |
| [x] | AI-AGUI-RUN-009 | Terminal event repeats identically. | State remains stable without duplicate announcements. | unit |
| [x] | AI-AGUI-RUN-010 | Conflicting terminal events arrive. | First terminal state or documented precedence wins with diagnostic. | unit |
| [ ] | AI-AGUI-RUN-011 | Reduce `STEP_STARTED`. | Display-safe step activity begins under the run. | unit |
| [ ] | AI-AGUI-RUN-012 | Reduce `STEP_FINISHED`. | Matching activity completes. | unit |
| [ ] | AI-AGUI-RUN-013 | Steps overlap/interleave. | Each step remains independently correlated. | unit |
| [ ] | AI-AGUI-RUN-014 | Step ends without start. | Diagnostic; no crash or fabricated sensitive log. | unit |

## Text message lifecycle

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [x] | AI-AGUI-TEXT-001 | Reduce `TEXT_MESSAGE_START`. | One message and open text part are created. | unit |
| [x] | AI-AGUI-TEXT-002 | Start omits role. | Role defaults according to AG-UI 1.0 semantics. | unit |
| [x] | AI-AGUI-TEXT-003 | Start includes supported role/name. | Role and author display name map correctly. | unit |
| [x] | AI-AGUI-TEXT-004 | Reduce one content delta. | Delta appends to the open stable part. | unit |
| [x] | AI-AGUI-TEXT-005 | Reduce many content deltas. | Final text equals arrival-order concatenation. | unit |
| [x] | AI-AGUI-TEXT-006 | Two messages stream interleaved where allowed. | Each delta reaches its matching message ID. | unit |
| [x] | AI-AGUI-TEXT-007 | Content arrives without start. | Orphan diagnostic; no anonymous visible message is invented. | unit |
| [x] | AI-AGUI-TEXT-008 | Content has empty delta. | Schema/lifecycle policy rejects or ignores without state change. | unit |
| [x] | AI-AGUI-TEXT-009 | Content references completed message. | Invalid-lifecycle diagnostic; completed content unchanged. | unit |
| [x] | AI-AGUI-TEXT-010 | Reduce `TEXT_MESSAGE_END`. | Part and message become complete when no other work is open. | unit |
| [x] | AI-AGUI-TEXT-011 | End arrives without start. | Diagnostic; store remains valid. | unit |
| [x] | AI-AGUI-TEXT-012 | Duplicate end arrives. | Idempotent/diagnostic behavior does not announce twice. | unit |
| [x] | AI-AGUI-TEXT-013 | Start and end with no content. | Empty complete message follows documented visibility policy. | unit |
| [x] | AI-AGUI-TEXT-014 | Reduce first `TEXT_MESSAGE_CHUNK`. | It opens the same canonical lifecycle with supplied ID. | unit |
| [x] | AI-AGUI-TEXT-015 | Reduce subsequent chunks. | They append to the same text part. | unit |
| [x] | AI-AGUI-TEXT-016 | Chunk stream changes message ID. | Previous message closes according to chunk normalization rules. | unit |
| [x] | AI-AGUI-TEXT-017 | Stream completes after chunks. | Open chunk message is finalized once. | unit |
| [x] | AI-AGUI-TEXT-018 | First chunk lacks required message identity. | Diagnostic; no message created. | unit |
| [x] | AI-AGUI-TEXT-019 | Start metadata then content metadata updates. | Metadata merge follows AG-UI key-wise last-write behavior. | unit |
| [ ] | AI-AGUI-TEXT-020 | Stream is stopped by transport abort. | Partial content remains and local/run state becomes stopped/cancelled per policy. | integration |

## Tool-call lifecycle

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [x] | AI-AGUI-TOOL-001 | Reduce `TOOL_CALL_START`. | Stable tool-call part is created with ID/name/parent. | unit |
| [x] | AI-AGUI-TOOL-002 | Start lacks optional parent message. | Call is retained and associated by documented run policy. | unit |
| [x] | AI-AGUI-TOOL-003 | Duplicate identical start. | No duplicate call part. | unit |
| [x] | AI-AGUI-TOOL-004 | Conflicting start reuses ID. | Diagnostic; original valid call remains. | unit |
| [x] | AI-AGUI-TOOL-005 | Reduce one `TOOL_CALL_ARGS` delta. | Raw argument buffer appends. | unit |
| [x] | AI-AGUI-TOOL-006 | Reduce fragmented valid JSON. | Parsed input appears once complete; raw input remains available as policy specifies. | unit |
| [x] | AI-AGUI-TOOL-007 | Reduce fragmented JSON with Unicode boundary. | Text concatenates without corruption. | unit |
| [x] | AI-AGUI-TOOL-008 | Args arrive without start. | Orphan diagnostic; no tool execution. | unit |
| [x] | AI-AGUI-TOOL-009 | Args exceed configured limit. | Call becomes failed/diagnostic; buffer growth stops safely. | unit |
| [x] | AI-AGUI-TOOL-010 | Reduce `TOOL_CALL_END` with valid JSON. | Call input finalizes and status advances. | unit |
| [x] | AI-AGUI-TOOL-011 | End with malformed JSON. | `rawInput` retained, parsed input absent, invalid-arguments diagnostic emitted. | unit |
| [x] | AI-AGUI-TOOL-012 | End without args. | Empty-argument policy is applied consistently. | unit |
| [x] | AI-AGUI-TOOL-013 | End without start. | Diagnostic; no fabricated call. | unit |
| [x] | AI-AGUI-TOOL-014 | Reduce `TOOL_CALL_RESULT`. | Result part correlates through `toolCallId`. | unit |
| [x] | AI-AGUI-TOOL-015 | Result arrives before call in snapshot/reconnect order. | Pending result pairs when call materializes. | unit |
| [x] | AI-AGUI-TOOL-016 | Result references unknown call permanently. | Orphan remains bounded and uses safe fallback/diagnostic. | unit |
| [x] | AI-AGUI-TOOL-017 | Parallel calls interleave args. | Buffers and parsed inputs remain isolated. | unit |
| [x] | AI-AGUI-TOOL-018 | Parallel results arrive in reverse order. | Each result pairs correctly. | unit |
| [x] | AI-AGUI-TOOL-019 | Normalize `TOOL_CALL_CHUNK`. | Final canonical call equals explicit start/args/end sequence. | unit |
| [x] | AI-AGUI-TOOL-020 | Tool result contains text. | Text maps safely without HTML execution. | unit |
| [x] | AI-AGUI-TOOL-021 | Tool result contains JSON content. | JSON maps within limits. | unit |
| [x] | AI-AGUI-TOOL-022 | Tool result contains provider-specific metadata. | Namespaced metadata survives without controlling authorization. | unit |
| [ ] | AI-AGUI-TOOL-023 | User approves a frontend tool. | Adapter/application creates correct resume data; TailNG itself does not execute. | integration |
| [ ] | AI-AGUI-TOOL-024 | User rejects/cancels approval. | Resume/cancel outcome is correlated with the intended interrupt/call. | integration |

## Reasoning lifecycle

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-AGUI-REASON-001 | Reduce `REASONING_START`. | Hidden reasoning lifecycle begins without visible transcript content. | unit |
| [ ] | AI-AGUI-REASON-002 | Reduce `REASONING_MESSAGE_START`. | Stable hidden reasoning message/part opens. | unit |
| [ ] | AI-AGUI-REASON-003 | Reduce reasoning content. | Content accumulates but default visibility remains hidden. | unit |
| [ ] | AI-AGUI-REASON-004 | Reduce reasoning message end. | Hidden part finalizes. | unit |
| [ ] | AI-AGUI-REASON-005 | Normalize reasoning chunk sequence. | Canonical result matches explicit lifecycle. | unit |
| [ ] | AI-AGUI-REASON-006 | Reduce `REASONING_ENCRYPTED_VALUE`. | Opaque value is retained and never selected as display text. | unit |
| [ ] | AI-AGUI-REASON-007 | Reduce `REASONING_END`. | Reasoning lifecycle completes without completion announcement content leak. | unit |
| [ ] | AI-AGUI-REASON-008 | Consumer explicitly enables summary policy. | Only explicitly marked display-safe summary becomes renderable. | unit |
| [ ] | AI-AGUI-REASON-009 | Raw reasoning is mislabeled only through metadata. | Metadata cannot override hidden policy. | unit |
| [ ] | AI-AGUI-REASON-010 | Malformed reasoning sequence. | Diagnostic and safe recovery; no raw content becomes visible. | unit |

## State, messages, and activity snapshots/deltas

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-AGUI-STATE-001 | Reduce `STATE_SNAPSHOT` with object. | Shared state becomes a safe copy. | unit |
| [ ] | AI-AGUI-STATE-002 | Snapshot contains array/primitive/null valid state. | Exact JSON value is retained. | unit |
| [ ] | AI-AGUI-STATE-003 | Reduce valid `STATE_DELTA`. | Patch applies immutably. | unit |
| [ ] | AI-AGUI-STATE-004 | Delta replaces value with null. | Null is preserved as data. | unit |
| [ ] | AI-AGUI-STATE-005 | Delta targets forbidden prototype path. | Patch rejected; previous state unchanged. | unit |
| [ ] | AI-AGUI-STATE-006 | Delta has invalid operation/path. | Diagnostic; previous state unchanged. | unit |
| [ ] | AI-AGUI-STATE-007 | Delta exceeds operation/depth limit. | `limit-exceeded`; previous state unchanged. | unit |
| [x] | AI-AGUI-STATE-008 | Reduce `MESSAGES_SNAPSHOT` on empty store. | Messages normalize in snapshot order. | unit |
| [x] | AI-AGUI-STATE-009 | Snapshot restates existing messages. | Records reconcile by ID without duplication. | unit |
| [x] | AI-AGUI-STATE-010 | Snapshot includes updated tool pairing. | Calls/results re-pair correctly. | unit |
| [x] | AI-AGUI-STATE-011 | Snapshot omits independently paged older history. | Reconciliation follows declared snapshot scope and does not accidentally purge pages. | unit |
| [x] | AI-AGUI-STATE-012 | Snapshot contains invalid one-of message. | Snapshot is rejected atomically or invalid entry handling follows documented policy. | unit |
| [ ] | AI-AGUI-STATE-013 | Reduce `ACTIVITY_SNAPSHOT`. | Activity state normalizes without rendering arbitrary data. | unit |
| [ ] | AI-AGUI-STATE-014 | Reduce valid `ACTIVITY_DELTA`. | Matching activity updates immutably. | unit |
| [ ] | AI-AGUI-STATE-015 | Invalid activity delta. | Last valid activity remains with diagnostic. | unit |
| [ ] | AI-AGUI-STATE-016 | Activity contains oversized display data. | Stored/rendered fallback is bounded by policy. | unit |

## Subagents, custom, and raw events

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-AGUI-EXT-001 | Reduce `SUBAGENT_STARTED` in hidden mode. | Run tracking updates; no attributed visible author appears. | unit |
| [ ] | AI-AGUI-EXT-002 | Reduce subagent start in attributed mode. | Opaque invocation ID and display-safe identity map to activity/author context. | unit |
| [ ] | AI-AGUI-EXT-003 | Reduce `SUBAGENT_FINISHED`. | Matching invocation completes. | unit |
| [ ] | AI-AGUI-EXT-004 | Reduce `SUBAGENT_ERROR`. | Matching invocation fails with safe error. | unit |
| [ ] | AI-AGUI-EXT-005 | Terminal subagent event lacks start. | Diagnostic; parent run remains valid. | unit |
| [ ] | AI-AGUI-EXT-006 | Known namespaced `CUSTOM` event is registered. | Validator runs and returns the intended extension/activity update. | unit |
| [ ] | AI-AGUI-EXT-007 | Known custom payload fails validator. | Event rejected; renderer not invoked. | unit |
| [ ] | AI-AGUI-EXT-008 | Unknown custom event arrives. | Safe ignore/preserve policy applies; no arbitrary UI. | unit |
| [ ] | AI-AGUI-EXT-009 | Unnamespaced custom event arrives under strict policy. | Diagnostic and no render. | unit |
| [ ] | AI-AGUI-EXT-010 | `RAW` event arrives. | Bounded diagnostics may record it; transcript/store behavior does not derive from it. | unit |
| [ ] | AI-AGUI-EXT-011 | Raw payload contains script/HTML/instructions. | Nothing executes or renders. | unit |

## Materialized message conversion

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-AGUI-CONV-001 | Convert AG-UI developer message. | Canonical role/content maps and default visibility remains hidden. | unit |
| [ ] | AI-AGUI-CONV-002 | Convert system message. | Canonical role/content maps and default visibility remains hidden. | unit |
| [ ] | AI-AGUI-CONV-003 | Convert user text message. | Stable user message and text part result. | unit |
| [ ] | AI-AGUI-CONV-004 | Convert multimodal user input. | Supported image/audio/video/document references map to safe file/data parts. | unit |
| [ ] | AI-AGUI-CONV-005 | Convert assistant message with text. | Assistant message and text part result. | unit |
| [ ] | AI-AGUI-CONV-006 | Convert assistant message with multiple tool calls. | Order and call IDs are preserved. | unit |
| [ ] | AI-AGUI-CONV-007 | Convert tool message. | Result correlates with `toolCallId`. | unit |
| [ ] | AI-AGUI-CONV-008 | Convert activity message. | Activity maps without exposing arbitrary logs. | unit |
| [ ] | AI-AGUI-CONV-009 | Convert reasoning message. | Hidden reasoning part results. | unit |
| [ ] | AI-AGUI-CONV-010 | Convert TailNG user message to run input. | AG-UI shape contains selected supported content only. | unit |
| [ ] | AI-AGUI-CONV-011 | Convert unsupported TailNG extension to run input. | Explicit converter is required; no lossy silent conversion. | unit |
| [ ] | AI-AGUI-CONV-012 | Round-trip supported messages. | IDs, roles, text, tools, and supported metadata remain equivalent. | unit |
| [ ] | AI-AGUI-CONV-013 | Conversion receives malformed union member. | Typed diagnostic; no partial unsafe message. | unit |
| [ ] | AI-AGUI-CONV-014 | Conversion receives absent optional fields. | Output omits them rather than writing null. | unit |

## Transport and Mastra integration

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-AGUI-TRANS-001 | Transport yields valid ordered events. | Adapter emits corresponding normalized updates in order. | integration |
| [ ] | AI-AGUI-TRANS-002 | Consumer aborts active transport. | Stream consumption stops and later events cannot mutate state. | integration |
| [ ] | AI-AGUI-TRANS-003 | Transport throws before `RUN_STARTED`. | Safe connection/run error state is exposed. | integration |
| [ ] | AI-AGUI-TRANS-004 | Transport throws mid-text. | Partial text remains and run/message failure policy applies. | integration |
| [ ] | AI-AGUI-TRANS-005 | Transport finishes without terminal event. | Incomplete-stream diagnostic and documented recovery state result. | integration |
| [ ] | AI-AGUI-TRANS-006 | Two runs exist for one thread. | Events remain isolated by run/message/call IDs. | integration |
| [ ] | AI-AGUI-TRANS-007 | Stale event arrives from cancelled run. | It cannot update the current run unless explicitly reconciled. | integration |
| [ ] | AI-AGUI-TRANS-008 | Reconnect supplies snapshot then live delta. | State reconciles once and live delta appends once. | integration |
| [ ] | AI-AGUI-MASTRA-001 | Reference Mastra agent streams text. | Required text lifecycle maps end to end. | integration |
| [ ] | AI-AGUI-MASTRA-002 | Mastra agent invokes one tool. | Call, arguments, result, and following text map correctly. | integration |
| [ ] | AI-AGUI-MASTRA-003 | Mastra agent invokes parallel tools. | Sibling calls/results are not lost or crossed. | integration |
| [ ] | AI-AGUI-MASTRA-004 | Mastra thread performs second run. | Same thread ID and prior durable context are preserved by application policy. | integration |
| [ ] | AI-AGUI-MASTRA-005 | Stop current Mastra run. | Partial content remains and next run starts cleanly. | integration |
| [ ] | AI-AGUI-MASTRA-006 | Mastra emits subagent delegation in hidden mode. | No accidental visible attribution. | integration |
| [ ] | AI-AGUI-MASTRA-007 | Mastra emits attributed subagent after complete-profile support. | Attribution maps to the correct invocation. | integration |
| [ ] | AI-AGUI-MASTRA-008 | Frontend tool round trip uses supported model fixture. | Provider-required metadata survives or documented incompatibility is detected before release. | integration |
| [ ] | AI-AGUI-MASTRA-009 | Server-history mode sends next turn. | Browser does not serialize an unbounded thread by TailNG default. | integration |
| [ ] | AI-AGUI-MASTRA-010 | Client-history mode is selected. | Application-selected messages convert without TailNG silently truncating them. | integration |

