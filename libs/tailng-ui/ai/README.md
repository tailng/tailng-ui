# @tailng-ui/ai

Provider-neutral Angular chat UI and agent-interaction contracts for TailNG UI.

## Chat component

`TngAiChatComponent` provides the transcript, professional default header, composer, run controls,
history requests, auto-scroll, jump-to-latest behavior, and bounded DOM rendering. Applications keep
control of their transport and agent runtime through typed inputs and outputs.

```html
<tng-ai-chat
  [messages]="messages()"
  [busy]="busy()"
  [status]="status()"
  [canStop]="busy()"
  (messageSubmit)="send($event.text)"
  (stopRequest)="stop()"
/>
```

Supply a trusted local Angular component through `headerComponent` to replace the default header.
Register trusted message-part components with `partRenderers` or
`provideTngAiMessagePartRenderer`. Agent payloads cannot select Angular components directly.

See `plan/ai` for the architecture and TDD catalog.
