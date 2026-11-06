---
id: "components/command-palette/examples"
title: "Command Palette examples"
description: "Command Palette examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["command-palette","utility","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/command-palette/tng-command-palette.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/command-palette/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/command-palette/sections/examples/command-palette-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/command-palette/sections/examples/command-palette-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/command-palette/sections/examples/command-palette-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/command-palette/examples"
componentGroup: "utility"
symbols: ["TngCommandPaletteComponent"]
selectors: ["tng-command-palette"]
productId: "command-palette"
section: "examples"
officialCatalog: true
generated: true
---

# Command Palette examples

## Examples

Use the default renderer for simple search results, then add templates when rows need richer operational context.

### command-palette-default.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngCommandPaletteComponent } from '@tailng-ui/components';

const DEVICES = [{ value: 'router', label: 'Router', description: 'Network gateway' }];
const filterDevices = (query: string) => DEVICES.filter((device) => device.label.toLowerCase().includes(query.toLowerCase()));

@Component({
  selector: 'app-command-palette-default',
  standalone: true,
  imports: [TngCommandPaletteComponent],
  templateUrl: './command-palette-default.component.html',
})
export class CommandPaletteDefaultComponent {
  protected readonly open = signal(false);
  protected readonly query = signal('');
  protected readonly options = computed(() => filterDevices(this.query()));
  protected selectDevice(_event: unknown): void {}
}
```

### command-palette-default.component.html

```html
<button type="button" (click)="open.set(true)">Search devices</button>
<tng-command-palette
  [open]="open()"
  [query]="query()"
  [options]="options()"
  placeholder="Search devices..."
  (openChange)="open.set($event)"
  (queryChange)="query.set($event)"
  (optionSelect)="selectDevice($event)"
/>
```

### command-palette-default.component.css

```css
.command-palette-example-overlay {
  --tng-z-overlay: 1200;
}
```

### command-palette-tailwind.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngButtonComponent, TngCommandPaletteComponent } from '@tailng-ui/components';

const DEVICES = [{ value: 'router', label: 'Router', description: 'Network gateway' }];
const filterDevices = (query: string) => DEVICES.filter((device) => device.label.toLowerCase().includes(query.toLowerCase()));

@Component({
  selector: 'app-command-palette-tailwind',
  standalone: true,
  imports: [TngButtonComponent, TngCommandPaletteComponent],
  templateUrl: './command-palette-tailwind.component.html',
  styleUrl: './command-palette-tailwind.component.css',
})
export class CommandPaletteTailwindComponent {
  protected readonly open = signal(false);
  protected readonly query = signal('');
  protected readonly selected = signal<string | null>(null);
  protected readonly options = computed(() => filterDevices(this.query()));
}
```

### command-palette-tailwind.component.html

```html
<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <div class="flex flex-wrap items-center gap-3">
    <tng-button type="button" appearance="solid" tone="primary" (click)="open.set(true)">
      Open palette
    </tng-button>
    @if (selected(); as value) {
      <p class="text-sm text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ value }}</p>
    }
  </div>
</div>

<tng-command-palette
  class="command-palette-example-overlay"
  [open]="open()"
  [query]="query()"
  [options]="options()"
  placeholder="Search devices..."
  (openChange)="open.set($event)"
  (queryChange)="query.set($event)"
  (optionSelect)="selected.set($event.option.label)"
/>
```

### command-palette-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### command-palette-custom.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngCommandPaletteComponent, type TngCommandPaletteOptionSelect } from '@tailng-ui/components';

type Device = {
  id: string;
  label: string;
  description: string;
  status: string;
};

const DEVICES: readonly Device[] = [{ id: 'router', label: 'Router', description: 'Network gateway', status: 'Online' }];
const filterDevices = (devices: readonly Device[], query: string) => devices.filter((device) => device.label.toLowerCase().includes(query.toLowerCase()));

