---
id: "components/menubar/examples"
title: "Menubar examples"
description: "Menubar examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["menubar","navigation","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/menubar/tng-menubar.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/menubar/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/menubar/sections/examples/menubar-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/navigation/menubar/sections/examples/menubar-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/menubar/sections/examples/menubar-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/menubar/examples"
componentGroup: "navigation"
symbols: ["TngMenubarComponent"]
selectors: ["tng-menubar"]
productId: "menubar"
section: "examples"
officialCatalog: true
generated: true
---

# Menubar examples

## Examples

Production menubar patterns for top-level command strips, owned menu panels, and nested submenu chains.

### menubar-examples-workspace-plain.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';
import { TngMenuGroupLabel, TngMenuItem, TngMenubarGroup, TngMenubarItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menubar-examples-workspace-plain',
  standalone: true,
  imports: [
    TngMenuComponent,
    TngMenubarComponent,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenubarGroup,
    TngMenubarItem,
  ],
  templateUrl: './menubar-examples-workspace-plain.component.html',
  styleUrl: './menubar-examples-workspace-plain.component.css',
})
export class MenubarExamplesWorkspacePlainComponent {
  readonly menubarExamplesWorkspacePlainLastCommand = signal('No command yet');

  onMenubarExamplesWorkspacePlainMenuSelect(event: TngMenuSelectEvent): void {
    this.menubarExamplesWorkspacePlainLastCommand.set(String(event.value));
  }
}
```

### menubar-examples-workspace-plain.component.html

```html
<tng-menubar ariaLabel="Wrapper workspace commands">
    <div tngMenubarGroup>
      <tng-menu
        #workspacePlainFileMenu="tngMenu"
        ariaLabel="File menu"
        (tngMenuSelect)="onMenubarExamplesWorkspacePlainMenuSelect($event)"
      >
        <div tngMenuGroupLabel>File</div>
        <button type="button" tngMenuItem tngMenuItemValue="Create release">New release</button>
        <button type="button" tngMenuItem tngMenuItemValue="Publish release">Publish</button>
      </tng-menu>
      <button type="button" tngMenubarItem [tngMenubarMenu]="workspacePlainFileMenu">File</button>
    </div>
    <div tngMenubarGroup>
      <tng-menu
        #workspacePlainViewMenu="tngMenu"
        ariaLabel="View menu"
        (tngMenuSelect)="onMenubarExamplesWorkspacePlainMenuSelect($event)"
      >
        <button type="button" tngMenuItem tngMenuItemValue="Toggle sidebar">Toggle sidebar</button>
        <button type="button" tngMenuItem tngMenuItemValue="Open command palette">Command palette</button>
      </tng-menu>
      <button type="button" tngMenubarItem [tngMenubarMenu]="workspacePlainViewMenu">View</button>
    </div>
    <button type="button" tngMenubarItem>Help</button>
  </tng-menubar>
<p>last command: {{ menubarExamplesWorkspacePlainLastCommand() }}</p>
```

### menubar-examples-workspace-plain.component.css

```css
/*
 * Menubar and menu internals are styled by TailNG component contracts.
 * Keep local CSS for layout wrappers only.
 */
```

### menubar-examples-workspace-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';
import { TngMenuGroupLabel, TngMenuItem, TngMenubarGroup, TngMenubarItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menubar-examples-workspace-tailwind',
  standalone: true,
  imports: [
    TngMenuComponent,
    TngMenubarComponent,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenubarGroup,
    TngMenubarItem,
  ],
  templateUrl: './menubar-examples-workspace-tailwind.component.html',
  styleUrl: './menubar-examples-workspace-tailwind.component.css',
})
export class MenubarExamplesWorkspaceTailwindComponent {
  readonly menubarExamplesWorkspaceTwLastCommand = signal('No command yet');

  onMenubarExamplesWorkspaceTwMenuSelect(event: TngMenuSelectEvent): void {
    this.menubarExamplesWorkspaceTwLastCommand.set(String(event.value));
  }
}
```

### menubar-examples-workspace-tailwind.component.html

