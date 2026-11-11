# Core Model, Store, and History Test Cases

Status: Test specification

## JSON and public contracts

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [x] | AI-CORE-JSON-001 | Serialize every `TngAiJsonPrimitive`. | String, finite number, boolean, and null round-trip without transformation. | unit |
| [x] | AI-CORE-JSON-002 | Serialize nested readonly arrays and objects. | Shape and ordering round-trip unchanged. | unit |
| [ ] | AI-CORE-JSON-003 | Assign a function to a JSON value fixture. | Type check rejects it. | type |
| [x] | AI-CORE-JSON-004 | Assign `Date`, `File`, `Blob`, DOM node, or class instance to persisted metadata. | Type-contract fixture rejects each value. | type |
| [x] | AI-CORE-JSON-005 | Pass a cyclic runtime value through boundary validation. | Validation returns a typed invalid-value result without recursion failure. | unit |
| [x] | AI-CORE-JSON-006 | Pass `NaN`, positive infinity, or negative infinity. | Boundary policy rejects non-JSON numbers. | unit |
| [x] | AI-CORE-JSON-007 | Pass an object with a prototype-polluting key. | Validator rejects or safely copies it without changing any prototype. | unit |
| [x] | AI-CORE-JSON-008 | Pass JSON nested beyond the configured depth. | Validation returns `limit-exceeded`. | unit |
| [x] | AI-CORE-JSON-009 | Pass JSON larger than the configured byte/entry limit. | Validation returns `limit-exceeded` before storing it. | unit |
| [x] | AI-CORE-JSON-010 | Use readonly canonical records as inputs. | Type check prevents direct mutation. | type |

## Thread and run contracts

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [x] | AI-CORE-RUN-001 | Create a thread with only an ID. | Record is accepted and serializable. | type |
| [ ] | AI-CORE-RUN-002 | Update thread title and timestamps immutably. | New record is returned; input remains unchanged. | unit |
| [x] | AI-CORE-RUN-003 | Start a run in an existing thread. | Run is indexed by ID and associated with the thread. | unit |
| [ ] | AI-CORE-RUN-004 | Apply every valid run-status transition. | Result matches the documented run lifecycle. | unit |
| [ ] | AI-CORE-RUN-005 | Apply a disallowed terminal-to-running transition. | Reducer returns a lifecycle diagnostic and preserves terminal state. | unit |
| [ ] | AI-CORE-RUN-006 | Finish a run with usage data. | Finish timestamp, status, finish metadata, and usage are retained. | unit |
| [ ] | AI-CORE-RUN-007 | Fail a run after complete messages exist. | Run becomes failed; completed messages remain complete. | unit |
| [ ] | AI-CORE-RUN-008 | Cancel a run with partial streaming content. | Run becomes cancelled and partial message content is retained. | unit |
| [ ] | AI-CORE-RUN-009 | Create child run with `parentRunId`. | Parent relationship is preserved as an opaque ID. | unit |
| [ ] | AI-CORE-RUN-010 | Supply timestamps out of chronological order. | Store preserves supplied values and never reorders by timestamp. | unit |
| [ ] | AI-CORE-RUN-011 | Supply usage fields from a partial provider report. | Missing fields remain absent and no totals are invented. | unit |
| [ ] | AI-CORE-RUN-012 | Attach namespaced run metadata. | Metadata survives serialization without affecting lifecycle behavior. | unit |

