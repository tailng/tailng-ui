import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tailng-ui/ui/table';
import { TngCodeBlock } from '@tailng-ui/ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = {
  property: string;
  type: string;
  default?: string;
  description: string;
};

@Component({
  standalone: true,
  selector: 'docs-code-block-api',
  templateUrl: './code-block-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class CodeBlockApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngCodeBlock } from '@tailng-ui/ui/utilities';`;

  private readonly inputSeed: DisplayDetails[] = [
    { property: 'content', type: 'string | null', default: 'null', description: 'Code string (or use projected text)' },
    { property: 'language', type: 'TngCodeLanguage', default: "'text'", description: 'Language for highlighting' },
    { property: 'showLineNumbers', type: 'boolean', default: 'false', description: 'Show line numbers' },
    { property: 'wrap', type: 'boolean', default: 'false', description: 'Wrap long lines' },
    { property: 'highlighter', type: 'TngCodeHighlighter | null', default: 'null', description: 'Optional highlighter (e.g. Shiki)' },
    { property: 'showCopy', type: 'boolean', default: 'true', description: 'Show copy button' },
    { property: 'copyVariant', type: "'ghost' | 'outline' | 'solid'", default: "'ghost'", description: 'Copy button variant' },
    { property: 'copySize', type: "'sm' | 'md'", default: "'sm'", description: 'Copy button size' },
    { property: 'copyResetMs', type: 'number', default: '1500', description: 'Ms before reverting copied state' },
    { property: 'copyWrapperKlass', type: 'string', default: "'absolute top-2 right-2'", description: 'Wrapper for copy button' },
  ];

  private readonly klassSeed: DisplayDetails[] = [
    { property: 'rootKlass', type: 'string', default: "''", description: 'Root wrapper' },
    { property: 'bodyKlass', type: 'string', default: "''", description: 'Body container' },
    { property: 'gutterKlass', type: 'string', default: "''", description: 'Line numbers gutter' },
    { property: 'preKlass', type: 'string', default: "''", description: 'pre element' },
    { property: 'codeKlass', type: 'string', default: "''", description: 'code element' },
  ];

  readonly inputRows = signal<DisplayDetails[]>(this.inputSeed);
  readonly klassRows = signal<DisplayDetails[]>(this.klassSeed);

  readonly property = (r: DisplayDetails) => r.property;
  readonly type = (r: DisplayDetails) => r.type;
  readonly default = (r: DisplayDetails) => r.default ?? '—';
  readonly description = (r: DisplayDetails) => r.description;

  ngAfterViewInit() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const links = document.querySelectorAll('.scroll-link');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id');
          const link = document.querySelector(`.scroll-link[href="#${id}"]`);
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove('text-blue-500', 'font-semibold'));
            link?.classList.add('text-blue-500', 'font-semibold');
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
  }
}
