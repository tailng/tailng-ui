# TailNG Chat Component Plan

Status: Proposed

## Design principle

`TngAiChatComponent` is the default public facade. It owns the reusable chat presentation and
interaction behavior while the application continues to own transport, persistence, agent logic,
and tool execution. The compound component family below describes internal responsibilities and a
possible future advanced API; consumers are not required to assemble those pieces for a standard
chat experience.

```html
<tng-chat>
  <tng-chat-header />
  <tng-chat-message-list>
    <tng-chat-message>
      <tng-chat-message-content />
      <tng-chat-message-actions />
    </tng-chat-message>
  </tng-chat-message-list>
  <tng-chat-scroll-button />
  <tng-chat-composer />
</tng-chat>
```

Consumers may use the complete shell or compose lower-level parts.

## Component family

| Component                        | Responsibility                                                         |
| -------------------------------- | ---------------------------------------------------------------------- |
| `TngChatComponent`               | Shared context, run presentation, announcements, and projected layout. |
| `TngChatHeaderComponent`         | Title, agent identity, model label, and conversation actions.          |
| `TngChatMessageListComponent`    | History requests, scroll following, anchoring, and visible range.      |
| `TngChatMessageComponent`        | Author, role, state, timestamps, and message-level semantics.          |
| `TngChatMessageContentComponent` | Ordered part rendering through the renderer registry.                  |
| `TngChatMessageActionsComponent` | Copy, retry, edit, feedback, branch, and consumer actions.             |
| `TngChatComposerComponent`       | Draft input, submit, stop, attachment selection, and limits.           |
| `TngChatAttachmentComponent`     | File metadata, preview, upload state, retry, and removal request.      |
| `TngChatStatusComponent`         | Thinking, streaming, waiting, stopped, failed, and run status.         |
| `TngChatEmptyComponent`          | Welcome content, suggestions, and initial actions.                     |
| `TngChatScrollButtonComponent`   | Jump to latest and unseen-message count.                               |

Parts should reuse existing TailNG textarea, button, avatar, tooltip, menu, code block, copy button,
collapsible, toast, skeleton, card, badge, and file-upload behavior where their contracts fit.

## Root ownership

`TngChatComponent` receives controlled state and emits requests. It does not create a network client.

Conceptual inputs:

```text
thread
run
store or messages
disabled
readonly
announcementPolicy
rendererRegistry
```

Conceptual outputs:

```text
messageSubmit
generationStop
messageRetry
messageEdit
feedbackChange
toolApproval
attachmentAdd
attachmentRemove
loadOlderMessages
scrollStateChange
```

Use typed request objects rather than positional event arguments. Outputs must not expose DOM events.

## Message list behavior

The list owns transcript behavior, not message persistence.

Required behavior:

- Render the visible message range with stable ID tracking.
- Follow streaming content only while the user is near the bottom.
- Stop following immediately when the user scrolls upward.
- Show the latest button when content exists below the viewport.
- Preserve the anchor message and pixel offset when older messages are prepended.
- Preserve position when images, tools, code blocks, or disclosures change height.
- Request older history before the user reaches the first loaded message.
- Avoid focusing a new message automatically.
- Expose visible and near-bottom states through data attributes and outputs.
- Support reduced motion for programmatic scrolling.

Suggested data attributes:

```text
data-slot="chat-message-list"
data-at-start
data-at-end
data-following
data-loading-history
data-has-unseen
```

## Message semantics

Each visible message should provide:

- A stable DOM anchor derived safely from the opaque message ID.
- An accessible author name.
- A visible or screen-reader-only role/status label as appropriate.
- A grouped content region.
- Message actions after content in keyboard order.
- State hooks for streaming, complete, stopped, and failed.

Suggested data attributes:

```text
data-slot="chat-message"
data-role="user|assistant|tool|activity|..."
data-status="queued|sending|streaming|complete|stopped|failed"
data-author
```

System, developer, reasoning, and unsupported messages follow the visibility policy defined by the
message model and renderer registry.

## Renderer registry

Message content dispatches each part to a registered renderer. The registry owns runtime rendering
configuration; it is not stored in message metadata.

Minimum built-in renderers:

- Plain text
- Safe Markdown adapter slot with plain-text fallback
- Tool call and result
- File metadata and image preview
- Source/citation
- Activity
- Unsupported part

Renderer requirements:

- Match an exact part kind and optional namespaced name.
- Receive a readonly part and message context.
- Return presentation only; never mutate the message store.
- Emit typed action requests through a supplied action channel.
- Declare whether content may be interactive.
- Respect payload and rendering limits.
- Supply an accessible fallback description.

Unknown parts must not disappear silently. Show a restrained unsupported-content indicator in
development and a policy-configurable fallback in production.

## Markdown and code

TailNG does not bundle a Markdown parser into the initial primary package.

