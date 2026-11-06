---
id: "components/tree/examples"
title: "Tree examples"
description: "Tree examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["tree","navigation","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/tree/tng-tree.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/tree/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/tree/sections/examples/tree-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/navigation/tree/sections/examples/tree-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/tree/sections/examples/tree-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/tree/examples"
componentGroup: "navigation"
symbols: ["TngTreeComponent"]
selectors: ["tng-tree"]
productId: "tree"
section: "examples"
officialCatalog: true
generated: true
---

# Tree examples

## Examples

Reusable wrapper tree patterns for file browsers, settings panels, and explorer-style navigation.

### tree-file-plain.component.ts

```ts
import { Component } from '@angular/core';
import { TngTree, type TngTreeItem } from '@tailng-ui/components';

@Component({
  selector: 'app-tree-file-browser-plain',
  standalone: true,
  imports: [TngTree],
  templateUrl: './tree-file-plain.component.html',
  styleUrl: './tree-file-plain.component.css',
})
export class TreeFileBrowserPlainComponent {
  protected readonly fileTreeNodes: readonly TngTreeItem[] = [
    { id: 'workspace', label: 'tailng-ui', description: 'Workspace root' },
    { id: 'libs', label: 'libs', description: 'Shared packages', parentId: 'workspace' },
    { id: 'components', label: 'components', parentId: 'libs' },
    { id: 'primitives', label: 'primitives', parentId: 'libs' },
    { id: 'theme', label: 'theme', parentId: 'libs' },
    { id: 'apps', label: 'apps', description: 'Deployable applications', parentId: 'workspace' },
    { id: 'docs', label: 'docs', parentId: 'apps' },
    { id: 'playground', label: 'playground-tailwind', parentId: 'apps' },
  ];

  protected readonly defaultExpandedIds = ['workspace', 'libs', 'apps'] as const;
}
```

### tree-file-plain.component.html

```html
<div class="tree-example-demo-shell">
<tng-tree
  [nodes]="fileTreeNodes"
  [defaultExpandedIds]="defaultExpandedIds"
  [defaultSelectedId]="'components'"
  ariaLabel="Repository files"
></tng-tree>
</div>
```

### tree-file-plain.component.css

```css
.tree-example-demo-shell {
  border: 1px solid var(--docs-border-subtle);
  border-radius: 16px;
  padding: 1rem;
}
```

### tree-file-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngTree, type TngTreeItem } from '@tailng-ui/components';

@Component({
  selector: 'app-tree-file-browser-tailwind',
  standalone: true,
  imports: [TngTree],
  templateUrl: './tree-file-tailwind.component.html',
  styleUrl: './tree-file-tailwind.component.css',
})
export class TreeFileBrowserTailwindComponent {
  protected readonly fileTreeNodes: readonly TngTreeItem[] = [
    { id: 'workspace', label: 'tailng-ui', description: 'Workspace root' },
    { id: 'libs', label: 'libs', description: 'Shared packages', parentId: 'workspace' },
    { id: 'components', label: 'components', parentId: 'libs' },
    { id: 'primitives', label: 'primitives', parentId: 'libs' },
    { id: 'theme', label: 'theme', parentId: 'libs' },
    { id: 'apps', label: 'apps', description: 'Deployable applications', parentId: 'workspace' },
    { id: 'docs', label: 'docs', parentId: 'apps' },
    { id: 'playground', label: 'playground-tailwind', parentId: 'apps' },
  ];

  protected readonly defaultExpandedIds = ['workspace', 'libs', 'apps'] as const;
}
```

### tree-file-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
<tng-tree
  [nodes]="fileTreeNodes"
  [defaultExpandedIds]="defaultExpandedIds"
  [defaultSelectedId]="'components'"
  ariaLabel="Repository files"
></tng-tree>
</div>
```

### tree-file-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### tree-settings-plain.component.ts

```ts
import { Component } from '@angular/core';
import { TngTree, type TngTreeItem } from '@tailng-ui/components';

@Component({
  selector: 'app-tree-settings-plain',
  standalone: true,
  imports: [TngTree],
  templateUrl: './tree-settings-plain.component.html',
  styleUrl: './tree-settings-plain.component.css',
})
export class TreeSettingsPlainComponent {
  protected readonly settingsNodes: readonly TngTreeItem[] = [
    { id: 'general', label: 'General' },
    { id: 'appearance', label: 'Appearance', parentId: 'general' },
    { id: 'theme-mode', label: 'Theme mode', parentId: 'appearance' },
    { id: 'font-size', label: 'Font size', parentId: 'appearance' },
    { id: 'privacy', label: 'Privacy', parentId: 'general' },
    { id: 'cookies', label: 'Cookies', parentId: 'privacy' },
    { id: 'tracking', label: 'Tracking', parentId: 'privacy' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'developer', label: 'Developer tools', parentId: 'advanced' },
    { id: 'experimental', label: 'Experimental', parentId: 'advanced', disabled: true },
  ];

  protected readonly defaultExpandedIds = ['general', 'appearance'] as const;
}
```

### tree-settings-plain.component.html

```html
<div class="tree-example-demo-shell">
<tng-tree
  [nodes]="settingsNodes"
  [defaultExpandedIds]="defaultExpandedIds"
  [defaultSelectedId]="'theme-mode'"
  ariaLabel="Settings"
></tng-tree>
</div>
```

### tree-settings-plain.component.css

```css
.tree-example-demo-shell {
  border: 1px solid var(--docs-border-subtle);
  border-radius: 16px;
  padding: 1rem;
}
```

### tree-settings-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngTree, type TngTreeItem } from '@tailng-ui/components';

@Component({
  selector: 'app-tree-settings-tailwind',
  standalone: true,
  imports: [TngTree],
  templateUrl: './tree-settings-tailwind.component.html',
  styleUrl: './tree-settings-tailwind.component.css',
})
export class TreeSettingsTailwindComponent {
  protected readonly settingsNodes: readonly TngTreeItem[] = [
    { id: 'general', label: 'General' },
    { id: 'appearance', label: 'Appearance', parentId: 'general' },
    { id: 'theme-mode', label: 'Theme mode', parentId: 'appearance' },
    { id: 'font-size', label: 'Font size', parentId: 'appearance' },
    { id: 'privacy', label: 'Privacy', parentId: 'general' },
    { id: 'cookies', label: 'Cookies', parentId: 'privacy' },
    { id: 'tracking', label: 'Tracking', parentId: 'privacy' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'developer', label: 'Developer tools', parentId: 'advanced' },
    { id: 'experimental', label: 'Experimental', parentId: 'advanced', disabled: true },
  ];

  protected readonly defaultExpandedIds = ['general', 'appearance'] as const;
}
```

### tree-settings-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
<tng-tree
  [nodes]="settingsNodes"
  [defaultExpandedIds]="defaultExpandedIds"
  [defaultSelectedId]="'theme-mode'"
  ariaLabel="Settings"
></tng-tree>
</div>
```

### tree-settings-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
