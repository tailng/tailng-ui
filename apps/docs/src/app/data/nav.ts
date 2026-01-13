import { categories } from './categories';

export type NavItem = {
  title: string;
  route?: string;
  children?: NavItem[];
};

export const gettingStarted: NavItem = {
  title: 'Getting Started',
  children: [
    { title: 'Installation', route: '/components/getting-started/installation' },
    { title: 'Tailwind Setup', route: '/components/getting-started/tailwind-setup' },
    { title: 'Quick Start', route: '/components/getting-started/quick-start' },
  ],
};

export const componentNav: NavItem[] = categories
  .filter(c => !c.internal)
  .map(c => ({
    title: c.name,
    children: c.components
      .filter(x => !('internal' in x) || !x.internal)
      .map(x => ({
        title: x.name,
        route: `/components${x.route}`,
      })),
  }));

export const docsNav: NavItem[] = [gettingStarted, ...componentNav];
