import { validateTngAiJsonValue } from './json.types';
import type { TngAiJsonValue } from './json.types';
import type {
  TngAiMessagePart,
  TngAiTextPart,
  TngAiToolCallPart,
  TngAiToolCallStatus,
} from './message-part.types';
import type { TngAiMessage, TngAiRole } from './message.types';

export type TngAiMessageDiagnostic = {
  readonly code:
    | 'duplicate-part'
    | 'invalid-annotation'
    | 'invalid-extension-name'
    | 'missing-part'
    | 'invalid-lifecycle'
    | 'invalid-tool-arguments';
  readonly message: string;
  readonly partId?: string;
};

export type TngAiMessageOperationResult =
  | {
      readonly ok: true;
      readonly value: TngAiMessage;
      readonly diagnostics?: readonly TngAiMessageDiagnostic[];
    }
  | { readonly ok: false; readonly error: TngAiMessageDiagnostic };

type PartUpdateResult =
  | {
      readonly ok: true;
      readonly part: TngAiMessagePart;
      readonly diagnostics?: readonly TngAiMessageDiagnostic[];
    }
  | { readonly ok: false; readonly error: TngAiMessageDiagnostic };

type PartUpdateRequest = {
  readonly partId: string;
  readonly type: TngAiMessagePart['type'];
  readonly update: (part: TngAiMessagePart) => PartUpdateResult;
};

const DEFAULT_VISIBLE_ROLES: readonly TngAiRole[] = ['user', 'assistant', 'tool', 'activity'];

const TOOL_TRANSITIONS: Readonly<Record<TngAiToolCallStatus, readonly TngAiToolCallStatus[]>> = {
  'input-streaming': ['awaiting-approval', 'running', 'failed', 'cancelled'],
  'awaiting-approval': ['running', 'failed', 'cancelled'],
  running: ['complete', 'failed', 'cancelled'],
  complete: [],
  failed: [],
  cancelled: [],
};

export function validateTngAiMessage(message: TngAiMessage): readonly TngAiMessageDiagnostic[] {
  const diagnostics: TngAiMessageDiagnostic[] = [];
  const partIds = new Set<string>();

  for (const part of message.parts) {
    if (partIds.has(part.id)) {
      diagnostics.push(diagnostic('duplicate-part', part.id, `Duplicate message part: ${part.id}.`));
    }
    partIds.add(part.id);
    diagnostics.push(...validatePart(part));
  }
  return diagnostics;
}

export function resolveTngAiRoleVisibility(
  role: TngAiRole,
  visibleRoles: readonly TngAiRole[] = DEFAULT_VISIBLE_ROLES,
): boolean {
  return visibleRoles.includes(role);
}

export function appendTngAiTextDelta(
  message: TngAiMessage,
  partId: string,
  delta: string,
): TngAiMessageOperationResult {
  if (delta.length === 0) {
    return { ok: true, value: message };
  }
  return updateMessagePart(message, {
    partId,
    type: 'text',
    update: (part) => appendText(part as TngAiTextPart, delta),
  });
}

export function completeTngAiTextPart(
  message: TngAiMessage,
  partId: string,
): TngAiMessageOperationResult {
  return updateMessagePart(message, {
    partId,
    type: 'text',
    update: (part) => ({ ok: true, part: completeText(part as TngAiTextPart) }),
  });
}

export function appendTngAiToolInput(
  message: TngAiMessage,
  partId: string,
  delta: string,
): TngAiMessageOperationResult {
  return updateMessagePart(message, {
    partId,
    type: 'tool-call',
    update: (part) => appendToolInput(part as TngAiToolCallPart, delta),
  });
}

export function completeTngAiToolInput(
  message: TngAiMessage,
  partId: string,
): TngAiMessageOperationResult {
  return updateMessagePart(message, {
    partId,
    type: 'tool-call',
    update: (part) => completeToolInput(part as TngAiToolCallPart),
  });
}

export function transitionTngAiToolCall(
  message: TngAiMessage,
  partId: string,
  status: TngAiToolCallStatus,
): TngAiMessageOperationResult {
  return updateMessagePart(message, {
    partId,
    type: 'tool-call',
    update: (part) => transitionTool(part as TngAiToolCallPart, status),
  });
}

function validatePart(part: TngAiMessagePart): readonly TngAiMessageDiagnostic[] {
  if (part.type === 'text') {
    return validateAnnotations(part);
  }
  if (part.type === 'extension' && !isNamespaced(part.name)) {
    return [diagnostic('invalid-extension-name', part.id, 'Extension names must be namespaced.')];
  }
  return [];
}