## Message invariants

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-CORE-MSG-001 | Insert a valid message. | ID appears once in thread order and record map. | unit |
| [x] | AI-CORE-MSG-002 | Insert the same message ID with identical content. | Operation is idempotent; order contains one ID. | unit |
| [x] | AI-CORE-MSG-003 | Insert the same ID with a newer authoritative revision/update. | Existing record is reconciled without duplicating order. | unit |
| [x] | AI-CORE-MSG-004 | Insert duplicate ID for another thread. | Store rejects cross-thread collision or keys identity by documented composite identity. | unit |
| [x] | AI-CORE-MSG-005 | Update one message status. | Only that record reference changes; order and unrelated records remain stable. | unit |
| [ ] | AI-CORE-MSG-006 | Move queued to sending, streaming, then complete. | Every allowed status is observable in sequence. | unit |
| [ ] | AI-CORE-MSG-007 | Mark a partial message stopped. | Existing parts remain and status becomes stopped. | unit |
| [ ] | AI-CORE-MSG-008 | Mark a partial message failed with error. | Existing parts remain and safe error metadata is attached. | unit |
| [ ] | AI-CORE-MSG-009 | Supply `parentMessageId`. | Relationship survives pagination, serialization, and update. | unit |
| [ ] | AI-CORE-MSG-010 | Supply an opaque ID containing punctuation and Unicode. | Identity remains exact and is never parsed. | unit |
| [ ] | AI-CORE-MSG-011 | Supply empty parts for a queued message. | Message is accepted. | unit |
| [x] | AI-CORE-MSG-012 | Supply duplicate part IDs within one message. | Validation returns a duplicate-part diagnostic. | unit |
| [x] | AI-CORE-MSG-013 | Update one part in a multipart message. | Part ordering is preserved and unrelated part references remain stable. | unit |
| [ ] | AI-CORE-MSG-014 | Append a new part. | Part appears exactly once at the requested order position. | unit |
| [ ] | AI-CORE-MSG-015 | Remove a transient part by explicit store operation. | Remaining order is stable; no other message changes. | unit |
| [ ] | AI-CORE-MSG-016 | Supply unknown metadata keys. | Keys round-trip without changing rendering/security defaults. | unit |
| [ ] | AI-CORE-MSG-017 | Supply every supported role. | Type accepts the role and visibility policy resolves deterministically. | type/unit |
| [x] | AI-CORE-MSG-018 | Resolve default visibility for system/developer/reasoning. | They are hidden without explicit policy. | unit |
| [x] | AI-CORE-MSG-019 | Resolve default visibility for user/assistant. | They are visible. | unit |
| [x] | AI-CORE-MSG-020 | Deep-freeze the message and reduce an update. | No mutation occurs and update succeeds. | unit |

## Message parts

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-CORE-PART-001 | Create plain-text part. | Text remains literal and format is plain. | unit |
| [ ] | AI-CORE-PART-002 | Create Markdown part. | Markdown remains unrendered data in the model. | unit |
| [x] | AI-CORE-PART-003 | Append text delta to an open part. | Same part ID contains concatenated text. | unit |
| [x] | AI-CORE-PART-004 | Append an empty text delta. | Reducer ignores it or reports the documented diagnostic without changing state. | unit |
| [x] | AI-CORE-PART-005 | Append after text part is complete. | Invalid-lifecycle diagnostic is returned and content is unchanged. | unit |
| [x] | AI-CORE-PART-006 | Complete a streaming text part. | Part status becomes complete without changing text or ID. | unit |
| [x] | AI-CORE-PART-007 | Add source annotation with valid UTF-16 offsets. | Annotation is retained. | unit |
| [x] | AI-CORE-PART-008 | Add source annotation outside text bounds. | Validation rejects the annotation. | unit |
| [ ] | AI-CORE-PART-009 | Add overlapping annotations. | Documented overlap policy is applied deterministically. | unit |
| [ ] | AI-CORE-PART-010 | Add hidden reasoning with encrypted value. | Value is preserved as opaque data and visibility remains hidden. | unit |
| [ ] | AI-CORE-PART-011 | Add summary reasoning. | Only explicit summary text is eligible for visible policy. | unit |
| [x] | AI-CORE-PART-012 | Add tool call with parsed input. | Call ID, name, input, and state are retained. | unit |
| [x] | AI-CORE-PART-013 | Add tool call with malformed raw input. | `rawInput` is retained, `input` is absent, and no exception escapes. | unit |
| [x] | AI-CORE-PART-014 | Transition tool through input-streaming, running, and complete. | Allowed sequence succeeds with stable part and call IDs. | unit |
| [x] | AI-CORE-PART-015 | Transition tool from complete back to running. | Lifecycle diagnostic is returned. | unit |
| [x] | AI-CORE-PART-016 | Mark tool awaiting approval. | Approval data is retained without executing the tool. | unit |
| [ ] | AI-CORE-PART-017 | Attach result to matching call ID. | Result correlation resolves correctly. | unit |
| [ ] | AI-CORE-PART-018 | Attach result before matching call is loaded. | Result is retained as orphan/pending and pairs when call arrives. | unit |
| [ ] | AI-CORE-PART-019 | Attach results for parallel calls out of order. | Each result pairs with its own call ID. | unit |
| [ ] | AI-CORE-PART-020 | Add file reference. | Metadata and URL references round-trip; no binary value exists. | unit |
| [ ] | AI-CORE-PART-021 | Attempt to store `File`, `Blob`, or Base64 object as file content. | Public type/boundary rejects it. | type/unit |
| [ ] | AI-CORE-PART-022 | Add source with excerpt and URL. | Data is retained as untrusted source content. | unit |
| [ ] | AI-CORE-PART-023 | Add structured data part. | Name and JSON value round-trip. | unit |
| [ ] | AI-CORE-PART-024 | Add activity and update its status. | Same activity part progresses without duplication. | unit |
| [x] | AI-CORE-PART-025 | Add reserved A2UI/MCP-App UI part without renderer. | Model accepts serializable payload; rendering policy resolves unsupported. | unit |
| [x] | AI-CORE-PART-026 | Add namespaced extension. | Extension round-trips and registry lookup uses the full exact name. | unit |
| [x] | AI-CORE-PART-027 | Add unnamespaced extension. | Validation rejects it. | unit |
| [x] | AI-CORE-PART-028 | Add unknown future part through compatibility decoder. | Unknown value is preserved safely or converted to documented unsupported representation. | unit |
| [ ] | AI-CORE-PART-029 | Add extremely large data/tool fallback. | Display-boundary limit produces a bounded summary rather than full expansion. | unit |
| [ ] | AI-CORE-PART-030 | Deep-freeze all part variants and reconcile. | No input is mutated. | unit |

