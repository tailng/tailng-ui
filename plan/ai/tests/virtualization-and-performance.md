# Virtualization and Performance Test Cases

Status: Test specification

## Range calculation and measurement

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-VIRT-RANGE-001 | Empty dataset. | Visible range is empty and offsets are zero. | unit |
| [ ] | AI-VIRT-RANGE-002 | Dataset fits within viewport. | All items mount once with no unnecessary spacer. | unit/browser |
| [ ] | AI-VIRT-RANGE-003 | Fixed estimated heights exceed viewport. | Visible range contains intersecting items plus configured overscan. | unit |
| [ ] | AI-VIRT-RANGE-004 | Scroll to middle. | Range advances deterministically and total estimated extent remains stable. | unit |
| [ ] | AI-VIRT-RANGE-005 | Scroll to exact item boundary. | No missing or duplicate row appears. | unit |
| [ ] | AI-VIRT-RANGE-006 | Scroll to final pixel. | Last message is mounted and reachable. | unit/browser |
| [ ] | AI-VIRT-RANGE-007 | Overscan is zero. | Only intersecting rows mount. | unit |
| [ ] | AI-VIRT-RANGE-008 | Overscan is one viewport. | Expected rows above/below mount within dataset bounds. | unit |
| [ ] | AI-VIRT-RANGE-009 | Invalid negative overscan. | Input is clamped or rejected according to contract. | unit |
| [ ] | AI-VIRT-RANGE-010 | Estimated height is replaced by measurement. | Offsets and total extent update without changing ID order. | unit |
| [ ] | AI-VIRT-RANGE-011 | Many measurements arrive out of DOM order. | Cache associates each height by stable ID. | unit |
| [ ] | AI-VIRT-RANGE-012 | Row ID moves position. | Measurement follows ID or invalidates according to documented policy, never index. | unit |
| [ ] | AI-VIRT-RANGE-013 | Container width enters new bucket. | Stale width-dependent measurements invalidate. | unit |
| [ ] | AI-VIRT-RANGE-014 | Width changes within same bucket/tolerance. | Unnecessary full invalidation is avoided. | unit |
| [ ] | AI-VIRT-RANGE-015 | Message is removed above viewport. | Anchor compensation equals removed measured/estimated height. | unit/browser |
| [ ] | AI-VIRT-RANGE-016 | Message is inserted above viewport. | Anchor compensation preserves visible item and offset. | unit/browser |
| [ ] | AI-VIRT-RANGE-017 | Message is inserted below viewport. | Current viewport remains unchanged. | unit/browser |
| [ ] | AI-VIRT-RANGE-018 | Focused row leaves normal range. | Row remains pinned until focus safely leaves. | browser |
| [ ] | AI-VIRT-RANGE-019 | Streaming row leaves range while run is active. | Pin policy keeps or releases it according to documented latest/follow state. | unit/browser |
| [ ] | AI-VIRT-RANGE-020 | Pinned exception count exceeds safety limit. | Old nonessential pins release or diagnostic appears; DOM cannot grow unbounded. | unit |

