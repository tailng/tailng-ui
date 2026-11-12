export type ComponentAssistantCategoryId = 'forms' | 'data' | 'navigation-layout' | 'feedback';

export type ComponentAssistantPreviewId =
  | 'release-date'
  | 'project-date-range'
  | 'assignee-search'
  | 'rollout-slider'
  | 'monthly-installs'
  | 'adoption-trend'
  | 'team-table'
  | 'release-faq'
  | 'release-tabs'
  | 'release-steps'
  | 'release-status'
  | 'release-progress';

export type ComponentAssistantCategory = Readonly<{
  id: ComponentAssistantCategoryId;
  label: string;
}>;

export type ComponentAssistantOption = Readonly<{
  id: ComponentAssistantPreviewId;
  categoryId: ComponentAssistantCategoryId;
  actionName: string;
  label: string;
  prompt: string;
  previewId: ComponentAssistantPreviewId;
  assistantIntroduction: string;
}>;

export type ComponentAssistantOptionGroup = Readonly<{
  category: ComponentAssistantCategory;
  options: readonly ComponentAssistantOption[];
}>;

export type ComponentAssistantRoute =
  | Readonly<{ kind: 'options' }>
  | Readonly<{ kind: 'preview'; option: ComponentAssistantOption }>
  | Readonly<{ kind: 'fallback' }>;

export type ComponentAssistantCatalogValidation =
  | Readonly<{ ok: true }>
  | Readonly<{ ok: false; reason: string }>;

export const COMPONENT_ASSISTANT_CATEGORIES: readonly ComponentAssistantCategory[] = Object.freeze([
  Object.freeze({ id: 'forms', label: 'Forms' }),
  Object.freeze({ id: 'data', label: 'Data' }),
  Object.freeze({ id: 'navigation-layout', label: 'Navigation & layout' }),
  Object.freeze({ id: 'feedback', label: 'Feedback' }),
]);

export const COMPONENT_ASSISTANT_OPTIONS: readonly ComponentAssistantOption[] = Object.freeze([
  option(
    'release-date',
    'forms',
    'Choose a release date',
    'Create a release date picker.',
    'Here is an interactive TailNG datepicker for the release.',
  ),
  option(
    'project-date-range',
    'forms',
    'Plan a project date range',
    'Create a project date range picker.',
    'Here is a TailNG date-range picker for the project window.',
  ),
  option(
    'assignee-search',
    'forms',
    'Find a teammate',
    'Create an assignee autocomplete.',
    'Here is a TailNG autocomplete for choosing a teammate.',
  ),
  option(
    'rollout-slider',
    'forms',
    'Set rollout percentage',
    'Create a rollout percentage slider.',
    'Here is a TailNG slider for the rollout percentage.',
  ),
  option(
    'monthly-installs',
    'data',
    'Show monthly installs',
    'Visualize monthly TailNG installs.',
    'Here is a TailNG bar chart of monthly installs.',
  ),
  option(
    'adoption-trend',
    'data',
    'Show adoption trend',
    'Visualize weekly TailNG adoption.',
    'Here is a TailNG line chart of weekly adoption.',
  ),
  option(
    'team-table',
    'data',
    'Display a team table',
    'Show a sortable team table.',
    'Here is a compact sortable TailNG team table.',
  ),
  option(
    'release-faq',
    'navigation-layout',
    'Show release FAQ',
    'Create an accordion for release questions.',
    'Here is a TailNG accordion for common release questions.',
  ),
  option(
    'release-tabs',
    'navigation-layout',
    'Build release settings tabs',
    'Create tabs for release settings.',
    'Here are TailNG tabs for release settings.',
  ),
  option(
    'release-steps',
    'navigation-layout',
    'Show release steps',
    'Create a release workflow stepper.',
    'Here is a compact TailNG release workflow stepper.',
  ),
  option(
    'release-status',
    'feedback',
    'Create status labels',
    'Create status tags for a release.',
    'Here are TailNG tags for common release states.',
  ),
  option(
    'release-progress',
    'feedback',
    'Track release progress',
    'Show release progress.',
    'Here is a TailNG progress bar for the release.',
  ),
]);

