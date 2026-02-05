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
  selector: 'docs-file-upload-api',
  templateUrl: './file-upload-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class FileUploadApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngFileUpload } from '@tailng-ui/ui/form';`;

  private readonly seed: DisplayDetails[] = [
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { property: 'accept', type: 'string', default: "''", description: 'Accept attribute (e.g. "image/*", ".pdf")' },
    { property: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple files' },
    { property: 'title', type: 'string', default: "'Upload files'", description: 'Dropzone title' },
    { property: 'subtitle', type: 'string', default: "'Drag & drop here or click to browse'", description: 'Dropzone subtitle' },
    { property: 'valueChange', type: 'OutputEventEmitter<File[] | null>', default: '—', description: 'Emits when files change' },
    { property: 'rootKlass', type: 'string', default: "'w-full'", description: 'Root wrapper classes' },
    { property: 'dropzoneKlass', type: 'string', default: "''", description: 'Dropzone box classes' },
    { property: 'titleKlass', type: 'string', default: "'text-sm font-medium text-fg'", description: 'Title text classes' },
    { property: 'subtitleKlass', type: 'string', default: "'text-xs text-disable'", description: 'Subtitle text classes' },
    { property: 'hintKlass', type: 'string', default: "'text-xs text-disable'", description: 'Hint text classes' },
    { property: 'fileListKlass', type: 'string', default: "'mt-2 space-y-1'", description: 'File list container classes' },
    { property: 'fileItemKlass', type: 'string', default: '…', description: 'Single file row classes' },
    { property: 'clearButtonKlass', type: 'string', default: '…', description: 'Clear button classes' },
  ];

  readonly configRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['disabled', 'accept', 'multiple', 'title', 'subtitle'].includes(p.property)));
  readonly outputRows = signal<DisplayDetails[]>(this.seed.filter((p) => p.property === 'valueChange'));
  readonly klassRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['rootKlass', 'dropzoneKlass', 'titleKlass', 'subtitleKlass', 'hintKlass', 'fileListKlass', 'fileItemKlass', 'clearButtonKlass'].includes(p.property)));

  readonly property = (r: DisplayDetails) => r.property;
  readonly type = (r: DisplayDetails) => r.type;
  readonly default = (r: DisplayDetails) => r.default;
  readonly description = (r: DisplayDetails) => r.description;

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
