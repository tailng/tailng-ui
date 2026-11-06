import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngButtonComponent,
  TngCommandPaletteComponent,
  type TngCommandPaletteOptionSelect,
} from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import {
  COMMAND_PALETTE_DEVICES,
  filterCommandPaletteDevices,
  type CommandPaletteDevice,
} from '../../command-palette.util';

@Component({
  selector: 'app-command-palette-examples-page',
  imports: [
    TngButtonComponent,
    TngCommandPaletteComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './command-palette-examples-page.component.html',
  styleUrl: './command-palette-examples-page.component.css',
})
export class CommandPaletteExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly defaultOpen = signal(false);
  protected readonly defaultQuery = signal('');
  protected readonly defaultSelected = signal<CommandPaletteDevice | null>(null);
  protected readonly defaultResults = computed(() =>
    filterCommandPaletteDevices(COMMAND_PALETTE_DEVICES, this.defaultQuery()),
  );

  protected readonly tailwindOpen = signal(false);
  protected readonly tailwindQuery = signal('');
  protected readonly tailwindSelected = signal<CommandPaletteDevice | null>(null);
  protected readonly tailwindResults = computed(() =>
    filterCommandPaletteDevices(COMMAND_PALETTE_DEVICES, this.tailwindQuery()),
  );

  protected readonly customOpen = signal(false);
  protected readonly customQuery = signal('');
  protected readonly customSelected = signal<CommandPaletteDevice | null>(null);
  protected readonly customResults = computed(() =>
    filterCommandPaletteDevices(COMMAND_PALETTE_DEVICES, this.customQuery()),
  );

  protected readonly tailwindCustomOpen = signal(false);
  protected readonly tailwindCustomQuery = signal('');
  protected readonly tailwindCustomSelected = signal<CommandPaletteDevice | null>(null);
  protected readonly tailwindCustomResults = computed(() =>
    filterCommandPaletteDevices(COMMAND_PALETTE_DEVICES, this.tailwindCustomQuery()),
  );

  protected readonly getDeviceValue = (device: CommandPaletteDevice): string => device.id;
  protected readonly getDeviceLabel = (device: CommandPaletteDevice): string => device.label;
  protected readonly getDeviceDescription = (device: CommandPaletteDevice): string =>
    device.description;

  protected readonly defaultTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'command-palette-default.component.ts',
      code: [
        "import { Component, computed, signal } from '@angular/core';",
        "import { TngCommandPaletteComponent } from '@tailng-ui/components';",
        '',
        "const DEVICES = [{ value: 'router', label: 'Router', description: 'Network gateway' }];",
        'const filterDevices = (query: string) => DEVICES.filter((device) => device.label.toLowerCase().includes(query.toLowerCase()));',
        '',
        '@Component({',
        "  selector: 'app-command-palette-default',",
        '  standalone: true,',
        '  imports: [TngCommandPaletteComponent],',
        "  templateUrl: './command-palette-default.component.html',",
        '})',
        'export class CommandPaletteDefaultComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly query = signal('');",
        '  protected readonly options = computed(() => filterDevices(this.query()));',
        '  protected selectDevice(_event: unknown): void {}',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'command-palette-default.component.html',
      code: [
        '<button type="button" (click)="open.set(true)">Search devices</button>',
        '<tng-command-palette',
        '  [open]="open()"',
        '  [query]="query()"',
        '  [options]="options()"',
        '  placeholder="Search devices..."',
        '  (openChange)="open.set($event)"',
        '  (queryChange)="query.set($event)"',
        '  (optionSelect)="selectDevice($event)"',
        '/>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'command-palette-default.component.css',
      code: [
        '.command-palette-example-overlay {',
        '  --tng-z-overlay: 1200;', // Keeps the overlay above sticky docs headers.
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'command-palette-tailwind.component.ts',
      code: [
        "import { Component, computed, signal } from '@angular/core';",
        "import { TngButtonComponent, TngCommandPaletteComponent } from '@tailng-ui/components';",
        '',
        "const DEVICES = [{ value: 'router', label: 'Router', description: 'Network gateway' }];",
        'const filterDevices = (query: string) => DEVICES.filter((device) => device.label.toLowerCase().includes(query.toLowerCase()));',
        '',
        '@Component({',
        "  selector: 'app-command-palette-tailwind',",
        '  standalone: true,',
        '  imports: [TngButtonComponent, TngCommandPaletteComponent],',
        "  templateUrl: './command-palette-tailwind.component.html',",
        "  styleUrl: './command-palette-tailwind.component.css',",
        '})',
        'export class CommandPaletteTailwindComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly query = signal('');",
        '  protected readonly selected = signal<string | null>(null);',
        '  protected readonly options = computed(() => filterDevices(this.query()));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'command-palette-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="flex flex-wrap items-center gap-3">',
        '    <tng-button type="button" appearance="solid" tone="primary" (click)="open.set(true)">',
        '      Open palette',
        '    </tng-button>',
        '    @if (selected(); as value) {',
        '      <p class="text-sm text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ value }}</p>',
        '    }',
        '  </div>',
        '</div>',
        '',
        '<tng-command-palette',
        '  class="command-palette-example-overlay"',
        '  [open]="open()"',
        '  [query]="query()"',
        '  [options]="options()"',
        '  placeholder="Search devices..."',
        '  (openChange)="open.set($event)"',
        '  (queryChange)="query.set($event)"',
        '  (optionSelect)="selected.set($event.option.label)"',
        '/>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'command-palette-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly customTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'command-palette-custom.component.ts',
      code: [
        "import { Component, computed, signal } from '@angular/core';",
        "import { TngCommandPaletteComponent, type TngCommandPaletteOptionSelect } from '@tailng-ui/components';",
        '',
        'type Device = {',
        '  id: string;',
        '  label: string;',
        '  description: string;',
        '  status: string;',
        '};',
        '',
        "const DEVICES: readonly Device[] = [{ id: 'router', label: 'Router', description: 'Network gateway', status: 'Online' }];",
        'const filterDevices = (devices: readonly Device[], query: string) => devices.filter((device) => device.label.toLowerCase().includes(query.toLowerCase()));',
        '',
        '@Component({',
        "  selector: 'app-command-palette-custom',",
        '  standalone: true,',
        '  imports: [TngCommandPaletteComponent],',
        "  templateUrl: './command-palette-custom.component.html',",
        "  styleUrl: './command-palette-custom.component.css',",
        '})',
        'export class CommandPaletteCustomComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly query = signal('');",
        '  protected readonly selected = signal<Device | null>(null);',
        '',
        '  protected readonly options = computed(() => filterDevices(DEVICES, this.query()));',
        '',
        '  protected readonly getOptionValue = (device: Device): string => device.id;',
        '  protected readonly getOptionLabel = (device: Device): string => device.label;',
        '  protected readonly getOptionDescription = (device: Device): string => device.description;',
        '',
        '  protected onSelect(event: TngCommandPaletteOptionSelect<Device, unknown>): void {',
        '    this.selected.set(event.option);',
        '  }',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'command-palette-custom.component.html',
      code: [
        '<tng-command-palette [open]="open()" [query]="query()" [options]="options()">',
        '  <ng-template #tngCommandPaletteInputPrefixTpl>',
        '    <span aria-hidden="true">⌘K</span>',
        '  </ng-template>',
        '',
        '  <ng-template #tngCommandPaletteOptionTpl let-item>',
        '    <span class="device-row">',
        '      <strong>{{ item.label }}</strong>',
        '      <span>{{ item.status }}</span>',
        '    </span>',
        '  </ng-template>',
        '',
        '  <ng-template #tngCommandPaletteFooterTpl>',
        '    Arrows move · Enter opens · Esc closes',
        '  </ng-template>',
        '</tng-command-palette>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'command-palette-custom.component.css',
      code: [
        '.device-row {',
        '  display: flex;',
        '  justify-content: space-between;',
        '  gap: 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCustomTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'command-palette-custom-tailwind.component.ts',
      code: [
        "import { Component, computed, signal } from '@angular/core';",
        "import { TngButtonComponent, TngCommandPaletteComponent, type TngCommandPaletteOptionSelect } from '@tailng-ui/components';",
        '',
        'type Device = {',
        '  id: string;',
        '  label: string;',
        '  description: string;',
        '  status: string;',
        '};',
        '',
        "const DEVICES: readonly Device[] = [{ id: 'router', label: 'Router', description: 'Network gateway', status: 'Online' }];",
        'const filterDevices = (devices: readonly Device[], query: string) => devices.filter((device) => device.label.toLowerCase().includes(query.toLowerCase()));',
        '',
        '@Component({',
        "  selector: 'app-command-palette-custom-tailwind',",
        '  standalone: true,',
        '  imports: [TngButtonComponent, TngCommandPaletteComponent],',
        "  templateUrl: './command-palette-custom-tailwind.component.html',",
        "  styleUrl: './command-palette-custom-tailwind.component.css',",
        '})',
        'export class CommandPaletteCustomTailwindComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly query = signal('');",
        '  protected readonly selected = signal<Device | null>(null);',
        '',
        '  protected readonly options = computed(() => filterDevices(DEVICES, this.query()));',
        '',
        '  protected readonly getOptionValue = (device: Device): string => device.id;',
        '  protected readonly getOptionLabel = (device: Device): string => device.label;',
        '  protected readonly getOptionDescription = (device: Device): string => device.description;',
        '',
        '  protected onSelect(event: TngCommandPaletteOptionSelect<Device, unknown>): void {',
        '    this.selected.set(event.option);',
        '  }',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'command-palette-custom-tailwind.component.html',
      code: [
        '<tng-command-palette [open]="open()" [query]="query()" [options]="options()">',
        '  <ng-template #tngCommandPaletteInputPrefixTpl>',
        '    <span class="rounded border border-[var(--tng-semantic-border-subtle)] px-1 py-0.5 text-[0.72rem] font-bold text-[var(--tng-semantic-foreground-secondary)]">',
        '      ⌘K',
        '    </span>',
        '  </ng-template>',
        '',
        '  <ng-template #tngCommandPaletteOptionTpl let-item>',
        '    <span class="flex min-w-0 items-center justify-between gap-4">',
        '      <span class="min-w-0">',
        '        <strong class="block truncate">{{ item.label }}</strong>',
        '        <small class="mt-0.25 block text-[var(--tng-semantic-foreground-secondary)]">{{ item.description }}</small>',
        '      </span>',
        '      <span class="shrink-0 rounded-full border border-[var(--tng-semantic-border-subtle)] px-2 py-0.5 text-xs text-[var(--tng-semantic-foreground-secondary)]">',
        '        {{ item.status }}',
        '      </span>',
        '    </span>',
        '  </ng-template>',
        '',
        '  <ng-template #tngCommandPaletteFooterTpl>',
        '    <span class="text-[var(--tng-semantic-foreground-muted)]">',
        '      Arrows move · Enter opens · Esc closes',
        '    </span>',
        '  </ng-template>',
        '</tng-command-palette>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'command-palette-custom-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onDefaultSelect(
    event: TngCommandPaletteOptionSelect<CommandPaletteDevice, unknown>,
  ): void {
    this.defaultSelected.set(event.option);
  }

  protected onTailwindSelect(
    event: TngCommandPaletteOptionSelect<CommandPaletteDevice, unknown>,
  ): void {
    this.tailwindSelected.set(event.option);
  }

  protected onCustomSelect(
    event: TngCommandPaletteOptionSelect<CommandPaletteDevice, unknown>,
  ): void {
    this.customSelected.set(event.option);
  }

  protected onTailwindCustomSelect(
    event: TngCommandPaletteOptionSelect<CommandPaletteDevice, unknown>,
  ): void {
    this.tailwindCustomSelected.set(event.option);
  }
}