- Plain text is the guaranteed renderer.
- Consumers may register a Markdown renderer.
- Rendered HTML must be sanitized after Markdown parsing.
- Links use safe schemes and explicit external-link behavior.
- Incomplete Markdown must remain readable while streaming.
- Syntax highlighting should be deferred or throttled until the code block stabilizes.
- Existing TailNG code block and copy button components should provide the final presentation.

## Composer

Required interaction:

- Auto-growing textarea with minimum and maximum height.
- `Enter` submits and `Shift+Enter` inserts a newline by default.
- Configurable submit-key policy.
- IME composition guard so composition confirmation does not submit.
- Whitespace-only input rejection.
- Clear distinction among disabled, readonly, sending, and active generation.
- Send button changes to stop while the current run is cancellable.
- Draft may be controlled or locally managed according to an explicit mode.
- Paste, browse, and drag/drop can request attachment addition.
- Character and optional token limits are presentation inputs, not model tokenization logic.
- Mobile keyboard and safe-area behavior must not cover the last message.

Suggested state hooks:

```text
data-slot="chat-composer"
data-empty
data-focused
data-composing
data-disabled
data-readonly
data-submitting
data-generating
data-has-attachments
data-invalid
```

The composer emits a submit request containing text and accepted attachment references. It does not
upload files or create a run.

## Attachments

The attachment UI distinguishes:

```text
selected -> uploading -> uploaded
                   \-> failed -> retry requested
selected/uploaded -> removal requested
```

The application owns upload side effects and writes updated attachment state back. TailNG owns
keyboard interaction, status presentation, and validation-message placement.

Never place Base64 payloads in component state. Temporary object URLs must be revoked when replaced,
removed, or destroyed.

## Message actions

Initial actions:

- Copy
- Retry/regenerate
- Edit and resend
- Positive/negative feedback
- View or expand sources
- Consumer-provided overflow actions

Deferred actions:

- Branch selection
- Continue generation
- Export conversation
- Share conversation

Actions are available to keyboard and touch users. Hover may reveal actions visually, but it cannot
be the only discovery or activation mechanism.

## Accessibility contract

### Transcript

- Provide a labelled conversation region.
- Use list semantics or equivalent grouping for messages.
- Do not mark the complete, continuously changing transcript as an assertive live region.
- Provide a dedicated polite status region for meaningful transitions.
- Announce response start, completion, stopped state, errors, and approval requests.
- Batch streaming announcements; never announce every token.
- Preserve the user's focus and reading position as new content arrives.

### Composer

- Associate visible label or accessible name with the textarea.
- Associate help, limits, attachment errors, and validation messages.
- Give every icon-only action an accessible name.
- Preserve native textarea navigation and selection behavior.
- Do not intercept Enter during IME composition.

### Messages and actions

- Expose author and status without relying on avatar or color.
- Ensure action order follows visual order.
- Keep actions reachable without pointer hover.
- Use semantic buttons and links.
- Preserve focus when retry or edit replaces message content.
- Respect reduced motion and high-contrast modes.

## Responsive behavior

- Support narrow mobile screens without horizontal page overflow.
- Code blocks, tables, and wide tool content scroll within their own bounded area.
- Composer actions may collapse into a menu, but send/stop remains directly available.
- Touch targets meet TailNG's minimum control-size contract.
- Safe-area insets are applied when the composer is fixed or sticky.
- Mixed-direction and RTL text are tested independently from shell direction.
- Long words, URLs, and filenames wrap or truncate with an accessible full-value affordance.

## Styling contract

The behavioral structure supports both:

- Full-width transcript rows.
- User/assistant bubble layouts.

The primitive must not require one visual treatment. Suggested slots:

```text
chat
chat-header
chat-message-list
chat-message
chat-message-author
chat-message-content
chat-message-actions
chat-composer
chat-attachment
chat-status
chat-empty
chat-scroll-button
```

Variants use documented data attributes. Do not add an open-ended CSS class input when slots and
semantic tokens can express the requirement.

## Component tests

The executable component specification is defined by `AI-CMP-*` and `AI-A11Y-*` in
[Component and accessibility tests](./tests/components-and-accessibility.md). The checklist below is
a summary gate.

- [ ] Root projects every compound part without owning transport.
- [ ] Stable message IDs prevent unrelated message recreation.
- [ ] New streamed content follows only when near the bottom.
- [ ] Loading older messages preserves the visible anchor.
- [ ] Composer handles Enter, Shift+Enter, and IME composition.
- [ ] Stop replaces send only when the run is cancellable.
- [ ] Every action is keyboard and touch reachable.
- [ ] Screen readers receive batched meaningful status announcements.
- [ ] Unknown and hidden parts follow renderer policy.
- [ ] Unsafe Markdown or URLs never bypass the renderer boundary.
- [ ] Mobile viewport and safe-area behavior keep the latest content reachable.
