import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { useAiChatDocsCodeTheme } from '../../chat-docs-code-theme';

@Component({
  selector: 'app-ai-chat-overview-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './ai-chat-overview-page.component.html',
})
export class AiChatOverviewPageComponent {
  protected readonly codeBlockTheme = useAiChatDocsCodeTheme();
  protected readonly installCode = 'pnpm add @tailng-ui/ai @ag-ui/core';
  protected readonly importsCode = [
    "import { TngAiChatStore, TngAiHistoryController } from '@tailng-ui/ai';",
    "import { TngAgUiReducer } from '@tailng-ui/ai/ag-ui';",
  ].join('\n');
  protected readonly messageCode = [
    "import type { TngAiMessage } from '@tailng-ui/ai';",
    '',
    'const message: TngAiMessage = {',
    "  id: 'message-42',",
    "  threadId: 'thread-7',",
    "  role: 'assistant',",
    "  status: 'complete',",
    '  parts: [',
    '    {',
    "      id: 'part-42',",
    "      type: 'text',",
    "      format: 'markdown',",
    "      text: 'The release is ready.',",
    "      status: 'complete',",
    '    },',
    '  ],',
    '};',
  ].join('\n');
}
