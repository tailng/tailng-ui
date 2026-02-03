import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tociva/tailng-ui/table';
import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
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
  selector: 'docs-dialog-api',
  templateUrl: './dialog-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class DialogApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () =>
    `import { TngDialog, TngDialogCloseReason } from '@tociva/tailng-ui/overlay';`;

  private readonly inputSeed: DisplayDetails[] = [
    { property: 'open', type: 'boolean', default: 'false', description: 'Controlled open state' },
    { property: 'closeOnBackdropClick', type: 'boolean', default: 'true', description: 'Close when backdrop is clicked' },
    { property: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close on Escape key' },
    { property: 'ariaLabel', type: 'string', default: "'Dialog'", description: 'Accessible label for the dialog' },
    { property: 'trapFocus', type: 'boolean', default: 'true', description: 'Trap focus inside dialog' },
    { property: 'restoreFocus', type: 'boolean', default: 'true', description: 'Restore focus on close' },
    { property: 'autoCapture', type: 'boolean', default: 'true', description: 'Auto-capture tabbable elements' },
    { property: 'deferCaptureElements', type: 'boolean', default: 'false', description: 'Defer capturing tabbables' },
    { property: 'autoFocusPanelWhenEmpty', type: 'boolean', default: 'true', description: 'Focus panel when no tabbables' },
  ];

  private readonly outputSeed: DisplayDetails[] = [
    { property: 'closed', type: 'TngDialogCloseReason', default: '', description: 'Emitted when dialog closes (confirm | cancel | escape | outside-click | programmatic)' },
    { property: 'opened', type: 'void', default: '', description: 'Emitted when dialog has opened' },
  ];

  private readonly klassSeed: DisplayDetails[] = [
    { property: 'backdropKlass', type: 'string', default: "'fixed inset-0 bg-black/40'", description: 'Backdrop overlay' },
    { property: 'panelKlass', type: 'string', default: 'centered panel…', description: 'Dialog panel (position, size, border, shadow)' },
    { property: 'headerWrapKlass', type: 'string', default: "'border-b border-border px-4 py-3'", description: 'Header wrapper' },
    { property: 'bodyWrapKlass', type: 'string', default: "'px-4 py-4'", description: 'Body wrapper' },
    { property: 'footerWrapKlass', type: 'string', default: "'border-t border-border px-4 py-3'", description: 'Footer wrapper' },
  ];

  readonly inputRows = signal<DisplayDetails[]>(this.inputSeed);
  readonly outputRows = signal<DisplayDetails[]>(this.outputSeed);
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