```html
<tng-menubar ariaLabel="Tailwind workspace commands">
      <div tngMenubarGroup>
        <tng-menu
          #workspaceTwFileMenu="tngMenu"
          ariaLabel="File menu"
          (tngMenuSelect)="onMenubarExamplesWorkspaceTwMenuSelect($event)"
        >
          <div tngMenuGroupLabel>File</div>
          <button type="button" tngMenuItem tngMenuItemValue="Create file">New</button>
          <button type="button" tngMenuItem tngMenuItemValue="Open file">Open</button>
        </tng-menu>
        <button type="button" tngMenubarItem [tngMenubarMenu]="workspaceTwFileMenu">File</button>
      </div>
      <div tngMenubarGroup>
        <tng-menu
          #workspaceTwToolsMenu="tngMenu"
          ariaLabel="Tools menu"
          (tngMenuSelect)="onMenubarExamplesWorkspaceTwMenuSelect($event)"
        >
          <button type="button" tngMenuItem tngMenuItemValue="Run lint">Run lint</button>
          <button type="button" tngMenuItem tngMenuItemValue="Run tests">Run tests</button>
        </tng-menu>
        <button type="button" tngMenubarItem [tngMenubarMenu]="workspaceTwToolsMenu">Tools</button>
      </div>
    </tng-menubar>
  <p>last command: {{ menubarExamplesWorkspaceTwLastCommand() }}</p>
```

### menubar-examples-workspace-tailwind.component.css

```css
/* Menubar and menu primitives use component styles; optional panel chrome can use utilities on wrappers. */
```

### menubar-examples-cascade-plain.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';
import { TngMenuGroupLabel, TngMenuItem, TngMenubarGroup, TngMenubarItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menubar-examples-cascade-plain',
  standalone: true,
  imports: [
    TngMenuComponent,
    TngMenubarComponent,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenubarGroup,
    TngMenubarItem,
  ],
  templateUrl: './menubar-examples-cascade-plain.component.html',
  styleUrl: './menubar-examples-cascade-plain.component.css',
})
export class MenubarExamplesCascadePlainComponent {
  readonly menubarExamplesCascadePlainLastCommand = signal('No command yet');

  onMenubarExamplesCascadePlainMenuSelect(event: TngMenuSelectEvent): void {
    this.menubarExamplesCascadePlainLastCommand.set(String(event.value));
  }
}
```

### menubar-examples-cascade-plain.component.html

```html
<tng-menubar ariaLabel="Cascaded command bar">
    <div tngMenubarGroup>
      <tng-menu
        #cascadePlainFileMenu="tngMenu"
        ariaLabel="File menu"
        (tngMenuSelect)="onMenubarExamplesCascadePlainMenuSelect($event)"
      >
        <div tngMenuGroupLabel>File</div>
        <button type="button" tngMenuItem tngMenuItemValue="Create project">Create project</button>
        <button
          type="button"
          tngMenuItem
          [tngMenuItemSubmenu]="cascadePlainImportMenu"
          tngMenuItemValue="Import from source"
        >
          Import from...
        </button>
        <div tngMenuSeparator></div>
        <button type="button" tngMenuItem tngMenuItemValue="Archive project">Archive project</button>
        <tng-menu
          #cascadePlainImportMenu="tngMenu"
          ariaLabel="Import submenu"
          (tngMenuSelect)="onMenubarExamplesCascadePlainMenuSelect($event)"
        >
          <button type="button" tngMenuItem tngMenuItemValue="Import from CSV">CSV file</button>
          <button
            type="button"
            tngMenuItem
            [tngMenuItemSubmenu]="cascadePlainGitMenu"
            tngMenuItemValue="Import from git"
          >
            Git repository
          </button>
        </tng-menu>
        <tng-menu
          #cascadePlainGitMenu="tngMenu"
          ariaLabel="Git provider submenu"
          (tngMenuSelect)="onMenubarExamplesCascadePlainMenuSelect($event)"
        >
          <button type="button" tngMenuItem tngMenuItemValue="Import from GitHub">GitHub</button>
          <button type="button" tngMenuItem tngMenuItemValue="Import from GitLab">GitLab</button>
        </tng-menu>
      </tng-menu>
      <button type="button" tngMenubarItem [tngMenubarMenu]="cascadePlainFileMenu">File</button>
    </div>
    <div tngMenubarGroup>
      <tng-menu
        #cascadePlainToolsMenu="tngMenu"
        ariaLabel="Tools menu"
        (tngMenuSelect)="onMenubarExamplesCascadePlainMenuSelect($event)"
      >
        <button type="button" tngMenuItem tngMenuItemValue="Run lint">Run lint</button>
        <button type="button" tngMenuItem tngMenuItemValue="Run tests">Run tests</button>
      </tng-menu>
      <button type="button" tngMenubarItem [tngMenubarMenu]="cascadePlainToolsMenu">Tools</button>
    </div>
  </tng-menubar>