function validateAnnotations(part: TngAiTextPart): readonly TngAiMessageDiagnostic[] {
  const invalidAnnotation = part.annotations?.find(
    ({ start, end }) =>
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start < 0 ||
      end < start ||
      end > part.text.length,
  );
  return invalidAnnotation === undefined
    ? []
    : [diagnostic('invalid-annotation', part.id, 'Text annotation is outside text bounds.')];
}

function isNamespaced(name: string): boolean {
  return /^[a-z0-9.-]+\/[a-z0-9._-]+$/i.test(name);
}

function updateMessagePart(
  message: TngAiMessage,
  request: PartUpdateRequest,
): TngAiMessageOperationResult {
  const index = message.parts.findIndex(({ id }) => id === request.partId);
  const part = message.parts[index];
  if (part?.type !== request.type) {
    return { ok: false, error: missingPart(request.partId, request.type) };
  }

  const result = request.update(part);
  if (!result.ok) {
    return result;
  }
  if (result.part === part) {
    return withDiagnostics(message, result.diagnostics);
  }
  const parts = message.parts.map((candidate, partIndex) =>
    partIndex === index ? result.part : candidate,
  );
  return withDiagnostics({ ...message, parts }, result.diagnostics);
}

function appendText(part: TngAiTextPart, delta: string): PartUpdateResult {
  if (part.status === 'complete') {
    return {
      ok: false,
      error: diagnostic('invalid-lifecycle', part.id, 'Cannot append to completed text.'),
    };
  }
  return { ok: true, part: { ...part, text: part.text + delta } };
}

function completeText(part: TngAiTextPart): TngAiTextPart {
  return part.status === 'complete' ? part : { ...part, status: 'complete' };
}

function appendToolInput(part: TngAiToolCallPart, delta: string): PartUpdateResult {
  if (part.status !== 'input-streaming') {
    return invalidToolLifecycle(part, 'Tool input is no longer streaming.');
  }
  if (delta.length === 0) {
    return { ok: true, part };
  }

  const rawInput = (part.rawInput ?? '') + delta;
  const parsed = parseToolInput(rawInput);
  const next = parsed.valid
    ? { ...part, rawInput, input: parsed.value }
    : { ...removeToolInput(part), rawInput };
  return { ok: true, part: next };
}

function completeToolInput(part: TngAiToolCallPart): PartUpdateResult {
  if (part.status !== 'input-streaming') {
    return invalidToolLifecycle(part, 'Tool input cannot be finalized from its current state.');
  }
  const parsed = parseToolInput(part.rawInput ?? '');
  if (parsed.valid) {
    return { ok: true, part: { ...part, input: parsed.value, status: 'running' } };
  }

  const failed = { ...removeToolInput(part), status: 'failed' as const };
  return {
    ok: true,
    part: failed,
    diagnostics: [diagnostic('invalid-tool-arguments', part.id, 'Tool input is not valid JSON.')],
  };
}

function transitionTool(part: TngAiToolCallPart, status: TngAiToolCallStatus): PartUpdateResult {
  if (part.status === status) {
    return { ok: true, part };
  }
  if (!TOOL_TRANSITIONS[part.status].includes(status)) {
    return invalidToolLifecycle(part, `Cannot transition tool from ${part.status} to ${status}.`);
  }
  return { ok: true, part: { ...part, status } };
}

function parseToolInput(
  rawInput: string,
): { readonly valid: true; readonly value: TngAiJsonValue } | { readonly valid: false } {
  try {
    const value: unknown = JSON.parse(rawInput) as unknown;
    const result = validateTngAiJsonValue(value);
    return result.valid ? { valid: true, value: result.value } : { valid: false };
  } catch {
    return { valid: false };
  }
}

function removeToolInput(part: TngAiToolCallPart): TngAiToolCallPart {
  const { input, ...withoutInput } = part;
  void input;
  return withoutInput;
}

function invalidToolLifecycle(part: TngAiToolCallPart, message: string): PartUpdateResult {
  return { ok: false, error: diagnostic('invalid-lifecycle', part.id, message) };
}

function withDiagnostics(
  value: TngAiMessage,
  diagnostics: readonly TngAiMessageDiagnostic[] | undefined,
): TngAiMessageOperationResult {
  return diagnostics === undefined ? { ok: true, value } : { ok: true, value, diagnostics };
}

function missingPart(partId: string, type: TngAiMessagePart['type']): TngAiMessageDiagnostic {
  return diagnostic('missing-part', partId, `Expected ${type} part ${partId}.`);
}

function diagnostic(
  code: TngAiMessageDiagnostic['code'],
  partId: string,
  message: string,
): TngAiMessageDiagnostic {
  return { code, partId, message };
}
