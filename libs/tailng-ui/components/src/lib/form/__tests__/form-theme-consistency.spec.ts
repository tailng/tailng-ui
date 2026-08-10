import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function readWorkspaceFile(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

const files = {
  shared: 'libs/tailng-ui/theme/src/lib/component-contracts/shared/controls.css',
  selectTheme: 'libs/tailng-ui/theme/src/lib/component-contracts/form/select/select.css',
  autocompleteTheme:
    'libs/tailng-ui/theme/src/lib/component-contracts/form/autocomplete/autocomplete.css',
  multiAutocompleteTheme:
    'libs/tailng-ui/theme/src/lib/component-contracts/form/multi-autocomplete/multi-autocomplete.css',
  inputTheme: 'libs/tailng-ui/theme/src/lib/component-contracts/form/input/input.css',
  inputFieldTheme:
    'libs/tailng-ui/theme/src/lib/component-contracts/form/input-field/input-field.css',
  formFieldTheme: 'libs/tailng-ui/theme/src/lib/component-contracts/form/form-field/form-field.css',
  datepickerTheme:
    'libs/tailng-ui/theme/src/lib/component-contracts/form/datepicker/datepicker.css',
  dateRangePickerTheme:
    'libs/tailng-ui/theme/src/lib/component-contracts/form/date-range-picker/date-range-picker.css',
} as const;

const documentedFormFamilies: Readonly<Record<string, readonly string[]>> = {
  Autocomplete: [files.autocompleteTheme],
  'Button Toggle': [
    'libs/tailng-ui/components/src/lib/form/button-toggle/tng-button-toggle.component.css',
    'libs/tailng-ui/components/src/lib/form/button-toggle/tng-button-toggle-group.component.css',
  ],
  Checkbox: ['libs/tailng-ui/components/src/lib/form/checkbox/tng-checkbox.component.css'],
  Chips: [
    'libs/tailng-ui/components/src/lib/form/chips/tng-chip.component.css',
    'libs/tailng-ui/components/src/lib/form/chips/tng-chips.component.css',
  ],
  'Date Range Picker': [files.dateRangePickerTheme],
  Datepicker: [files.datepickerTheme],
  'File Upload': [
    'apps/tailng-ui/docs/src/app/pages/components/form/fileupload/sections/examples/fileupload-examples-page.component.css',
  ],
  'Form Field': [files.formFieldTheme],
  Input: [files.inputTheme],
  'Input Field': [files.inputFieldTheme],
  'Input OTP': ['libs/tailng-ui/components/src/lib/form/input-otp/tng-input-otp.component.css'],
  Label: ['libs/tailng-ui/components/src/lib/form/label/tng-label.component.css'],
  ListBox: ['libs/tailng-ui/components/src/lib/form/listbox/tng-listbox.component.css'],
  MultiAutocomplete: [files.multiAutocompleteTheme],
  MultiSelect: [
    files.selectTheme,
    'libs/tailng-ui/components/src/lib/form/multiselect/tng-multiselect.component.css',
  ],
  'Number Range': [
    'libs/tailng-ui/components/src/lib/form/number-range/tng-number-range.component.css',
  ],
  Radio: ['libs/tailng-ui/components/src/lib/form/radio/tng-radio.component.css'],
  'Range Slider': [
    'libs/tailng-ui/components/src/lib/form/range-slider/tng-range-slider.component.css',
  ],
  Select: [files.selectTheme],
  Slider: ['libs/tailng-ui/components/src/lib/form/slider/tng-slider.component.css'],
  Switch: ['libs/tailng-ui/components/src/lib/form/switch/tng-switch.component.css'],
  Textarea: ['libs/tailng-ui/components/src/lib/form/textarea/tng-textarea.component.css'],
  Toggle: ['libs/tailng-ui/components/src/lib/form/toggle/tng-toggle.component.css'],
  'Toggle Group': [
    'libs/tailng-ui/components/src/lib/form/toggle-group/tng-toggle-group.component.css',
  ],
};

describe('form theme consistency', () => {
  it('defines shared control, overlay, item, and group vocabularies', () => {
    const sharedCss = readWorkspaceFile(files.shared);

    expect(sharedCss).toContain('--tng-control-shadow: none;');
    expect(sharedCss).toContain('--tng-control-height-md: 2.5rem;');
    expect(sharedCss).toContain('--tng-control-radius: var(--tng-radius-control);');
    expect(sharedCss).toContain('--tng-overlay-shadow:');
    expect(sharedCss).toContain('--tng-item-radius: var(--tng-radius-item);');
    expect(sharedCss).toContain('--tng-group-radius: var(--tng-radius-panel);');
  });

  it('keeps closed select triggers flat and reserves elevation for the overlay', () => {
    const selectThemeCss = readWorkspaceFile(files.selectTheme);
    const selectComponentCss = readWorkspaceFile(
      'libs/tailng-ui/components/src/lib/form/select/tng-select.component.css',
    );

    expect(selectThemeCss).toContain('--tng-select-shadow: var(--tng-control-shadow, none);');
    expect(selectThemeCss).toContain('--tng-select-overlay-shadow: var(--tng-overlay-shadow);');
    expect(selectThemeCss).not.toMatch(/--tng-select-shadow:\s*\n\s*0\s+4px/);
    expect(selectComponentCss).toContain('box-shadow: var(--tng-select-shadow, none);');
    expect(selectComponentCss).toContain(
      'box-shadow: var(--tng-select-overlay-shadow, var(--tng-overlay-shadow));',
    );
  });

  for (const [family, paths] of Object.entries(documentedFormFamilies)) {
    it(`${family} consumes the shared theme vocabulary`, () => {
      const source = paths.map(readWorkspaceFile).join('\n');
      expect(source).toMatch(/--tng-(?:control|overlay|item|group)-/);
    });
  }

  it.each([
    [
      'Month Daypicker',
      'libs/tailng-ui/components/src/lib/form/month-daypicker/tng-month-daypicker.component.ts',
    ],
    ['Yearpicker', 'libs/tailng-ui/components/src/lib/form/yearpicker/tng-yearpicker.component.ts'],
  ])('%s inherits the themed datepicker chrome through composition', (_family, path) => {
    const source = readWorkspaceFile(path);
    expect(source).toContain('imports: [TngDatepickerComponent]');
    expect(source).toContain('<tng-datepicker');
  });
});
