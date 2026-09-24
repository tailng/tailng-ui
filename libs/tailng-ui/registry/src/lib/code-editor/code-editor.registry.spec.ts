import { describe, expect, it } from 'vitest';
import { codeEditorRegistryItem } from './code-editor.registry';

describe('code-editor registry item', () => {
  it('contains expected metadata', () => {
    expect(codeEditorRegistryItem.name).toBe('code-editor');
    expect(codeEditorRegistryItem.dependencies).toEqual([]);
    expect(codeEditorRegistryItem.files).toHaveLength(5);
    expect(codeEditorRegistryItem.install.importPath).toBe('./tailng-ui/code-editor');
  });

  it('generates local editor and highlighting source without bundling Shiki', () => {
    const component = codeEditorRegistryItem.files.find((file) =>
      file.path.endsWith('tng-code-editor.ts'),
    );
    const highlighting = codeEditorRegistryItem.files.find((file) =>
      file.path.endsWith('tng-code-highlighting.ts'),
    );
    const index = codeEditorRegistryItem.files.find((file) => file.path.endsWith('index.ts'));

    expect(component?.content).toContain('export class TngCodeEditor');
    expect(component?.content).toContain('requestId === this.requestId');
    expect(highlighting?.content).toContain('createTngCodeHighlighterAdapter');
    expect(index?.content).toContain("export * from './tng-code-editor';");
    expect(codeEditorRegistryItem.files.map((file) => file.content).join('\n')).not.toContain(
      "from 'shiki",
    );
  });
});
