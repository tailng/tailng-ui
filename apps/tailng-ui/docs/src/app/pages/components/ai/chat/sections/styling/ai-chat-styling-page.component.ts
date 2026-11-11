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
    "import { TngAiPartRegistry } from '@tailng-ui/ai';",
    '',
    'const renderers = new TngAiPartRegistry<string>();',
    "renderers.registerExtension('acme/release-card', (part) => {",
    "  return part.type === 'extension' ? JSON.stringify(part.value) : '';",
    '});',
  ].join('\n');
  protected readonly safeMarkdownCode = [
    '// Keep transport data as text until it passes your rendering policy.',
    'const html = markdownToHtml(textPart.text);',
    'const safeHtml = sanitize(html);',
    '// Bind only safeHtml in the presentation layer.',
  ].join('\n');
}