<p>last cascaded command: {{ menubarExamplesCascadePlainLastCommand() }}</p>
```

### menubar-examples-cascade-plain.component.css

```css
/*
 * Menubar and menu internals are styled by TailNG component contracts.
 * Keep local CSS for layout wrappers only.
 */
```

### menubar-examples-cascade-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';
import { TngMenuGroupLabel, TngMenuItem, TngMenubarGroup, TngMenubarItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menubar-examples-cascade-tailwind',
  standalone: true,
  imports: [
    TngMenuComponent,
    TngMenubarComponent,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenubarGroup,
    TngMenubarItem,
  ],
  templateUrl: './menubar-examples-cascade-tailwind.component.html',
  styleUrl: './menubar-examples-cascade-tailwind.component.css',
})
export class MenubarExamplesCascadeTailwindComponent {
  readonly menubarExamplesCascadeTwLastCommand = signal('No command yet');

  onMenubarExamplesCascadeTwMenuSelect(event: TngMenuSelectEvent): void {
    this.menubarExamplesCascadeTwLastCommand.set(String(event.value));
  }
}
```

### menubar-examples-cascade-tailwind.component.html

```html
<tng-menubar ariaLabel="Cascaded command bar">
      <div tngMenubarGroup>
        <tng-menu
          #cascadeTwFileMenu="tngMenu"
          ariaLabel="File menu"
          (tngMenuSelect)="onMenubarExamplesCascadeTwMenuSelect($event)"
        >
          <div tngMenuGroupLabel>File</div>
          <button type="button" tngMenuItem tngMenuItemValue="Create project">Create project</button>
          <button
            type="button"
            tngMenuItem
            [tngMenuItemSubmenu]="cascadeTwImportMenu"
            tngMenuItemValue="Import from source"
          >
            Import from...
          </button>
          <div tngMenuSeparator></div>
          <button type="button" tngMenuItem tngMenuItemValue="Archive project">Archive project</button>
          <tng-menu
            #cascadeTwImportMenu="tngMenu"
            ariaLabel="Import submenu"
            (tngMenuSelect)="onMenubarExamplesCascadeTwMenuSelect($event)"
          >
            <button type="button" tngMenuItem tngMenuItemValue="Import from CSV">CSV file</button>
            <button
              type="button"
              tngMenuItem
              [tngMenuItemSubmenu]="cascadeTwGitMenu"
              tngMenuItemValue="Import from git"
            >
              Git repository
            </button>
          </tng-menu>
          <tng-menu
            #cascadeTwGitMenu="tngMenu"
            ariaLabel="Git provider submenu"
            (tngMenuSelect)="onMenubarExamplesCascadeTwMenuSelect($event)"
          >
            <button type="button" tngMenuItem tngMenuItemValue="Import from GitHub">GitHub</button>
            <button type="button" tngMenuItem tngMenuItemValue="Import from GitLab">GitLab</button>
          </tng-menu>
        </tng-menu>
        <button type="button" tngMenubarItem [tngMenubarMenu]="cascadeTwFileMenu">File</button>
      </div>
      <div tngMenubarGroup>
        <tng-menu
          #cascadeTwToolsMenu="tngMenu"
          ariaLabel="Tools menu"
          (tngMenuSelect)="onMenubarExamplesCascadeTwMenuSelect($event)"
        >
          <button type="button" tngMenuItem tngMenuItemValue="Run lint">Run lint</button>
          <button type="button" tngMenuItem tngMenuItemValue="Run tests">Run tests</button>
        </tng-menu>
        <button type="button" tngMenubarItem [tngMenubarMenu]="cascadeTwToolsMenu">Tools</button>
      </div>
    </tng-menubar>
  <p>last cascaded command: {{ menubarExamplesCascadeTwLastCommand() }}</p>
```

