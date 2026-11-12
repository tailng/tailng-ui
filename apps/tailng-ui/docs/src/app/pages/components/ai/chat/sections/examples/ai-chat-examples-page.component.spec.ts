import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { aiChatLiveDemoCodeTabs } from './live-chat-demo/ai-chat-live-demo-code.generated';

const examplesDirectory = resolve(
  process.cwd(),
  'apps/tailng-ui/docs/src/app/pages/components/ai/chat/sections/examples',
);

function source(relativePath: string): string {
  return readFileSync(resolve(examplesDirectory, relativePath), 'utf8');
}

describe('AI Chat working example documentation', () => {
  it('AI-DEMO-DOCS-001 wraps the live demo in the standard source panel', () => {
    const template = source('ai-chat-examples-page.component.html');
    const panelStart = template.indexOf('<app-docs-example-panel');
    const demoStart = template.indexOf('<app-ai-chat-live-demo');
    const panelEnd = template.indexOf('</app-docs-example-panel>');

    expect(panelStart).toBeGreaterThanOrEqual(0);
    expect(demoStart).toBeGreaterThan(panelStart);
    expect(panelEnd).toBeGreaterThan(demoStart);
    expect(template).toContain('[codeTabs]="liveDemoCodeTabs"');
  });

  it('AI-DEMO-DOCS-002 displays the exact TS, HTML, and CSS used by the live demo', () => {
    const component = source('ai-chat-examples-page.component.ts');
    const expectedSources = new Map([
      ['ts', source('live-chat-demo/ai-chat-live-demo.component.ts')],
      ['html', source('live-chat-demo/ai-chat-live-demo.component.html')],
      ['css', source('live-chat-demo/ai-chat-live-demo.component.css')],
    ]);

    expect(aiChatLiveDemoCodeTabs.map((tab) => tab.value)).toEqual(['ts', 'html', 'css']);
    for (const tab of aiChatLiveDemoCodeTabs) {
      expect(tab.code).toBe(expectedSources.get(tab.value));
    }
    expect(component).toContain('aiChatLiveDemoCodeTabs');
  });

  it('AI-DEMO-DOCS-003 keeps the running example in its own three component files', () => {
    const component = source('live-chat-demo/ai-chat-live-demo.component.ts');
    const template = source('live-chat-demo/ai-chat-live-demo.component.html');
    const styles = source('live-chat-demo/ai-chat-live-demo.component.css');

    expect(component).toContain("templateUrl: './ai-chat-live-demo.component.html'");
    expect(component).toContain("styleUrl: './ai-chat-live-demo.component.css'");
    expect(component).not.toContain('ComponentAssistantComponent');
    expect(template).toContain('class="component-assistant__transcript"');
    expect(styles).toContain('.component-assistant__composer');
  });
});