## Scroll anchoring and follow mode

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-VIRT-ANCHOR-001 | Capture visible anchor. | Stable ID and offset from container top are recorded. | unit/browser |
| [ ] | AI-VIRT-ANCHOR-002 | Prepend one measured page. | Same anchor returns within 1 CSS pixel after settle. | browser |
| [ ] | AI-VIRT-ANCHOR-003 | Prepend estimated rows then measure them. | Incremental compensation maintains anchor after correction. | browser |
| [ ] | AI-VIRT-ANCHOR-004 | Anchor message is updated but remains present. | Identity and visual offset remain stable. | browser |
| [ ] | AI-VIRT-ANCHOR-005 | Anchor message is deleted. | Deterministic nearest surviving anchor is selected. | unit/browser |
| [ ] | AI-VIRT-ANCHOR-006 | Row above anchor expands. | Scroll offset increases by measured delta. | browser |
| [ ] | AI-VIRT-ANCHOR-007 | Row above anchor collapses. | Scroll offset decreases by measured delta. | browser |
| [ ] | AI-VIRT-ANCHOR-008 | Row below anchor changes. | No compensation moves current viewport. | browser |
| [ ] | AI-VIRT-ANCHOR-009 | User is within near-bottom threshold. | Follow mode is active. | unit/browser |
| [ ] | AI-VIRT-ANCHOR-010 | User scrolls beyond threshold. | Follow mode deactivates immediately. | browser |
| [ ] | AI-VIRT-ANCHOR-011 | Content streams while not following. | Anchor stays fixed and unseen state increases. | browser |
| [ ] | AI-VIRT-ANCHOR-012 | User returns to bottom manually. | Follow mode resumes. | browser |
| [ ] | AI-VIRT-ANCHOR-013 | User activates latest button. | Latest becomes visible and follow resumes. | browser |
| [ ] | AI-VIRT-ANCHOR-014 | Reduced motion is active. | Latest navigation does not smooth-scroll. | browser |
| [ ] | AI-VIRT-ANCHOR-015 | Composer height changes while following. | Latest remains visible. | browser |
| [ ] | AI-VIRT-ANCHOR-016 | Composer height changes while reading older content. | Transcript anchor remains stable. | browser |

## Streaming efficiency

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-PERF-STREAM-001 | Consume 1,000 text deltas. | One logical buffer/part grows; no retained object per token. | unit/performance |
| [ ] | AI-PERF-STREAM-002 | Many deltas arrive in one animation frame. | Presentation commits at most once in that frame. | unit with scheduler |
| [ ] | AI-PERF-STREAM-003 | Continuous stream exceeds maximum batch interval. | User-visible progress commits within configured maximum interval. | unit with fake clock |
| [ ] | AI-PERF-STREAM-004 | Stream ends before scheduled frame. | Final content flushes exactly once. | unit |
| [ ] | AI-PERF-STREAM-005 | Stream errors before scheduled frame. | Partial content flushes before error presentation. | unit |
| [ ] | AI-PERF-STREAM-006 | Stream aborts before scheduled frame. | Partial content flushes before stopped state. | unit |
| [ ] | AI-PERF-STREAM-007 | Two messages stream concurrently. | Scheduler batches while preserving independent order/content. | unit |
| [ ] | AI-PERF-STREAM-008 | Tool arguments stream alongside text. | Both buffers remain correct with bounded presentation commits. | unit |
| [ ] | AI-PERF-STREAM-009 | Unrelated complete messages are present. | Their component render/check counters do not grow per delta beyond framework baseline. | component/performance |
| [ ] | AI-PERF-STREAM-010 | Markdown renderer is configured. | Parse frequency is throttled during stream and final parse occurs at completion. | unit/component |
| [ ] | AI-PERF-STREAM-011 | Syntax highlighter is configured. | Incomplete code is not fully highlighted per token. | component/performance |
| [ ] | AI-PERF-STREAM-012 | Live announcements are enabled. | Announcement count is bounded and independent of token count. | component |

