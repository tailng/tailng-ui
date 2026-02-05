import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngIcon } from '@tailng-ui/icons/icon';
import { TngBadge, TngButton } from '@tailng-ui/ui/primitives';
import {
  TngCodeBlock, TngCodeBlockCopiedSlot, TngCodeBlockCopySlot
} from '@tailng-ui/ui/utilities';
import { DemoShikiHighlighterService } from '../../../shared/demo-shiki-highlighter.service';
import { TngShikiAdapter } from '../../../shared/tng-shiki.adapter';

@Component({
  standalone: true,
  selector: 'tng-code-block-demo',
  imports: [
    RouterLink,
    TngCodeBlock,
    TngBadge,
    TngButton,
    TngIcon,
    TngCodeBlockCopySlot,
    TngCodeBlockCopiedSlot,
  ],
  templateUrl: './code-block-demo.component.html',
})
export class CodeBlockDemoComponent {

  private shiki = inject(DemoShikiHighlighterService);

  readonly highlighter = new TngShikiAdapter(this.shiki);
  
  readonly inlineExample = computed(
    () => `import { Component, input } from '@angular/core';

@Component({
  selector: 'tng-button',
  standalone: true,
  template: '<button>{{ label() }}</button>',
})
export class ButtonComponent {
  label = input<string>('Click me');
}`,
  );

  readonly klassSignalSnippet = computed(
    () => `import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'tng-button',
  standalone: true,
  template: '<button type="button" [class]="klass()"><ng-content /></button>',
})
export class ButtonComponent {
  variant = input<'primary' | 'outline'>('primary');

  klass = computed(() => {
    const base = 'rounded-md px-3 py-2 text-sm font-semibold';
    const primary = 'bg-[color:var(--primary)] text-white';
    const outline = 'border border-slate-200 text-slate-800';

    return [base, this.variant() === 'primary' ? primary : outline].join(' ');
  });
}`,
  );

  readonly jsonSnippet = computed(
    () => `{
  "name": "tailng",
  "tagline": "Scalability of Angular. Simplicity of Tailwind.",
  "openSource": true
}`,
  );

  readonly smallSnippet = computed(() => `npm i @tailng-ui/ui`);
}