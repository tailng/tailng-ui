import { AfterViewInit, Component, computed, inject, signal } from '@angular/core';
import { TngCodeBlock } from '@tailng-ui/ui/utilities';
import { TngTable, TngCol } from '@tailng-ui/ui/table';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type displayDetails = {
  property: string;
  type: string;
  default?: string;
  description: string;
};

@Component({
  standalone: true,
  selector: 'docs-chips-api',
  templateUrl: './chips-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol, TngTag],
})
export class ChipsApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = computed(() => `import { TngChips } from '@tailng-ui/ui/form';`);

  private readonly seed: displayDetails[] = [
    { property: 'value', type: 'T[]', default: '[]', description: 'Initial value (when not using CVA)' },
    { property: 'options', type: 'T[]', default: '[]', description: 'Options shown in dropdown' },
    { property: 'placeholder', type: 'string', default: "'Add…'", description: 'Input placeholder when empty' },
    { property: 'displayWith', type: '(item: T) => string', default: '(v) => String(v)', description: 'String for chip and list display' },
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { property: 'allowFreeText', type: 'boolean', default: 'true', description: 'Allow adding raw input on Enter' },
    { property: 'parse', type: '(raw: string) => T', default: '(raw) => raw as T', description: 'Convert free-text to T' },
    { property: 'preventDuplicates', type: 'boolean', default: 'true', description: 'Prevent duplicate chips (by display string)' },
    { property: 'search', type: 'OutputEventEmitter<string>', default: '—', description: 'Emits input text for filtering/fetch' },
    { property: 'valueChange', type: 'OutputEventEmitter<T[]>', default: '—', description: 'Emits new value array' },
    { property: 'chipAdded', type: 'OutputEventEmitter<T>', default: '—', description: 'Emits when a chip is added' },
    { property: 'chipRemoved', type: 'OutputEventEmitter<T>', default: '—', description: 'Emits when a chip is removed' },
    { property: 'closed', type: 'OutputEventEmitter<ChipsCloseReason>', default: '—', description: 'Emits when overlay closes' },
    { property: 'rootKlass', type: 'string', default: "'relative'", description: 'Root wrapper' },
    { property: 'containerKlass', type: 'string', default: '(see source)', description: 'Chips + input container' },
    { property: 'chipKlass', type: 'string', default: '(see source)', description: 'Each chip wrapper' },
    { property: 'chipLabelKlass', type: 'string', default: "'truncate max-w-[200px]'", description: 'Chip label' },
    { property: 'removeButtonKlass', type: 'string', default: "'ml-1 text-disable hover:text-fg'", description: 'Remove button' },
    { property: 'inputKlass', type: 'string', default: "'flex-1 min-w-[140px]...'", description: 'Text input' },
  ];

  readonly inputRows = signal<displayDetails[]>(this.seed.filter((p) =>
    ['value', 'options', 'placeholder', 'displayWith', 'disabled', 'allowFreeText', 'parse', 'preventDuplicates'].includes(p.property)
  ));
  readonly outputRows = signal<displayDetails[]>(this.seed.filter((p) =>
    ['search', 'valueChange', 'chipAdded', 'chipRemoved', 'closed'].includes(p.property)
  ));
  readonly klassRows = signal<displayDetails[]>(this.seed.filter((p) =>
    ['rootKlass', 'containerKlass', 'chipKlass', 'chipLabelKlass', 'removeButtonKlass', 'inputKlass'].includes(p.property)
  ));

  readonly property = (r: displayDetails) => r.property;
  readonly type = (r: displayDetails) => r.type;
  readonly default = (r: displayDetails) => r.default;
  readonly description = (r: displayDetails) => r.description;

  ngAfterViewInit() {
    const sections = document.querySelectorAll('section[id]');
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
