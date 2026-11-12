import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const template = readFileSync(
  resolve(
    process.cwd(),
    'apps/tailng-ui/docs/src/app/pages/landing/landing/landing-page.component.html',
  ),
  'utf8',
);

describe('LandingPageComponent component assistant surface', () => {
  it('places the assistant after the hero and before the component gallery', () => {
    const heroIndex = template.indexOf('id="home"');
    const assistantIndex = template.indexOf('id="component-assistant"');
    const galleryIndex = template.indexOf('id="components"');

    expect(heroIndex).toBeGreaterThanOrEqual(0);
    expect(assistantIndex).toBeGreaterThan(heroIndex);
    expect(galleryIndex).toBeGreaterThan(assistantIndex);
  });

  it('keeps discoverable copy and the examples CTA outside deferred content', () => {
    const sectionStart = template.indexOf('id="component-assistant"');
    const deferStart = template.indexOf('@defer', sectionStart);
    const assistantElement = template.indexOf('<app-landing-component-assistant', sectionStart);
    const heading = template.indexOf(
      'Build AI experiences with real TailNG components',
      sectionStart,
    );
    const examplesRoute = template.indexOf(
      'routerLink="/components/ai/chat/examples"',
      sectionStart,
    );

    expect(heading).toBeGreaterThan(sectionStart);
    expect(heading).toBeLessThan(deferStart);
    expect(template.indexOf('deterministic simulation', sectionStart)).toBeLessThan(deferStart);
    expect(examplesRoute).toBeGreaterThan(sectionStart);
    expect(examplesRoute).toBeLessThan(deferStart);
    expect(assistantElement).toBeGreaterThan(deferStart);
  });

  it('defers the landing-owned compact assistant with a stable placeholder', () => {
    expect(template).toContain('@defer (on viewport; prefetch on idle)');
    expect(template).toContain('<app-landing-component-assistant />');
    expect(template).toContain('class="component-assistant-loading"');
  });
});
