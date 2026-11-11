import type { Routes } from '@angular/router';
import { COMPONENTS_AI_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_AI_GROUP;
const item = group.items.find((entry) => entry.slug === 'chat');
if (item === undefined) {
  throw new Error('Missing "chat" in components AI docs group.');
}

export const COMPONENTS_AI_CHAT_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./chat-page.component').then((module) => module.AiChatPageComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/ai-chat-overview-page.component').then(
            (module) => module.AiChatOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/ai-chat-api-page.component').then(
            (module) => module.AiChatApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/ai-chat-styling-page.component').then(
            (module) => module.AiChatStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/ai-chat-examples-page.component').then(
            (module) => module.AiChatExamplesPageComponent,
          ),
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
];
