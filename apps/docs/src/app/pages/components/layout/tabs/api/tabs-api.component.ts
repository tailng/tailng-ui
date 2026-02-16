import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tailng-ui/ui/table';
import { TngCodeBlock } from '@tailng-ui/ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = { property: string; type: string; default?: string; description: string };

@Component({
  standalone: true,
  selector: 'docs-tabs-api',
  templateUrl: './tabs-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class TabsApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () =>
    `import { TngTabs, TngTab, TngTabPanel } from '@tailng-ui/ui/layout';`;

  private readonly tabsInputSeed: DisplayDetails[] = [
    { property: 'value', type: 'string | null', default: 'null', description: 'Controlled active tab value' },
    { property: 'defaultValue', type: 'string | null', default: 'null', description: 'Initial value (uncontrolled)' },
    { property: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Tab list orientation' },
  ];
  private readonly tabsOutputSeed: DisplayDetails[] = [
    { property: 'valueChange', type: 'EventEmitter<string>', description: 'Emitted when active tab changes' },
  ];
  private readonly tabsSlotSeed: DisplayDetails[] = [
    { property: 'slot', type: 'TngSlotMap<TngTabsSlot>', default: '{}', description: 'Slot-based micro styling' },
    { property: 'slot.container', type: 'string', default: "'w-full'", description: 'Root wrapper' },
    { property: 'slot.tabList', type: 'string', default: "'flex gap-2 border-b border-border'", description: 'Tab list (tablist)' },
    { property: 'slot.panelContainer', type: 'string', default: "'pt-4'", description: 'Panel container' },
  ];
  private readonly tabInputSeed: DisplayDetails[] = [
    { property: 'value', type: 'string', description: 'Unique tab value (required)' },
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disables the tab' },
  ];
  private readonly tabSlotSeed: DisplayDetails[] = [
    { property: 'slot', type: 'TngSlotMap<TngTabSlot>', default: '{}', description: 'Slot-based micro styling' },
    { property: 'slot.tab', type: 'string', default: "'px-3 py-2 text-sm font-medium border-b-2 border-transparent'", description: 'Base tab button' },
    { property: 'slot.active', type: 'string', default: "'border-primary text-primary'", description: 'Active tab' },
    { property: 'slot.inactive', type: 'string', default: "'text-muted-foreground'", description: 'Inactive tab' },
    { property: 'slot.disabled', type: 'string', default: "'opacity-50 cursor-not-allowed'", description: 'Disabled tab' },
  ];
  private readonly panelInputSeed: DisplayDetails[] = [
    { property: 'value', type: 'string', description: 'Matches a tng-tab value (required)' },
  ];

  readonly tabsInputRows = signal<DisplayDetails[]>(this.tabsInputSeed);
  readonly tabsOutputRows = signal<DisplayDetails[]>(this.tabsOutputSeed);
  readonly tabsSlotRows = signal<DisplayDetails[]>(this.tabsSlotSeed);
  readonly tabInputRows = signal<DisplayDetails[]>(this.tabInputSeed);
  readonly tabSlotRows = signal<DisplayDetails[]>(this.tabSlotSeed);
  readonly panelInputRows = signal<DisplayDetails[]>(this.panelInputSeed);
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
