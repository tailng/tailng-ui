import type { Routes } from '@angular/router';
import { COMPONENTS_AI_GROUP } from '../component-docs.data';

const chatItem = COMPONENTS_AI_GROUP.items.find((item) => item.slug === 'chat');
if (chatItem === undefined) {
  throw new Error('Missing "chat" in components AI docs group.');
}

export const COMPONENTS_AI_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: chatItem.slug,
  },
  {
    path: chatItem.slug,
    loadChildren: () => import('./chat/routes').then((module) => module.COMPONENTS_AI_CHAT_ROUTES),
  },
  {
    path: '**',
    redirectTo: chatItem.slug,
  },
];
