import { provideHttpClient } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTngCodeHighlighting } from '@tailng-ui/components';
import { provideTngIcons } from '@tailng-ui/icons';
import { provideTailngTheme } from '@tailng-ui/theme';
import { appRoutes } from './app.routes';
import { lazyShikiCodeHighlighterAdapter } from './code-highlighting/lazy-shiki-code-highlighter.adapter';
import { resolveStoredDocsTheme } from './shared/theme/docs-theme-preference';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(appRoutes),
    provideTailngTheme({ theme: resolveStoredDocsTheme() }),
    provideTngIcons(),
    provideTngCodeHighlighting({
      adapters: [lazyShikiCodeHighlighterAdapter],
      defaultAdapter: 'shiki',
    }),
  ],
};