### menubar-examples-cascade-tailwind.component.css

```css
/* Menubar and menu primitives use component styles; optional panel chrome can use utilities on wrappers. */
```

### menubar-examples-contract.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';
import { TngMenuGroupLabel, TngMenuItem, TngMenuSeparator, TngMenubarGroup, TngMenubarItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menubar-examples-contract',
  standalone: true,
  imports: [
    TngMenuComponent,
    TngMenubarComponent,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenuSeparator,
    TngMenubarGroup,
    TngMenubarItem,
  ],
  templateUrl: './menubar-examples-contract.component.html',
  styleUrl: './menubar-examples-contract.component.css',
})
export class MenubarExamplesContractComponent {
  readonly menubarExamplesContractLastCommand = signal('No command yet');

  onMenubarExamplesContractMenuSelect(event: TngMenuSelectEvent): void {
    this.menubarExamplesContractLastCommand.set(String(event.value));
  }
}
```

### menubar-examples-contract.component.html

```html
<div class="menubar-examples-contract-shell">
  <p class="menubar-examples-contract-note">
    This example scopes a branded menubar through <code>data-slot="menubar"</code>,
    <code>data-slot="menubar-item"</code>, <code>data-slot="menu"</code>, and state hooks
    such as <code>aria-expanded</code> and <code>data-active</code>.
  </p>

  <tng-menubar ariaLabel="Release control bar">
    <div tngMenubarGroup>
      <tng-menu
        #contractReleaseMenu="tngMenu"
        ariaLabel="Release menu"
        (tngMenuSelect)="onMenubarExamplesContractMenuSelect($event)"
      >
        <div tngMenuGroupLabel>Release</div>
        <button type="button" tngMenuItem tngMenuItemValue="Create release">Create release</button>
        <button
          type="button"
          tngMenuItem
          [tngMenuItemSubmenu]="contractDeployMenu"
          tngMenuItemValue="Deploy release"
        >
          Deploy to...
        </button>
        <div tngMenuSeparator></div>
        <button type="button" tngMenuItem tngMenuItemValue="Rollback release" disabled>
          Rollback
        </button>

        <tng-menu
          #contractDeployMenu="tngMenu"
          ariaLabel="Deploy targets"
          (tngMenuSelect)="onMenubarExamplesContractMenuSelect($event)"
        >
          <button type="button" tngMenuItem tngMenuItemValue="Deploy to staging">Staging</button>
          <button type="button" tngMenuItem tngMenuItemValue="Deploy to production">Production</button>
        </tng-menu>
      </tng-menu>
      <button type="button" tngMenubarItem [tngMenubarMenu]="contractReleaseMenu">Release</button>
    </div>

    <div tngMenubarGroup>
      <tng-menu
        #contractInspectMenu="tngMenu"
        ariaLabel="Inspect menu"
        (tngMenuSelect)="onMenubarExamplesContractMenuSelect($event)"
      >
        <button type="button" tngMenuItem tngMenuItemValue="Open activity log">Activity log</button>
        <button type="button" tngMenuItem tngMenuItemValue="Inspect audit trail">Audit trail</button>
      </tng-menu>
      <button type="button" tngMenubarItem [tngMenubarMenu]="contractInspectMenu">Inspect</button>
    </div>
  </tng-menubar>
</div>
<p>last contract command: {{ menubarExamplesContractLastCommand() }}</p>
```

### menubar-examples-contract.component.css

```css
.menubar-examples-contract-shell {
  display: grid;
  gap: 0.9rem;
  max-width: 38rem;
  padding: 1.1rem;
  border: 1px solid color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, var(--tng-semantic-border-subtle));
  border-radius: 1.2rem;
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, transparent), transparent 42%),
    color-mix(in srgb, var(--tng-semantic-background-surface) 92%, transparent);
}

.menubar-examples-contract-shell [data-slot="menubar"] {
  --tng-menubar-radius: 1.1rem;
  --tng-menubar-padding: 0.38rem;
  --tng-menubar-item-px: 1rem;
  --tng-menubar-surface: color-mix(in srgb, var(--tng-semantic-accent-brand) 10%, var(--tng-semantic-background-surface));
  --tng-menubar-border-strong: color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, var(--tng-semantic-border-strong));
  --tng-menubar-shadow: 0 18px 36px -28px color-mix(in srgb, var(--tng-semantic-foreground-primary) 30%, transparent);
}

