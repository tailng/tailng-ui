# Component and Accessibility Test Cases

Status: Test specification

## Documentation working demo

| Done | ID              | Scenario                            | Expected                                                                                          | Level     |
| ---- | --------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------- | --------- |
| [x]  | AI-DOC-DEMO-001 | Open the AI Chat Examples page.     | A labelled interactive chat region renders recent canonical messages and a usable composer.       | component |
| [x]  | AI-DOC-DEMO-002 | Submit a non-empty prompt.          | One user message is added and one AG-UI run starts without duplicating messages.                  | component |
| [x]  | AI-DOC-DEMO-003 | Advance the simulated agent stream. | Text deltas update one stable assistant message and the status is not announced per token.        | component |
| [x]  | AI-DOC-DEMO-004 | Reach the simulated tool phase.     | A correlated tool call progresses from input streaming to running and displays its result safely. | component |
| [x]  | AI-DOC-DEMO-005 | Stop an active response.            | Timers are cancelled, partial text remains visible, and the run/message become cancelled/stopped. | component |
| [x]  | AI-DOC-DEMO-006 | Retry a stopped response.           | A new run starts while the stopped response remains immutable history.                            | component |
| [x]  | AI-DOC-DEMO-007 | Load earlier history.               | One cursor page is prepended, repeated loading is deduplicated, and exhaustion is exposed.        | component |
| [x]  | AI-DOC-DEMO-008 | Destroy the demo during streaming.  | Scheduled stream work and history work are cancelled without later mutation.                      | component |

## Chat root and compound composition

| Done | ID              | Scenario                            | Expected                                                                              | Level     |
| ---- | --------------- | ----------------------------------- | ------------------------------------------------------------------------------------- | --------- |
| [ ]  | AI-CMP-ROOT-001 | Render empty chat root.             | Labelled chat region and projected layout exist without transport creation.           | component |
| [ ]  | AI-CMP-ROOT-002 | Project every compound part.        | Header, list, status, latest button, and composer register once.                      | component |
| [ ]  | AI-CMP-ROOT-003 | Omit optional compound parts.       | Root remains usable without runtime errors.                                           | component |
| [ ]  | AI-CMP-ROOT-004 | Supply controlled thread/run/store. | Descendants observe matching readonly context.                                        | component |
| [ ]  | AI-CMP-ROOT-005 | Replace controlled run.             | Presentation updates without recreating unrelated messages.                           | component |
| [ ]  | AI-CMP-ROOT-006 | Set disabled.                       | Composer/actions become unavailable according to contract; transcript stays readable. | component |
| [ ]  | AI-CMP-ROOT-007 | Set readonly.                       | Transcript and copy remain usable; mutation requests are suppressed.                  | component |
| [ ]  | AI-CMP-ROOT-008 | Destroy root.                       | Child registrations, announcements, and scheduled work are cleaned up.                | component |
| [ ]  | AI-CMP-ROOT-009 | Nest chat root accidentally.        | Contexts remain isolated or unsupported nesting reports a clear diagnostic.           | component |
| [ ]  | AI-CMP-ROOT-010 | Use custom renderer registry.       | Descendants use supplied registry without global leakage.                             | component |

## Message list, scrolling, and history requests

