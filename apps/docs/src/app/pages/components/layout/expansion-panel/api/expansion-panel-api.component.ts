import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tociva/tailng-ui/table';
import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = { property: string; type: string; default?: string; description: string };

@Component({
  standalone: true,
  selector: 'docs-expansion-panel-api',
  templateUrl: './expansion-panel-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class ExpansionPanelApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () =>
    `import { TngExpansionPanel, TngExpansionIconOpen, TngExpansionIconClose } from '@tociva/tailng-ui/layout';`;

  private readonly inputSeed: DisplayDetails[] = [
    { property: 'open', type: 'boolean', default: 'false', description: 'Controlled open state' },
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disables toggling' },
    { property: 'padded', type: 'boolean', default: 'true', description: 'Apply content padding' },
  ];
  private readonly outputSeed: DisplayDetails[] = [
    { property: 'openChange', type: 'EventEmitter<boolean>', description: 'Emitted when open state toggles' },
  ];
  private readonly contentSeed: DisplayDetails[] = [
    { property: 'tngExpansionTitle', type: '', description: 'Project title (header) content' },
    { property: 'tngExpansionContent', type: '', description: 'Project body (expandable) content' },
    { property: 'tngExpansionIconOpen', type: '', description: 'Optional icon when panel is open (directive)' },
    { property: 'tngExpansionIconClose', type: '', description: 'Optional icon when panel is closed (directive)' },
  ];
  private readonly klassSeed: DisplayDetails[] = [
    { property: 'rootKlass', type: 'string', default: "'rounded-lg border border-border bg-bg'", description: 'Root wrapper' },
    { property: 'headerKlass', type: 'string', default: '(header button styles)', description: 'Header button' },
    { property: 'titleKlass', type: 'string', default: "'flex-1'", description: 'Title container' },
    { property: 'iconWrapperKlass', type: 'string', default: "'ml-2 shrink-0 inline-flex...'", description: 'Icon wrapper' },
    { property: 'chevronKlass', type: 'string', default: "'h-4 w-4 shrink-0 transition...'", description: 'Default chevron' },
    { property: 'contentOuterKlass', type: 'string', default: "'grid transition-[grid-template-rows]...'", description: 'Content outer grid' },
    { property: 'contentClipKlass', type: 'string', default: "'overflow-hidden'", description: 'Content clip' },
    { property: 'contentBodyKlass', type: 'string', default: "'text-sm text-muted-foreground'", description: 'Content body (+ padding if padded)' },
    { property: 'contentPaddingKlass', type: 'string', default: "'px-4 pb-4 pt-2'", description: 'Content padding (when padded)' },
  ];

  readonly inputRows = signal<DisplayDetails[]>(this.inputSeed);
  readonly outputRows = signal<DisplayDetails[]>(this.outputSeed);
  readonly contentRows = signal<DisplayDetails[]>(this.contentSeed);
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
