import { validateTngAiJsonValue } from './json.types';
import type { TngAiMessagePart } from './message-part.types';

export type TngAiPartRenderer<T> = (part: TngAiMessagePart) => T;

export type TngAiPartResolution<T> =
  | { readonly supported: true; readonly renderer: TngAiPartRenderer<T> }
  | { readonly supported: false; readonly reason: 'missing-renderer' | 'unsupported-part' };

export type TngAiPartDecodeResult =
  | { readonly ok: true; readonly part: TngAiMessagePart }
  | { readonly ok: false; readonly reason: 'invalid-part' | 'invalid-json' };

export class TngAiPartRegistry<T> {
  private readonly extensions = new Map<string, TngAiPartRenderer<T>>();

  public registerExtension(name: string, renderer: TngAiPartRenderer<T>): boolean {
    if (!isNamespaced(name)) {
      return false;
    }
    this.extensions.set(name, renderer);
    return true;
  }

  public resolve(part: TngAiMessagePart): TngAiPartResolution<T> {
    if (part.type === 'extension') {
      const renderer = this.extensions.get(part.name);
      return renderer === undefined
        ? { supported: false, reason: 'missing-renderer' }
        : { supported: true, renderer };
    }
    return {
      supported: false,
      reason: part.type === 'unsupported' ? 'unsupported-part' : 'missing-renderer',
    };
  }
}

export function decodeTngAiMessagePart(value: unknown): TngAiPartDecodeResult {
  const validation = validateTngAiJsonValue(value);
  if (!validation.valid) {
    return { ok: false, reason: 'invalid-json' };
  }
  if (!isPartRecord(value)) {
    return { ok: false, reason: 'invalid-part' };
  }

  const { id, type } = value;
  return {
    ok: true,
    part: { id, type: 'unsupported', originalType: type, value: validation.value },
  };
}

function isPartRecord(value: unknown): value is Readonly<Record<string, unknown>> & {
  readonly id: string;
  readonly type: string;
} {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const record = value as Readonly<Record<string, unknown>>;
  return typeof record['id'] === 'string' && typeof record['type'] === 'string';
}

function isNamespaced(name: string): boolean {
  return /^[a-z0-9.-]+\/[a-z0-9._-]+$/i.test(name);
}
