import { Component, inject } from '@angular/core';
import { TngIcon } from '@tailng-ui/icons/icon';
import { TngButtonToggle, TngButtonToggleOption } from '@tailng-ui/ui/form';
import { TngCard } from '@tailng-ui/ui/layout';
import {
  TngCodeBlock,
  TngCodeBlockCopiedSlot,
  TngCodeBlockCopySlot,
} from '@tailng-ui/ui/utilities';
import { ShikiHighlighterService } from '../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../shared/tng-shiki.adapter';

@Component({
  standalone: true,
  selector: 'docs-icons',
  host: { class: 'block flex-1 min-h-0 overflow-auto' },
  templateUrl: './icons.component.html',
  imports: [
    TngCard,
    TngCodeBlock,
    TngCodeBlockCopySlot,
    TngCodeBlockCopiedSlot,
    TngIcon,
    TngButtonToggle,
  ],
})
export class IconsComponent {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);

  installStatus: 'yarn' | 'npm' = 'yarn';

  titleOptions: TngButtonToggleOption<string>[] = [
    { value: 'yarn', label: 'Yarn' },
    { value: 'npm', label: 'npm' },
  ];

  get install(): string {
    return this.installStatus === 'yarn' ? this.yarnInstall : this.npmInstall;
  }

  readonly yarnInstall = `yarn add @tailng-ui/icons @ng-icons/core`;
  readonly npmInstall = `npm i @tailng-ui/icons @ng-icons/core`;

  // Generic registration example (works with any pack)
  registerIconsExample = `// app.config.ts (standalone Angular)
// This is an example of registering icons using @ng-icons/core.
// The exact import path depends on which icon pack you choose.

import { ApplicationConfig } from '@angular/core';
import { provideIcons } from '@ng-icons/core';

// Example: import a few icons from your chosen pack
// import { bootstrapCopy, bootstrapCheck2Circle } from '@ng-icons/bootstrap-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIcons({
      // bootstrapCopy,
      // bootstrapCheck2Circle,
    }),
  ],
};`;

  // If they prefer feature/local registration
  registerIconsLocalExample = `// icons.provider.ts (optional pattern)
// Use this when you want to group icon registrations per feature.

import { provideIcons } from '@ng-icons/core';
// import { bootstrapCopy, bootstrapCheck2Circle } from '@ng-icons/bootstrap-icons';

export const provideAppIcons = () =>
  provideIcons({
    // bootstrapCopy,
    // bootstrapCheck2Circle,
  });`;

  usageBasic = `<tng-icon name="bootstrapCopy"></tng-icon>
<tng-icon name="bootstrapCheck2Circle"></tng-icon>`;

  usageSize = `<!-- number => px -->
<tng-icon name="bootstrapCopy" [size]="16"></tng-icon>

<!-- string => passed as-is -->
<tng-icon name="bootstrapCopy" size="1.25rem"></tng-icon>
<tng-icon name="bootstrapCopy" size="20px"></tng-icon>`;

  usageClass = `<tng-icon
  name="bootstrapCopy"
  [slot]="{ icon: 'text-fg' }"
></tng-icon>`;

  // Accessibility examples based on your component API
  a11yDecorative = `<!-- Decorative (default): aria-hidden="true" -->
<tng-icon name="bootstrapCopy"></tng-icon>`;

  a11yMeaningful = `<!-- Meaningful: decorative=false, provide ariaLabel -->
<tng-icon
  name="bootstrapCheck2Circle"
  [decorative]="false"
  ariaLabel="Copied"
></tng-icon>`;

  // Button pattern (icon + text)
  iconButton = `<button class="inline-flex items-center gap-2 bg-bg text-fg border border-border rounded px-3 py-2">
  <tng-icon name="bootstrapCopy"></tng-icon>
  Copy
</button>`;

  // Tailng integration pattern (your own docs use case)
  codeBlockSlotExample = `<tng-code-block
  [content]="someCode"
  language="bash"
  [highlighter]="highlighter"
  [copyResetMs]="5000"
>
  <tng-icon name="bootstrapCopy" tngCodeBlockCopy>Copy</tng-icon>
  <tng-icon name="bootstrapCheck2Circle" size="1rem" tngCodeBlockCopied></tng-icon>
</tng-code-block>`;
}