## Errors, finish reasons, and actions

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-CORE-ACT-001 | Store safe retryable error. | Code, message, retryable flag, and details survive. | unit |
| [ ] | AI-CORE-ACT-002 | Error lacks display-safe message. | Presentation selector returns generic fallback. | unit |
| [ ] | AI-CORE-ACT-003 | Map every known finish reason. | Canonical reason is preserved. | unit |
| [ ] | AI-CORE-ACT-004 | Map unknown provider finish reason. | Canonical value is `other`; provider value may remain namespaced metadata. | unit |
| [ ] | AI-CORE-ACT-005 | Create submit request. | Contains draft/attachment references and no DOM event. | type/unit |
| [ ] | AI-CORE-ACT-006 | Create stop request. | Contains thread/run IDs and source. | unit |
| [ ] | AI-CORE-ACT-007 | Create retry request. | Contains target message/run context without copying the transcript. | unit |
| [ ] | AI-CORE-ACT-008 | Create edit request. | Original message ID and proposed content remain distinct. | unit |
| [ ] | AI-CORE-ACT-009 | Create feedback request. | Feedback value and target message ID are retained. | unit |
| [ ] | AI-CORE-ACT-010 | Create tool-approval request. | Tool call, decision, and optional JSON payload are retained; no execution occurs. | unit |
| [ ] | AI-CORE-ACT-011 | Create history request. | Cursor and limit are opaque and bounded by configured policy. | unit |
| [ ] | AI-CORE-ACT-012 | Attempt to attach browser event to an action. | Public type rejects it. | type |