.menubar-examples-contract-shell [data-slot="menu"][aria-labelledby] {
  --tng-menu-radius: 1rem;
  --tng-menu-padding: 0.5rem;
  --tng-menu-border-strong: color-mix(in srgb, var(--tng-semantic-accent-brand) 22%, var(--tng-semantic-border-subtle));
  min-width: 14.5rem;
  background: linear-gradient(180deg, color-mix(in srgb, var(--tng-semantic-accent-brand) 14%, var(--tng-semantic-background-canvas)), color-mix(in srgb, var(--tng-semantic-background-surface) 96%, var(--tng-semantic-background-canvas)));
  box-shadow: 0 24px 52px -30px color-mix(in srgb, var(--tng-semantic-foreground-primary) 40%, transparent), inset 0 1px 0 color-mix(in srgb, var(--tng-semantic-background-canvas) 70%, transparent), 0 0 0 1px color-mix(in srgb, var(--tng-semantic-accent-brand) 10%, transparent);
  backdrop-filter: blur(12px);
}

.menubar-examples-contract-shell [data-slot="menu-item"] {
  border-radius: 0.82rem;
}

.menubar-examples-contract-shell [data-slot="menu-item"][data-active],
.menubar-examples-contract-shell [data-slot="menu-item"][aria-expanded="true"] {
  background: linear-gradient(90deg, color-mix(in srgb, var(--tng-semantic-accent-brand) 76%, transparent) 0 0.24rem, color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent) 0.24rem);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tng-semantic-accent-brand) 24%, transparent);
}
```

### menubar-examples-contract-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';
import { TngMenuGroupLabel, TngMenuItem, TngMenuSeparator, TngMenubarGroup, TngMenubarItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menubar-examples-contract-tailwind',
  standalone: true,
  imports: [
    TngMenuComponent,
    TngMenubarComponent,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenuSeparator,
    TngMenubarGroup,
    TngMenubarItem,
  ],
  templateUrl: './menubar-examples-contract-tailwind.component.html',
})
export class MenubarExamplesContractTailwindComponent {
  readonly menubarExamplesContractTailwindLastCommand = signal('No command yet');

  onMenubarExamplesContractTailwindMenuSelect(event: TngMenuSelectEvent): void {
    this.menubarExamplesContractTailwindLastCommand.set(String(event.value));
  }
}
```

### menubar-examples-contract-tailwind.component.html

