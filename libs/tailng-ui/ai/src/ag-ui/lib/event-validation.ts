import { EventType } from '@ag-ui/core';
import type { Event } from '@ag-ui/core';
import { EventSchema } from '@ag-ui/core/schemas';
// eslint-disable-next-line @nx/enforce-module-boundaries -- A secondary entry point must consume the primary entry point through its public package boundary.
import { validateTngAiJsonValue } from '@tailng-ui/ai';

export type TngAgUiProfile = 'required-chat' | 'complete';

export type TngAgUiValidationOptions = {
  readonly profile?: TngAgUiProfile;
  readonly maxBytes?: number;
  readonly maxDepth?: number;
  readonly maxEntries?: number;
};

export type TngAgUiValidationDiagnostic = {
  readonly code: 'invalid-event' | 'unsupported-event' | 'limit-exceeded';
  readonly message: string;
};

export type TngAgUiValidationResult =
  | { readonly valid: true; readonly event: Event }
  | { readonly valid: false; readonly diagnostic: TngAgUiValidationDiagnostic };

export function validateTngAgUiEvent(
  value: unknown,
  options: TngAgUiValidationOptions = {},
): TngAgUiValidationResult {
  const boundary = validateBoundary(value, options);
  if (!boundary.valid) {
    return boundary;
  }

  const type = readEventType(value);
  if (type === undefined) {
    return invalid('invalid-event', 'An AG-UI event requires a string type discriminator.');
  }
  const profileDiagnostic = validateProfile(type, options.profile ?? 'required-chat');
  if (profileDiagnostic !== undefined) {
    return { valid: false, diagnostic: profileDiagnostic };
  }
  return parseOfficialEvent(value);
}

const REQUIRED_EVENT_TYPES = new Set<string>([
  EventType.RUN_STARTED,
  EventType.RUN_FINISHED,
  EventType.RUN_ERROR,
  EventType.TEXT_MESSAGE_START,
  EventType.TEXT_MESSAGE_CONTENT,
  EventType.TEXT_MESSAGE_END,
  EventType.TEXT_MESSAGE_CHUNK,
  EventType.TOOL_CALL_START,
  EventType.TOOL_CALL_ARGS,
  EventType.TOOL_CALL_END,
  EventType.TOOL_CALL_CHUNK,
  EventType.TOOL_CALL_RESULT,
  EventType.MESSAGES_SNAPSHOT,
]);

const ALL_EVENT_TYPES = new Set<string>(Object.values(EventType));

function validateBoundary(
  value: unknown,
  options: TngAgUiValidationOptions,
): TngAgUiValidationResult | { readonly valid: true } {
  const json = validateTngAiJsonValue(value, {
    maxDepth: options.maxDepth ?? 64,
    maxEntries: options.maxEntries ?? 50_000,
  });
  if (!json.valid) {
    const code = json.error.code === 'limit-exceeded' ? 'limit-exceeded' : 'invalid-event';
    return invalid(code, json.error.message);
  }
  const maximum = options.maxBytes ?? 1_048_576;
  const bytes = new TextEncoder().encode(JSON.stringify(value)).byteLength;
  return bytes > maximum
    ? invalid('limit-exceeded', `The AG-UI event exceeds ${maximum} bytes.`)
    : { valid: true };
}

function readEventType(value: unknown): string | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }
  const type = (value as Readonly<Record<string, unknown>>)['type'];
  return typeof type === 'string' ? type : undefined;
}

function supportsProfile(type: string, profile: TngAgUiProfile): boolean {
  return profile === 'complete' || REQUIRED_EVENT_TYPES.has(type);
}

function validateProfile(
  type: string,
  profile: TngAgUiProfile,
): TngAgUiValidationDiagnostic | undefined {
  return ALL_EVENT_TYPES.has(type) && supportsProfile(type, profile)
    ? undefined
    : {
        code: 'unsupported-event',
        message: `The event type ${type} is not supported by this profile.`,
      };
}

function parseOfficialEvent(value: unknown): TngAgUiValidationResult {
  const parsed = EventSchema.safeParse(value);
  return parsed.success
    ? { valid: true, event: parsed.data }
    : invalid('invalid-event', parsed.error.issues[0]?.message ?? 'The AG-UI event is invalid.');
}

function invalid(
  code: TngAgUiValidationDiagnostic['code'],
  message: string,
): TngAgUiValidationResult {
  return { valid: false, diagnostic: { code, message } };
}