## Normalized store and selectors

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [x] | AI-STORE-001 | Initialize empty store. | Maps, order, pages, runs, and diagnostics are empty. | unit |
| [x] | AI-STORE-002 | Add messages in chronological order. | Ordered IDs match input order. | unit |
| [x] | AI-STORE-003 | Prepend an older page. | Older IDs appear before current IDs. | unit |
| [x] | AI-STORE-004 | Merge overlapping page. | Duplicate IDs are reconciled once. | unit |
| [x] | AI-STORE-005 | Merge edited record from authoritative page. | Record updates without order duplication. | unit |
| [ ] | AI-STORE-006 | Select ordered messages. | Selector returns records in stored order. | unit |
| [x] | AI-STORE-007 | Re-run selector without relevant changes. | Result reference remains stable. | unit |
| [ ] | AI-STORE-008 | Update one selected message. | Selector changes only required aggregate/record references. | unit |
| [x] | AI-STORE-009 | Update another thread. | Active-thread selectors retain references. | unit |
| [ ] | AI-STORE-010 | Add run without a message. | Run selector changes; message selector does not. | unit |
| [ ] | AI-STORE-011 | Remove one complete evictable page. | Records unique to page are removed; shared/pinned records remain. | unit |
| [ ] | AI-STORE-012 | Attempt eviction containing active streaming message. | Page or record remains pinned. | unit |
| [ ] | AI-STORE-013 | Attempt eviction containing visible anchor. | Anchor remains available. | unit |
| [ ] | AI-STORE-014 | Attempt eviction containing focused message. | Focused record remains available. | unit |
| [ ] | AI-STORE-015 | Unpin then evict. | Formerly pinned record becomes evictable. | unit |
| [ ] | AI-STORE-016 | Receive late update for evicted message. | Policy rehydrates or records pending update without corrupting order. | unit |
| [ ] | AI-STORE-017 | Switch active thread. | Active selectors change; previous cache remains bounded. | unit |
| [ ] | AI-STORE-018 | Exceed recent-thread LRU limit. | Least-recently-used inactive thread cache is evicted. | unit |
| [ ] | AI-STORE-019 | Touch inactive cached thread. | LRU order updates deterministically. | unit |
| [x] | AI-STORE-020 | Clear one thread. | Its messages, runs, pages, pins, and cursors are removed only for that thread. | unit |
| [ ] | AI-STORE-021 | Clear all on sign-out. | All in-memory records and sensitive diagnostics are removed. | unit |
| [ ] | AI-STORE-022 | Record bounded diagnostics. | Oldest diagnostics are evicted after the configured maximum. | unit |
| [ ] | AI-STORE-023 | Apply 1,000 deltas to one message. | Order array reference remains unchanged throughout. | unit |
| [ ] | AI-STORE-024 | Snapshot store state for debugging. | Snapshot is readonly, bounded, and excludes configured sensitive values. | unit |
| [x] | AI-STORE-025 | Dispose store. | Pending work is cancelled and subsequent writes follow documented disposed behavior. | unit |

## History source and pagination

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [x] | AI-HIST-001 | Load newest page with no cursor. | Items are normalized and cursor state is recorded. | unit |
| [x] | AI-HIST-002 | Load older page using opaque cursor. | Cursor is passed unchanged. | unit |
| [x] | AI-HIST-003 | Page reports `hasMore: false`. | Further automatic prefetch is suppressed. | unit |
| [x] | AI-HIST-004 | Page has no cursor but `hasMore: true`. | Invalid-page diagnostic is produced; loop is prevented. | unit |
| [x] | AI-HIST-005 | Two prefetch triggers occur while request is active. | One request is in flight for that boundary. | unit |
| [x] | AI-HIST-006 | Active request completes successfully. | Loading state clears and page merges once. | unit |
| [x] | AI-HIST-007 | Active request fails. | Existing history remains, error state appears, and retry is possible. | unit |
| [x] | AI-HIST-008 | Retry succeeds. | Error clears and page merges once. | unit |
| [x] | AI-HIST-009 | Thread switches before response. | Old response is ignored or cancelled. | unit |
| [x] | AI-HIST-010 | Abort signal fires. | Loading state clears without user-facing failure unless policy requests it. | unit |
| [x] | AI-HIST-011 | Page contains messages for wrong thread. | Page is rejected and active store is unchanged. | unit |
| [x] | AI-HIST-012 | Page order is invalid. | Boundary reports diagnostic or normalizes only according to documented policy. | unit |
| [x] | AI-HIST-013 | Page overlaps current first page. | Overlap deduplicates by ID. | unit |
| [x] | AI-HIST-014 | Page includes updated existing message. | Authoritative update applies without moving ID unexpectedly. | unit |
| [x] | AI-HIST-015 | Requested limit exceeds configured maximum. | Request is clamped or rejected according to public policy. | unit |
| [x] | AI-HIST-016 | History source returns immutable records. | Store does not mutate them. | unit |
| [ ] | AI-HIST-017 | Evicted page is requested again. | It reloads without duplicating IDs or stale cursors. | unit |
| [x] | AI-HIST-018 | Concurrent threads load history. | States and cancellations remain isolated by thread. | unit |
| [ ] | AI-HIST-019 | Consumer omits history source. | Transcript works with supplied messages and emits no load request automatically. | component |
| [x] | AI-HIST-020 | Dispose during request. | Result cannot write to disposed store/component. | unit |

