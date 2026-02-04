import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tociva/tailng-ui/table';
import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = { property: string; type: string; default?: string; description: string };

@Component({
  standalone: true,
  selector: 'docs-snackbar-api',
  templateUrl: './snackbar-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class SnackbarApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () =>
    `import { TngSnackbarHost, TngSnackbarItem, TngSnackbarIntent } from '@tociva/tailng-ui/overlay';`;

  private readonly inputSeed: DisplayDetails[] = [
    { property: 'items', type: 'TngSnackbarItem[]', default: '[]', description: 'Controlled list of snackbar items' },
    { property: 'position', type: 'TngSnackbarPosition', default: "'bottom-center'", description: 'top-left | top-center | top-right | bottom-left | bottom-center | bottom-right' },
    { property: 'max', type: 'number', default: '3', description: 'Max number of items shown at once' },
  ];
  private readonly outputSeed: DisplayDetails[] = [
    { property: 'dismiss', type: '{ id: string; reason: "timeout" | "dismiss" | "action" }', description: 'Emitted when an item is removed (timeout, dismiss button, or action button)' },
  ];
  private readonly itemSeed: DisplayDetails[] = [
    { property: 'id', type: 'string', description: 'Unique id for the item' },
    { property: 'message', type: 'string', description: 'Message text' },
    { property: 'intent', type: 'TngSnackbarIntent', description: 'default | success | info | warning | error' },
    { property: 'actionLabel', type: 'string', description: 'Optional action button label' },
    { property: 'durationMs', type: 'number', description: 'Auto-dismiss delay (ms); 0 or undefined = no auto-dismiss' },
  ];
  private readonly klassSeed: DisplayDetails[] = [
    { property: 'hostKlass', type: 'string', default: "'fixed z-[1100] flex flex-col gap-2 p-4'", description: 'Host container (position added by component)' },
    { property: 'itemKlass', type: 'string', default: "'pointer-events-auto w-[min(28rem,...)] rounded-md border...'", description: 'Each snackbar item' },
    { property: 'itemInnerKlass', type: 'string', default: "'flex items-start gap-3 px-4 py-3'", description: 'Inner content row' },
    { property: 'messageKlass', type: 'string', default: "'text-sm text-foreground'", description: 'Message text' },
    { property: 'actionKlass', type: 'string', default: "'text-sm font-medium text-primary hover:underline'", description: 'Action button' },
    { property: 'dismissBtnKlass', type: 'string', default: "'text-muted-foreground hover:text-foreground'", description: 'Dismiss (×) button' },
    { property: 'intentKlass', type: '(intent: TngSnackbarIntent) => string', default: '(function)', description: 'Returns extra class per intent (e.g. border color)' },
  ];

  readonly inputRows = signal<DisplayDetails[]>(this.inputSeed);
  readonly outputRows = signal<DisplayDetails[]>(this.outputSeed);
  readonly itemRows = signal<DisplayDetails[]>(this.itemSeed);
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
