import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { useAiChatDocsCodeTheme } from '../../chat-docs-code-theme';
import { AiChatLiveDemoComponent } from './live-chat-demo/ai-chat-live-demo.component';

@Component({
  selector: 'app-ai-chat-examples-page',
  imports: [TngCodeBlockComponent, AiChatLiveDemoComponent],
  templateUrl: './ai-chat-examples-page.component.html',
})
export class AiChatExamplesPageComponent {
  protected readonly codeBlockTheme = useAiChatDocsCodeTheme();
  protected readonly storeCode = [
    "import { TngAiChatStore } from '@tailng-ui/ai';",
    '',
    'const store = new TngAiChatStore();',
    "store.upsertThread({ id: 'thread-7', title: 'Release review' });",
    'store.upsertMessage({',
    "  id: 'message-1',",
    "  threadId: 'thread-7',",
    "  role: 'user',",
    "  status: 'complete',",
    "  parts: [{ id: 'part-1', type: 'text', format: 'plain', text: 'Is it ready?' }],",
    '});',
    '',
    "const visibleMessages = store.selectMessages('thread-7');",
  ].join('\n');
  protected readonly historyCode = [
    "import { TngAiChatStore, TngAiHistoryController, type TngAiHistorySource } from '@tailng-ui/ai';",
    '',
    'const source: TngAiHistorySource = {',
    '  async loadBefore({ threadId, cursor, limit, signal }) {',
    '    const url = new URL(`/api/threads/${threadId}/messages`, location.origin);',
    "    if (cursor) url.searchParams.set('before', cursor);",
    "    url.searchParams.set('limit', String(limit));",
    '    const response = await fetch(url, { signal });',
    '    if (!response.ok) throw new Error(`History failed: ${response.status}`);',
    '    return response.json();',
    '  },',
    '};',
    '',
    'const history = new TngAiHistoryController(new TngAiChatStore(), source, {',
    '  pageSize: 40,',
    '  maxPageSize: 100,',
    '});',
    "await history.loadBefore('thread-7');",
  ].join('\n');
  protected readonly agUiCode = [
    "import type { Event } from '@ag-ui/core';",
    "import { TngAiChatStore } from '@tailng-ui/ai';",
    "import { TngAgUiReducer } from '@tailng-ui/ai/ag-ui';",
    '',
    'const store = new TngAiChatStore();',
    "const reducer = new TngAgUiReducer(store, { profile: 'required-chat' });",
    '',
    'function onAgentEvent(event: Event): void {',
    '  const result = reducer.reduce(event);',
    '  if (!result.applied) {',
    "    console.warn('Rejected AG-UI event', result.diagnostic);",
    '  }',
    '}',
  ].join('\n');
}
