import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'docs-tooltip',
  template: `
    <div class="max-w-4xl mx-auto py-12 px-4">
      <h1 class="text-4xl font-bold mb-4">Tooltip</h1>
      <p class="text-lg text-slate-600 mb-8">
        Tooltip component for contextual hints.
      </p>
      <p class="text-slate-700">
        Documentation coming soon...
      </p>
    </div>
  `,
})
export class TooltipDocsComponent {}
