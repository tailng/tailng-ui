import { Component, inject } from '@angular/core';
import { TngShikiAdapter } from '../../../shared/tng-shiki.adapter';
import { ShikiHighlighterService } from '../../../shared/shiki-highlighter.service';
import { TngCodeBlock } from '@tailng-ui/ui/utilities';
import { TngCard } from '@tailng-ui/ui/layout';
import { TngButtonToggle, TngButtonToggleOption } from '@tailng-ui/ui/form';

@Component({
  standalone: true,
  selector: 'docs-tailwind-setup',
  templateUrl: './tailwind-setup.component.html',
  imports: [TngCodeBlock, TngCard, TngButtonToggle],
})
export class TailwindSetupComponent {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);

  installStatus: 'yarn' | 'npm' = 'yarn';
  runStatus: 'yarn' | 'npm' = 'yarn';

  titleOptions: TngButtonToggleOption<string>[] = [
    { value: 'yarn', label: 'Yarn' },
    { value: 'npm', label: 'npm' },
  ];

  get installTailwind(): string {
    return this.installStatus === 'yarn' ? this.yarnInstallTailwind : this.npmInstallTailwind;
  }
  get runCmd(): string {
    return this.runStatus === 'yarn' ? this.yarnRun : this.npmRun;
  }

  // 1) Install Tailwind
  readonly yarnInstallTailwind = `yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init`;

  readonly npmInstallTailwind = `npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init`;

  // 2) PostCSS config
  postcssConfig = `/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

  // 3) Tailwind config for tailng
  tailwindConfig = `import type { Config } from 'tailwindcss';

// tailng preset (recommended)
import tailngPreset from '@tailng-ui/theme/tailwind/tailng.preset';

// optional: tailng plugin (enable if your package exports it)
// import tailngPlugin from '@tailng-ui/theme/tailwind/tailng.plugin';

export default {
  content: [
    './src/**/*.{html,ts}',
    // If you're using Nx workspace libs:
    './libs/**/*.{html,ts}',
    // If you want scanning inside tailng packages:
    './node_modules/@tailng-ui/**/*.{html,ts,js,mjs}',
  ],
  presets: [tailngPreset],
  theme: {
    extend: {},
  },
  plugins: [
    // tailngPlugin,
  ],
} satisfies Config;
`;

  // 4) Global styles
  globalStyles = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* tailng theme tokens (recommended) */
@import '@tailng-ui/theme/css/tailng.css';
`;

  // 5) Angular build config note
  angularStylesConfig = `{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": ["src/styles.css"]
          }
        }
      }
    }
  }
}
`;

  // 6) Theme modes (optional)
  themeExample = `<body class="mode-light theme-default">
  <app-root></app-root>
</body>

<!-- dark mode -->
<body class="mode-dark theme-default">
  <app-root></app-root>
</body>
`;

  // 7) Verify setup
  verifyHtml = `<div class="p-4 rounded-md bg-primary text-white">
  Tailwind + tailng is working ✅
</div>
`;

  readonly yarnRun = `yarn start`;
  readonly npmRun = `npm run start`;
}