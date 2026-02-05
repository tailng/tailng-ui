import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngIcon } from '@tailng-ui/icons/icon';
import { TngCard, TngCardFooter, TngCardHeader } from '@tailng-ui/ui/layout';
import { TngButton, TngTag } from '@tailng-ui/ui/primitives';
import {
  TngCodeBlock,
  TngCodeBlockCopiedSlot,
  TngCodeBlockCopySlot,
} from '@tailng-ui/ui/utilities';
import { ShikiHighlighterService } from '../../../shared/shiki-highlighter.service';
import { TngLogoComponent } from '../../../shared/tng-logo/tng-logo.component';
import { TngShikiAdapter } from '../../../shared/tng-shiki.adapter';

@Component({
  standalone: true,
  selector: 'tng-project-home',
  host: { class: 'block flex-1 min-h-0 overflow-auto' },
  imports: [
    RouterLink,
    TngButton,
    TngTag,
    TngCard,
    TngCardHeader,
    TngCardFooter,
    TngCodeBlock,
    TngIcon,
    TngCodeBlockCopySlot,
    TngCodeBlockCopiedSlot,
    TngLogoComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);

  links = {
    github: 'https://github.com/tailng/tailng-ui',
    npm: 'https://www.npmjs.com/package/@tailng-ui/ui',
    demo: 'https://tailng.dev',
  } as const;

  year = computed(() => new Date().getFullYear());

  installSnippet = computed(() => `npm i @tailng-ui/cdk @tailng-ui/theme @tailng-ui/ui`);

tailwindConfigSnippet = computed(() => `
const tailngPreset = require("@tailng-ui/theme/tailwind/tailng.preset.cjs");

module.exports = {
  presets: [tailngPreset],
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/@tailng-ui/ui/**/*.{mjs,js}",
    "./node_modules/@tailng-ui/icons/**/*.{mjs,js}",
  ],
};`);
stylesCssSnippet = computed(() => `
@import "@tailng-ui/theme/tokens/index.css";
@tailwind base;
@tailwind components;
@tailwind utilities;
`);

importSnippetTs = computed(() => `
import { Component } from '@angular/core';
import { TngButton } from '@tailng-ui/ui/primitives';

@Component({
  selector: 'app-root',
  standalone: true,
  template: \`<tng-button>Click me</tng-button>\`,
  imports: [TngButton],
})
export class AppComponent {}
`);

  klassSignalSnippet = computed(
    () => `import { Component, computed, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'tng-example-button',
  template: \`
    <button type="button" class="px-3 py-2 text-sm font-semibold" [class]="klass()">
      <ng-content />
    </button>
  \`,
})
export class ExampleButtonComponent {
  variant = input<'primary' | 'outline'>('primary');
  disabled = input(false);

  klass = computed(() => {
    const base = 'rounded-md transition';
    const primary = 'bg-[color:var(--primary)] text-white hover:opacity-95';
    const outline = 'border border-slate-200 text-slate-800 hover:bg-slate-50';
    const disabled = 'opacity-50 pointer-events-none';

    return [
      base,
      this.variant() === 'primary' ? primary : outline,
      this.disabled() ? disabled : '',
    ].filter(Boolean).join(' ');
  });
}`,
  );

  klassUsageSnippet = computed(
    () => `<tng-example-button variant="primary">Save</tng-example-button>
<tng-example-button variant="outline">Cancel</tng-example-button>
<tng-example-button variant="primary" [disabled]="true">Disabled</tng-example-button>`,
  );

  async copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  }
}