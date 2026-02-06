import { Component, inject } from '@angular/core';
import { TngCard } from '@tailng-ui/ui/layout';
import {
  TngCodeBlock,
  TngCodeBlockCopiedSlot,
  TngCodeBlockCopySlot,
} from '@tailng-ui/ui/utilities';
import { ShikiHighlighterService } from '../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../shared/tng-shiki.adapter';
import { TngButtonToggle, TngButtonToggleOption } from '@tailng-ui/ui/form';
import { TngIcon } from '@tailng-ui/icons/icon';

@Component({
  standalone: true,
  selector: 'docs-quick-start',
  templateUrl: './quick-start.component.html',
  imports: [
    TngCard,
    TngCodeBlock,
    TngCodeBlockCopySlot,
    TngCodeBlockCopiedSlot,
    TngButtonToggle,
    TngIcon,
  ],
})
export class QuickStartComponent {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);

  installStatus: 'yarn' | 'npm' = 'yarn';

  titleOptions: TngButtonToggleOption<string>[] = [
    { value: 'yarn', label: 'Yarn' },
    { value: 'npm', label: 'npm' },
  ];

  get installPackages(): string {
    return this.installStatus === 'yarn' ? this.yarnInstallPackages : this.npmInstallPackages;
  }

  // 1) Install packages (minimal)
  readonly yarnInstallPackages = `yarn add @tailng-ui/ui @tailng-ui/theme @tailng-ui/icons @ng-icons/core`;

  readonly npmInstallPackages = `npm i @tailng-ui/ui @tailng-ui/theme @tailng-ui/icons @ng-icons/core`;

  // 2) Import styles reminder
  styleReminder = `/* styles.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import '@tailng-ui/theme/css/tailng.css';
`;

  // 3) Example component usage
  buttonExample = `<tng-button variant="primary">
  Primary Button
</tng-button>

<tng-button variant="outline">
  Outline Button
</tng-button>
`;

  // 4) Card example
  cardExample = `<tng-card rootKlass="max-w-sm p-4 space-y-3">
  <h3 class="text-lg font-semibold">Card title</h3>
  <p class="text-slate-600">
    Cards are layout primitives with sensible defaults.
  </p>

  <tng-button size="sm">Action</tng-button>
</tng-card>
`;

  // 5) Form input example
  inputExample = `<tng-input
  label="Email"
  placeholder="you@example.com"
></tng-input>
`;

  // 6) Theme switch example
  themeExample = `<body class="mode-light theme-default">
  <app-root></app-root>
</body>

<!-- dark mode -->
<body class="mode-dark theme-default">
  <app-root></app-root>
</body>
`;

}