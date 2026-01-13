import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'docs-empty-state',
  template: `
    <div class="max-w-4xl mx-auto py-12 px-4">
      <h1 class="text-4xl font-bold mb-4">Empty State</h1>
      <p class="text-lg text-slate-600 mb-8">
        Empty state component for no-data situations.
      </p>
      <p class="text-slate-700">
        Documentation coming soon...
      </p>
    </div>
  `,
})
export class EmptyStateDocsComponent {}
