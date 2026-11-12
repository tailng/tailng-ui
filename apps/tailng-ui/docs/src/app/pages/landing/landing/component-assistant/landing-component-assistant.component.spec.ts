import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const directory = resolve(
  process.cwd(),
  'apps/tailng-ui/docs/src/app/pages/landing/landing/component-assistant',
);

function source(fileName: string): string {
  return readFileSync(resolve(directory, fileName), 'utf8');
}

describe('LandingComponentAssistantComponent ownership', () => {
  it('LANDING-AI-001 owns its component, template, and stylesheet', () => {
    const component = source('landing-component-assistant.component.ts');

    expect(component).toContain("selector: 'app-landing-component-assistant'");
    expect(component).toContain("templateUrl: './landing-component-assistant.component.html'");
    expect(component).toContain("styleUrl: './landing-component-assistant.component.css'");
    expect(component).not.toContain('AiChatLiveDemoComponent');
  });

  it('LANDING-AI-002 keeps the landing-specific compact presentation', () => {
    const template = source('landing-component-assistant.component.html');

    expect(template).toContain('data-assistant-variant="compact"');
    expect(template).toContain('[rows]="1"');
    expect(template).not.toContain('Load earlier messages');
  });
});