## DOM and memory budgets

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-PERF-MEM-001 | Load 10,000 synthetic messages. | Mounted message views stay within range plus documented pins. | browser/performance |
| [ ] | AI-PERF-MEM-002 | Scroll from start to end of 10,000 messages. | DOM count stays bounded; every sampled target is reachable. | browser/performance |
| [ ] | AI-PERF-MEM-003 | Load pages until 300-record default cache is exceeded. | Eviction keeps in-memory records near budget plus pins. | unit/browser |
| [ ] | AI-PERF-MEM-004 | Repeat load/evict cycle 20 times. | Heap returns to stable band after GC opportunity. | browser/performance |
| [ ] | AI-PERF-MEM-005 | Switch among more than three cached threads. | Inactive LRU threads evict and active thread remains intact. | unit/browser |
| [ ] | AI-PERF-MEM-006 | Reopen evicted thread. | Data reloads correctly without duplicate views/listeners. | browser |
| [ ] | AI-PERF-MEM-007 | Stream for two minutes. | Heap/object count does not grow linearly with tokens after retained text growth is accounted for. | browser/performance |
| [ ] | AI-PERF-MEM-008 | Expand/collapse large tool payload repeatedly. | Detached DOM/views do not accumulate. | browser/performance |
| [ ] | AI-PERF-MEM-009 | Open/close overflow menus across virtualized rows. | Overlay instances and listeners return to baseline. | browser/performance |
| [ ] | AI-PERF-MEM-010 | Destroy chat root. | Observers, schedulers, streams, and view references become collectible. | browser/performance |

## Media, workers, and cleanup

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-PERF-RES-001 | Image is outside preload range. | Full image is not requested/decoded by TailNG policy. | browser |
| [ ] | AI-PERF-RES-002 | Image enters range. | Lazy load begins and height correction preserves anchor. | browser |
| [ ] | AI-PERF-RES-003 | Image leaves range and unmounts. | Element/resources release according to browser and renderer policy. | browser |
| [ ] | AI-PERF-RES-004 | Temporary object URL is replaced. | Previous URL is revoked exactly once. | unit/browser |
| [ ] | AI-PERF-RES-005 | Temporary object URL attachment is removed. | URL is revoked. | unit/browser |
| [ ] | AI-PERF-RES-006 | Audio/video row unmounts. | Playback stops and renderer releases resources. | browser |
| [ ] | AI-PERF-RES-007 | Markdown worker is created lazily. | No worker exists before renderer use. | unit/browser |
| [ ] | AI-PERF-RES-008 | Chat is destroyed with worker active. | Worker is terminated and pending result is ignored. | browser |
| [ ] | AI-PERF-RES-009 | History request completes after destroy. | Result is ignored and no view/store leak occurs. | unit/browser |
| [ ] | AI-PERF-RES-010 | Resize/IntersectionObserver fires after unmount. | Callback cannot mutate disposed row/list state. | browser |
| [ ] | AI-PERF-RES-011 | Animation frame/timer is scheduled at destroy. | It is cancelled or becomes a safe no-op. | unit/browser |
| [ ] | AI-PERF-RES-012 | Stream is active at destroy. | Subscription is aborted/disposed according to ownership policy. | integration/browser |

## Performance budgets and reports

| Done | ID | Scenario | Expected | Level |
| --- | --- | --- | --- | --- |
| [ ] | AI-PERF-BUDGET-001 | Default page load. | Requested size is 40 unless consumer config overrides it. | unit |
| [ ] | AI-PERF-BUDGET-002 | Prefetch threshold is crossed. | Request starts at documented 10-message threshold. | unit |
| [ ] | AI-PERF-BUDGET-003 | Mounted range is measured. | Target remains 20-60 for standard viewport/fixture, excluding pins. | browser/performance |
| [ ] | AI-PERF-BUDGET-004 | Stream presentation cadence is measured. | Commits respect frame/50 ms policy. | performance |
| [ ] | AI-PERF-BUDGET-005 | Prepend anchor error is measured. | Error is no more than 1 CSS pixel after stabilization. | browser/performance |
| [ ] | AI-PERF-BUDGET-006 | Representative desktop stream is profiled. | No long task above agreed threshold is attributable to transcript update. | performance |
| [ ] | AI-PERF-BUDGET-007 | Throttled mobile profile is run. | Send, scroll, stop, and latest controls remain responsive within agreed threshold. | performance |
| [ ] | AI-PERF-BUDGET-008 | Build produces performance report. | DOM, heap, render frequency, parse cost, and anchor error are recorded. | CI/performance |