| Done | ID              | Scenario                                   | Expected                                                                                    | Level             |
| ---- | --------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------- | ----------------- |
| [ ]  | AI-CMP-LIST-001 | Render ordered messages.                   | Visual and accessibility order match canonical order.                                       | component         |
| [ ]  | AI-CMP-LIST-002 | Append new message while at end.           | Follow mode keeps latest message visible.                                                   | browser           |
| [ ]  | AI-CMP-LIST-003 | Append while user is above end.            | Scroll position remains anchored and latest button appears.                                 | browser           |
| [ ]  | AI-CMP-LIST-004 | Stream content while following.            | End remains visible without focus movement.                                                 | browser           |
| [ ]  | AI-CMP-LIST-005 | Stream while user reads older content.     | Viewport does not jump downward.                                                            | browser           |
| [ ]  | AI-CMP-LIST-006 | User activates latest button.              | View moves to latest using reduced-motion policy and follow mode resumes.                   | browser           |
| [ ]  | AI-CMP-LIST-007 | Unseen messages accumulate.                | Button exposes correct bounded unseen count.                                                | component/browser |
| [ ]  | AI-CMP-LIST-008 | User reaches history threshold.            | Exactly one typed load request is emitted.                                                  | component         |
| [ ]  | AI-CMP-LIST-009 | Loading state remains active at threshold. | Duplicate load requests are suppressed.                                                     | component         |
| [ ]  | AI-CMP-LIST-010 | History fails.                             | Existing messages remain and accessible retry affordance appears.                           | component         |
| [ ]  | AI-CMP-LIST-011 | Retry history.                             | One retry request emits with same boundary context.                                         | component         |
| [ ]  | AI-CMP-LIST-012 | History reports no more.                   | Automatic requests stop and start-of-conversation state is exposed.                         | component         |
| [ ]  | AI-CMP-LIST-013 | Prepend history.                           | Visible anchor and focus remain stable.                                                     | browser           |
| [ ]  | AI-CMP-LIST-014 | Message above viewport resizes.            | Anchor compensation prevents perceptible jump.                                              | browser           |
| [ ]  | AI-CMP-LIST-015 | Message below viewport resizes.            | Current viewport does not move.                                                             | browser           |
| [ ]  | AI-CMP-LIST-016 | Container width changes.                   | Measurements refresh and anchor remains stable.                                             | browser           |
| [ ]  | AI-CMP-LIST-017 | Switch thread.                             | Scroll/history state resets or restores per documented policy without leaking prior thread. | browser           |
| [ ]  | AI-CMP-LIST-018 | Empty list with empty slot.                | Empty content renders and composer remains reachable.                                       | component         |

## Message and content rendering

| Done | ID             | Scenario                                                 | Expected                                                               | Level             |
| ---- | -------------- | -------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------- |
| [ ]  | AI-CMP-MSG-001 | Render user message.                                     | Author, role, content, status hooks, and message anchor are present.   | component         |
| [ ]  | AI-CMP-MSG-002 | Render assistant message.                                | Assistant identity and ordered parts are present.                      | component         |
| [ ]  | AI-CMP-MSG-003 | Render custom author.                                    | Name and avatar fallback use existing avatar semantics.                | component         |
| [ ]  | AI-CMP-MSG-004 | Render queued/sending/streaming/complete/stopped/failed. | Correct data status and accessible status text resolve for each.       | component         |
| [ ]  | AI-CMP-MSG-005 | Update one message.                                      | Unrelated message component instances remain stable.                   | component         |
| [ ]  | AI-CMP-MSG-006 | Render multipart content.                                | Parts appear in canonical order.                                       | component         |
| [ ]  | AI-CMP-MSG-007 | Render plain text containing markup.                     | Markup displays as text and does not execute.                          | component         |
| [ ]  | AI-CMP-MSG-008 | Render Markdown without registered renderer.             | Safe plain-text or unsupported fallback appears.                       | component         |
| [ ]  | AI-CMP-MSG-009 | Render Markdown with registered renderer.                | Renderer receives readonly context and sanitized output is displayed.  | component         |
| [ ]  | AI-CMP-MSG-010 | Render streaming incomplete Markdown/code fence.         | Content remains readable and stable.                                   | component/browser |
| [ ]  | AI-CMP-MSG-011 | Complete Markdown stream.                                | Final parse/highlight replaces provisional view without losing anchor. | browser           |
| [ ]  | AI-CMP-MSG-012 | Render tool input-streaming/running/complete/failed.     | Correct disclosure/status and safe payload summary appear.             | component         |
| [ ]  | AI-CMP-MSG-013 | Render parallel tool calls.                              | Each call/result stays visually correlated.                            | component         |
| [ ]  | AI-CMP-MSG-014 | Render malformed tool arguments.                         | Safe raw fallback appears; no exception or execution.                  | component         |
| [ ]  | AI-CMP-MSG-015 | Render file part.                                        | Name, media type, size, and authorized actions appear.                 | component         |
| [ ]  | AI-CMP-MSG-016 | Render broken image preview.                             | Fallback appears without collapsing message semantics.                 | browser           |
| [ ]  | AI-CMP-MSG-017 | Render source and annotation.                            | Citation target and source details correlate accessibly.               | component         |
| [ ]  | AI-CMP-MSG-018 | Render unsafe source URL.                                | Link is disabled or omitted according to safe-scheme policy.           | component         |
| [ ]  | AI-CMP-MSG-019 | Render activity updates.                                 | One activity view progresses without duplicated nodes/announcements.   | component         |
| [ ]  | AI-CMP-MSG-020 | Render reasoning under default policy.                   | No reasoning text appears.                                             | component         |
| [ ]  | AI-CMP-MSG-021 | Render approved display-safe reasoning summary.          | Summary appears inside explicit disclosure.                            | component         |
| [ ]  | AI-CMP-MSG-022 | Render unknown data/extension part.                      | Bounded unsupported fallback appears.                                  | component         |
| [ ]  | AI-CMP-MSG-023 | Register extension renderer.                             | Exact namespaced extension uses it; other names do not.                | component         |
| [ ]  | AI-CMP-MSG-024 | Extension renderer emits action.                         | Typed action channel receives it; store is not mutated directly.       | component         |
| [ ]  | AI-CMP-MSG-025 | Renderer throws.                                         | Error boundary shows safe fallback and remaining parts render.         | component         |

