import { Component, computed, signal, type Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { TngTableSortDirection } from '@tailng-ui/cdk';
import {
  TngBarChartComponent,
  TngLineChartComponent,
  type TngChartData,
  type TngChartSeries,
} from '@tailng-ui/charts';
import {
  TngCardComponent,
  TngDatepickerComponent,
  TngDateRangePickerComponent,
  TngAutocompleteComponent,
  TngBadge,
  TngTag,
  TngTableComponent,
  TngTableCellTpl,
  TngTree,
  TngTreeTable,
  type TngTableColumn,
  type TngTreeItem,
  type TngTreeTableColumn,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import type { TngTableSortChange, TngTreeTableKey } from '@tailng-ui/primitives';
import { LandingComponentAssistantComponent } from './component-assistant/landing-component-assistant.component';

// ─── Showcase types & data ────────────────────────────────────────────────────

type Country = Readonly<{ code: string; name: string; flag: string }>;

const COUNTRIES: readonly Country[] = [
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
];

type TeamRow = Readonly<{
  name: string;
  role: string;
  team: string;
  joined: string;
  status: string;
}>;

const DEMO_TEAM: readonly TeamRow[] = [
  {
    name: 'Sofia Reyes',
    role: 'Product Designer',
    team: 'Design',
    joined: 'Jan 2023',
    status: 'Active',
  },
  {
    name: 'Liam Chen',
    role: 'Frontend Engineer',
    team: 'Platform',
    joined: 'Mar 2022',
    status: 'Active',
  },
  {
    name: 'Amara Diallo',
    role: 'Eng Manager',
    team: 'Platform',
    joined: 'Aug 2021',
    status: 'On leave',
  },
  {
    name: 'Noah Park',
    role: 'Product Manager',
    team: 'Growth',
    joined: 'Feb 2024',
    status: 'Active',
  },
  {
    name: 'Isla Novak',
    role: 'Backend Engineer',
    team: 'Platform',
    joined: 'Nov 2022',
    status: 'Active',
  },
];

const DEMO_TABLE_COLUMNS: readonly TngTableColumn<TeamRow>[] = [
  {
    id: 'identity',
    label: 'Identity',
    children: [
      { id: 'name', label: 'Name', accessor: 'name', sortable: true },
      { id: 'role', label: 'Role', accessor: 'role', sortable: true },
    ],
  },
  {
    id: 'assignment',
    label: 'Team & Status',
    children: [
      { id: 'team', label: 'Team', accessor: 'team', sortable: true },
      { id: 'joined', label: 'Joined', accessor: 'joined', sortable: true },
      { id: 'status', label: 'Status', accessor: 'status', sortable: true },
    ],
  },
];

// ─── Tree-table demo ───────────────────────────────────────────────────────────

type OrgRow = {
  id: string;
  name: string;
  role: string;
  dept: string;
  location: string;
  children?: OrgRow[];
};

const DEMO_ORG_DATA: readonly OrgRow[] = [
  {
    id: 'eng',
    name: 'Engineering',
    role: 'Division',
    dept: 'Product',
    location: 'Remote',
    children: [
      {
        id: 'platform',
        name: 'Platform',
        role: 'Team',
        dept: 'Product',
        location: 'Remote',
        children: [
          {
            id: 'liam',
            name: 'Liam Chen',
            role: 'Senior Engineer',
            dept: 'Platform',
            location: 'San Francisco',
          },
          {
            id: 'isla',
            name: 'Isla Novak',
            role: 'Engineer',
            dept: 'Platform',
            location: 'Berlin',
          },
          {
            id: 'amara',
            name: 'Amara Diallo',
            role: 'Eng Manager',
            dept: 'Platform',
            location: 'Lagos',
          },
        ],
      },
    ],
  },
  {
    id: 'design',
    name: 'Design',
    role: 'Division',
    dept: 'Product',
    location: 'Remote',
    children: [
      {
        id: 'sofia',
        name: 'Sofia Reyes',
        role: 'Product Designer',
        dept: 'Design',
        location: 'Mexico City',
      },
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    role: 'Division',
    dept: 'Business',
    location: 'Remote',
    children: [
      { id: 'noah', name: 'Noah Park', role: 'Product Manager', dept: 'Growth', location: 'Seoul' },
    ],
  },
];

const DEMO_ORG_COLUMNS: readonly TngTreeTableColumn<OrgRow>[] = [
  {
    key: 'employee',
    label: 'Employee',
    children: [
      { key: 'name', label: 'Name', treeToggle: true, accessor: (r) => r.name, width: 180 },
      { key: 'role', label: 'Role', accessor: (r) => r.role },
    ],
  },
  {
    key: 'assignment',
    label: 'Assignment',
    children: [
      { key: 'dept', label: 'Department', accessor: (r) => r.dept },
      { key: 'location', label: 'Location', accessor: (r) => r.location },
    ],
  },
];

const DEMO_TREE_NODES: readonly TngTreeItem[] = [
  { id: 'tailng-ui', label: 'tailng-ui', description: 'workspace root' },
  { id: 'libs', label: 'libs', parentId: 'tailng-ui' },
  { id: 'components', label: 'components', parentId: 'libs' },
  { id: 'primitives', label: 'primitives', parentId: 'libs' },
  { id: 'theme', label: 'theme', parentId: 'libs' },
  { id: 'charts', label: 'charts', parentId: 'libs' },
  { id: 'apps', label: 'apps', parentId: 'tailng-ui' },
  { id: 'docs', label: 'docs', parentId: 'apps' },
  { id: 'playground', label: 'playground', parentId: 'apps' },
];

const DEMO_BAR_DATA: TngChartData = [
  { month: 'Jan', installs: 11 },
  { month: 'Feb', installs: 18 },
  { month: 'Mar', installs: 27 },
  { month: 'Apr', installs: 36 },
  { month: 'May', installs: 49 },
  { month: 'Jun', installs: 64 },
];

const DEMO_LINE_DATA: TngChartData = [
  { week: 'W1', users: 420, active: 310 },
  { week: 'W2', users: 580, active: 430 },
  { week: 'W3', users: 640, active: 510 },
  { week: 'W4', users: 720, active: 590 },
  { week: 'W5', users: 850, active: 680 },
  { week: 'W6', users: 940, active: 750 },
];

const DEMO_LINE_SERIES: readonly TngChartSeries[] = [
  { key: 'users', label: 'Total Users', yField: 'users', smooth: true },
  { key: 'active', label: 'Active Users', yField: 'active', smooth: true },
];

// ─── Page content types ────────────────────────────────────────────────────────

type ContentCard = Readonly<{
  title: string;
  description: string;
  href?: string;
}>;

type RouteCard = Readonly<{
  title: string;
  description: string;
  route: string;
}>;

const packageCards: readonly ContentCard[] = [
  {
    title: 'CDK',
    description:
      'Low-level utilities for interaction, behavior, structure, focus management, overlays, and shared UI mechanics.',
    href: '/cdk',
  },
  {
    title: 'Headless',
    description:
      'Headless accessible foundations for menus, popovers, dialogs, tabs, switches, drawers, and more.',
    href: '/headless',
  },
  {
    title: 'Components',
    description:
      'Reusable UI components with sensible structure and minimal styling, ready for real product development.',
    href: '/components',
  },
  {
    title: 'Icons',
    description: 'A consistent icon set designed to fit naturally into TailNG apps and docs.',
    href: '/icons',
  },
  {
    title: 'Theme',
    description:
      'Tokens, visual foundations, presets, and mode-aware styling for product interfaces.',
    href: '/theme',
  },
  {
    title: 'Install',
    description:
      'Selective adoption inspired by shadcn-like workflows, so teams can own exactly what they ship.',
  },
];

const principles: readonly ContentCard[] = [
  {
    title: 'Accessibility first',
    description:
      'Strong interaction patterns, semantics, keyboard support, and ARIA behavior are the baseline.',
  },
  {
    title: 'Ownable by teams',
    description:
      'UI code stays understandable, adaptable, and maintainable for product teams over time.',
  },
  {
    title: 'Layered architecture',
    description:
      'Adopt CDK, headless patterns, components, icons, and themes at the level that fits your project.',
  },
  {
    title: 'Angular-native',
    description:
      'Built for modern Angular patterns with a signal-first mindset and predictable APIs.',
  },
  {
    title: 'Styling flexibility',
    description:
      'TailNG supports branding and custom design systems without forcing one rigid visual identity.',
  },
  {
    title: 'Practical by default',
    description: 'Designed for real dashboards, forms, overlays, tables, and product workflows.',
  },
];

const whyTailng: readonly ContentCard[] = [
  {
    title: 'Modular adoption',
    description:
      'Start with components, go lower with headless patterns, and build deeper with CDK only when needed.',
  },
  {
    title: 'Better ownership',
    description:
      'The architecture encourages clarity so teams can understand and evolve the UI they ship.',
  },
  {
    title: 'Accessibility that matters',
    description:
      'Focus behavior, keyboard interactions, and semantics are treated as core product quality.',
  },
  {
    title: 'Design-system friendly',
    description:
      'TailNG fits branded ecosystems instead of forcing a fixed visual identity on every product.',
  },
  {
    title: 'Flexible install path',
    description:
      'Choose package installation or selective ownership patterns based on how your team works.',
  },
];

const installOptions: readonly ContentCard[] = [
  {
    title: 'Use components',
    description:
      'Start with ready-to-use building blocks for forms, overlays, navigation, and data UI.',
  },
  {
    title: 'Use headless',
    description: 'Build your own presentation layer on top of accessible behavior contracts.',
  },
  {
    title: 'Use CDK',
    description: 'Compose advanced product patterns with lower-level behavior foundations.',
  },
  {
    title: 'Use selective install',
    description: 'Adopt only the modules your team wants to own and evolve.',
  },
];

const themeHighlights: readonly ContentCard[] = [
  {
    title: 'Theme tokens',
    description:
      'Define reusable values for color, spacing, typography, borders, and surfaces across the product.',
  },
  {
    title: 'Presets and customization',
    description: 'Start from a preset, then adapt TailNG to match your internal system language.',
  },
  {
    title: 'Dark and light support',
    description: 'Support modern UI expectations with clean mode-aware visual behavior.',
  },
  {
    title: 'Styling without lock-in',
    description: 'Works with vanilla CSS, utility workflows, and design-system conventions.',
  },
];

const exploreLinks: readonly RouteCard[] = [
  {
    title: 'Components',
    description: 'Browse ready-made UI building blocks for common product needs.',
    route: '/components',
  },
  {
    title: 'Headless',
    description: 'Explore accessible headless interaction patterns for custom UI development.',
    route: '/headless',
  },
  {
    title: 'Headless Collapsible',
    description: 'Jump directly to the headless collapsible docs in the layout section.',
    route: '/headless/layout/collapsible',
  },
  {
    title: 'CDK',
    description: 'See the low-level behavioral foundations that power the system.',
    route: '/cdk',
  },
  {
    title: 'Theme',
    description: 'Understand tokens, presets, and mode-aware styling foundations.',
    route: '/theme',
  },
  {
    title: 'Icons',
    description: 'Browse icon usage patterns for interface consistency.',
    route: '/icons',
  },
];

@Component({
  selector: 'app-landing-page',
  imports: [
    RouterLink,
    TngIcon,
    TngCardComponent,
    TngDatepickerComponent,
    TngDateRangePickerComponent,
    TngAutocompleteComponent,
    TngBadge,
    TngTag,
    TngTableComponent,
    TngTableCellTpl,
    TngTree,
    TngTreeTable,
    TngBarChartComponent,
    TngLineChartComponent,
    LandingComponentAssistantComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
  // ─── Page content ──────────────────────────────────────────────────────────
  protected readonly packageCards = packageCards;
  protected readonly principles = principles;
  protected readonly whyTailng = whyTailng;
  protected readonly installOptions = installOptions;
  protected readonly themeHighlights = themeHighlights;
  protected readonly exploreLinks = exploreLinks;

  // ─── Showcase: autocomplete ─────────────────────────────────────────────────
  protected readonly countryQuery = signal('');

  protected readonly filteredCountries = computed(() => {
    const q = this.countryQuery().toLowerCase().trim();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q),
    );
  });

  protected readonly getCountryValue = (c: Country): string => c.code;
  protected readonly getCountryLabel = (c: Country): string => c.name;

  // ─── Showcase: badges ───────────────────────────────────────────────────────
  protected readonly notifCount = signal(5);
  protected readonly msgCount = signal(12);

  // ─── Showcase: table ────────────────────────────────────────────────────────
  protected readonly demoTableColumns = DEMO_TABLE_COLUMNS;

  protected readonly sortActive = signal<string | null>(null);
  protected readonly sortDirection = signal<TngTableSortDirection | null>(null);

  protected readonly sortedTeam: Signal<readonly TeamRow[]> = computed(() => {
    const col = this.sortActive();
    const dir = this.sortDirection();
    if (!col || !dir) return DEMO_TEAM;

    return [...DEMO_TEAM].sort((a, b) => {
      const av = String(a[col as keyof TeamRow] ?? '').toLowerCase();
      const bv = String(b[col as keyof TeamRow] ?? '').toLowerCase();
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return dir === 'asc' ? cmp : -cmp;
    });
  });

  protected onTableSortChange(change: TngTableSortChange): void {
    this.sortActive.set(change.activeColumnId);
    this.sortDirection.set(change.direction);
  }

  protected getStatusConfig(status: string): Readonly<{ icon: string; classes: string }> {
    switch (status) {
      case 'Active':
        return { icon: 'circle-check', classes: 'text-tng-fg-success' };
      case 'On leave':
        return { icon: 'circle-pause', classes: 'text-tng-fg-warning' };
      case 'Inactive':
        return { icon: 'circle-minus', classes: 'text-tng-fg-secondary' };
      default:
        return { icon: 'circle-dot', classes: 'text-tng-fg-secondary' };
    }
  }

  // ─── Showcase: tree ─────────────────────────────────────────────────────────
  protected readonly treeNodes = DEMO_TREE_NODES;
  protected readonly treeExpanded = ['tailng-ui', 'libs', 'apps'];

  // ─── Showcase: tree-table ───────────────────────────────────────────────────
  protected readonly orgData = DEMO_ORG_DATA;
  protected readonly orgColumns = DEMO_ORG_COLUMNS;
  protected readonly orgExpandedKeys = signal<readonly TngTreeTableKey[]>([
    'eng',
    'platform',
    'design',
    'growth',
  ]);
  protected readonly getOrgKey = (row: OrgRow): string => row.id;
  protected readonly getOrgChildren = (row: OrgRow): readonly OrgRow[] | undefined => row.children;

  // ─── Showcase: charts ───────────────────────────────────────────────────────
  protected readonly barChartData = DEMO_BAR_DATA;
  protected readonly lineChartData = DEMO_LINE_DATA;
  protected readonly lineChartSeries = DEMO_LINE_SERIES;
}
