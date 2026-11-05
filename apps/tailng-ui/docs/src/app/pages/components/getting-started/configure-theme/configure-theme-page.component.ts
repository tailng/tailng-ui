import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../shared/util';
import {
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
  TngCodeBlockComponent,
  TngTabsComponent,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';
import { map } from 'rxjs/operators';
import {
  COMPONENTS_GETTING_STARTED_GROUP,
  toComponentsDocsRouteData,
  type ComponentsDocsRouteData,
} from '../../component-docs.data';

const configureThemeItem = COMPONENTS_GETTING_STARTED_GROUP.items.find(
  (item) => item.slug === 'configure-theme',
);

if (!configureThemeItem) {
  throw new Error('Configure Theme item not found.');
}

const fallbackData: ComponentsDocsRouteData = toComponentsDocsRouteData(
  COMPONENTS_GETTING_STARTED_GROUP,
  configureThemeItem,
);

@Component({
  selector: 'app-configure-theme-page',
  imports: [
    RouterLink,
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCodeBlockComponent,
    TngTabsComponent,
    TngTabList,
    TngTab,
    TngTabPanel,
    TngIcon,
  ],
  templateUrl: './configure-theme-page.component.html',
  styleUrl: './configure-theme-page.component.css',
})
export class ConfigureThemePageComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly documentRef = inject(DOCUMENT);

  private readonly routeData = toSignal(
    this.route.data.pipe(
      map((data) => (data as ComponentsDocsRouteData | undefined) ?? fallbackData),
    ),
    { initialValue: fallbackData },
  );

  public readonly item = computed(() => this.routeData().item);
  public readonly groupTitle = computed(() => this.routeData().groupTitle);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  // ── 1. Import theme CSS ────────────────────────────────────────────────────

  protected readonly importThemeCssCode = `/* styles.css */
@import '@tailng-ui/theme/index.css';`;

  protected readonly angularJsonStylesCode = `// angular.json
"styles": [
  "node_modules/@tailng-ui/theme/index.css",
  "src/styles.css"
]`;

  // ── 2. CSS Custom Properties overview ─────────────────────────────────────

  protected readonly cssTokensExampleCode = `/* Example semantic tokens exposed by @tailng-ui/theme */
:root {
  /* Brand / accent */
  --tng-semantic-accent-brand:          #6366f1;
  --tng-semantic-accent-brand-hover:    #4f46e5;

  /* Foreground */
  --tng-semantic-foreground-primary:    #0f172a;
  --tng-semantic-foreground-secondary:  #64748b;
  --tng-semantic-foreground-disabled:   #94a3b8;

  /* Background */
  --tng-semantic-background-surface:    #ffffff;
  --tng-semantic-background-subtle:     #f8fafc;

  /* Border */
  --tng-semantic-border-default:        #e2e8f0;
  --tng-semantic-border-subtle:         #f1f5f9;

  /* Feedback */
  --tng-semantic-feedback-error:        #ef4444;
  --tng-semantic-feedback-success:      #22c55e;
  --tng-semantic-feedback-warning:      #f59e0b;
  --tng-semantic-feedback-info:         #3b82f6;

  /* Focus */
  --tng-semantic-focus-ring:            #6366f1;
}`;

  // ── 3. Dark mode ──────────────────────────────────────────────────────────

  protected readonly darkModeClassCode = `<!-- index.html – class strategy -->
<html class="dark">
  ...
</html>`;

  protected readonly darkModeMediaCode = `/* styles.css – media strategy (automatic) */
@import '@tailng-ui/theme/index.css';
/* Dark tokens are applied via @media (prefers-color-scheme: dark)
   inside the theme bundle – nothing extra required. */`;

  protected readonly darkModeAngularCode = `// app.component.ts
import { Component, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({ selector: 'app-root', template: \`
  <button (click)="toggleDark()">Toggle dark mode</button>
\` })
export class AppComponent {
  private readonly doc = inject(DOCUMENT);
  readonly isDark = signal(false);

  toggleDark(): void {
    this.isDark.update((v) => !v);
    this.doc.documentElement.classList.toggle('dark', this.isDark());
  }
}`;

  // ── 4. Customizing tokens ─────────────────────────────────────────────────

  protected readonly customizeTokensCode = `/* styles.css – override any token after importing the theme */
@import '@tailng-ui/theme/index.css';

:root {
  /* Swap brand accent to teal */
  --tng-semantic-accent-brand:       #0d9488;
  --tng-semantic-accent-brand-hover: #0f766e;
  --tng-semantic-focus-ring:         #0d9488;
}

.dark {
  --tng-semantic-accent-brand:       #2dd4bf;
  --tng-semantic-accent-brand-hover: #5eead4;
}`;

  // ── 5. Tailwind integration ───────────────────────────────────────────────

  protected readonly tailwindConfigCode = `// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tng: {
          brand:      'var(--tng-semantic-accent-brand)',
          'brand-hover': 'var(--tng-semantic-accent-brand-hover)',
          'fg-primary':   'var(--tng-semantic-foreground-primary)',
          'fg-secondary': 'var(--tng-semantic-foreground-secondary)',
          'bg-surface':   'var(--tng-semantic-background-surface)',
          'bg-subtle':    'var(--tng-semantic-background-subtle)',
          'border':       'var(--tng-semantic-border-default)',
        },
      },
    },
  },
} satisfies Config;`;

  protected readonly tailwindUsageCode = `<!-- Use TailNG tokens as Tailwind utility classes -->
<button class="bg-tng-brand hover:bg-tng-brand-hover text-white rounded px-4 py-2">
  Save changes
</button>`;

  // ── 6. provideTheme (optional runtime) ────────────────────────────────────

  protected readonly provideThemeCode = `// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideTheme } from '@tailng-ui/theme';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideTheme({ colorScheme: 'system' }), // 'light' | 'dark' | 'system'
  ],
});`;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