export function groupComponentAssistantOptions(
  options: readonly ComponentAssistantOption[] = COMPONENT_ASSISTANT_OPTIONS,
): readonly ComponentAssistantOptionGroup[] {
  return COMPONENT_ASSISTANT_CATEGORIES.map((category) =>
    Object.freeze({
      category,
      options: Object.freeze(options.filter((candidate) => candidate.categoryId === category.id)),
    }),
  );
}

export function validateComponentAssistantCatalog(
  categories: readonly ComponentAssistantCategory[] = COMPONENT_ASSISTANT_CATEGORIES,
  options: readonly ComponentAssistantOption[] = COMPONENT_ASSISTANT_OPTIONS,
): ComponentAssistantCatalogValidation {
  return (
    validateCatalogPresence(categories, options) ??
    validateCategories(categories, options) ??
    validateUniqueOptionFields(options) ?? { ok: true }
  );
}

export function routeComponentAssistantPrompt(prompt: string): ComponentAssistantRoute {
  const normalized = normalize(prompt);
  if (normalized === 'hi' || normalized === 'hello' || normalized === 'hey') {
    return { kind: 'options' };
  }
  const matchingOption = COMPONENT_ASSISTANT_OPTIONS.find(
    (candidate) => normalize(candidate.prompt) === normalized,
  );
  return matchingOption === undefined
    ? { kind: 'fallback' }
    : { kind: 'preview', option: matchingOption };
}

export function componentAssistantOption(id: string): ComponentAssistantOption | undefined {
  return COMPONENT_ASSISTANT_OPTIONS.find((candidate) => candidate.id === id);
}

function option(
  ...definition: readonly [
    id: ComponentAssistantPreviewId,
    categoryId: ComponentAssistantCategoryId,
    label: string,
    prompt: string,
    assistantIntroduction: string,
  ]
): ComponentAssistantOption {
  const [id, categoryId, label, prompt, assistantIntroduction] = definition;
  return Object.freeze({
    id,
    categoryId,
    actionName: `component_assistant.${id.replaceAll('-', '_')}`,
    label,
    prompt,
    previewId: id,
    assistantIntroduction,
  });
}

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

function validateCatalogPresence(
  categories: readonly ComponentAssistantCategory[],
  options: readonly ComponentAssistantOption[],
): ComponentAssistantCatalogValidation | undefined {
  return categories.length === 0 || options.length === 0
    ? { ok: false, reason: 'Catalog categories and options must not be empty.' }
    : undefined;
}

function validateCategories(
  categories: readonly ComponentAssistantCategory[],
  options: readonly ComponentAssistantOption[],
): ComponentAssistantCatalogValidation | undefined {
  const categoryIds = new Set(categories.map(({ id }) => id));
  if (categoryIds.size !== categories.length) {
    return { ok: false, reason: 'Category IDs must be unique.' };
  }
  if (categories.some(({ label }) => label.trim().length === 0)) {
    return { ok: false, reason: 'Category labels must not be empty.' };
  }
  if (options.some(({ categoryId }) => !categoryIds.has(categoryId))) {
    return { ok: false, reason: 'Every option must reference a known category.' };
  }
  return categories.some(({ id }) => !options.some(({ categoryId }) => categoryId === id))
    ? { ok: false, reason: 'Every category must contain an option.' }
    : undefined;
}

function validateUniqueOptionFields(
  options: readonly ComponentAssistantOption[],
): ComponentAssistantCatalogValidation | undefined {
  const uniqueFields: readonly (keyof Pick<
    ComponentAssistantOption,
    'id' | 'actionName' | 'prompt' | 'previewId'
  >)[] = ['id', 'actionName', 'prompt', 'previewId'];
  for (const field of uniqueFields) {
    const values = options.map((candidate) => normalize(String(candidate[field])));
    if (values.some((value) => value.length === 0) || new Set(values).size !== values.length) {
      return { ok: false, reason: `Option ${field} values must be nonempty and unique.` };
    }
  }
  return undefined;
}
