import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { useAiChatDocsCodeTheme } from '../../chat-docs-code-theme';

@Component({
  selector: 'app-ai-chat-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './ai-chat-styling-page.component.html',
})
export class AiChatStylingPageComponent {
  protected readonly codeBlockTheme = useAiChatDocsCodeTheme();
  protected readonly rendererCode = [
    "import { TNG_AI_MESSAGE_PART_CONTEXT, type TngAiMessagePartRenderer } from '@tailng-ui/ai';",
    '',
    'readonly partRenderers: readonly TngAiMessagePartRenderer[] = [{',
    "  match: { type: 'extension', name: 'acme.dev/release-card' },",
    '  component: ReleaseCardPartComponent,',
    '}];',
    '',
    '// ReleaseCardPartComponent injects TNG_AI_MESSAGE_PART_CONTEXT.',
  ].join('\n');
  protected readonly safeMarkdownCode = [
    '// Keep transport data as text until it passes your rendering policy.',
    'const html = markdownToHtml(textPart.text);',
    'const safeHtml = sanitize(html);',
    '// Bind only safeHtml in the presentation layer.',
  ].join('\n');
}