## Composer and draft behavior

| Done | ID              | Scenario                                  | Expected                                                                    | Level             |
| ---- | --------------- | ----------------------------------------- | --------------------------------------------------------------------------- | ----------------- |
| [ ]  | AI-CMP-COMP-001 | Render uncontrolled empty composer.       | Draft is empty and send is disabled.                                        | component         |
| [ ]  | AI-CMP-COMP-002 | Enter non-whitespace text.                | Draft updates and send becomes available.                                   | component         |
| [ ]  | AI-CMP-COMP-003 | Enter whitespace only.                    | Send remains unavailable and submit emits nothing.                          | component         |
| [ ]  | AI-CMP-COMP-004 | Press Enter under default policy.         | One submit request emits.                                                   | component         |
| [ ]  | AI-CMP-COMP-005 | Press Shift+Enter.                        | Newline is inserted and no submit emits.                                    | component         |
| [ ]  | AI-CMP-COMP-006 | Configure alternate submit-key policy.    | Documented key combination submits; Enter behaves accordingly.              | component         |
| [ ]  | AI-CMP-COMP-007 | Press Enter during IME composition.       | No submit emits.                                                            | component/browser |
| [ ]  | AI-CMP-COMP-008 | End composition then press Enter.         | One submit emits with finalized text.                                       | component/browser |
| [ ]  | AI-CMP-COMP-009 | Submit by button.                         | Same typed request shape as keyboard submission.                            | component         |
| [ ]  | AI-CMP-COMP-010 | Rapid keyboard and button activation.     | Duplicate submit is suppressed while submitting.                            | component         |
| [ ]  | AI-CMP-COMP-011 | Controlled draft changes externally.      | Textarea reflects value and cursor/focus policy remains stable.             | component         |
| [ ]  | AI-CMP-COMP-012 | Consumer accepts submit and clears draft. | Composer clears only from controlled update or documented local policy.     | component         |
| [ ]  | AI-CMP-COMP-013 | Submit fails.                             | Draft restoration/retention follows policy and remains editable.            | component         |
| [ ]  | AI-CMP-COMP-014 | Textarea content grows.                   | Height grows up to maximum, then internal scrolling begins.                 | browser           |
| [ ]  | AI-CMP-COMP-015 | Draft shrinks.                            | Height shrinks without shifting latest-message access unexpectedly.         | browser           |
| [ ]  | AI-CMP-COMP-016 | Character limit reached.                  | Further input/validation follows policy and count is associated accessibly. | component         |
| [ ]  | AI-CMP-COMP-017 | Token estimate supplied.                  | Estimate displays as informational and is not treated as provider truth.    | component         |
| [ ]  | AI-CMP-COMP-018 | Disabled composer.                        | Text editing, attach, and submit are unavailable.                           | component         |
| [ ]  | AI-CMP-COMP-019 | Readonly composer.                        | Mutation actions are unavailable while transcript remains interactive.      | component         |
| [ ]  | AI-CMP-COMP-020 | Run becomes cancellable.                  | Send changes to labelled stop control.                                      | component         |
| [ ]  | AI-CMP-COMP-021 | Activate stop.                            | Exactly one stop request emits with run/thread IDs.                         | component         |
| [ ]  | AI-CMP-COMP-022 | Run ends.                                 | Stop returns to send without stealing focus.                                | component         |
| [ ]  | AI-CMP-COMP-023 | Paste plain text.                         | Native text insertion works.                                                | component         |
| [ ]  | AI-CMP-COMP-024 | Paste files.                              | Attachment-add request emits; file is not embedded in persisted message.    | component         |
| [ ]  | AI-CMP-COMP-025 | Drop files onto composer/drop zone.       | Attachment-add request emits with source drop.                              | browser           |
| [ ]  | AI-CMP-COMP-026 | Draft contains bidirectional text.        | Text editing and visual direction remain usable.                            | browser           |
| [ ]  | AI-CMP-COMP-027 | Mobile keyboard opens.                    | Composer and latest message remain reachable.                               | browser           |

