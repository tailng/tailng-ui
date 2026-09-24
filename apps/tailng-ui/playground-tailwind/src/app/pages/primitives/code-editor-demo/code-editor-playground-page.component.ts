import { Component, signal } from '@angular/core';
import {
  createTngCodeHighlighterAdapter,
  escapeTngCodeHtml,
  resolveTngCodeHighlightingConfig,
  TNG_CODE_HIGHLIGHTING_CONFIG,
  TngCodeEditorComponent,
} from '@tailng-ui/components';

const demoAdapter = createTngCodeHighlighterAdapter('demo', (input) => ({
  html: escapeTngCodeHtml(input.code).replace(
    /\b(const|return|export|function)\b/gu,
    '<span class="font-semibold text-violet-500">$1</span>',
  ),
  kind: 'html',
}));

@Component({
  selector: 'app-code-editor-playground-page',
  imports: [TngCodeEditorComponent],
  providers: [
    {
      provide: TNG_CODE_HIGHLIGHTING_CONFIG,
      useValue: resolveTngCodeHighlightingConfig({
        adapters: [demoAdapter],
        defaultAdapter: 'demo',
      }),
    },
  ],
  templateUrl: './code-editor-playground-page.component.html',
})
export class CodeEditorPlaygroundPageComponent {
  protected readonly source = signal(
    ['export function answer(): number {', '  const value = 42;', '  return value;', '}'].join(
      '\n',
    ),
  );
}
