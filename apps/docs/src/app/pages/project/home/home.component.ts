import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngBadge, TngButton } from '@tociva/tailng-ui/buttons-indicators';

@Component({
  standalone: true,
  selector: 'tng-project-home',
  host: { class: 'block flex-1 min-h-0 overflow-auto' },
  imports: [RouterLink, TngButton, TngBadge],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  links = {
    github: 'https://github.com/tociva/tailng',
    npm: 'https://www.npmjs.com/package/@tociva/tailng-ui',
    demo: 'https://tailng.dev',
    tociva: 'https://tociva.com',
  } as const;

  year = computed(() => new Date().getFullYear());

  // IMPORTANT: keep these as strings and bind with {{ ... }} in <code>.
  // Do NOT paste raw braces directly into the HTML template.
  themeSnippet = computed(
    () => `:root {
  --primary: #12284b;
  --radius: 6px;
  --surface: #ffffff;
  --surface-2: #f8fafc;
}

/* Example usage */
.button-primary {
  background: var(--primary);
  border-radius: var(--radius);
}`,
  );

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
      // ignore (clipboard might not be available)
    }
  }
}
