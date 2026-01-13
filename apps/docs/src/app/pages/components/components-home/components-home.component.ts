import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'docs-components-home',
  template: `
    <div class="max-w-4xl mx-auto py-12 px-4">
      <h1 class="text-4xl font-bold mb-4">Components</h1>
      <p class="text-lg text-slate-600 mb-8">
        Browse tailng components, examples, and usage guidelines.
      </p>
      <p class="text-slate-700">
        Use the navigation menu on the left to explore different component categories.
      </p>
    </div>
  `,
})
export class ComponentsHomeComponent {}
