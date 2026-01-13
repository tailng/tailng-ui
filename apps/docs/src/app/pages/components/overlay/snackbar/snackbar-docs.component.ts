import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'docs-snackbar',
  template: `
    <div class="max-w-4xl mx-auto py-12 px-4">
      <h1 class="text-4xl font-bold mb-4">Snackbar</h1>
      <p class="text-lg text-slate-600 mb-8">
        Snackbar notifications for tailng.
      </p>
      <p class="text-slate-700">
        Documentation coming soon...
      </p>
    </div>
  `,
})
export class SnackbarDocsComponent {}