```html
<div class="rounded-[1.2rem] border border-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_18%,var(--tng-semantic-border-subtle))] bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--tng-semantic-accent-brand)_12%,transparent),transparent_42%),color-mix(in_srgb,var(--tng-semantic-background-surface)_92%,transparent)] p-[1.1rem]">
  <div class="grid w-full max-w-[38rem] gap-[0.9rem] [&_[data-slot=menubar]]:[--tng-menubar-radius:1.1rem] [&_[data-slot=menubar]]:[--tng-menubar-padding:0.38rem] [&_[data-slot=menubar]]:[--tng-menubar-item-px:1rem] [&_[data-slot=menubar]]:[--tng-menubar-surface:color-mix(in_srgb,var(--tng-semantic-accent-brand)_10%,var(--tng-semantic-background-surface))] [&_[data-slot=menubar]]:[--tng-menubar-border-strong:color-mix(in_srgb,var(--tng-semantic-accent-brand)_18%,var(--tng-semantic-border-strong))] [&_[data-slot=menubar]]:[--tng-menubar-shadow:0_18px_36px_-28px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_30%,transparent)] [&_[data-slot=menubar-item]]:tracking-[0.01em] [&_[data-slot=menubar-item][aria-expanded=true]]:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-accent-brand)_24%,transparent)] [&_[data-slot=menu][aria-labelledby]]:[--tng-menu-radius:1rem] [&_[data-slot=menu][aria-labelledby]]:[--tng-menu-padding:0.5rem] [&_[data-slot=menu][aria-labelledby]]:[--tng-menu-border-strong:color-mix(in_srgb,var(--tng-semantic-accent-brand)_22%,var(--tng-semantic-border-subtle))] [&_[data-slot=menu][aria-labelledby]]:min-w-[14.5rem] [&_[data-slot=menu][aria-labelledby]]:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tng-semantic-accent-brand)_14%,var(--tng-semantic-background-canvas)),color-mix(in_srgb,var(--tng-semantic-background-surface)_96%,var(--tng-semantic-background-canvas)))] [&_[data-slot=menu][aria-labelledby]]:shadow-[0_24px_52px_-30px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_40%,transparent),inset_0_1px_0_color-mix(in_srgb,var(--tng-semantic-background-canvas)_70%,transparent),0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-accent-brand)_10%,transparent)] [&_[data-slot=menu][aria-labelledby]]:backdrop-blur-[12px] [&_[data-slot=menu-group-label]]:text-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_52%,var(--tng-semantic-foreground-secondary))] [&_[data-slot=menu-item]]:rounded-[0.82rem] [&_[data-slot=menu-item][data-active]]:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--tng-semantic-accent-brand)_76%,transparent)_0_0.24rem,color-mix(in_srgb,var(--tng-semantic-accent-brand)_18%,transparent)_0.24rem)] [&_[data-slot=menu-item][data-active]]:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-accent-brand)_24%,transparent)] [&_[data-slot=menu-item][aria-expanded=true]]:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--tng-semantic-accent-brand)_76%,transparent)_0_0.24rem,color-mix(in_srgb,var(--tng-semantic-accent-brand)_18%,transparent)_0.24rem)] [&_[data-slot=menu-item][aria-expanded=true]]:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-accent-brand)_24%,transparent)] [&_[data-slot=menu-item][aria-disabled=true]]:opacity-40">
    <p class="m-0 max-w-[34rem] text-[0.92rem] leading-[1.55] text-[color:var(--tng-semantic-foreground-secondary)]">
      This example scopes the same hooks with Tailwind utilities, using
      <code>data-slot="menubar"</code>, <code>data-slot="menubar-item"</code>,
      <code>data-slot="menu"</code>, and public state attributes.
    </p>

    <tng-menubar ariaLabel="Release control bar">
      <div tngMenubarGroup>
        <tng-menu
          #contractTwReleaseMenu="tngMenu"
          ariaLabel="Release menu"
          (tngMenuSelect)="onMenubarExamplesContractTailwindMenuSelect($event)"
        >
          <div tngMenuGroupLabel>Release</div>
          <button type="button" tngMenuItem tngMenuItemValue="Create release">Create release</button>
          <button
            type="button"
            tngMenuItem
            [tngMenuItemSubmenu]="contractTwDeployMenu"
            tngMenuItemValue="Deploy release"
          >
            Deploy to...
          </button>
          <div tngMenuSeparator></div>
          <button type="button" tngMenuItem tngMenuItemValue="Rollback release" disabled>
            Rollback
          </button>

          <tng-menu
            #contractTwDeployMenu="tngMenu"
            ariaLabel="Deploy targets"
            (tngMenuSelect)="onMenubarExamplesContractTailwindMenuSelect($event)"
          >
            <button type="button" tngMenuItem tngMenuItemValue="Deploy to staging">Staging</button>
            <button type="button" tngMenuItem tngMenuItemValue="Deploy to production">Production</button>
          </tng-menu>
        </tng-menu>
        <button type="button" tngMenubarItem [tngMenubarMenu]="contractTwReleaseMenu">Release</button>
      </div>

      <div tngMenubarGroup>
        <tng-menu
          #contractTwInspectMenu="tngMenu"
          ariaLabel="Inspect menu"
          (tngMenuSelect)="onMenubarExamplesContractTailwindMenuSelect($event)"
        >
          <button type="button" tngMenuItem tngMenuItemValue="Open activity log">Activity log</button>
          <button type="button" tngMenuItem tngMenuItemValue="Inspect audit trail">Audit trail</button>
        </tng-menu>
        <button type="button" tngMenubarItem [tngMenubarMenu]="contractTwInspectMenu">Inspect</button>
      </div>
    </tng-menubar>
  </div>
</div>
<p>last contract command: {{ menubarExamplesContractTailwindLastCommand() }}</p>
```

### menubar-examples-contract-tailwind.component.css

```css
/* Tailwind utilities are scoped on the wrapper through public slot and state hooks. */
```
