import type { TngAiExtensionPart } from '@tailng-ui/ai';
import type {
  ComponentAssistantOption,
  ComponentAssistantOptionGroup,
  ComponentAssistantPreviewId,
} from './component-assistant.catalog';
import {
  COMPONENT_ASSISTANT_OPTIONS,
  componentAssistantOption,
  groupComponentAssistantOptions,
} from './component-assistant.catalog';

export type ComponentAssistantExtensionView =
  | Readonly<{
      kind: 'prompt-options';
      groups: readonly ComponentAssistantOptionGroup[];
      options: readonly ComponentAssistantOption[];
    }>
  | Readonly<{ kind: 'component-preview'; previewId: ComponentAssistantPreviewId }>;

export function resolveComponentAssistantExtension(
  part: TngAiExtensionPart,
): ComponentAssistantExtensionView | undefined {
  if (part.name === 'tailng.dev/prompt-options') {
    return resolveOptions(part.value);
  }
  if (part.name === 'tailng.dev/component-preview') {
    return resolvePreview(part.value);
  }
  return undefined;
}

export function createPromptOptionsExtension(id: string): TngAiExtensionPart {
  return {
    id,
    type: 'extension',
    name: 'tailng.dev/prompt-options',
    value: {
      version: 1,
      options: COMPONENT_ASSISTANT_OPTIONS.map(({ id: optionId, label, prompt }) => ({
        id: optionId,
        label,
        prompt,
      })),
    },
  };
}

export function createComponentPreviewExtension(
  id: string,
  previewId: ComponentAssistantPreviewId,
): TngAiExtensionPart {
  return {
    id,
    type: 'extension',
    name: 'tailng.dev/component-preview',
    value: { version: 1, previewId },
  };
}

function resolveOptions(value: unknown): ComponentAssistantExtensionView | undefined {
  if (!isRecord(value) || !hasOnlyKeys(value, ['version', 'options']) || value['version'] !== 1) {
    return undefined;
  }
  const optionsValue: unknown = value['options'];
  if (!Array.isArray(optionsValue) || optionsValue.length !== COMPONENT_ASSISTANT_OPTIONS.length) {
    return undefined;
  }
  const options = optionsValue as readonly unknown[];
  for (let index = 0; index < options.length; index += 1) {
    if (!matchesCatalogOption(options[index], COMPONENT_ASSISTANT_OPTIONS[index])) {
      return undefined;
    }
  }
  return {
    kind: 'prompt-options',
    groups: groupComponentAssistantOptions(),
    options: COMPONENT_ASSISTANT_OPTIONS,
  };
}

function matchesCatalogOption(
  value: unknown,
  catalogOption: ComponentAssistantOption | undefined,
): boolean {
  if (catalogOption === undefined || !isRecord(value)) {
    return false;
  }
  if (!hasOnlyKeys(value, ['id', 'label', 'prompt'])) {
    return false;
  }
  return (
    matchesBoundedField(value, 'id', catalogOption.id, 64) &&
    matchesBoundedField(value, 'label', catalogOption.label, 80) &&
    matchesBoundedField(value, 'prompt', catalogOption.prompt, 200)
  );
}

function matchesBoundedField(
  value: Readonly<Record<string, unknown>>,
  field: string,
  expected: string,
  maxLength: number,
): boolean {
  const actual = value[field];
  return typeof actual === 'string' && actual.length <= maxLength && actual === expected;
}

function resolvePreview(value: unknown): ComponentAssistantExtensionView | undefined {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, ['version', 'previewId']) ||
    value['version'] !== 1 ||
    typeof value['previewId'] !== 'string'
  ) {
    return undefined;
  }
  const option = componentAssistantOption(value['previewId']);
  return option?.previewId === value['previewId']
    ? { kind: 'component-preview', previewId: option.previewId }
    : undefined;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(
  value: Readonly<Record<string, unknown>>,
  expected: readonly string[],
): boolean {
  const keys = Object.keys(value).sort();
  return (
    keys.length === expected.length &&
    keys.every((key, index) => key === [...expected].sort()[index])
  );
}
