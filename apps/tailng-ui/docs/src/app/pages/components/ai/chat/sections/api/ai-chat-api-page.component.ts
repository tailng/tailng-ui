import { Component } from '@angular/core';

type ApiRow = Readonly<{ name: string; signature: string; description: string }>;

@Component({
  selector: 'app-ai-chat-api-page',
  templateUrl: './ai-chat-api-page.component.html',
})
export class AiChatApiPageComponent {
  protected readonly coreRows: readonly ApiRow[] = [
    {
      name: 'TngAiThread',
      signature: 'type',
      description: 'Conversation identity, timestamps, title, and JSON-safe metadata.',
    },
    {
      name: 'TngAiRun',
      signature: 'type',
      description: 'Run identity, lifecycle status, error, usage, and metadata.',
    },
    {
      name: 'TngAiMessage',
      signature: 'type',
      description: 'Canonical message envelope containing ordered message parts.',
    },
    {
      name: 'TngAiMessagePart',
      signature: 'union',
      description:
        'Text, reasoning, tool, file, source, data, activity, UI, extension, or unsupported content.',
    },
    {
      name: 'TngAiActionRequest',
      signature: 'union',
      description:
        'Submit, stop, retry, edit, feedback, approval, and history intents emitted by a UI.',
    },
    {
      name: 'TngAiPartRegistry<T>',
      signature: 'class',
      description: 'Explicit registry for namespaced extension renderers.',
    },
  ];
  protected readonly storeRows: readonly ApiRow[] = [
    {
      name: 'snapshot()',
      signature: 'TngAiChatStoreSnapshot',
      description: 'Returns normalized thread, run, message, and per-thread order maps.',
    },
    {
      name: 'upsertThread(thread)',
      signature: 'void',
      description: 'Adds or replaces a thread record.',
    },
    { name: 'upsertRun(run)', signature: 'void', description: 'Adds or replaces a run record.' },
    {
      name: 'upsertMessage(message, position?)',
      signature: 'void',
      description: 'Adds or updates a message without duplicating identity.',
    },
    {
      name: 'selectMessages(threadId)',
      signature: 'readonly TngAiMessage[]',
      description: 'Returns a cached ordered projection for one thread.',
    },
    {
      name: 'clearThread(threadId)',
      signature: 'void',
      description: 'Clears the thread and its runs and messages.',
    },
    {
      name: 'dispose()',
      signature: 'void',
      description: 'Clears all records and rejects later writes with a diagnostic.',
    },
  ];
  protected readonly historyRows: readonly ApiRow[] = [
    {
      name: 'loadBefore(threadId, cursor?, limit?)',
      signature: 'Promise<TngAiHistoryLoadResult>',
      description: 'Loads and prepends the previous cursor page.',
    },
    {
      name: 'retry(threadId)',
      signature: 'Promise<TngAiHistoryLoadResult>',
      description: 'Retries the last request recorded for a thread.',
    },
    {
      name: 'state(threadId)',
      signature: 'TngAiHistoryState',
      description: 'Reads loading, cursor, exhaustion, and error state.',
    },
    {
      name: 'activateThread(threadId)',
      signature: 'void',
      description: 'Aborts history work belonging to inactive threads.',
    },
    { name: 'dispose()', signature: 'void', description: 'Aborts all active requests.' },
  ];
  protected readonly adapterRows: readonly ApiRow[] = [
    {
      name: 'validateTngAgUiEvent(value, options?)',
      signature: 'TngAgUiValidationResult',
      description: 'Checks JSON limits, profile support, and the official AG-UI schema.',
    },
    {
      name: 'new TngAgUiReducer(store, options?)',
      signature: 'TngAgUiReducer',
      description: 'Creates an AG-UI event reducer over a normalized chat store.',
    },
    {
      name: 'reducer.reduce(value)',
      signature: 'TngAgUiReduceResult',
      description: 'Validates and applies one event or returns a diagnostic.',
    },
    {
      name: 'reducer.diagnostics()',
      signature: 'readonly TngAgUiReducerDiagnostic[]',
      description: 'Returns bounded reducer diagnostics for observability.',
    },
  ];
}
