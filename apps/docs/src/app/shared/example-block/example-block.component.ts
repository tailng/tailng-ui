import { Component, computed, Directive, inject, input, signal } from '@angular/core';
import { TngIcon } from '@tociva/tailng-icons/icon';
import { TngExpansionPanel, TngTab, TngTabPanel, TngTabs } from '@tociva/tailng-ui/layout';
import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
import { ShikiHighlighterService } from '../shiki-highlighter.service';
import { TngShikiAdapter } from '../tng-shiki.adapter';

/**
 * Directive to mark title content for projection
 */
@Directive({
  selector: '[tngExampleTitle]',
  standalone: true,
})
export class TngExampleTitle {}

/**
 * Directive to mark demo content for projection
 */
@Directive({
  selector: '[tngExampleDemo]',
  standalone: true,
})
export class TngExampleDemo {}

@Component({
  standalone: true,
  selector: 'docs-example-block',
  templateUrl: './example-block.component.html',
  imports: [
    TngCodeBlock,
    TngExpansionPanel,
    TngIcon,
    TngTab,
    TngTabPanel,
    TngTabs,
  ],
})
export class ExampleBlockComponent {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);

  htmlSource = computed(() => this.htmlContent());
tsSource   = computed(() => this.tsContent());
cssSource  = computed(() => this.styleContent());


copied = signal(false);

  // Inputs
  readonly docLink = input<string>('');
  readonly stackBlitzLink = input<string>('');
  readonly htmlContent = input<string>('');
  readonly tsContent = input<string>('');
  readonly styleContent = input<string>('');
  readonly klass = input<string>('');

  // State
  readonly isCodePanelOpen = signal(false);

  readonly finalKlass = computed(() => {
    return ['rounded-xl border border-border bg-bg p-4 shadow-sm space-y-2', this.klass()].join(' ');
  });

  toggleCodePanel(): void {
    this.isCodePanelOpen.update((v) => !v);
  }

  async copyDocLink(): Promise<void> {
    const link = this.docLink();
    if (!link) return;
    
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // clipboard may be blocked; ignore
    }
  }

  openStackBlitz(): void {
    const link = this.stackBlitzLink();
    if (link) {
      window.open(link, '_blank');
    }
  }



}
