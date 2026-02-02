export const coerceBoolean = (value: unknown): boolean => value != null && `${value}` !== 'false';
