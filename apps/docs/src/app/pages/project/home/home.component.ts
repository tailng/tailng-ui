import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'docs-home',
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto py-12 px-4">
      <h1 class="text-4xl font-bold mb-4">Welcome to tailng</h1>
      <p class="text-lg text-slate-600 mb-8">
        Scalability of Angular. Simplicity of Tailwind.
      </p>
      <p class="text-slate-700 mb-8">
        tailng is an open-source Angular component library built with Tailwind CSS.
      </p>
      <div class="mt-8">
        <a routerLink="/components" class="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
          Browse Components
        </a>
      </div>
    </div>
  `,
})
export class HomeComponent {}
