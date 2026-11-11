export type TngAiJsonPrimitive = string | number | boolean | null;

export type TngAiJsonValue =
  | TngAiJsonPrimitive
  | readonly TngAiJsonValue[]
  | { readonly [key: string]: TngAiJsonValue };

export type TngAiJsonLimits = {
  readonly maxDepth?: number;
  readonly maxEntries?: number;
}

export type TngAiValidationError = {
  readonly code: 'invalid-json-value' | 'limit-exceeded';
  readonly path: string;
  readonly message: string;
}

export type TngAiValidationResult<T> =
  | { readonly valid: true; readonly value: T }
  | { readonly valid: false; readonly error: TngAiValidationError };

export function validateTngAiJsonValue(
  value: unknown,
  limits: TngAiJsonLimits = {},
): TngAiValidationResult<TngAiJsonValue> {
  const error = new JsonValueValidator(limits).validate(value);

  return error === null ? { valid: true, value: value as TngAiJsonValue } : { valid: false, error };
}

class JsonValueValidator {
  private readonly ancestors = new WeakSet<object>();
  private entries = 0;

  public constructor(private readonly limits: TngAiJsonLimits) {}

  public validate(value: unknown): TngAiValidationError | null {
    return this.visit(value, '$', 0);
  }

  private visit(value: unknown, path: string, depth: number): TngAiValidationError | null {
    const scalar = validateScalar(value, path);
    if (scalar.handled) {
      return scalar.error;
    }

    const object = value as object;
    const containerError = this.validateContainer(object, path, depth);
    if (containerError !== null) {
      return containerError;
    }

    this.ancestors.add(object);
    const result = this.visitEntries(object, path, depth);
    this.ancestors.delete(object);
    return result;
  }

  private validateContainer(
    value: object,
    path: string,
    depth: number,
  ): TngAiValidationError | null {
    if (this.limits.maxDepth !== undefined && depth >= this.limits.maxDepth) {
      return exceeded(path, `JSON nesting exceeds maximum depth ${this.limits.maxDepth}.`);
    }
    if (this.ancestors.has(value)) {
      return invalid(path, 'Cyclic JSON values are not supported.');
    }
    return isJsonContainer(value)
      ? null
      : invalid(path, 'Only arrays and plain objects are supported JSON containers.');
  }

  private visitEntries(value: object, path: string, depth: number): TngAiValidationError | null {
    const array = Array.isArray(value);
    for (const [key, child] of jsonEntries(value)) {
      const childPath = propertyPath(path, key, array);
      const entryError = this.validateEntry(key, childPath, array);
      if (entryError !== null) {
        return entryError;
      }
      const childError = this.visit(child, childPath, depth + 1);
      if (childError !== null) {
        return childError;
      }
    }
    return null;
  }

  private validateEntry(key: string, path: string, array: boolean): TngAiValidationError | null {
    if (!array && isUnsafeKey(key)) {
      return invalid(path, `Unsafe JSON object key: ${key}.`);
    }
    this.entries += 1;
    return this.limits.maxEntries !== undefined && this.entries > this.limits.maxEntries
      ? exceeded(path, `JSON entries exceed maximum ${this.limits.maxEntries}.`)
      : null;
  }
}

type ScalarValidation =
  | { readonly handled: true; readonly error: TngAiValidationError | null }
  | { readonly handled: false };

function validateScalar(value: unknown, path: string): ScalarValidation {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') {
    return { handled: true, error: null };
  }
  if (typeof value === 'number') {
    return {
      handled: true,
      error: Number.isFinite(value) ? null : invalid(path, 'Numbers must be finite.'),
    };
  }
  return typeof value === 'object'
    ? { handled: false }
    : { handled: true, error: invalid(path, `Unsupported JSON value type: ${typeof value}.`) };
}

function isJsonContainer(value: object): boolean {
  if (Array.isArray(value)) {
    return true;
  }
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function jsonEntries(value: object): readonly [string, unknown][] {
  if (Array.isArray(value)) {
    return value.map((entry: unknown, index: number) => [String(index), entry]);
  }
  return Object.entries(value as Record<string, unknown>);
}

function isUnsafeKey(key: string): boolean {
  return key === '__proto__' || key === 'prototype' || key === 'constructor';
}

function propertyPath(path: string, key: string, array = false): string {
  if (array) {
    return `${path}[${key}]`;
  }
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`;
}

function invalid(path: string, message: string): TngAiValidationError {
  return { code: 'invalid-json-value', path, message };
}

function exceeded(path: string, message: string): TngAiValidationError {
  return { code: 'limit-exceeded', path, message };
}