@Component({
  selector: 'app-command-palette-custom',
  standalone: true,
  imports: [TngCommandPaletteComponent],
  templateUrl: './command-palette-custom.component.html',
  styleUrl: './command-palette-custom.component.css',
})
export class CommandPaletteCustomComponent {
  protected readonly open = signal(false);
  protected readonly query = signal('');
  protected readonly selected = signal<Device | null>(null);

  protected readonly options = computed(() => filterDevices(DEVICES, this.query()));

  protected readonly getOptionValue = (device: Device): string => device.id;
  protected readonly getOptionLabel = (device: Device): string => device.label;
  protected readonly getOptionDescription = (device: Device): string => device.description;

  protected onSelect(event: TngCommandPaletteOptionSelect<Device, unknown>): void {
    this.selected.set(event.option);
  }
}
```

### command-palette-custom.component.html

```html
<tng-command-palette [open]="open()" [query]="query()" [options]="options()">
  <ng-template #tngCommandPaletteInputPrefixTpl>
    <span aria-hidden="true">⌘K</span>
  </ng-template>

  <ng-template #tngCommandPaletteOptionTpl let-item>
    <span class="device-row">
      <strong>{{ item.label }}</strong>
      <span>{{ item.status }}</span>
    </span>
  </ng-template>

  <ng-template #tngCommandPaletteFooterTpl>
    Arrows move · Enter opens · Esc closes
  </ng-template>
</tng-command-palette>
```

### command-palette-custom.component.css

```css
.device-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
```

### command-palette-custom-tailwind.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngButtonComponent, TngCommandPaletteComponent, type TngCommandPaletteOptionSelect } from '@tailng-ui/components';

type Device = {
  id: string;
  label: string;
  description: string;
  status: string;
};

const DEVICES: readonly Device[] = [{ id: 'router', label: 'Router', description: 'Network gateway', status: 'Online' }];
const filterDevices = (devices: readonly Device[], query: string) => devices.filter((device) => device.label.toLowerCase().includes(query.toLowerCase()));

@Component({
  selector: 'app-command-palette-custom-tailwind',
  standalone: true,
  imports: [TngButtonComponent, TngCommandPaletteComponent],
  templateUrl: './command-palette-custom-tailwind.component.html',
  styleUrl: './command-palette-custom-tailwind.component.css',
})
export class CommandPaletteCustomTailwindComponent {
  protected readonly open = signal(false);
  protected readonly query = signal('');
  protected readonly selected = signal<Device | null>(null);

  protected readonly options = computed(() => filterDevices(DEVICES, this.query()));

  protected readonly getOptionValue = (device: Device): string => device.id;
  protected readonly getOptionLabel = (device: Device): string => device.label;
  protected readonly getOptionDescription = (device: Device): string => device.description;

  protected onSelect(event: TngCommandPaletteOptionSelect<Device, unknown>): void {
    this.selected.set(event.option);
  }
}
```

### command-palette-custom-tailwind.component.html

```html
<tng-command-palette [open]="open()" [query]="query()" [options]="options()">
  <ng-template #tngCommandPaletteInputPrefixTpl>
    <span class="rounded border border-[var(--tng-semantic-border-subtle)] px-1 py-0.5 text-[0.72rem] font-bold text-[var(--tng-semantic-foreground-secondary)]">
      ⌘K
    </span>
  </ng-template>

  <ng-template #tngCommandPaletteOptionTpl let-item>
    <span class="flex min-w-0 items-center justify-between gap-4">
      <span class="min-w-0">
        <strong class="block truncate">{{ item.label }}</strong>
        <small class="mt-0.25 block text-[var(--tng-semantic-foreground-secondary)]">{{ item.description }}</small>
      </span>
      <span class="shrink-0 rounded-full border border-[var(--tng-semantic-border-subtle)] px-2 py-0.5 text-xs text-[var(--tng-semantic-foreground-secondary)]">
        {{ item.status }}
      </span>
    </span>
  </ng-template>

  <ng-template #tngCommandPaletteFooterTpl>
    <span class="text-[var(--tng-semantic-foreground-muted)]">
      Arrows move · Enter opens · Esc closes
    </span>
  </ng-template>
</tng-command-palette>
```

### command-palette-custom-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
