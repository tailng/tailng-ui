import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const componentDirectory = join(
  process.cwd(),
  'apps/tailng-ui/docs/src/app/shared/component-section-tabs',
);
const template = readFileSync(
  join(componentDirectory, 'docs-component-section-tabs.component.html'),
  'utf8',
);
const componentStyles = readFileSync(
  join(componentDirectory, 'docs-component-section-tabs.component.css'),
  'utf8',
);
const docsStyles = readFileSync(join(process.cwd(), 'apps/tailng-ui/docs/src/styles.css'), 'utf8');

describe('docs component section tabs', () => {
  it('keeps documentation sections as navigable anchor links', () => {
    expect(template).toContain('<a');
    expect(template).toContain('tngTab');
    expect(template).toContain('[routerLink]="tabHrefs()[tab.value]"');
    expect(template).toContain('docs-component-tab-trigger');
  });

  it('preserves the lightweight documentation navigation treatment', () => {
    expect(componentStyles).toContain('.docs-component-tab-list');
    expect(componentStyles).toContain('.docs-component-tab-scroll-btn');
    expect(docsStyles).toContain(".docs-component-tabs [data-slot='tab']");
    expect(docsStyles).toContain('border-bottom: 3px solid transparent');
    expect(docsStyles).toContain(".docs-component-tabs [data-slot='tab'][data-selected='true']");
    expect(docsStyles).toContain('border-bottom-color: var(--tng-semantic-accent-brand)');
  });
});
