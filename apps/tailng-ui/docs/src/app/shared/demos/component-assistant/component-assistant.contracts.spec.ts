import { describe, expect, it } from 'vitest';
import {
  COMPONENT_ASSISTANT_CATEGORIES,
  COMPONENT_ASSISTANT_OPTIONS,
  groupComponentAssistantOptions,
  routeComponentAssistantPrompt,
  validateComponentAssistantCatalog,
} from './component-assistant.catalog';
import {
  createPromptOptionsExtension,
  resolveComponentAssistantExtension,
} from './component-assistant.extensions';

describe('component assistant contracts', () => {
  it('AI-DEMO-EXPAND-001..003 defines and groups twelve stable catalog options', () => {
    expect(COMPONENT_ASSISTANT_CATEGORIES.map(({ id }) => id)).toEqual([
      'forms',
      'data',
      'navigation-layout',
      'feedback',
    ]);
    expect(COMPONENT_ASSISTANT_OPTIONS).toHaveLength(12);
    expect(COMPONENT_ASSISTANT_OPTIONS.map(({ id }) => id)).toEqual([
      'release-date',
      'project-date-range',
      'assignee-search',
      'rollout-slider',
      'monthly-installs',
      'adoption-trend',
      'team-table',
      'release-faq',
      'release-tabs',
      'release-steps',
      'release-status',
      'release-progress',
    ]);
    expect(
      groupComponentAssistantOptions().map(({ category, options }) => [
        category.label,
        options.map(({ id }) => id),
      ]),
    ).toEqual([
      ['Forms', ['release-date', 'project-date-range', 'assignee-search', 'rollout-slider']],
      ['Data', ['monthly-installs', 'adoption-trend', 'team-table']],
      ['Navigation & layout', ['release-faq', 'release-tabs', 'release-steps']],
      ['Feedback', ['release-status', 'release-progress']],
    ]);
    expect(validateComponentAssistantCatalog()).toEqual({ ok: true });
  });

  it('AI-DEMO-GREET-002/003 routes normalized greetings and exact prompts', () => {
    expect(routeComponentAssistantPrompt('  HeLLo ')).toEqual({ kind: 'options' });
    expect(routeComponentAssistantPrompt('hey')).toEqual({ kind: 'options' });
    expect(routeComponentAssistantPrompt('Create a release date picker.')).toEqual({
      kind: 'preview',
      option: COMPONENT_ASSISTANT_OPTIONS[0],
    });
    expect(routeComponentAssistantPrompt('unknown')).toEqual({ kind: 'fallback' });
  });

  it('AI-DEMO-EXPAND-004/005 routes every expanded prompt without changing greeting fallback', () => {
    for (const option of COMPONENT_ASSISTANT_OPTIONS) {
      expect(routeComponentAssistantPrompt(option.prompt)).toEqual({ kind: 'preview', option });
    }
    expect(routeComponentAssistantPrompt('HI')).toEqual({ kind: 'options' });
    expect(routeComponentAssistantPrompt('not supported')).toEqual({ kind: 'fallback' });
  });

  it('AI-DEMO-EXPAND-002/006 rejects duplicate prompts and unknown categories', () => {
    const firstOption = COMPONENT_ASSISTANT_OPTIONS[0];
    const lastOption = COMPONENT_ASSISTANT_OPTIONS.at(-1);
    if (firstOption === undefined || lastOption === undefined) {
      throw new Error('Expanded catalog fixture is empty.');
    }
    const duplicatePrompt = [
      ...COMPONENT_ASSISTANT_OPTIONS.slice(0, -1),
      { ...lastOption, prompt: firstOption.prompt },
    ];
    expect(
      validateComponentAssistantCatalog(COMPONENT_ASSISTANT_CATEGORIES, duplicatePrompt),
    ).toEqual(expect.objectContaining({ ok: false }));
    expect(
      validateComponentAssistantCatalog(COMPONENT_ASSISTANT_CATEGORIES, [
        { ...firstOption, categoryId: 'unknown' as 'forms' },
      ]),
    ).toEqual(expect.objectContaining({ ok: false }));
  });

  it('AI-DEMO-EXPAND-007 keeps the version-one wire payload category-free', () => {
    const extension = createPromptOptionsExtension('expanded-options');
    expect(extension.value).toEqual({
      version: 1,
      options: COMPONENT_ASSISTANT_OPTIONS.map(({ id, label, prompt }) => ({ id, label, prompt })),
    });
    expect(JSON.stringify(extension.value)).not.toContain('categoryId');
    expect(JSON.stringify(extension.value)).not.toContain('actionName');
  });

  it('AI-DEMO-EXT-001 resolves only the canonical options payload', () => {
    expect(
      resolveComponentAssistantExtension({
        id: 'options',
        type: 'extension',
        name: 'tailng.dev/prompt-options',
        value: {
          version: 1,
          options: COMPONENT_ASSISTANT_OPTIONS.map(({ id, label, prompt }) => ({
            id,
            label,
            prompt,
          })),
        },
      }),
    ).toEqual({
      kind: 'prompt-options',
      groups: groupComponentAssistantOptions(),
      options: COMPONENT_ASSISTANT_OPTIONS,
    });
  });

  it('AI-DEMO-EXT-002 resolves an allowlisted component preview', () => {
    expect(
      resolveComponentAssistantExtension({
        id: 'preview',
        type: 'extension',
        name: 'tailng.dev/component-preview',
        value: { version: 1, previewId: 'team-table' },
      }),
    ).toEqual({ kind: 'component-preview', previewId: 'team-table' });
  });

  it.each([
    'project-date-range',
    'assignee-search',
    'rollout-slider',
    'adoption-trend',
    'release-faq',
    'release-tabs',
    'release-steps',
    'release-progress',
  ] as const)('AI-DEMO-EXPAND-011 resolves the %s preview ID', (previewId) => {
    expect(
      resolveComponentAssistantExtension({
        id: `preview-${previewId}`,
        type: 'extension',
        name: 'tailng.dev/component-preview',
        value: { version: 1, previewId },
      }),
    ).toEqual({ kind: 'component-preview', previewId });
  });

  it('AI-DEMO-EXT-003..006 rejects unknown versions, IDs, markup, and oversized options', () => {
    expect(
      resolveComponentAssistantExtension({
        id: 'bad-version',
        type: 'extension',
        name: 'tailng.dev/component-preview',
        value: { version: 2, previewId: 'team-table' },
      }),
    ).toBeUndefined();
    expect(
      resolveComponentAssistantExtension({
        id: 'unknown-id',
        type: 'extension',
        name: 'tailng.dev/component-preview',
        value: { version: 1, previewId: 'app-secret-component', template: '<script />' },
      }),
    ).toBeUndefined();
    expect(
      resolveComponentAssistantExtension({
        id: 'too-many',
        type: 'extension',
        name: 'tailng.dev/prompt-options',
        value: {
          version: 1,
          options: Array.from({ length: 20 }, (_, index) => ({
            id: `option-${index}`,
            label: 'Option',
            prompt: 'Prompt',
          })),
        },
      }),
    ).toBeUndefined();
  });

  it('AI-DEMO-EXPAND-009/010 rejects legacy, reordered, and implementation-bearing payloads', () => {
    const canonical = COMPONENT_ASSISTANT_OPTIONS.map(({ id, label, prompt }) => ({
      id,
      label,
      prompt,
    }));
    for (const options of [canonical.slice(0, 4), [...canonical].reverse()]) {
      expect(
        resolveComponentAssistantExtension({
          id: 'noncanonical-options',
          type: 'extension',
          name: 'tailng.dev/prompt-options',
          value: { version: 1, options },
        }),
      ).toBeUndefined();
    }
    expect(
      resolveComponentAssistantExtension({
        id: 'implementation-bearing-options',
        type: 'extension',
        name: 'tailng.dev/prompt-options',
        value: {
          version: 1,
          options: canonical.map((option, index) =>
            index === 0 ? { ...option, categoryId: 'forms', selector: 'app-secret' } : option,
          ),
        },
      }),
    ).toBeUndefined();
  });
});