## Attachments

| Done | ID             | Scenario                                 | Expected                                                            | Level             |
| ---- | -------------- | ---------------------------------------- | ------------------------------------------------------------------- | ----------------- |
| [ ]  | AI-CMP-ATT-001 | Display selected attachment.             | Name, type, size, and remove action appear.                         | component         |
| [ ]  | AI-CMP-ATT-002 | Attachment is uploading.                 | Progress/status is exposed visually and accessibly.                 | component         |
| [ ]  | AI-CMP-ATT-003 | Upload completes.                        | Uploaded state and server reference replace transient selection.    | component         |
| [ ]  | AI-CMP-ATT-004 | Upload fails.                            | Error and retry/remove actions appear.                              | component         |
| [ ]  | AI-CMP-ATT-005 | Activate retry.                          | Typed retry request emits once.                                     | component         |
| [ ]  | AI-CMP-ATT-006 | Activate remove.                         | Typed removal request emits; component does not delete server file. | component         |
| [ ]  | AI-CMP-ATT-007 | File exceeds application-provided limit. | Validation message appears and submit policy is enforced.           | component         |
| [ ]  | AI-CMP-ATT-008 | File type is rejected.                   | Accessible rejection identifies the file and reason.                | component         |
| [ ]  | AI-CMP-ATT-009 | Multiple mode is false.                  | Extra selection follows declared rejection behavior.                | component         |
| [ ]  | AI-CMP-ATT-010 | Temporary preview URL changes.           | Old URL cleanup hook runs and new preview displays.                 | component/browser |
| [ ]  | AI-CMP-ATT-011 | Attachment component unmounts.           | Temporary URL/media resources are released.                         | browser           |
| [ ]  | AI-CMP-ATT-012 | Filename is very long or RTL.            | Layout remains bounded and full name is accessible.                 | browser           |

## Message actions

| Done | ID             | Scenario                             | Expected                                                                          | Level          |
| ---- | -------------- | ------------------------------------ | --------------------------------------------------------------------------------- | -------------- |
| [ ]  | AI-CMP-ACT-001 | Copy plain message.                  | Existing copy behavior receives intended display text and announces success once. | component      |
| [ ]  | AI-CMP-ACT-002 | Copy multipart message.              | Documented copy serializer excludes hidden/unsafe parts.                          | unit/component |
| [ ]  | AI-CMP-ACT-003 | Copy fails.                          | Accessible failure appears without losing focus.                                  | component      |
| [ ]  | AI-CMP-ACT-004 | Retry eligible message.              | One retry request emits with message/run context.                                 | component      |
| [ ]  | AI-CMP-ACT-005 | Retry ineligible message.            | Control is absent/disabled with explanation.                                      | component      |
| [ ]  | AI-CMP-ACT-006 | Edit user message.                   | Edit request or edit mode uses original content without mutation.                 | component      |
| [ ]  | AI-CMP-ACT-007 | Cancel edit.                         | Original message presentation returns unchanged.                                  | component      |
| [ ]  | AI-CMP-ACT-008 | Submit edited message.               | One edit/resend request emits with original ID and proposed content.              | component      |
| [ ]  | AI-CMP-ACT-009 | Give positive/negative feedback.     | Controlled feedback request emits and state reflects only accepted update.        | component      |
| [ ]  | AI-CMP-ACT-010 | Open overflow actions by keyboard.   | TailNG menu semantics and focus restoration apply.                                | browser        |
| [ ]  | AI-CMP-ACT-011 | Actions are visually hover-revealed. | Keyboard focus and touch still make them discoverable.                            | browser        |
| [ ]  | AI-CMP-ACT-012 | Consumer adds custom action.         | Action participates in ordering, labels, disabled state, and typed output.        | component      |

