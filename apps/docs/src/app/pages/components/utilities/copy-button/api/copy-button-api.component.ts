import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tailng-ui/ui/table';
import { TngCodeBlock } from '@tailng-ui/ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = { property: string; type: string; default?: string; description: string };

@Component({
  standalone: true,
  selector: 'docs-copy-button-api',
  templateUrl: './copy-button-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class CopyButtonApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () =>
    `import { TngCopyButton } from '@tailng-ui/ui/utilities';`;

  private readonly inputSeed: DisplayDetails[] = [
    { property: 'text', type: 'string', description: 'Text to copy to clipboard (required)' },
    { property: 'variant', type: "'ghost' | 'outline' | 'solid'", default: "'ghost'", description: 'Visual variant' },
    { property: 'size', type: "'sm' | 'md'", default: "'sm'", description: 'Button size' },
    { property: 'resetAfterMs', type: 'number', default: '1500', description: 'How long to show "copied" state (ms)' },
    { property: 'rootKlass', type: 'string', default: "''", description: 'Override/extend button classes (merged with default)' },
    { property: 'contentWrapKlass', type: 'string', default: "''", description: 'Override/extend content wrapper span classes' },
  ];
  private readonly klassSeed: DisplayDetails[] = [
    { property: 'rootKlass', type: 'string', default: "''", description: 'Merged into finalRootKlass (button)' },
    { property: 'contentWrapKlass', type: 'string', default: "''", description: 'Merged into finalContentWrapKlass (inner span)' },
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
