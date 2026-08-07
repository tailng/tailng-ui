import { coerceTngPressAriaHasPopup, coerceTngPressNullableBoolean } from '@tailng-ui/primitives';
import { describe, expect, it } from 'vitest';
import { TngButtonComponent } from './tng-button.component';

describe('tng-button component', () => {
  it('exports the public TngButtonComponent symbol', () => {
    expect(typeof TngButtonComponent).toBe('function');
  });

  it('coerces nullable boolean inputs', () => {
    expect(coerceTngPressNullableBoolean(undefined)).toBeNull();
    expect(coerceTngPressNullableBoolean('')).toBe(true);
    expect(coerceTngPressNullableBoolean('true')).toBe(true);
    expect(coerceTngPressNullableBoolean('false')).toBe(false);
    expect(coerceTngPressNullableBoolean('x')).toBeNull();
  });

  it('coerces aria-haspopup inputs', () => {
    expect(coerceTngPressAriaHasPopup(undefined)).toBeNull();
    expect(coerceTngPressAriaHasPopup(true)).toBe('true');
    expect(coerceTngPressAriaHasPopup(false)).toBe('false');
    expect(coerceTngPressAriaHasPopup(' listbox ')).toBe('listbox');
    expect(coerceTngPressAriaHasPopup('noop')).toBeNull();
  });
});