## Accessibility and responsive behavior

| Done | ID          | Scenario                                                 | Expected                                                                                | Level             |
| ---- | ----------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------- |
| [ ]  | AI-A11Y-001 | Inspect chat root.                                       | Region has an accessible name.                                                          | component         |
| [ ]  | AI-A11Y-002 | Inspect transcript structure.                            | Messages expose coherent list/group semantics in reading order.                         | component         |
| [ ]  | AI-A11Y-003 | Inspect one message.                                     | Author and relevant status are discoverable without color/avatar.                       | component         |
| [ ]  | AI-A11Y-004 | Assistant starts response.                               | Polite status announces start once.                                                     | component/browser |
| [ ]  | AI-A11Y-005 | Many text deltas arrive.                                 | Tokens are not individually announced.                                                  | component         |
| [ ]  | AI-A11Y-006 | Assistant completes.                                     | Completion is announced once with no full-message repetition unless policy requests it. | component         |
| [ ]  | AI-A11Y-007 | Response stops/fails.                                    | Meaningful status and recovery action are announced.                                    | component         |
| [ ]  | AI-A11Y-008 | Tool approval is required.                               | Request is announced and focusable action is available.                                 | browser           |
| [ ]  | AI-A11Y-009 | New content arrives while reading older content.         | Focus and virtual cursor are not forcibly moved.                                        | browser           |
| [ ]  | AI-A11Y-010 | Composer has help/count/error.                           | `aria-describedby` relationships are correct and deduplicated.                          | component         |
| [ ]  | AI-A11Y-011 | Icon-only controls render.                               | Each has an accessible name.                                                            | component         |
| [ ]  | AI-A11Y-012 | Tab through chat.                                        | Order matches visual/action order; hidden controls are not focusable.                   | browser           |
| [ ]  | AI-A11Y-013 | Focused message approaches virtual boundary.             | Focused content remains mounted and operable.                                           | browser           |
| [ ]  | AI-A11Y-014 | Focused action disappears after controlled state update. | Focus moves to documented nearest stable target.                                        | browser           |
| [ ]  | AI-A11Y-015 | Reduced motion is enabled.                               | Programmatic scrolling/indicators avoid nonessential animation.                         | browser           |
| [ ]  | AI-A11Y-016 | Forced-colors mode.                                      | Focus, status, disabled, and selected states remain distinguishable.                    | browser           |
| [ ]  | AI-A11Y-017 | 200% and 400% zoom.                                      | Content reflows without losing controls or requiring page-horizontal scroll.            | browser           |
| [ ]  | AI-A11Y-018 | Large text settings.                                     | Messages and composer remain usable without clipping.                                   | browser           |
| [ ]  | AI-A11Y-019 | RTL shell.                                               | Layout/order adapt while code and mixed-direction content remain readable.              | browser           |
| [ ]  | AI-A11Y-020 | Touch-only interaction.                                  | Send, stop, latest, attachments, and actions have adequate targets.                     | browser           |
| [ ]  | AI-A11Y-021 | Wide code/table content.                                 | Overflow remains inside bounded content region, not the page.                           | browser           |
| [ ]  | AI-A11Y-022 | Long URL/word/filename.                                  | It wraps/truncates safely and full value remains accessible.                            | browser           |
| [ ]  | AI-A11Y-023 | Empty, loading, and error states.                        | Each has appropriate status semantics without excessive live announcements.             | component         |
| [ ]  | AI-A11Y-024 | Automated accessibility scan of representative states.   | No serious/critical violations; manual-only cases remain separately verified.           | browser           |
| [ ]  | AI-A11Y-025 | Screen-reader smoke test across send/stream/stop/retry.  | User can complete flow and receives meaningful, non-repetitive feedback.                | browser/manual    |
